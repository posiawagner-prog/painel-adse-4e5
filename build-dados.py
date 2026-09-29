#!/usr/bin/env python3
"""Gera dados.js a partir da planilha ADSE (5º ano)."""
from __future__ import annotations

import json
import os
import re
import sys
from decimal import Decimal, ROUND_HALF_UP

try:
    import openpyxl
except ImportError:
    import subprocess

    subprocess.check_call([sys.executable, "-m", "pip", "install", "openpyxl", "-q"])
    import openpyxl

ROOT = os.path.dirname(os.path.abspath(__file__))


def round_half_up(value: float, ndigits: int = 2) -> float:
    """Arredonda como o Excel (0,5 para cima), não o banker's rounding do Python."""
    d = Decimal(f"{float(value):.{ndigits + 8}f}")
    return float(d.quantize(Decimal(1).scaleb(-ndigits), rounding=ROUND_HALF_UP))


def norm(text: str) -> str:
    s = re.sub(r"\s+", " ", (text or "").strip())
    s = s.replace("C. E.", "C.E.").replace("E. M. E. I. F.", "E.M.E.I.F.")
    return s


def parse_escola_turma(raw: str) -> tuple[str, str]:
    raw = norm(raw)
    match = re.match(r"(.+?)\s*-\s*([A-D])\s*$", raw)
    if match:
        return norm(match.group(1)), match.group(2).upper()
    return raw, "ÚNICA"


def find_sheet(wb, candidates: list[str]) -> str:
    names = {name.strip().lower(): name for name in wb.sheetnames}
    for candidate in candidates:
        key = candidate.strip().lower()
        if key in names:
            return names[key]
    for candidate in candidates:
        key = candidate.strip().lower()
        for sheet_key, sheet_name in names.items():
            if key in sheet_key:
                return sheet_name
    raise KeyError(f"Aba não encontrada: {candidates}")


def _norm_header(value) -> str:
    text = re.sub(r"\s+", " ", str(value or "").strip().upper())
    return (
        text.replace("Ã", "A")
        .replace("Á", "A")
        .replace("À", "A")
        .replace("Â", "A")
        .replace("É", "E")
        .replace("Ê", "E")
        .replace("Í", "I")
        .replace("Ó", "O")
        .replace("Ô", "O")
        .replace("Ú", "U")
        .replace("Ç", "C")
    )


def find_proficiencia_cols(ws) -> dict[str, int]:
    """Localiza colunas % ACERTOS / APRENDIZADO / PROFICIÊNCIA / NÍVEL (Diagnóstica LP)."""
    mapping: dict[str, int] = {}
    for row in range(12, 16):
        for col in range(1, ws.max_column + 1):
            header = _norm_header(ws.cell(row, col).value)
            if not header:
                continue
            if "ACERTO" in header and "pctAcertos" not in mapping:
                mapping["pctAcertos"] = col
            elif "APRENDIZADO" in header and "aprendizado" not in mapping:
                mapping["aprendizado"] = col
            elif "PROFICI" in header and "proficiencia" not in mapping:
                mapping["proficiencia"] = col
            elif header.startswith("NIVEL") and "nivel" not in mapping:
                mapping["nivel"] = col
    return mapping


def parse_nivel(value) -> tuple[int | None, str]:
    raw = re.sub(r"\s+", " ", str(value or "").strip())
    if not raw:
        return None, ""
    match = re.search(r"(\d+)", raw)
    numero = int(match.group(1)) if match else None
    label = raw if "NIVEL" in _norm_header(raw) or "NÍVEL" in raw.upper() else (f"NÍVEL {numero}" if numero is not None else raw)
    return numero, label


def normalize_aprendizado(value) -> str:
    key = _norm_header(value)
    if "INSUF" in key:
        return "INSUFICIENTE"
    if "BASICO" in key or "BÁSICO" in str(value or "").upper():
        return "BÁSICO"
    if "PROFIC" in key:
        return "PROFICIENTE"
    if "AVANC" in key or "AVANÇ" in str(value or "").upper():
        return "AVANÇADO"
    return str(value or "").strip().upper()


