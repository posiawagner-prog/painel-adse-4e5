#!/usr/bin/env python3
"""Gera dados.js a partir da planilha ADSE (5º ano)."""
from __future__ import annotations

import json
import os
import re
import sys

try:
    import openpyxl
except ImportError:
    import subprocess

    subprocess.check_call([sys.executable, "-m", "pip", "install", "openpyxl", "-q"])
    import openpyxl

ROOT = os.path.dirname(os.path.abspath(__file__))


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
                        questoes[question] = round(float(pct), 2)
                    if isinstance(quant, (int, float)):
                        acertos[question] = int(quant)
                schools[escola]["questoes"] = questoes
                schools[escola]["acertos"] = acertos
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
            result[question] = round(weighted / total, 2)
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
    if not questoes:
        return 0.0
    return round(sum(questoes.values()) / len(questoes), 2)


def assign_ranking(items: list[dict], field: str, target: str) -> None:
    ranked = sorted(items, key=lambda item: item[field], reverse=True)
    for index, item in enumerate(ranked, start=1):
        item[target] = f"{index}º"


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
        previstos = max(prev_lp, prev_mat)
        avaliados = min(aval_lp, aval_mat) if aval_lp and aval_mat else max(aval_lp, aval_mat)
        media_lp = media_from_questoes(lp.get("questoes", {}))
        media_mat = media_from_questoes(mat.get("questoes", {}))
        media_geral = round((media_lp + media_mat) / 2, 2) if media_lp or media_mat else 0.0
        turmas.append(
            {
                "ano": 5,
                "escola": escola,
                "turma": turma,
                "previstos": previstos,
                "avaliados": avaliados,
                "participacao": round(avaliados / previstos * 100, 1) if previstos else 0,
                "mediaLp": media_lp,
                "mediaMat": media_mat,
                "mediaGeral": media_geral,
                "previstosLp": prev_lp,
                "avaliadosLp": aval_lp,
                "previstosMat": prev_mat,
                "avaliadosMat": aval_mat,
            }
        )

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
        media_lp = round(sum(row["mediaLp"] * row["avaliadosLp"] for row in rows) / aval_lp, 2) if aval_lp else 0
        media_mat = round(sum(row["mediaMat"] * row["avaliadosMat"] for row in rows) / aval_mat, 2) if aval_mat else 0
        media_geral = round(sum(row["mediaGeral"] * row["avaliados"] for row in rows) / avaliados, 2) if avaliados else 0
        escolas.append(
            {
                "escola": nome,
                "previstos": previstos,
                "avaliados": avaliados,
                "participacao": round(avaliados / previstos * 100, 1) if previstos else 0,
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


def find_xlsx() -> str:
    for name in os.listdir(ROOT):
        if name.lower().endswith(".xlsx"):
            return os.path.join(ROOT, name)
    raise FileNotFoundError("Nenhuma planilha .xlsx encontrada em DashboardADSE")


def build() -> dict:
    fp = find_xlsx()
    wb = openpyxl.load_workbook(fp, data_only=True)

    sheet_lp = find_sheet(wb, ["Português", "Portugues"])
    sheet_mat = find_sheet(wb, ["Matemática", "Matematica"])
    questoes_lp, escolas_lp = parse_questions(wb, sheet_lp)
    questoes_mat, escolas_mat = parse_questions(wb, sheet_mat)
    turmas = build_turmas(escolas_lp, escolas_mat)
    escolas = build_escolas(turmas)

    total_previstos = sum(t["previstos"] for t in turmas)
    total_avaliados = sum(t["avaliados"] for t in turmas)
    total_previstos_lp = sum(t["previstosLp"] for t in turmas)
    total_avaliados_lp = sum(t["avaliadosLp"] for t in turmas)
    total_previstos_mat = sum(t["previstosMat"] for t in turmas)
    total_avaliados_mat = sum(t["avaliadosMat"] for t in turmas)

    return {
        "meta": {
            "titulo": "Avaliação Diagnóstica do Sistema Estadual — ADSE",
            "subtitulo": "5º Ano · Avaliação Formativa/Percurso · 1º Semestre 2026",
            "fonte": os.path.basename(fp),
            "ano": 5,
            "totalPrevistos": total_previstos,
            "totalAvaliados": total_avaliados,
            "previstosLp": total_previstos_lp,
            "avaliadosLp": total_avaliados_lp,
            "previstosMat": total_previstos_mat,
            "avaliadosMat": total_avaliados_mat,
            "participacaoGeral": round(total_avaliados / total_previstos * 100, 1)
            if total_previstos
            else 0,
            "mediaLpGeral": round(sum(t["mediaLp"] * t["avaliadosLp"] for t in turmas) / total_avaliados_lp, 2)
            if total_avaliados_lp
            else 0,
            "mediaMatGeral": round(sum(t["mediaMat"] * t["avaliadosMat"] for t in turmas) / total_avaliados_mat, 2)
            if total_avaliados_mat
            else 0,
            "mediaGeral": round(sum(t["mediaGeral"] * t["avaliados"] for t in turmas) / total_avaliados, 2)
            if total_avaliados
            else 0,
            "questoesLp": questoes_lp,
            "questoesMat": questoes_mat,
            "mediaQuestoesLp": avg_questions(questoes_lp, escolas_lp),
            "mediaQuestoesMat": avg_questions(questoes_mat, escolas_mat),
            "acertosQuestoesLp": sum_acertos(questoes_lp, escolas_lp),
            "acertosQuestoesMat": sum_acertos(questoes_mat, escolas_mat),
        },
        "turmas": turmas,
        "escolas": escolas,
        "escolasQuestoesLp": escolas_lp,
        "escolasQuestoesMat": escolas_mat,
    }


def main() -> None:
    data = build()
    target = os.path.join(ROOT, "dados.js")
    payload = json.dumps(data, ensure_ascii=False, separators=(",", ":"))
    with open(target, "w", encoding="utf-8") as handle:
        handle.write(f"const DADOS = {payload};\n")
    print(f"Gerado {len(data['turmas'])} turmas e {len(data['escolas'])} escolas em {target}")


if __name__ == "__main__":
    main()
