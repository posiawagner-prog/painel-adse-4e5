const FAIXAS = [
  { key: "critico", label: "Abaixo do Básico (< 40%)", color: "#FF3B30", min: 0, max: 40 },
  { key: "atencao", label: "Básico (40–60%)", color: "#FF9500", min: 40, max: 60 },
  { key: "bom", label: "Adequado (60–80%)", color: "#FFD60A", min: 60, max: 80 },
  { key: "excelente", label: "Avançado (≥ 80%)", color: "#00E676", min: 80, max: 101 },
];

const DISCIPLINAS = {
  geral: "Português + Matemática",
  lp: "Língua Portuguesa",
  mat: "Matemática",
};

const PERIODOS = {
  diagnostica: "Diagnóstica",
  percurso: "Percurso",
  saida: "Saída",
};

/** Fallback quando meta não declara o período padrão. */
const PERIODO_DADOS = "percurso";

const state = {
  view: "dashboard",
  visao: "turmas",
  disciplina: "geral",
  escola: "",
  turma: "",
  periodo: "percurso",
  faixa: "",
  search: "",
  page: 1,
  pageSize: 10,
  sort: { key: "ranking", dir: 1 },
};

function periodoPadrao() {
  return DADOS.meta?.periodoPadrao || DADOS.meta?.periodo || PERIODO_DADOS;
}

function periodosDisponiveis() {
  return DADOS.meta?.periodosDisponiveis || Object.keys(DADOS.byPeriodo || {}) || [periodoPadrao()];
}

function periodoBundle(periodo = state.periodo) {
  if (DADOS.byPeriodo?.[periodo]) return DADOS.byPeriodo[periodo];
  if (periodo === periodoPadrao()) {
    return {
      meta: DADOS.meta,
      escolasQuestoesLp: DADOS.escolasQuestoesLp,
      escolasQuestoesMat: DADOS.escolasQuestoesMat,
    };
  }
  return null;
}

function metaAtivo() {
  return periodoBundle()?.meta || DADOS.meta;
}

function expandPeriodo(row, periodo = state.periodo) {
  const block = row?.periodos?.[periodo];
  if (!block) return null;
  return { ...row, ...block };
}

const charts = {};
const THEME_KEY = "adse-theme";
const PAGE_SIZE = 10;

function fmt(n) {
  return new Intl.NumberFormat("pt-BR").format(n || 0);
}

function fmtPct(n) {
  return `${(n || 0).toFixed(2).replace(".", ",")}%`;
}

function contrastTextOn(color) {
  const hex = String(color || "#000000").replace("#", "");
  if (hex.length !== 6) return "#ffffff";
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.58 ? "#141418" : "#ffffff";
}

function shortSchool(name) {
  return String(name || "")
    .replace(/^E\.M\.E\.I\.F\.\s+/i, "")
    .replace(/^C\.E\.\s+/i, "")
    .replace(/\s*\([^)]+\)\s*$/, "")
    .trim();
}

function mediaRow(row) {
  if (state.disciplina === "lp") return row.mediaLp;
  if (state.disciplina === "mat") return row.mediaMat;
  return row.mediaGeral;
}

function faixaFromMedia(media) {
  return FAIXAS.find((f) => media >= f.min && media < f.max) || FAIXAS[0];
}

function metricPrevistos(row) {
  if (state.disciplina === "lp") return row.previstosLp ?? row.previstos;
  if (state.disciplina === "mat") return row.previstosMat ?? row.previstos;
  const lp = row.previstosLp ?? 0;
  const mat = row.previstosMat ?? 0;
  if (lp || mat) return roundHalfUp((lp + mat) / 2, 0);
  return row.previstos || 0;
}

function metricAvaliados(row) {
  if (state.disciplina === "lp") return row.avaliadosLp ?? row.avaliados;
  if (state.disciplina === "mat") return row.avaliadosMat ?? row.avaliados;
  const lp = row.avaliadosLp ?? 0;
  const mat = row.avaliadosMat ?? 0;
  if (lp || mat) return roundHalfUp((lp + mat) / 2, 0);
  return row.avaliados || 0;
}

function subjectPrevistos(row, subject) {
  if (state.visao === "escolas") {
    const turmas = turmasForEscolaNome(row.escola);
    if (!turmas.length) {
      if (subject === "lp") return row.previstosLp ?? row.previstos ?? 0;
      if (subject === "mat") return row.previstosMat ?? row.previstos ?? 0;
      return row.previstos || 0;
    }
    if (subject === "lp") return turmas.reduce((acc, t) => acc + (t.previstosLp ?? t.previstos ?? 0), 0);
    if (subject === "mat") return turmas.reduce((acc, t) => acc + (t.previstosMat ?? t.previstos ?? 0), 0);
    return turmas.reduce((acc, t) => acc + (t.previstos ?? 0), 0);
  }
  if (subject === "lp") return row.previstosLp ?? row.previstos ?? 0;
  if (subject === "mat") return row.previstosMat ?? row.previstos ?? 0;
  return row.previstos || 0;
}

function matchesSearchTurma(row, q) {
  return !q || `${row.escola} ${row.turma}`.toLowerCase().includes(q);
}

function matchesSearchEscola(row, q) {
  return !q || row.escola.toLowerCase().includes(q);
}

function periodoTemDados(periodo = state.periodo) {
  return !!periodoBundle(periodo);
}

function turmasBase(exclude = {}) {
  const q = exclude.search ? "" : state.search.trim().toLowerCase();
  if (!exclude.periodo && !periodoTemDados()) return [];
  return DADOS.turmas
    .map((row) => {
      const active = expandPeriodo(row, state.periodo);
      if (active) return active;
      if (!exclude.periodo) return null;
      for (const p of periodosDisponiveis()) {
        const alt = expandPeriodo(row, p);
        if (alt) return alt;
      }
      return null;
    })
    .filter(Boolean)
    .filter((row) => {
      if (!exclude.escola && state.escola && row.escola !== state.escola) return false;
      if (!exclude.turma && state.turma && row.turma !== state.turma) return false;
      if (!exclude.faixa && state.faixa && faixaFromMedia(mediaRow(row)).key !== state.faixa) return false;
      if (!exclude.search && !matchesSearchTurma(row, q)) return false;
      return true;
    });
}

function escolasBase(exclude = {}) {
  const q = exclude.search ? "" : state.search.trim().toLowerCase();
  if (!exclude.periodo && !periodoTemDados()) return [];
  return DADOS.escolas
    .map((row) => {
      const active = expandPeriodo(row, state.periodo);
      if (active) return active;
      if (!exclude.periodo) return null;
      for (const p of periodosDisponiveis()) {
        const alt = expandPeriodo(row, p);
        if (alt) return alt;
      }
      return null;
    })
    .filter(Boolean)
    .filter((row) => {
      if (!exclude.escola && state.escola && row.escola !== state.escola) return false;
      if (!exclude.faixa && state.faixa && faixaFromMedia(mediaRow(row)).key !== state.faixa) return false;
      if (!exclude.search && !matchesSearchEscola(row, q)) return false;
      return true;
    });
}

function rowsTurmas() {
  return turmasBase();
}

function rowsEscolas() {
  return escolasBase();
}

function activeRows() {
  return state.visao === "escolas" ? rowsEscolas() : rowsTurmas();
}

function rowMetrics(row) {
  if (state.visao === "escolas") {
    return escolaRowMetrics(row);
  }
  return {
    previstos: metricPrevistos(row),
    avaliados: metricAvaliados(row),
  };
}