def parse_questions(wb, sheet: str) -> tuple[list[str], dict[str, dict]]:
    ws = wb[sheet]
    questions: list[str] = []
    col = 4
    while col <= ws.max_column:
        header = ws.cell(13, col).value
        if header and "Quest" in str(header):
            questions.append(re.sub(r"\s+", " ", str(header).strip()))
            col += 2
        else:
            col += 1

    prof_cols = find_proficiencia_cols(ws)
    schools: dict[str, dict] = {}
    for row in range(14, ws.max_row + 1):
        name = ws.cell(row, 1).value
        flag = ws.cell(row, 2).value
        if not name:
            continue
        escola = norm(str(name))
        flag_text = str(flag or "").strip().upper().replace("Ã", "A").replace("ÃO", "AO")
        if flag_text.startswith("PARTIC"):
            break
        if flag_text in ("SIM", "NAO", "NÃO"):
            if flag_text == "SIM" and escola in schools:
                questoes = {}
                acertos = {}
                for index, question in enumerate(questions):
                    quant = ws.cell(row, 4 + index * 2).value
                    pct = ws.cell(row, 5 + index * 2).value
                    if isinstance(pct, (int, float)):
                        # Mantém precisão cheia; arredonda só na média final / exportação.
                        questoes[question] = float(pct)
                    if isinstance(quant, (int, float)):
                        acertos[question] = int(quant)
                schools[escola]["questoes"] = questoes
                schools[escola]["acertos"] = acertos
                if prof_cols:
                    pct_raw = ws.cell(row, prof_cols["pctAcertos"]).value if "pctAcertos" in prof_cols else None
                    aprend = ws.cell(row, prof_cols["aprendizado"]).value if "aprendizado" in prof_cols else None
                    prof = ws.cell(row, prof_cols["proficiencia"]).value if "proficiencia" in prof_cols else None
                    nivel_raw = ws.cell(row, prof_cols["nivel"]).value if "nivel" in prof_cols else None
                    if aprend or isinstance(prof, (int, float)) or nivel_raw is not None:
                        pct_acertos = None
                        if isinstance(pct_raw, (int, float)):
                            pct_acertos = round_half_up(float(pct_raw) * 100 if float(pct_raw) <= 1 else float(pct_raw), 2)
                        nivel_num, nivel_label = parse_nivel(nivel_raw)
                        schools[escola]["proficiencia"] = {
                            "pctAcertos": pct_acertos,
                            "aprendizado": normalize_aprendizado(aprend) if aprend else "",
                            "proficiencia": round_half_up(float(prof), 2) if isinstance(prof, (int, float)) else None,
                            "nivel": nivel_num,
                            "nivelLabel": nivel_label,
                        }
            continue
        if isinstance(flag, (int, float)) or (isinstance(flag, str) and flag.strip().isdigit()):
            schools[escola] = {
                "previstos": int(ws.cell(row, 2).value or 0),
                "avaliados": int(ws.cell(row, 3).value or 0),
                "questoes": {},
                "acertos": {},
            }
    return questions, schools


def avg_questions(questions: list[str], schools: dict[str, dict]) -> dict[str, float]:
    """Média percentual de acerto ponderada pelo número de avaliados."""
    result: dict[str, float] = {}
    for question in questions:
        weighted = 0.0
        total = 0
        for school in schools.values():
            pct = school.get("questoes", {}).get(question)
            avaliados = school.get("avaliados", 0)
            if pct is None or not avaliados:
                continue
            weighted += float(pct) * avaliados
            total += avaliados
        if total:
            result[question] = round_half_up(weighted / total, 2)
    return result


