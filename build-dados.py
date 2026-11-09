#!/usr/bin/env python3
"""Gera dados.js a partir das planilhas ADSE (4º / 5º ano).

Bloco de proficiência na planilha (a partir da coluna AZ):
  AZ = % ACERTOS | BA = APRENDIZADO | BB = PROFICIÊNCIA | BC = NÍVEL
"""
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
    """Localiza colunas % ACERTOS / APRENDIZADO / PROFICIÊNCIA / NÍVEL a partir de AZ.

    Padrão da planilha (colunas 52–55): AZ=% ACERTOS, BA=APRENDIZADO,
    BB=PROFICIÊNCIA, BC=NÍVEL. Busca o cabeçalho nessas colunas primeiro.
    """
    mapping: dict[str, int] = {}
    # Preferência: bloco AZ–BC (52–55) e vizinhança, depois varredura geral.
    preferred_cols = list(range(52, 56)) + list(range(45, 52)) + list(range(56, ws.max_column + 1))
    seen_cols = set(preferred_cols)
    all_cols = preferred_cols + [c for c in range(1, ws.max_column + 1) if c not in seen_cols]

    def absorb(col: int, header: str) -> None:
        # Evita colidir APRENDIZADO com PROFICIÊNCIA (ambos podem ter "PROFICI" em textos longos).
        if "ACERTO" in header and "pctAcertos" not in mapping:
            mapping["pctAcertos"] = col
        elif "APRENDIZADO" in header and "aprendizado" not in mapping:
            mapping["aprendizado"] = col
        elif (
            "PROFICI" in header
            and "APRENDIZ" not in header
            and "proficiencia" not in mapping
        ):
            mapping["proficiencia"] = col
        elif header.startswith("NIVEL") and "nivel" not in mapping:
            mapping["nivel"] = col

    for row in range(12, 16):
        for col in all_cols:
            header = _norm_header(ws.cell(row, col).value)
            if header:
                absorb(col, header)
        if len(mapping) == 4:
            break
    return mapping


def detect_ano(filename: str) -> int:
    name = filename.lower()
    if re.search(r"4[ºo°]?\s*ano|\b4ano\b", name):
        return 4
    if re.search(r"5[ºo°]?\s*ano|\b5ano\b", name):
        return 5
    return 5


def ano_label(ano: int) -> str:
    return f"{ano}º Ano"


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


def aprendizado_from_proficiencia(score: float, disciplina: str = "lp") -> str:
    """Classificação de aprendizado sobre a escala SAEB.
    LP (padrão municipal): ≤149 / 150-199 / 200-249 / ≥250
    Matemática (faixas da imagem municipal): ≤174 / 175-224 / 225-274 / ≥275
    """
    if disciplina == "mat":
        if score <= 174:
            return "INSUFICIENTE"
        if score <= 224:
            return "BÁSICO"
        if score <= 274:
            return "PROFICIENTE"
        return "AVANÇADO"
    if score <= 149:
        return "INSUFICIENTE"
    if score < 200:
        return "BÁSICO"
    if score <= 249:
        return "PROFICIENTE"
    return "AVANÇADO"


def nivel_from_proficiencia(score: float, disciplina: str = "lp") -> tuple[int, str]:
    """Faixas SAEB 5º ano: LP até Nível 9; Matemática até Nível 10."""
    thresholds = [
        (350, 10),
        (325, 9),
        (300, 8),
        (275, 7),
        (250, 6),
        (225, 5),
        (200, 4),
        (175, 3),
        (150, 2),
        (125, 1),
    ]
    if disciplina != "mat":
        thresholds = [t for t in thresholds if t[1] <= 9]
    for minimo, numero in thresholds:
        if score >= minimo:
            return numero, f"NÍVEL {numero}"
    return 0, "NÍVEL 0"


def scale_for_disciplina(disciplina: str) -> float:
    """LP mapeia 100% → 325 (N9); Matemática 100% → 350 (N10), conforme SAEB 5º ano."""
    return 350.0 if disciplina == "mat" else 325.0