function subjectAvaliados(row, subject) {
  if (state.visao === "escolas") {
    const turmas = turmasForEscolaNome(row.escola);
    if (!turmas.length) return row.avaliados || 0;
    if (subject === "lp") return turmas.reduce((acc, t) => acc + (t.avaliadosLp ?? t.avaliados), 0);
    if (subject === "mat") return turmas.reduce((acc, t) => acc + (t.avaliadosMat ?? t.avaliados), 0);
    return turmas.reduce((acc, t) => acc + t.avaliados, 0);
  }
  if (subject === "lp") return row.avaliadosLp ?? row.avaliados;
  if (subject === "mat") return row.avaliadosMat ?? row.avaliados;
  return row.avaliados;
}

function roundHalfUp(value, digits = 2) {
  const sign = value < 0 ? -1 : 1;
  const factor = 10 ** digits;
  return (sign * Math.floor(Math.abs(Number(value) || 0) * factor + 0.5)) / factor;
}

/** Turmas das escolas exibidas — evita distorcer a média da rede na visão por escola. */
function turmasOfEscolaRows(escolaRows) {
  const bases = new Set(escolaRows.map((r) => escolaBaseNome(r.escola)));
  return turmasBase({ escola: true, turma: true, faixa: true, search: true }).filter((t) =>
    bases.has(escolaBaseNome(t.escola))
  );
}

function aggregate(rows) {
  const previstos = rows.reduce((acc, r) => acc + rowMetrics(r).previstos, 0);
  const avaliados = rows.reduce((acc, r) => acc + rowMetrics(r).avaliados, 0);

  // Médias sempre pelas turmas (como no Excel da rede).
  // Na visão por escola, mediaLp da escola é média simples das turmas;
  // reponderar isso pelo tamanho da escola muda o % (ex.: 59,51% → 58,90%).
  const mediaRows = state.visao === "escolas" ? turmasOfEscolaRows(rows) : rows;

  const weightedAvg = (getMedia, getWeight) => {
    let sum = 0;
    let weightTotal = 0;
    for (const row of mediaRows) {
      const weight = getWeight(row) || 0;
      if (!weight) continue;
      sum += (getMedia(row) || 0) * weight;
      weightTotal += weight;
    }
    return weightTotal ? roundHalfUp(sum / weightTotal) : 0;
  };

  const weightLp = (r) => r.avaliadosLp ?? r.avaliados ?? 0;
  const weightMat = (r) => r.avaliadosMat ?? r.avaliados ?? 0;

  const mediaLp = weightedAvg((r) => r.mediaLp, weightLp);
  const mediaMat = weightedAvg((r) => r.mediaMat, weightMat);
  // Visão geral: junta as médias ponderadas de LP e MAT
  const mediaGeral = roundHalfUp((mediaLp + mediaMat) / 2);

  return {
    previstos,
    avaliados,
    participacao: previstos ? (avaliados / previstos) * 100 : 0,
    mediaLp,
    mediaMat,
    mediaGeral,
  };
}

function toggleFilter(key, value) {
  state[key] = state[key] === value ? "" : value;
  if (key === "escola") state.turma = "";
  state.page = 1;
  syncSelects();
  render();
}

function setView(view) {
  state.view = view;
  document.querySelectorAll(".nav-btn[data-view]").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.view === view);
  });
  document.getElementById("viewDashboard").hidden = view !== "dashboard";
  document.getElementById("viewTable").hidden = view !== "table";
}

function escolasUnicas() {
  return [...new Set(turmasBase({ escola: true }).map((r) => r.escola))].sort((a, b) =>
    a.localeCompare(b, "pt-BR")
  );
}

function turmasDaEscola(escola) {
  return [
    ...new Set(
      turmasBase({ turma: true, escola: !escola })
        .filter((r) => !escola || r.escola === escola)
        .map((r) => r.turma)
    ),
  ].sort((a, b) => {
    if (a === "ÚNICA") return 1;
    if (b === "ÚNICA") return -1;
    return a.localeCompare(b, "pt-BR");
  });
}

function sumMetric(rows, field) {
  return rows.reduce((acc, row) => acc + (field === "previstos" ? metricPrevistos(row) : metricAvaliados(row)), 0);
}

function turmasForEscolaNome(escolaNome) {
  const base = String(escolaNome || "")
    .replace(/\s*\([^)]+\)\s*$/, "")
    .trim();
  return turmasBase({ escola: true }).filter((row) => row.escola === base || row.escola.startsWith(base));
}

function escolaRowMetrics(row) {
  if (state.visao === "escolas") {
    const rows = turmasForEscolaNome(row.escola);
    if (rows.length) {
      return {
        previstos: sumMetric(rows, "previstos"),
        avaliados: sumMetric(rows, "avaliados"),
      };
    }
  }
  return {
    previstos: metricPrevistos(row),
    avaliados: metricAvaliados(row),
  };
}

function escolaStats(escola) {
  const rows = turmasBase({ escola: true }).filter((r) => r.escola === escola);
  return {
    turmas: rows.length,
    previstos: sumMetric(rows, "previstos"),
    avaliados: sumMetric(rows, "avaliados"),
  };
}

function turmaStats(turma) {
  const rows = turmasBase({ turma: true }).filter(
    (r) => r.turma === turma && (!state.escola || r.escola === state.escola)
  );
  return {
    count: rows.length,
    previstos: sumMetric(rows, "previstos"),
    avaliados: sumMetric(rows, "avaliados"),
  };
}

function optionLabel(value, suffix) {
  return `${value}${suffix ? ` (${suffix})` : ""}`;
}