def sum_acertos(questions: list[str], schools: dict[str, dict]) -> dict[str, int]:
    """Total de alunos que acertaram cada questão."""
    result: dict[str, int] = {}
    for question in questions:
        total = sum(int(school.get("acertos", {}).get(question, 0) or 0) for school in schools.values())
        if total:
            result[question] = total
    return result


def media_from_questoes(questoes: dict[str, float]) -> float:
    """Média das questões em precisão cheia (arredonda só depois, como no Excel)."""
    if not questoes:
        return 0.0
    return sum(questoes.values()) / len(questoes)


def assign_ranking(items: list[dict], field: str, target: str) -> None:
    """Ranking com empate denso: mesmas médias recebem a mesma posição; a próxima continua.
    Ex.: 10º, 11º, 11º, 12º.
    """
    ranked = sorted(items, key=lambda item: item[field], reverse=True)
    index = 0
    position = 1
    while index < len(ranked):
        value = round_half_up(ranked[index][field], 2)
        end = index + 1
        while end < len(ranked) and round_half_up(ranked[end][field], 2) == value:
            end += 1
        label = f"{position}º"
        for item in ranked[index:end]:
            item[target] = label
        position += 1
        index = end


def build_proficiencia_rows(escolas: dict[str, dict], disciplina: str) -> list[dict]:
    rows: list[dict] = []
    for key, data in escolas.items():
        block = data.get("proficiencia")
        if not block:
            continue
        escola, turma = parse_escola_turma(key)
        rows.append(
            {
                "disciplina": disciplina,
                "escola": escola,
                "turma": turma,
                "chave": key,
                "previstos": data.get("previstos", 0),
                "avaliados": data.get("avaliados", 0),
                "pctAcertos": block.get("pctAcertos"),
                "aprendizado": block.get("aprendizado") or "",
                "proficiencia": block.get("proficiencia"),
                "nivel": block.get("nivel"),
                "nivelLabel": block.get("nivelLabel") or "",
            }
        )
    rows.sort(key=lambda item: (item.get("proficiencia") is None, -(item.get("proficiencia") or 0), item["escola"], item["turma"]))
    return rows


def build_turmas(escolas_lp: dict[str, dict], escolas_mat: dict[str, dict]) -> list[dict]:
    keys = sorted(set(escolas_lp) | set(escolas_mat))
    turmas: list[dict] = []
    for key in keys:
        lp = escolas_lp.get(key, {})
        mat = escolas_mat.get(key, {})
        escola, turma = parse_escola_turma(key)
        prev_lp = lp.get("previstos", 0)
        aval_lp = lp.get("avaliados", 0)
        prev_mat = mat.get("previstos", 0)
        aval_mat = mat.get("avaliados", 0)
        # Visão geral: junta Português e Matemática pela média dos totais.
        if prev_lp or prev_mat:
            previstos = int(round_half_up((prev_lp + prev_mat) / 2, 0))
        else:
            previstos = 0
        if aval_lp or aval_mat:
            avaliados = int(round_half_up((aval_lp + aval_mat) / 2, 0))
        else:
            avaliados = 0
        media_lp = round_half_up(media_from_questoes(lp.get("questoes", {})), 2)
        media_mat = round_half_up(media_from_questoes(mat.get("questoes", {})), 2)
        # Igual ao Excel: média das médias já arredondadas (ex.: 82,19 + 52,68 → 67,44)
        media_geral = round_half_up((media_lp + media_mat) / 2, 2) if media_lp or media_mat else 0.0
        row = {
            "ano": 5,
            "escola": escola,
            "turma": turma,
            "previstos": previstos,
            "avaliados": avaliados,
            "participacao": round_half_up(avaliados / previstos * 100, 1) if previstos else 0,
            "mediaLp": media_lp,
            "mediaMat": media_mat,
            "mediaGeral": media_geral,
            "_mediaLp": media_lp,
            "_mediaMat": media_mat,
            "_mediaGeral": media_geral,
            "previstosLp": prev_lp,
            "avaliadosLp": aval_lp,
            "previstosMat": prev_mat,
            "avaliadosMat": aval_mat,
        }
        if lp.get("proficiencia"):
            row["proficienciaLp"] = lp["proficiencia"]
        if mat.get("proficiencia"):
            row["proficienciaMat"] = mat["proficiencia"]
        turmas.append(row)

    assign_ranking(turmas, "mediaGeral", "rankingGeral")
    assign_ranking(turmas, "mediaLp", "rankingLp")
    assign_ranking(turmas, "mediaMat", "rankingMat")
    return turmas