def build_proficiencia_block(
    pct_acertos: float | None = None,
    aprendizado: str | None = None,
    proficiencia: float | None = None,
    nivel: int | None = None,
    nivel_label: str = "",
    disciplina: str = "lp",
) -> dict | None:
    """Monta bloco de proficiência; completa faltantes pela escala SAEB × %."""
    scale = scale_for_disciplina(disciplina)
    pct = float(pct_acertos) if isinstance(pct_acertos, (int, float)) else None
    prof = float(proficiencia) if isinstance(proficiencia, (int, float)) else None
    if pct is None and prof is None:
        return None
    if pct is not None and pct <= 1:
        pct = pct * 100
    if prof is None and pct is not None:
        prof = scale * (pct / 100)
    if pct is None and prof is not None:
        pct = (prof / scale) * 100
    pct = round_half_up(pct, 2)
    prof = round_half_up(prof, 2)
    aprend = normalize_aprendizado(aprendizado) if aprendizado else aprendizado_from_proficiencia(prof, disciplina)
    if nivel is None:
        nivel, nivel_label = nivel_from_proficiencia(prof, disciplina)
    elif not nivel_label:
        nivel_label = f"NÍVEL {nivel}"
    return {
        "pctAcertos": pct,
        "aprendizado": aprend,
        "proficiencia": prof,
        "nivel": nivel,
        "nivelLabel": nivel_label,
    }


def parse_questions(wb, sheet: str) -> tuple[list[str], dict[str, dict]]:
    ws = wb[sheet]
    is_lp = "portug" in sheet.lower()
    is_mat = "matem" in sheet.lower()
    disciplina = "mat" if is_mat else "lp"
    questions: list[str] = []
    col = 4
    while col <= ws.max_column:
        header = ws.cell(13, col).value
        if header and "Quest" in str(header):
            questions.append(re.sub(r"\s+", " ", str(header).strip()))
            col += 2
        else:
            col += 1

    prof_cols = find_proficiencia_cols(ws) if (is_lp or is_mat) else {}
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
                    if isinstance(pct, str) and pct.startswith("="):
                        pct = None
                    if isinstance(pct, (int, float)):
                        # Mantém precisão cheia; arredonda só na média final / exportação.
                        questoes[question] = float(pct)
                    elif isinstance(quant, (int, float)):
                        # Planilha regravada sem cache de fórmulas: recalcula % pela quantidade.
                        base = schools[escola].get("avaliados") or schools[escola].get("previstos") or 0
                        if base:
                            questoes[question] = (float(quant) * 100.0) / float(base)
                    if isinstance(quant, (int, float)):
                        acertos[question] = int(quant)
                schools[escola]["questoes"] = questoes
                schools[escola]["acertos"] = acertos
                block = None
                if prof_cols:
                    pct_raw = ws.cell(row, prof_cols["pctAcertos"]).value if "pctAcertos" in prof_cols else None
                    aprend = ws.cell(row, prof_cols["aprendizado"]).value if "aprendizado" in prof_cols else None
                    prof = ws.cell(row, prof_cols["proficiencia"]).value if "proficiencia" in prof_cols else None
                    nivel_raw = ws.cell(row, prof_cols["nivel"]).value if "nivel" in prof_cols else None
                    # data_only=True pode devolver None se a fórmula Excel ainda não foi cacheada.
                    if isinstance(aprend, str) and aprend.startswith("="):
                        aprend = None
                    if isinstance(prof, str) and str(prof).startswith("="):
                        prof = None
                    if isinstance(pct_raw, str) and str(pct_raw).startswith("="):
                        pct_raw = None
                    if isinstance(nivel_raw, str) and str(nivel_raw).startswith("="):
                        nivel_raw = None
                    # Sem cache na coluna PROFICIÊNCIA: usa a média das questões (como AR/AT no Excel)
                    # e aplica a mesma fórmula da planilha: LP = 325 * %; MAT = 350 * %.
                    if not isinstance(prof, (int, float)) and questoes:
                        media_q = media_from_questoes(questoes)
                        if media_q:
                            if not isinstance(pct_raw, (int, float)):
                                pct_raw = media_q
                            scale = scale_for_disciplina(disciplina)
                            pct_for_scale = float(pct_raw)
                            if pct_for_scale <= 1:
                                pct_for_scale *= 100
                            prof = scale * (pct_for_scale / 100.0)
                    nivel_num, nivel_label = parse_nivel(nivel_raw)
                    block = build_proficiencia_block(
                        pct_acertos=pct_raw if isinstance(pct_raw, (int, float)) else None,
                        aprendizado=aprend if aprend else None,
                        proficiencia=prof if isinstance(prof, (int, float)) else None,
                        nivel=nivel_num,
                        nivel_label=nivel_label,
                        disciplina=disciplina,
                    )
                # Sem colunas AY-BB (ou fórmulas sem cache): deriva da média das questões.
                if block is None and (is_lp or is_mat) and questoes:
                    media = media_from_questoes(questoes)
                    if media:
                        block = build_proficiencia_block(pct_acertos=media, disciplina=disciplina)
                if block:
                    schools[escola]["proficiencia"] = block
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