function fillSelects() {
  const vis = document.getElementById("filterVisao");
  const disc = document.getElementById("filterDisciplina");
  const esc = document.getElementById("filterEscola");
  const tur = document.getElementById("filterTurma");
  const m = metaAtivo();
  const turmasCount = turmasBase({ escola: true, turma: true, faixa: true, search: true }).length;
  const escolasCount = escolasBase({ escola: true, faixa: true, search: true }).length;

  vis.innerHTML = [
    `<option value="turmas">${optionLabel("Por turma", `${turmasCount} turmas`)}</option>`,
    `<option value="escolas">${optionLabel("Por escola", `${escolasCount} escolas`)}</option>`,
  ].join("");

  const periodoSelect = document.getElementById("filterPeriodo");
  if (periodoSelect) {
    const order = ["diagnostica", "percurso", "saida"];
    periodoSelect.innerHTML = order
      .map((periodo) => {
        const has = periodoTemDados(periodo);
        const label = has ? PERIODOS[periodo] : `${PERIODOS[periodo]} (sem dados)`;
        return `<option value="${periodo}" ${has ? "" : "disabled"}>${label}</option>`;
      })
      .join("");
  }

  disc.innerHTML = [
    `<option value="lp">${optionLabel("Língua Portuguesa", `${fmt(m.previstosLp ?? m.totalPrevistos)} prev · ${fmt(m.avaliadosLp ?? m.totalAvaliados)} aval`)}</option>`,
    `<option value="mat">${optionLabel("Matemática", `${fmt(m.previstosMat ?? m.totalPrevistos)} prev · ${fmt(m.avaliadosMat ?? m.totalAvaliados)} aval`)}</option>`,
    `<option value="geral">${optionLabel(
      "Português + Matemática",
      `${fmt(m.totalPrevistos)} prev · ${fmt(m.totalAvaliados)} aval · LP ${fmt(m.previstosLp ?? 0)}/${fmt(m.avaliadosLp ?? 0)} · MAT ${fmt(m.previstosMat ?? 0)}/${fmt(m.avaliadosMat ?? 0)}`
    )}</option>`,
  ].join("");

  if (state.visao === "escolas") {
    const rows = escolasBase({ escola: true });
    const totalPrev = rows.reduce((acc, row) => acc + escolaRowMetrics(row).previstos, 0);
    const totalAval = rows.reduce((acc, row) => acc + escolaRowMetrics(row).avaliados, 0);
    esc.innerHTML =
      `<option value="">${optionLabel("Todas as escolas", `${rows.length} · ${fmt(totalPrev)} prev · ${fmt(totalAval)} aval`)}</option>` +
      rows
        .map((row) => {
          const metrics = escolaRowMetrics(row);
          const suffix = `${fmt(metrics.previstos)} prev · ${fmt(metrics.avaliados)} aval`;
          return `<option value="${row.escola}">${optionLabel(shortSchool(row.escola), suffix)}</option>`;
        })
        .join("");
    tur.innerHTML = `<option value="">—</option>`;
    tur.disabled = true;
  } else {
    const escolaRows = escolasUnicas();
    const allTurmas = turmasBase({ turma: true, escola: true });
    const totalPrev = sumMetric(allTurmas, "previstos");
    const totalAval = sumMetric(allTurmas, "avaliados");
    esc.innerHTML =
      `<option value="">${optionLabel("Todas as escolas", `${escolaRows.length} · ${fmt(totalPrev)} prev · ${fmt(totalAval)} aval`)}</option>` +
      escolaRows
        .map((escola) => {
          const stats = escolaStats(escola);
          const suffix = `${stats.turmas} turma${stats.turmas > 1 ? "s" : ""} · ${fmt(stats.previstos)} prev · ${fmt(stats.avaliados)} aval`;
          return `<option value="${escola}">${optionLabel(shortSchool(escola), suffix)}</option>`;
        })
        .join("");

    const turmaRows = turmasBase({ turma: true });
    const turmas = state.escola ? turmasDaEscola(state.escola) : [...new Set(turmaRows.map((r) => r.turma))].sort((a, b) => {
      if (a === "ÚNICA") return 1;
      if (b === "ÚNICA") return -1;
      return a.localeCompare(b, "pt-BR");
    });
    const turPrev = sumMetric(turmaRows, "previstos");
    const turAval = sumMetric(turmaRows, "avaliados");
    tur.disabled = false;
    tur.innerHTML =
      `<option value="">${optionLabel("Todas as turmas", `${turmas.length} · ${fmt(turPrev)} prev · ${fmt(turAval)} aval`)}</option>` +
      turmas
        .map((turma) => {
          const stats = turmaStats(turma);
          const suffix =
            stats.count > 1 && !state.escola
              ? `${stats.count} turmas · ${fmt(stats.previstos)} prev · ${fmt(stats.avaliados)} aval`
              : `${fmt(stats.previstos)} prev · ${fmt(stats.avaliados)} aval`;
          return `<option value="${turma}">${optionLabel(turma, suffix)}</option>`;
        })
        .join("");
  }

  syncSelects();
}

function syncSelects() {
  ["filterVisao", "filterDisciplina", "filterEscola", "filterTurma", "filterPeriodo"].forEach((id) => {
    const el = document.getElementById(id);
    if (!el) return;
    const key = id.replace("filter", "").toLowerCase();
    el.value =
      state[key] ||
      (id === "filterDisciplina" ? "geral" : id === "filterVisao" ? "turmas" : id === "filterPeriodo" ? periodoPadrao() : "");
  });
}

function renderChips() {
  const chips = document.getElementById("chips");
  const items = [];
  if (state.visao === "escolas") items.push({ key: "visao", label: "Visão: escolas" });
  if (state.disciplina !== "geral") items.push({ key: "disciplina", label: DISCIPLINAS[state.disciplina] });
  if (state.escola) items.push({ key: "escola", label: shortSchool(state.escola) });
  if (state.turma) items.push({ key: "turma", label: `Turma ${state.turma}` });
  if (state.periodo && state.periodo !== periodoPadrao()) {
    items.push({ key: "periodo", label: `Período: ${PERIODOS[state.periodo] || state.periodo}` });
  }
  if (state.faixa) items.push({ key: "faixa", label: FAIXAS.find((f) => f.key === state.faixa)?.label || state.faixa });
  if (!items.length) {
    chips.hidden = true;
    chips.innerHTML = "";
    return;
  }
  chips.hidden = false;
  chips.innerHTML = items
    .map(
      (i) =>
        `<button type="button" class="chip" data-clear="${i.key}">${i.label} <span aria-hidden="true">×</span></button>`
    )
    .join("");
}

function renderKPIs(rows) {
  const agg = aggregate(rows);
  const mediaAtual =
    state.disciplina === "lp" ? agg.mediaLp : state.disciplina === "mat" ? agg.mediaMat : agg.mediaGeral;
  const prevLp = rows.reduce((acc, r) => acc + subjectPrevistos(r, "lp"), 0);
  const prevMat = rows.reduce((acc, r) => acc + subjectPrevistos(r, "mat"), 0);
  const avalLp = rows.reduce((acc, r) => acc + subjectAvaliados(r, "lp"), 0);
  const avalMat = rows.reduce((acc, r) => acc + subjectAvaliados(r, "mat"), 0);
  const avalAtual =
    state.disciplina === "lp" ? avalLp : state.disciplina === "mat" ? avalMat : agg.avaliados;
  const alunosPct = (media, avaliados) => Math.round(((media || 0) * (avaliados || 0)) / 100);

  // Em Português + Matemática: junta LP e MAT (média dos totais) nos cards.
  const previstosCard =
    state.disciplina === "geral" ? roundHalfUp((prevLp + prevMat) / 2, 0) : agg.previstos;
  const avaliadosCard =
    state.disciplina === "geral" ? roundHalfUp((avalLp + avalMat) / 2, 0) : agg.avaliados;
  const participacaoCard = previstosCard ? (avaliadosCard / previstosCard) * 100 : 0;

  const leftCards = [
    {
      title: "Previstos",
      value: fmt(previstosCard),
      foot:
        state.disciplina === "geral"
          ? `LP <span class="num">${fmt(prevLp)}</span> · MAT <span class="num">${fmt(prevMat)}</span><br><span class="num">${fmt(avaliadosCard)}</span> avaliados`
          : `<span class="num">${fmt(avaliadosCard)}</span> avaliados`,
      icon: "tot",
    },
    {
      title: "Participação",
      value: fmtPct(participacaoCard),
      foot: `<span class="num">${fmt(avaliadosCard)}</span> de <span class="num">${fmt(previstosCard)}</span>`,
      icon: "ini",
    },
  ];

  const rightCards = [
    {
      title: state.disciplina === "geral" ? "Média geral" : DISCIPLINAS[state.disciplina],
      value: fmtPct(mediaAtual),
      foot:
        state.disciplina === "geral"
          ? "média ponderada LP + MAT"
          : `<span class="num">${fmt(alunosPct(mediaAtual, avalAtual))}</span> alunos`,
      icon: "flu",
    },
    {
      title: "Turmas/Escolas",
      value: fmt(rows.length),
      foot: state.visao === "escolas" ? "escolas no filtro" : "turmas no filtro",
      icon: "cov",
    },
  ];

  if (state.disciplina === "geral") {
    leftCards.push({
      title: "Português",
      value: fmtPct(agg.mediaLp),
      foot: `<span class="num">${fmt(prevLp)}</span> prev · <span class="num">${fmt(avalLp)}</span> aval`,
      icon: "ava",
    });
    rightCards.push({
      title: "Matemática",
      value: fmtPct(agg.mediaMat),
      foot: `<span class="num">${fmt(prevMat)}</span> prev · <span class="num">${fmt(avalMat)}</span> aval`,
      icon: "pre",
    });
  }

  const iconHtml = {
    tot: `<div class="kpi-icon tot" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" stroke="currentColor" stroke-width="1.8"/></svg></div>`,
    ini: `<div class="kpi-icon ini" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none"><path d="M22 12h-4l-3 9L9 3l-3 9H2" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg></div>`,
    flu: `<div class="kpi-icon flu" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none"><path d="m9 11 2 2 4-4" stroke="currentColor" stroke-width="1.8"/><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.8"/></svg></div>`,
    ava: `<div class="kpi-icon ava" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" stroke="currentColor" stroke-width="1.8"/><path d="M8 7h8M8 11h5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg></div>`,
    pre: `<div class="kpi-icon pre" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none"><path d="M12 20V10M18 20V4M6 20v-4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg></div>`,
    cov: `<div class="kpi-icon cov" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none"><path d="M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z" stroke="currentColor" stroke-width="1.8"/></svg></div>`,
  };

  const html = (list) =>
    list
      .map((c) => {
        if (!c) return `<div class="kpi-spacer" aria-hidden="true"></div>`;
        return `
    <article class="kpi has-icon">
      ${iconHtml[c.icon]}
      <p class="kpi-title">${c.title}</p>
      <p class="kpi-value">${c.value}</p>
      <div class="kpi-foot"><span class="kpi-foot-text">${c.foot}</span></div>
    </article>`;
      })
      .join("");

  document.getElementById("kpiLeft").innerHTML = html(leftCards);
  document.getElementById("kpiRight").innerHTML = html(rightCards);
}