def build_escolas(turmas: list[dict]) -> list[dict]:
    groups: dict[str, list[dict]] = {}
    for turma in turmas:
        groups.setdefault(turma["escola"], []).append(turma)

    escolas: list[dict] = []
    for escola, rows in sorted(groups.items(), key=lambda item: item[0]):
        turmas_label = "+".join(
            sorted({row["turma"] for row in rows if row["turma"] != "ÚNICA"})
        )
        nome = f"{escola} ({turmas_label})" if turmas_label else escola
        previstos = sum(row["previstos"] for row in rows)
        avaliados = sum(row["avaliados"] for row in rows)
        prev_lp = sum(row["previstosLp"] for row in rows)
        aval_lp = sum(row["avaliadosLp"] for row in rows)
        prev_mat = sum(row["previstosMat"] for row in rows)
        aval_mat = sum(row["avaliadosMat"] for row in rows)
        # Usa as médias já arredondadas das turmas; geral = média dessas médias (como no Excel).
        media_lp = round_half_up(sum(row["_mediaLp"] for row in rows) / len(rows), 2) if rows else 0
        media_mat = round_half_up(sum(row["_mediaMat"] for row in rows) / len(rows), 2) if rows else 0
        media_geral = round_half_up((media_lp + media_mat) / 2, 2) if rows else 0
        escolas.append(
            {
                "escola": nome,
                "previstos": previstos,
                "avaliados": avaliados,
                "participacao": round_half_up(avaliados / previstos * 100, 1) if previstos else 0,
                "mediaLp": media_lp,
                "mediaMat": media_mat,
                "mediaGeral": media_geral,
                "previstosLp": prev_lp,
                "avaliadosLp": aval_lp,
                "previstosMat": prev_mat,
                "avaliadosMat": aval_mat,
            }
        )

    assign_ranking(escolas, "mediaGeral", "ranking")
    assign_ranking(escolas, "mediaGeral", "rankingGeral")
    assign_ranking(escolas, "mediaLp", "rankingLp")
    assign_ranking(escolas, "mediaMat", "rankingMat")
    return escolas


def finalize_questoes(schools: dict[str, dict]) -> None:
    for school in schools.values():
        school["questoes"] = {
            key: round_half_up(value, 2) for key, value in school.get("questoes", {}).items()
        }


def strip_private_fields(turmas: list[dict]) -> None:
    for row in turmas:
        row.pop("_mediaLp", None)
        row.pop("_mediaMat", None)
        row.pop("_mediaGeral", None)


PERIOD_METRIC_KEYS = (
    "previstos",
    "avaliados",
    "participacao",
    "mediaLp",
    "mediaMat",
    "mediaGeral",
    "previstosLp",
    "avaliadosLp",
    "previstosMat",
    "avaliadosMat",
    "rankingGeral",
    "rankingLp",
    "rankingMat",
    "ranking",
    "proficienciaLp",
    "proficienciaMat",
)

PERIOD_LABELS = {
    "diagnostica": "Diagnóstica",
    "percurso": "Formativa/Percurso",
    "saida": "Saída",
}


def classify_periodo(filename: str) -> str | None:
    name = filename.lower()
    if "diagn" in name:
        return "diagnostica"
    if "percurso" in name or "formativa" in name:
        return "percurso"
    if "saida" in name or "saída" in name:
        return "saida"
    return None