def build_turmas(escolas_lp: dict[str, dict], escolas_mat: dict[str, dict], ano: int = 5) -> list[dict]:
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
            "ano": ano,
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


def find_xlsx_by_periodo(ano_alvo: int | None = None) -> dict[str, str]:
    found: dict[str, str] = {}
    candidates: dict[str, list[str]] = {}
    for name in os.listdir(ROOT):
        if not name.lower().endswith(".xlsx"):
            continue
        if name.startswith("~$"):
            continue
        # Ignora planilha de descritores e auxiliares.
        if name.lower().startswith("descritores"):
            continue
        periodo = classify_periodo(name)
        if not periodo:
            continue
        if ano_alvo is not None and detect_ano(name) != ano_alvo:
            continue
        candidates.setdefault(periodo, []).append(os.path.join(ROOT, name))
    for periodo, paths in candidates.items():
        # Prefere 4º ano quando pedido; depois faixas MAT/LP modeladas; em empate, a mais recente.
        # Valores AZ–BC sem cache Excel ainda são derivados da média.
        def preference(path: str) -> tuple:
            name = os.path.basename(path).lower()
            ano = detect_ano(name)
            score = 0
            if "aprendizado-mat" in name or "fix-falso" in name:
                score = 3
            elif "mat-proficiencia" in name or "com proficiencia" in name:
                score = 2
            elif "proficiencia" in name:
                score = 1
            # Sem ano_alvo, prefere 4º se existir no lote (pedido do painel de saída).
            ano_rank = 0 if ano == 4 else 1
            return (ano_rank, -score, -os.path.getmtime(path), name)

        preferred = sorted(paths, key=preference)
        found[periodo] = preferred[0]
    if not found:
        raise FileNotFoundError("Nenhuma planilha .xlsx de período encontrada em DashboardADSE")
    return found