function currentTheme() {
  return document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark";
}

function cssVar(name) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem(THEME_KEY, theme);
  const btn = document.getElementById("btnTheme");
  if (btn) {
    btn.setAttribute("aria-checked", theme === "light" ? "true" : "false");
    btn.title = theme === "light" ? "Modo claro" : "Modo escuro";
  }
}

function chartDefaults() {
  const isLight = currentTheme() === "light";
  const ink = "rgb(0, 0, 0)";
  const outside = isLight ? ink : "#ffffff";
  const muted = isLight ? ink : cssVar("--muted") || "#c8c8d0";
  const text = isLight ? ink : "#ffffff";
  if (typeof Chart !== "undefined") {
    Chart.defaults.color = text;
    Chart.defaults.borderColor = "transparent";
    Chart.defaults.font.family = "'DM Sans', system-ui, sans-serif";
  }
  return { muted, text, ink, outside };
}

function destroyChart(key) {
  if (charts[key]) {
    charts[key].destroy();
    charts[key] = null;
  }
}

function labelRows(rows, withRank = false) {
  const ranks = withRank ? competitionRanks(rows.map((r) => mediaRow(r))) : null;
  return rows.map((r, index) => {
    const base = shortSchool(r.escola);
    const name = state.visao === "turmas" && r.turma !== "ÚNICA" ? `${base} · ${r.turma}` : base;
    return withRank ? `${name} · ${ranks[index]}º` : name;
  });
}

/** Ranking com empate denso (valores já ordenados do maior para o menor): 10º, 11º, 11º, 12º. */
function competitionRanks(values) {
  const ranks = new Array(values.length);
  let index = 0;
  let position = 1;
  while (index < values.length) {
    const key = roundHalfUp(values[index] ?? 0);
    let end = index + 1;
    while (end < values.length && roundHalfUp(values[end] ?? 0) === key) end += 1;
    for (let i = index; i < end; i += 1) ranks[i] = position;
    position += 1;
    index = end;
  }
  return ranks;
}

const rankingBarLabelsPlugin = {
  id: "rankingBarLabels",
  afterDatasetsDraw(chart) {
    const meta = chart.getDatasetMeta(0);
    if (!meta?.data?.length) return;
    const { ctx } = chart;
    const dataset = chart.data.datasets[0];
    const padding = 10;
    const { ink, outside } = chartDefaults();
    ctx.save();
    meta.data.forEach((bar, index) => {
      const value = dataset.data[index];
      const alunos = dataset.alunos?.[index];
      const rank = dataset.ranks?.[index] ?? index + 1;
      const start = Math.min(bar.x, bar.base);
      const end = Math.max(bar.x, bar.base);

      ctx.textBaseline = "middle";
      ctx.shadowColor = "transparent";
      ctx.shadowBlur = 0;

      // rótulos dentro da barra (fundo colorido)
      ctx.fillStyle = ink;
      ctx.font = "700 12px 'DM Sans', system-ui, sans-serif";
      ctx.textAlign = "left";
      ctx.fillText(`${rank}º`, start + padding, bar.y);

      if (alunos != null) {
        const alunosText = `${fmt(alunos)} alunos`;
        ctx.font = "400 11px 'DM Sans', system-ui, sans-serif";
        ctx.textAlign = "right";
        ctx.fillText(alunosText, end - 8, bar.y);
      }

      // percentual fora da barra — branco no modo escuro
      ctx.fillStyle = outside;
      ctx.font = "700 12px 'DM Sans', system-ui, sans-serif";
      ctx.textAlign = "left";
      ctx.fillText(fmtPct(value), end + 8, bar.y);
    });
    ctx.restore();
  },
};

const questoesBarLabelsPlugin = {
  id: "questoesBarLabels",
  afterDatasetsDraw(chart) {
    const meta = chart.getDatasetMeta(0);
    if (!meta?.data?.length) return;
    const { ctx } = chart;
    const dataset = chart.data.datasets[0];
    const areaTop = chart.chartArea?.top ?? 0;
    const { ink, outside } = chartDefaults();
    ctx.save();
    meta.data.forEach((bar, index) => {
      const value = dataset.data[index];
      if (value == null) return;

      const acertos = dataset.acertos?.[index];
      const acertosText =
        acertos == null ? null : `${fmt(acertos)} ${Number(acertos) === 1 ? "aluno" : "alunos"}`;

      const base = Math.max(bar.y, bar.base);
      const top = Math.min(bar.y, bar.base);
      const barHeight = base - top;

      ctx.font = "400 10px 'DM Sans', system-ui, sans-serif";
      const acertosLen = acertosText ? ctx.measureText(acertosText).width : 0;
      const fitsInside = acertosText && barHeight >= acertosLen + 14;

      // percentual acima da barra (sobe se o rótulo de alunos sair da barra)
      let pctY = bar.y - 4;
      if (acertosText && !fitsInside) {
        const outsideTop = base - 6 - acertosLen;
        pctY = Math.min(pctY, outsideTop - 4);
      }
      pctY = Math.max(pctY, areaTop + 2);

      ctx.fillStyle = outside;
      ctx.textAlign = "center";
      ctx.textBaseline = "bottom";
      ctx.font = "700 11px 'DM Sans', system-ui, sans-serif";
      ctx.fillText(fmtPct(value), bar.x, pctY);

      if (!acertosText) return;

      // dentro da barra: preto; fora (barra baixa): cor do tema
      ctx.save();
      ctx.fillStyle = fitsInside ? ink : outside;
      ctx.font = "400 10px 'DM Sans', system-ui, sans-serif";
      ctx.translate(bar.x, base - 6);
      ctx.rotate(-Math.PI / 2);
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";
      ctx.fillText(acertosText, 0, 0);
      ctx.restore();
    });
    ctx.restore();
  },
};