def find_xlsx_by_periodo() -> dict[str, str]:
    found: dict[str, str] = {}
    for name in os.listdir(ROOT):
        if not name.lower().endswith(".xlsx"):
            continue
        periodo = classify_periodo(name)
        if not periodo:
            continue
        # Prefere o primeiro arquivo encontrado por período.
        found.setdefault(periodo, os.path.join(ROOT, name))
    if not found:
        raise FileNotFoundError("Nenhuma planilha .xlsx de período encontrada em DashboardADSE")
    return found


def build_periodo(fp: str, periodo: str) -> dict:
    wb = openpyxl.load_workbook(fp, data_only=True)

    sheet_lp = find_sheet(wb, ["Português", "Portugues"])
    sheet_mat = find_sheet(wb, ["Matemática", "Matematica"])
    questoes_lp, escolas_lp = parse_questions(wb, sheet_lp)
    questoes_mat, escolas_mat = parse_questions(wb, sheet_mat)
    turmas = build_turmas(escolas_lp, escolas_mat)
    escolas = build_escolas(turmas)
    finalize_questoes(escolas_lp)
    finalize_questoes(escolas_mat)
    strip_private_fields(turmas)

    total_previstos_lp = sum(t["previstosLp"] for t in turmas)
    total_avaliados_lp = sum(t["avaliadosLp"] for t in turmas)
    total_previstos_mat = sum(t["previstosMat"] for t in turmas)
    total_avaliados_mat = sum(t["avaliadosMat"] for t in turmas)
    # Totais da visão geral = média dos totais de Português e Matemática
    total_previstos = int(round_half_up((total_previstos_lp + total_previstos_mat) / 2, 0))
    total_avaliados = int(round_half_up((total_avaliados_lp + total_avaliados_mat) / 2, 0))

    label = PERIOD_LABELS.get(periodo, periodo)
    proficiencia_lp = build_proficiencia_rows(escolas_lp, "lp")
    proficiencia_mat = build_proficiencia_rows(escolas_mat, "mat")
    return {
        "meta": {
            "titulo": "Avaliação Diagnóstica do Sistema Estadual — ADSE",
            "subtitulo": f"5º Ano · {label} · 1º Semestre 2026",
            "fonte": os.path.basename(fp),
            "periodo": periodo,
            "ano": 5,
            "totalPrevistos": total_previstos,
            "totalAvaliados": total_avaliados,
            "previstosLp": total_previstos_lp,
            "avaliadosLp": total_avaliados_lp,
            "previstosMat": total_previstos_mat,
            "avaliadosMat": total_avaliados_mat,
            "participacaoGeral": round_half_up(total_avaliados / total_previstos * 100, 1)
            if total_previstos
            else 0,
            "mediaLpGeral": round_half_up(sum(t["mediaLp"] * t["avaliadosLp"] for t in turmas) / total_avaliados_lp, 2)
            if total_avaliados_lp
            else 0,
            "mediaMatGeral": round_half_up(sum(t["mediaMat"] * t["avaliadosMat"] for t in turmas) / total_avaliados_mat, 2)
            if total_avaliados_mat
            else 0,
            "mediaGeral": round_half_up(
                (
                    (
                        round_half_up(sum(t["mediaLp"] * t["avaliadosLp"] for t in turmas) / total_avaliados_lp, 2)
                        if total_avaliados_lp
                        else 0
                    )
                    + (
                        round_half_up(sum(t["mediaMat"] * t["avaliadosMat"] for t in turmas) / total_avaliados_mat, 2)
                        if total_avaliados_mat
                        else 0
                    )
                )
                / 2,
                2,
            ),
            "questoesLp": questoes_lp,
            "questoesMat": questoes_mat,
            "mediaQuestoesLp": avg_questions(questoes_lp, escolas_lp),
            "mediaQuestoesMat": avg_questions(questoes_mat, escolas_mat),
            "acertosQuestoesLp": sum_acertos(questoes_lp, escolas_lp),
            "acertosQuestoesMat": sum_acertos(questoes_mat, escolas_mat),
            "temProficiencia": bool(proficiencia_lp or proficiencia_mat),
        },
        "turmas": turmas,
        "escolas": escolas,
        "escolasQuestoesLp": escolas_lp,
        "escolasQuestoesMat": escolas_mat,
        "proficienciaLp": proficiencia_lp,
        "proficienciaMat": proficiencia_mat,
    }