def build_periodo(fp: str, periodo: str) -> dict:
    wb = openpyxl.load_workbook(fp, data_only=True)
    ano = detect_ano(os.path.basename(fp))

    sheet_lp = find_sheet(wb, ["Português", "Portugues"])
    sheet_mat = find_sheet(wb, ["Matemática", "Matematica"])
    questoes_lp, escolas_lp = parse_questions(wb, sheet_lp)
    questoes_mat, escolas_mat = parse_questions(wb, sheet_mat)
    turmas = build_turmas(escolas_lp, escolas_mat, ano=ano)
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
    semestre = "2º Semestre 2026" if periodo == "saida" else "1º Semestre 2026"
    proficiencia_lp = build_proficiencia_rows(escolas_lp, "lp")
    proficiencia_mat = build_proficiencia_rows(escolas_mat, "mat")
    media_lp_geral = (
        round_half_up(sum(t["mediaLp"] * t["avaliadosLp"] for t in turmas) / total_avaliados_lp, 2)
        if total_avaliados_lp
        else 0
    )
    media_mat_geral = (
        round_half_up(sum(t["mediaMat"] * t["avaliadosMat"] for t in turmas) / total_avaliados_mat, 2)
        if total_avaliados_mat
        else 0
    )
    # Linha PARTICIPAÇÃO / % SIM da planilha (ex.: 55,22%) → bloco AZ–BC municipal.
    proficiencia_lp_geral = build_proficiencia_block(pct_acertos=media_lp_geral, disciplina="lp")
    proficiencia_mat_geral = build_proficiencia_block(pct_acertos=media_mat_geral, disciplina="mat")
    return {
        "meta": {
            "titulo": "Avaliação Diagnóstica do Sistema Estadual — ADSE",
            "subtitulo": f"{ano_label(ano)} · {label} · {semestre}",
            "fonte": os.path.basename(fp),
            "periodo": periodo,
            "ano": ano,
            "totalPrevistos": total_previstos,
            "totalAvaliados": total_avaliados,
            "previstosLp": total_previstos_lp,
            "avaliadosLp": total_avaliados_lp,
            "previstosMat": total_previstos_mat,
            "avaliadosMat": total_avaliados_mat,
            "participacaoGeral": round_half_up(total_avaliados / total_previstos * 100, 1)
            if total_previstos
            else 0,
            "mediaLpGeral": media_lp_geral,
            "mediaMatGeral": media_mat_geral,
            "proficienciaLpGeral": proficiencia_lp_geral,
            "proficienciaMatGeral": proficiencia_mat_geral,
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


def anos_disponiveis_em_planilhas() -> list[int]:
    """Lista 4º e/ou 5º ano conforme as planilhas Ranking encontradas."""
    found: set[int] = set()
    for name in os.listdir(ROOT):
        if not name.lower().endswith(".xlsx") or name.startswith("~$"):
            continue
        if name.lower().startswith("descritores"):
            continue
        if not classify_periodo(name):
            continue
        ano = detect_ano(name)
        if ano in (4, 5):
            found.add(ano)
    return sorted(found)


def build_ano(ano_alvo: int) -> dict:
    """Monta o pacote de um único ano (períodos + turmas + escolas)."""
    files = find_xlsx_by_periodo(ano_alvo=ano_alvo)
    order = ["diagnostica", "percurso", "saida"]
    periodos_data: dict[str, dict] = {}
    for periodo in order:
        fp = files.get(periodo)
        if not fp:
            continue
        periodos_data[periodo] = build_periodo(fp, periodo)

    if not periodos_data:
        raise FileNotFoundError(f"Nenhum período processado para o {ano_alvo}º ano")

    disponiveis = list(periodos_data.keys())
    for candidato in ("saida", "percurso", "diagnostica"):
        if candidato in periodos_data:
            padrao = candidato
            break
    else:
        padrao = disponiveis[0]
    padrao_data = periodos_data[padrao]
    ano = int(padrao_data["meta"].get("ano") or ano_alvo)
    labels = [PERIOD_LABELS.get(p, p) for p in disponiveis]
    if "saida" in periodos_data and any(p in periodos_data for p in ("diagnostica", "percurso")):
        semestre_label = "1º e 2º Semestres 2026"
    elif "saida" in periodos_data:
        semestre_label = "2º Semestre 2026"
    else:
        semestre_label = "1º Semestre 2026"

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
        "subtitulo": f"{ano_label(ano)} · {' · '.join(labels)} · {semestre_label}",
        "periodo": padrao,
        "periodoPadrao": padrao,
        "periodosDisponiveis": disponiveis,
        "ano": ano,
        "fontes": {periodo: data["meta"]["fonte"] for periodo, data in periodos_data.items()},
    }

    return {
        "meta": meta,
        "byPeriodo": by_periodo,
        "turmas": merge_turmas(periodos_data),
        "escolas": merge_escolas(periodos_data),
        "escolasQuestoesLp": padrao_data["escolasQuestoesLp"],
        "escolasQuestoesMat": padrao_data["escolasQuestoesMat"],
    }


def build() -> dict:
    """Gera dados dos anos disponíveis (4º e/ou 5º), sem sobrescrever um pelo outro."""
    anos = anos_disponiveis_em_planilhas()
    if not anos:
        raise FileNotFoundError("Nenhuma planilha Ranking de 4º ou 5º ano encontrada")

    by_ano: dict[str, dict] = {}
    for ano in anos:
        try:
            by_ano[str(ano)] = build_ano(ano)
        except FileNotFoundError as exc:
            print(f"Aviso: {exc}")

    if not by_ano:
        raise FileNotFoundError("Nenhum período processado")

    # Prefere 5º quando existir (histórico completo); senão o único disponível.
    if "5" in by_ano:
        ano_padrao = 5
    else:
        ano_padrao = int(next(iter(by_ano)))

    ativo = by_ano[str(ano_padrao)]
    meta = {
        **ativo["meta"],
        "anoPadrao": ano_padrao,
        "anosDisponiveis": [int(a) for a in sorted(by_ano.keys(), key=int)],
    }

    return {
        "meta": meta,
        "byPeriodo": ativo["byPeriodo"],
        "turmas": ativo["turmas"],
        "escolas": ativo["escolas"],
        "escolasQuestoesLp": ativo["escolasQuestoesLp"],
        "escolasQuestoesMat": ativo["escolasQuestoesMat"],
        "byAno": by_ano,
    }


def main() -> None:
    data = build()
    target = os.path.join(ROOT, "dados.js")
    payload = json.dumps(data, ensure_ascii=False, separators=(",", ":"))
    with open(target, "w", encoding="utf-8") as handle:
        handle.write(f"const DADOS = {payload};\n")
    anos = ", ".join(f"{a}º" for a in data["meta"]["anosDisponiveis"])
    for key, bloco in data.get("byAno", {}).items():
        periodos = ", ".join(bloco["meta"]["periodosDisponiveis"])
        print(
            f"{key}º ano: {len(bloco['turmas'])} turmas, {len(bloco['escolas'])} escolas ({periodos})"
        )
    print(f"Gerado dados.js com anos {anos} (padrão {data['meta']['anoPadrao']}º) em {target}")


if __name__ == "__main__":
    main()