function renderComparativo() {
  destroyChart("comparativo");
  const { muted, text } = chartDefaults();
  // Comparativo entre períodos: ignora o filtro de período para manter as 3 séries.
  const rows = state.visao === "escolas" ? escolasBase({ periodo: true }) : turmasBase({ periodo: true });
  const sortMedia = (r) =>
    mediaPeriodoRow(r, state.periodo) ?? mediaPeriodoRow(r, PERIODO_DADOS) ?? mediaPeriodoRow(r, "percurso") ?? 0;
  const sorted = [...rows].sort((a, b) => sortMedia(b) - sortMedia(a)).slice(0, 12);

  const titleEl = document.getElementById("chartComparativoTitle");
  const subEl = document.getElementById("chartComparativoSub");
  if (titleEl) titleEl.textContent = "Diagnóstica × Percurso × Saída";
  if (subEl) {
    subEl.textContent = `${DISCIPLINAS[state.disciplina]} · destaque: ${PERIODOS[state.periodo] || state.periodo}`;
  }

  const periodoKeys = ["diagnostica", "percurso", "saida"];
  const periodoColors = {
    diagnostica: { on: "rgba(61, 123, 255, 0.9)", off: "rgba(61, 123, 255, 0.28)" },
    percurso: { on: "rgba(0, 230, 118, 0.9)", off: "rgba(0, 230, 118, 0.28)" },
    saida: { on: "rgba(255, 176, 32, 0.9)", off: "rgba(255, 176, 32, 0.28)" },
  };

  const ctx = document.getElementById("chartComparativo");
  charts.comparativo = new Chart(ctx, {
    type: "bar",
    data: {
      labels: labelRows(sorted),
      datasets: periodoKeys.map((periodo) => {
        const active = state.periodo === periodo;
        const colors = periodoColors[periodo];
        return {
          label: PERIODOS[periodo],
          periodo,
          data: sorted.map((r) => mediaPeriodoRow(r, periodo)),
          backgroundColor: active ? colors.on : colors.off,
          borderColor: active ? colors.on.replace("0.9", "1") : "transparent",
          borderWidth: active ? 1 : 0,
          borderRadius: 8,
        };
      }),
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: { ticks: { color: muted, maxRotation: 45, minRotation: 0 }, grid: { display: false } },
        y: { max: 100, ticks: { color: muted, callback: (v) => `${v}%` }, grid: { color: "rgba(255,255,255,.06)" } },
      },
      plugins: {
        legend: { labels: { color: text } },
        tooltip: {
          callbacks: {
            label: (ctx) => {
              if (ctx.raw == null) return `${ctx.dataset.label}: sem dados`;
              return `${ctx.dataset.label}: ${fmtPct(ctx.raw)}`;
            },
          },
        },
      },
      onClick: (_, els) => {
        if (!els.length) return;
        const el = els[0];
        const row = sorted[el.index];
        const periodo = charts.comparativo.data.datasets[el.datasetIndex]?.periodo;
        if (periodo) state.periodo = periodo;
        const sameEscola = state.escola === row.escola;
        const sameTurma =
          state.visao === "turmas" && row.turma && state.turma === row.turma;
        if (sameEscola && (state.visao === "escolas" || sameTurma || !row.turma)) {
          state.escola = "";
          state.turma = "";
        } else {
          state.escola = row.escola;
          state.turma = state.visao === "turmas" && row.turma ? row.turma : "";
        }
        state.page = 1;
        fillSelects();
        render();
      },
    },
  });
}

function metricsPeriodo(row, periodo) {
  const block = row.periodos?.[periodo];
  if (block) return block;
  if (row.mediaGeral != null || row.mediaLp != null || row.mediaMat != null) {
    // Linha já expandida para o período ativo
    if (periodo === state.periodo) {
      return {
        mediaLp: row.mediaLp,
        mediaMat: row.mediaMat,
        mediaGeral: row.mediaGeral,
      };
    }
  }
  return null;
}

function mediaPeriodoRow(row, periodo) {
  const m = metricsPeriodo(row, periodo);
  if (!m) return null;
  if (state.disciplina === "lp") return m.mediaLp ?? null;
  if (state.disciplina === "mat") return m.mediaMat ?? null;
  return m.mediaGeral ?? null;
}

const donutSliceLabelsPlugin = {
  id: "donutSliceLabels",
  afterDatasetsDraw(chart) {
    const meta = chart.getDatasetMeta(0);
    if (!meta?.data?.length) return;
    const { ctx } = chart;
    const dataset = chart.data.datasets[0];
    const total = dataset.data.reduce((acc, v) => acc + (Number(v) || 0), 0);
    ctx.save();
    meta.data.forEach((arc, index) => {
      const value = Number(dataset.data[index]) || 0;
      if (value <= 0 || !total) return;

      const props = arc.getProps(["startAngle", "endAngle", "innerRadius", "outerRadius", "x", "y"], true);
      const angleSpan = props.endAngle - props.startAngle;
      const mid = (props.startAngle + props.endAngle) / 2;
      const thin = angleSpan < 0.35;
      // fatias estreitas: número um pouco fora do anel para caber
      const radius = thin
        ? props.outerRadius + 14
        : (props.innerRadius + props.outerRadius) / 2;
      const x = props.x + Math.cos(mid) * radius;
      const y = props.y + Math.sin(mid) * radius;
      const color = Array.isArray(dataset.backgroundColor)
        ? dataset.backgroundColor[index]
        : dataset.backgroundColor;
      const pct = ((value / total) * 100).toFixed(1).replace(".", ",");
      const ink = thin ? chartDefaults().outside : contrastTextOn(color);

      ctx.fillStyle = ink;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      if (thin) {
        ctx.font = "700 11px 'DM Sans', system-ui, sans-serif";
        ctx.fillText(`${value} · ${pct}%`, x, y);
      } else {
        ctx.font = "700 15px 'DM Sans', system-ui, sans-serif";
        ctx.fillText(String(value), x, y - 8);
        ctx.font = "600 11px 'DM Sans', system-ui, sans-serif";
        ctx.fillText(`${pct}%`, x, y + 9);
      }
    });
    ctx.restore();
  },
};

function renderDonut(rows) {
  destroyChart("donut");
  const { text } = chartDefaults();
  const counts = Object.fromEntries(FAIXAS.map((f) => [f.key, 0]));
  rows.forEach((r) => {
    counts[faixaFromMedia(mediaRow(r)).key] += 1;
  });
  const legend = document.getElementById("donutLegend");
  legend.innerHTML = FAIXAS.map(
    (f) => `
    <li data-faixa="${f.key}" class="${state.faixa === f.key ? "active" : ""}">
      <span class="swatch" style="background:${f.color}"></span>
      <span>${f.label}</span>
      <b>${counts[f.key]}</b>
    </li>`
  ).join("");

  const ctx = document.getElementById("chartDonut");
  charts.donut = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: FAIXAS.map((f) => f.label),
      datasets: [
        {
          data: FAIXAS.map((f) => counts[f.key]),
          backgroundColor: FAIXAS.map((f) => f.color),
          borderWidth: 0,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: "58%",
      layout: { padding: 22 },
      plugins: { legend: { display: false }, tooltip: { callbacks: { label: (c) => `${c.label}: ${c.raw}` } } },
      onClick: (_, els) => {
        if (!els.length) return;
        toggleFilter("faixa", FAIXAS[els[0].index].key);
      },
    },
    plugins: [donutSliceLabelsPlugin],
  });
  document.getElementById("chartDonutTitle").textContent = "Faixas de desempenho";
  document.getElementById("chartDonutSub").textContent = DISCIPLINAS[state.disciplina];
}

function escolaBaseNome(nome) {
  return String(nome || "")
    .replace(/\s*\([^)]+\)\s*$/, "")
    .trim();
}

function qtdTurmasEscola(escolaNome) {
  const base = escolaBaseNome(escolaNome);
  return turmasBase({ escola: true, turma: true, faixa: true, search: true }).filter(
    (row) => row.escola === base
  ).length;
}

function isMultiTurmaEscola(escolaNome) {
  return qtdTurmasEscola(escolaNome) > 1;
}

function mediaEscolaRow(row) {
  if (state.disciplina === "lp") return row.mediaLp;
  if (state.disciplina === "mat") return row.mediaMat;
  return row.mediaGeral;
}

function labelEscolaRow(row, withRank = false) {
  const base = shortSchool(row.escola);
  const qtd = qtdTurmasEscola(row.escola);
  const name = qtd > 1 ? `${base} · ${qtd} turmas` : base;
  return withRank ? `${name} · ${withRank}º` : name;
}