def metrics_block(row: dict) -> dict:
    return {key: row[key] for key in PERIOD_METRIC_KEYS if key in row}


def merge_turmas(periodos_data: dict[str, dict]) -> list[dict]:
    merged: dict[tuple[str, str], dict] = {}
    for periodo, data in periodos_data.items():
        for row in data["turmas"]:
            key = (row["escola"], row["turma"])
            entry = merged.setdefault(
                key,
                {"ano": row.get("ano", 5), "escola": row["escola"], "turma": row["turma"], "periodos": {}},
            )
            entry["periodos"][periodo] = metrics_block(row)
    return [merged[key] for key in sorted(merged)]


def merge_escolas(periodos_data: dict[str, dict]) -> list[dict]:
    merged: dict[str, dict] = {}
    for periodo, data in periodos_data.items():
        for row in data["escolas"]:
            key = row["escola"]
            entry = merged.setdefault(key, {"escola": row["escola"], "periodos": {}})
            entry["periodos"][periodo] = metrics_block(row)
    return [merged[key] for key in sorted(merged)]


def build() -> dict:
    files = find_xlsx_by_periodo()
    # Ordem estável: Diagnóstica → Percurso → Saída
    order = ["diagnostica", "percurso", "saida"]
    periodos_data: dict[str, dict] = {}
    for periodo in order:
        fp = files.get(periodo)
        if not fp:
            continue
        periodos_data[periodo] = build_periodo(fp, periodo)

    if not periodos_data:
        raise FileNotFoundError("Nenhum período processado")

    disponiveis = list(periodos_data.keys())
    padrao = "percurso" if "percurso" in periodos_data else disponiveis[0]
    padrao_data = periodos_data[padrao]
    labels = [PERIOD_LABELS.get(p, p) for p in disponiveis]

    by_periodo = {
        periodo: {
            "meta": data["meta"],
            "escolasQuestoesLp": data["escolasQuestoesLp"],
            "escolasQuestoesMat": data["escolasQuestoesMat"],
            "proficienciaLp": data.get("proficienciaLp", []),
            "proficienciaMat": data.get("proficienciaMat", []),
        }
        for periodo, data in periodos_data.items()
    }

    meta = {
        **padrao_data["meta"],
        "subtitulo": f"5º Ano · {' · '.join(labels)} · 1º Semestre 2026",
        "periodo": padrao,
        "periodoPadrao": padrao,
        "periodosDisponiveis": disponiveis,
        "fontes": {periodo: data["meta"]["fonte"] for periodo, data in periodos_data.items()},
    }

    return {
        "meta": meta,
        "byPeriodo": by_periodo,
        "turmas": merge_turmas(periodos_data),
        "escolas": merge_escolas(periodos_data),
        # Compatibilidade: questões do período padrão no nível raiz
        "escolasQuestoesLp": padrao_data["escolasQuestoesLp"],
        "escolasQuestoesMat": padrao_data["escolasQuestoesMat"],
    }


def main() -> None:
    data = build()
    target = os.path.join(ROOT, "dados.js")
    payload = json.dumps(data, ensure_ascii=False, separators=(",", ":"))
    with open(target, "w", encoding="utf-8") as handle:
        handle.write(f"const DADOS = {payload};\n")
    periodos = ", ".join(data["meta"]["periodosDisponiveis"])
    print(
        f"Gerado {len(data['turmas'])} turmas e {len(data['escolas'])} escolas "
        f"({periodos}) em {target}"
    )


if __name__ == "__main__":
    main()