function rankingYAxisFit(labels) {
  return (scale) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    ctx.font = "11px 'DM Sans', system-ui, sans-serif";
    const longest = labels.reduce((max, label) => Math.max(max, ctx.measureText(String(label)).width), 0);
    scale.width = Math.ceil(longest) + 16;
  };
}

function escolasForRanking() {
  const rows = escolasBase({ escola: true });
  if (!state.escola) return rows;
  const base = escolaBaseNome(state.escola);
  return rows.filter((row) => row.escola === state.escola || escolaBaseNome(row.escola) === base);
}

function renderRankingEscolas() {
  destroyChart("rankingEscolas");
  const { muted, text } = chartDefaults();
  const rows = escolasForRanking();
  const sorted = [...rows].sort((a, b) => mediaEscolaRow(b) - mediaEscolaRow(a));
  const wrap = document.getElementById("chartRankingEscolasWrap");
  wrap.style.height = `${Math.max(520, sorted.length * 34)}px`;

  const multi = sorted.filter((row) => isMultiTurmaEscola(row.escola));
  const unica = sorted.filter((row) => !isMultiTurmaEscola(row.escola));
  const aggMulti = multi.length ? aggregate(multi) : null;
  const aggUnica = unica.length ? aggregate(unica) : null;
  const mediaMulti =
    aggMulti &&
    (state.disciplina === "lp"
      ? aggMulti.mediaLp
      : state.disciplina === "mat"
        ? aggMulti.mediaMat
        : aggMulti.mediaGeral);
  const mediaUnica =
    aggUnica &&
    (state.disciplina === "lp"
      ? aggUnica.mediaLp
      : state.disciplina === "mat"
        ? aggUnica.mediaMat
        : aggUnica.mediaGeral);

  document.getElementById("chartRankingEscolasTitle").textContent = "Ranking por escola";
  document.getElementById("chartRankingEscolasSub").textContent =
    `${DISCIPLINAS[state.disciplina]} · ${sorted.length} escolas · turmas agrupadas · clique para filtrar`;

  const legend = document.getElementById("rankingEscolasLegend");
  legend.innerHTML = [
    `<li><span class="swatch" style="background:#FFB020"></span><span>Várias turmas (${multi.length})${mediaMulti != null ? ` · ${fmtPct(mediaMulti)}` : ""}</span></li>`,
    `<li><span class="swatch" style="background:#3D7BFF"></span><span>Turma única (${unica.length})${mediaUnica != null ? ` · ${fmtPct(mediaUnica)}` : ""}</span></li>`,
  ].join("");

  const ctx = document.getElementById("chartRankingEscolas");
  const labels = sorted.map((row) => labelEscolaRow(row));
  const medias = sorted.map((row) => mediaEscolaRow(row));
  const ranks = competitionRanks(medias);
  charts.rankingEscolas = new Chart(ctx, {
    type: "bar",
    data: {
      labels,
      datasets: [
        {
          label: "Média %",
          data: medias,
          alunos: sorted.map((row) => metricAvaliados(row)),
          ranks,
          backgroundColor: sorted.map((row) => {
            const faixa = faixaFromMedia(mediaEscolaRow(row));
            return isMultiTurmaEscola(row.escola) ? faixa.color : `${faixa.color}cc`;
          }),
          borderColor: sorted.map((row) => (isMultiTurmaEscola(row.escola) ? "#FFB020" : "transparent")),
          borderWidth: sorted.map((row) => (isMultiTurmaEscola(row.escola) ? 2 : 0)),
          borderRadius: 8,
        },
      ],
    },
    options: {
      indexAxis: "y",
      responsive: true,
      maintainAspectRatio: false,
      layout: { padding: { left: 8, right: 56 } },
      scales: {
        x: { max: 100, ticks: { color: muted, callback: (v) => `${v}%` }, grid: { color: "rgba(255,255,255,.06)" } },
        y: {
          ticks: { color: text, font: { size: 11 }, autoSkip: false },
          grid: { display: false },
          afterFit: rankingYAxisFit(labels),
        },
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (ctx) => fmtPct(ctx.raw),
            afterLabel: (ctx) => {
              const row = sorted[ctx.dataIndex];
              const qtd = qtdTurmasEscola(row.escola);
              return qtd > 1 ? `${qtd} turmas · média ponderada` : "Turma única";
            },
          },
        },
      },
      onClick: (_, els) => {
        if (!els.length) return;
        const row = sorted[els[0].index];
        const base = escolaBaseNome(row.escola);
        const active = state.escola === row.escola || escolaBaseNome(state.escola) === base;
        state.escola = active ? "" : row.escola;
        state.turma = "";
        state.page = 1;
        syncSelects();
        render();
      },
    },
    plugins: [rankingBarLabelsPlugin],
  });
}

function renderRanking(rows) {
  destroyChart("ranking");
  const { muted, text } = chartDefaults();
  const sorted = [...rows].sort((a, b) => mediaRow(b) - mediaRow(a));
  const wrap = document.getElementById("chartRankingWrap");
  wrap.style.height = `${Math.max(360, sorted.length * 34)}px`;

  document.getElementById("chartRankingTitle").textContent =
    state.visao === "escolas" ? "Ranking por escola" : "Ranking por turma";
  document.getElementById("chartRankingSub").textContent = `${DISCIPLINAS[state.disciplina]} · 1º ao ${sorted.length}º · clique para filtrar`;

  const ctx = document.getElementById("chartRanking");
  const labels = labelRows(sorted);
  const medias = sorted.map((r) => mediaRow(r));
  const ranks = competitionRanks(medias);
  charts.ranking = new Chart(ctx, {
    type: "bar",
    data: {
      labels,
      datasets: [
        {
          label: "Média %",
          data: medias,
          alunos: sorted.map((r) => metricAvaliados(r)),
          ranks,
          backgroundColor: sorted.map((r) => faixaFromMedia(mediaRow(r)).color),
          borderRadius: 8,
        },
      ],
    },
    options: {
      indexAxis: "y",
      responsive: true,
      maintainAspectRatio: false,
      layout: { padding: { left: 8, right: 56 } },
      scales: {
        x: { max: 100, ticks: { color: muted, callback: (v) => `${v}%` }, grid: { color: "rgba(255,255,255,.06)" } },
        y: {
          ticks: { color: text, font: { size: 11 }, autoSkip: false },
          grid: { display: false },
          afterFit: rankingYAxisFit(labels),
        },
      },
      plugins: {
        legend: { display: false },
        tooltip: { callbacks: { label: (ctx) => fmtPct(ctx.raw) } },
      },
      onClick: (_, els) => {
        if (!els.length) return;
        const row = sorted[els[0].index];
        state.escola = state.escola === row.escola ? "" : row.escola;
        if (state.visao === "turmas" && row.turma) state.turma = state.turma === row.turma ? "" : row.turma;
        state.page = 1;
        syncSelects();
        render();
      },
    },
    plugins: [rankingBarLabelsPlugin],
  });
}

function questoesData() {
  if (!periodoTemDados()) return [];
  const bundle = periodoBundle();
  const meta = bundle.meta;
  const isMat = state.disciplina === "mat";
  const isLp = state.disciplina === "lp";
  const questoes = isMat ? meta.questoesMat : meta.questoesLp;
  const mediaMap = isMat ? meta.mediaQuestoesMat : meta.mediaQuestoesLp;
  const acertosMap = isMat ? meta.acertosQuestoesMat : meta.acertosQuestoesLp;

  if (state.escola) {
    const key = state.visao === "turmas" && state.turma !== "ÚNICA"
      ? `${state.escola} - ${state.turma}`
      : state.escola;
    const source = isMat ? bundle.escolasQuestoesMat : bundle.escolasQuestoesLp;
    const altKey = Object.keys(source).find((k) => k.startsWith(state.escola));
    const school = source[key] || source[altKey];
    if (school?.questoes) {
      return questoes.map((q) => ({
        q,
        v: school.questoes[q] ?? null,
        acertos: school.acertos?.[q] ?? null,
      }));
    }
  }

  if (isMat || isLp) {
    return questoes.map((q) => ({
      q,
      v: mediaMap[q] ?? null,
      acertos: acertosMap?.[q] ?? null,
    }));
  }

  const lp = meta.mediaQuestoesLp;
  const mat = meta.mediaQuestoesMat;
  const acLp = meta.acertosQuestoesLp || {};
  const acMat = meta.acertosQuestoesMat || {};
  const maxLen = Math.max(meta.questoesLp.length, meta.questoesMat.length);
  const out = [];
  for (let i = 0; i < maxLen; i += 1) {
    const qLp = meta.questoesLp[i];
    const qMat = meta.questoesMat[i];
    if (qLp && lp[qLp] != null) {
      out.push({ q: `LP ${qLp.replace("Questão ", "Q")}`, v: lp[qLp], acertos: acLp[qLp] ?? null, group: "lp" });
    }
    if (qMat && mat[qMat] != null) {
      out.push({ q: `MAT ${qMat.replace("Questão ", "Q")}`, v: mat[qMat], acertos: acMat[qMat] ?? null, group: "mat" });
    }
  }
  return out;
}

function questoesAvaliadosTotal() {
  if (!periodoTemDados()) return 0;
  const bundle = periodoBundle();
  const meta = bundle.meta;
  const isMat = state.disciplina === "mat";
  const isLp = state.disciplina === "lp";
  const source = isMat ? bundle.escolasQuestoesMat : bundle.escolasQuestoesLp;

  if (state.escola) {
    const keys = Object.keys(source).filter((k) => {
      if (state.visao === "turmas" && state.turma && state.turma !== "ÚNICA") {
        return k === `${state.escola} - ${state.turma}`;
      }
      return k === state.escola || k.startsWith(`${state.escola} -`) || k.startsWith(state.escola);
    });
    if (keys.length) {
      if (isLp || isMat) {
        return keys.reduce((acc, key) => acc + (source[key].avaliados || 0), 0);
      }
      const lp = bundle.escolasQuestoesLp;
      const mat = bundle.escolasQuestoesMat;
      const lpKeys = Object.keys(lp).filter((k) => k === state.escola || k.startsWith(`${state.escola} -`) || k.startsWith(state.escola));
      const matKeys = Object.keys(mat).filter((k) => k === state.escola || k.startsWith(`${state.escola} -`) || k.startsWith(state.escola));
      const avalLp = lpKeys.reduce((acc, key) => acc + (lp[key].avaliados || 0), 0);
      const avalMat = matKeys.reduce((acc, key) => acc + (mat[key].avaliados || 0), 0);
      return Math.max(avalLp, avalMat);
    }
  }

  if (isLp) return meta.avaliadosLp || 0;
  if (isMat) return meta.avaliadosMat || 0;
  return meta.totalAvaliados || 0;
}

function renderQuestoes() {
  destroyChart("questoes");
  const { muted, text } = chartDefaults();
  const data = questoesData().filter((d) => d.v != null);
  document.getElementById("chartQuestoesTitle").textContent =
    state.disciplina === "geral"
      ? "Desempenho por questão (LP e MAT)"
      : `Desempenho por questão — ${DISCIPLINAS[state.disciplina]}`;

  const tabValue = document.querySelector("#chartQuestoesAvaliados .chart-tab-value");
  if (tabValue) tabValue.textContent = fmt(questoesAvaliadosTotal());

  const ctx = document.getElementById("chartQuestoes");
  const labelsVerticais = state.disciplina === "geral";
  charts.questoes = new Chart(ctx, {
    type: "bar",
    data: {
      labels: data.map((d) => d.q.replace("Questão ", "Q")),
      datasets: [
        {
          label: "Acerto %",
          data: data.map((d) => d.v),
          acertos: data.map((d) => d.acertos ?? null),
          backgroundColor: data.map((d) =>
            d.group === "mat" ? "rgba(0, 230, 118, 0.85)" : d.group === "lp" ? "rgba(61, 123, 255, 0.85)" : "rgba(123, 97, 255, 0.85)"
          ),
          borderRadius: 6,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      layout: { padding: { top: 28, bottom: labelsVerticais ? 8 : 0 } },
      scales: {
        x: {
          ticks: {
            color: muted,
            maxRotation: labelsVerticais ? 90 : 0,
            minRotation: labelsVerticais ? 90 : 0,
            font: { size: 10 },
          },
          grid: { display: false },
        },
        y: { max: 100, ticks: { color: muted, callback: (v) => `${v}%` }, grid: { color: "rgba(255,255,255,.06)" } },
      },
      plugins: {
        legend: { display: false },
        tooltip: { callbacks: { label: (ctx) => fmtPct(ctx.raw) } },
      },
    },
    plugins: [questoesBarLabelsPlugin],
  });
}

function rankingField(row) {
  if (state.disciplina === "lp") return row.rankingLp || row.ranking || "—";
  if (state.disciplina === "mat") return row.rankingMat || row.ranking || "—";
  return row.rankingGeral || row.ranking || "—";
}

function parseRankingNum(value) {
  const n = parseInt(String(value || "").replace(/\D/g, ""), 10);
  return Number.isFinite(n) ? n : 999;
}

function sortedTableRows(rows) {
  const { key, dir } = state.sort;
  return [...rows].sort((a, b) => {
    let av;
    let bv;
    if (key === "ranking") {
      av = parseRankingNum(rankingField(a));
      bv = parseRankingNum(rankingField(b));
    } else if (key === "previstos") {
      av = rowMetrics(a).previstos;
      bv = rowMetrics(b).previstos;
    } else if (key === "avaliados") {
      av = rowMetrics(a).avaliados;
      bv = rowMetrics(b).avaliados;
    } else if (key === "participacao") {
      const ma = rowMetrics(a);
      const mb = rowMetrics(b);
      av = ma.previstos ? ma.avaliados / ma.previstos : 0;
      bv = mb.previstos ? mb.avaliados / mb.previstos : 0;
    } else if (key === "mediaGeral" && state.disciplina !== "geral") {
      av = mediaRow(a);
      bv = mediaRow(b);
    } else {
      av = a[key];
      bv = b[key];
    }
    if (typeof av === "string") return dir * av.localeCompare(bv, "pt-BR");
    return dir * ((av || 0) - (bv || 0));
  });
}

function renderStatusRow(rows) {
  const counts = Object.fromEntries(FAIXAS.map((f) => [f.key, 0]));
  rows.forEach((r) => {
    counts[faixaFromMedia(mediaRow(r)).key] += 1;
  });
  document.getElementById("statusRow").innerHTML = FAIXAS.map(
    (f) => `
    <article class="status-card ${f.key === "critico" ? "pl" : f.key === "atencao" ? "mid" : f.key === "bom" ? "ini" : "flu"} ${state.faixa === f.key ? "active" : ""}" data-faixa="${f.key}">
      <h3>${f.label.split(" (")[0]} <small>${f.label.match(/\(([^)]+)\)/)?.[1] || ""}</small></h3>
      <p class="num">${counts[f.key]}</p>
      <p class="sub">${state.visao === "escolas" ? "escolas" : "turmas"}</p>
    </article>`
  ).join("");
}

function renderTable(rows) {
  const sorted = sortedTableRows(rows);
  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  state.page = Math.min(state.page, totalPages);
  const slice = sorted.slice((state.page - 1) * PAGE_SIZE, state.page * PAGE_SIZE);

  document.getElementById("tableCount").textContent = `${sorted.length} ${state.visao === "escolas" ? "escolas" : "turmas"}`;
  const scope = document.getElementById("tableScope");
  if (scope) scope.textContent = ` · ${DISCIPLINAS[state.disciplina]} · 5º ano`;
  document.getElementById("pageInfo").textContent = `${state.page} de ${totalPages}`;

  document.querySelectorAll("th[data-sort]").forEach((th) => {
    th.classList.toggle("col-active", false);
  });
  const activeSort =
    state.disciplina === "lp" ? "mediaLp" : state.disciplina === "mat" ? "mediaMat" : "mediaGeral";
  document.querySelector(`th[data-sort="${activeSort}"]`)?.classList.add("col-active");

  document.getElementById("tableBody").innerHTML = slice
    .map((r) => {
      const ranking = rankingField(r);
      const turma = state.visao === "escolas" ? "—" : r.turma;
      const faixa = faixaFromMedia(mediaRow(r));
      const metrics = rowMetrics(r);
      const participacao = metrics.previstos ? (metrics.avaliados / metrics.previstos) * 100 : 0;
      return `
      <tr class="clickable" data-escola="${r.escola}" data-turma="${turma === "—" ? "" : turma}">
        <td><span class="tag" style="--tag:${faixa.color}">${ranking}</span></td>
        <td>${shortSchool(r.escola)}</td>
        <td>${turma}</td>
        <td class="num">${fmt(metrics.previstos)}</td>
        <td class="num">${fmt(metrics.avaliados)}</td>
        <td class="num">${fmtPct(participacao)}</td>
        <td class="num ${state.disciplina === "lp" ? "col-active" : ""}">${fmtPct(r.mediaLp)}</td>
        <td class="num ${state.disciplina === "mat" ? "col-active" : ""}">${fmtPct(r.mediaMat)}</td>
        <td class="num ${state.disciplina === "geral" ? "col-active" : ""}">${fmtPct(r.mediaGeral)}</td>
      </tr>`;
    })
    .join("");

  renderStatusRow(rows);
}

function exportCsv(rows) {
  const header = ["Ranking", "Escola", "Turma", "Previstos", "Avaliados", "Participacao", "Portugues", "Matematica", "MediaGeral"];
  const lines = [header.join(";")];
  sortedTableRows(rows).forEach((r) => {
    const metrics = rowMetrics(r);
    const participacao = metrics.previstos ? (metrics.avaliados / metrics.previstos) * 100 : 0;
    lines.push(
      [
        rankingField(r),
        r.escola,
        state.visao === "escolas" ? "" : r.turma,
        metrics.previstos,
        metrics.avaliados,
        participacao.toFixed(2),
        r.mediaLp.toFixed(2),
        r.mediaMat.toFixed(2),
        r.mediaGeral.toFixed(2),
      ].join(";")
    );
  });
  const blob = new Blob(["\ufeff" + lines.join("\n")], { type: "text/csv;charset=utf-8" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "adse-5ano-ranking.csv";
  a.click();
  URL.revokeObjectURL(a.href);
}

function syncRankingCards() {
  // Visão por turma → ranking de turmas ao lado da pizza (mesmo com escola filtrada)
  // Visão por escola → ranking de escolas ao lado da pizza
  const hideTurma = state.visao === "escolas";
  const hideEscola = state.visao === "turmas";
  const cardTurma = document.getElementById("cardRankingTurma");
  const cardEscola = document.getElementById("cardRankingEscola");
  if (cardTurma) cardTurma.hidden = hideTurma;
  if (cardEscola) cardEscola.hidden = hideEscola;
  return { hideTurma, hideEscola };
}

function render() {
  fillSelects();
  const rows = activeRows();
  renderChips();
  renderKPIs(rows);
  if (state.view === "dashboard") {
    const { hideTurma, hideEscola } = syncRankingCards();
    renderComparativo();
    renderDonut(rows);
    if (hideTurma) destroyChart("ranking");
    else renderRanking(rows);
    if (hideEscola) destroyChart("rankingEscolas");
    else renderRankingEscolas();
    renderQuestoes();
  } else {
    renderTable(rows);
  }
}

function bindEvents() {
  document.getElementById("searchInput").addEventListener("input", (e) => {
    state.search = e.target.value;
    state.page = 1;
    render();
  });

  document.getElementById("filterVisao").addEventListener("change", (e) => {
    state.visao = e.target.value;
    state.turma = "";
    state.page = 1;
    fillSelects();
    render();
  });

  document.getElementById("filterDisciplina").addEventListener("change", (e) => {
    state.disciplina = e.target.value;
    state.page = 1;
    fillSelects();
    render();
  });

  document.getElementById("filterEscola").addEventListener("change", (e) => {
    state.escola = e.target.value;
    state.turma = "";
    state.page = 1;
    fillSelects();
    render();
  });

  document.getElementById("filterTurma").addEventListener("change", (e) => {
    state.turma = e.target.value;
    state.page = 1;
    render();
  });

  document.getElementById("filterPeriodo").addEventListener("change", (e) => {
    state.periodo = e.target.value;
    state.page = 1;
    fillSelects();
    render();
  });

  document.getElementById("btnTheme").addEventListener("click", () => {
    applyTheme(currentTheme() === "light" ? "dark" : "light");
    render();
  });

  document.getElementById("btnResetAll").addEventListener("click", () => {
    Object.assign(state, {
      visao: "turmas",
      disciplina: "geral",
      escola: "",
      turma: "",
      periodo: periodoPadrao(),
      faixa: "",
      search: "",
      page: 1,
    });
    document.getElementById("searchInput").value = "";
    fillSelects();
    render();
  });

  document.querySelectorAll(".nav-btn[data-view]").forEach((btn) => {
    btn.addEventListener("click", () => setView(btn.dataset.view) || render());
  });

  document.getElementById("chips").addEventListener("click", (e) => {
    const btn = e.target.closest("[data-clear]");
    if (!btn) return;
    const key = btn.dataset.clear;
    if (key === "visao") state.visao = "turmas";
    else if (key === "disciplina") state.disciplina = "geral";
    else if (key === "periodo") state.periodo = periodoPadrao();
    else state[key] = "";
    state.page = 1;
    fillSelects();
    render();
  });

  document.getElementById("donutLegend").addEventListener("click", (e) => {
    const li = e.target.closest("[data-faixa]");
    if (!li) return;
    toggleFilter("faixa", li.dataset.faixa);
  });

  document.getElementById("statusRow").addEventListener("click", (e) => {
    const card = e.target.closest("[data-faixa]");
    if (!card) return;
    toggleFilter("faixa", card.dataset.faixa);
  });

  document.getElementById("tableBody").addEventListener("click", (e) => {
    const tr = e.target.closest("tr[data-escola]");
    if (!tr) return;
    state.escola = tr.dataset.escola;
    state.turma = tr.dataset.turma || "";
    state.page = 1;
    fillSelects();
    setView("dashboard");
    render();
  });

  document.querySelectorAll("th[data-sort]").forEach((th) => {
    th.addEventListener("click", () => {
      const key = th.dataset.sort;
      if (state.sort.key === key) state.sort.dir *= -1;
      else state.sort = { key, dir: 1 };
      render();
    });
  });

  document.getElementById("pagePrev").addEventListener("click", () => {
    state.page = Math.max(1, state.page - 1);
    render();
  });

  document.getElementById("pageNext").addEventListener("click", () => {
    state.page += 1;
    render();
  });

  document.getElementById("btnExport").addEventListener("click", () => exportCsv(activeRows()));
}

function init() {
  state.periodo = periodoPadrao();
  document.getElementById("todayLabel").textContent = new Date().toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  fillSelects();
  bindEvents();
  render();
}

init();
