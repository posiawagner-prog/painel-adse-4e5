const FAIXAS = [
  { key: "critico", label: "Abaixo do Básico (< 40%)", color: "#FF3B30", min: 0, max: 40 },
  { key: "atencao", label: "Básico (40–60%)", color: "#FF9500", min: 40, max: 60 },
  { key: "bom", label: "Adequado (60–80%)", color: "#FFD60A", min: 60, max: 80 },
  { key: "excelente", label: "Avançado (≥ 80%)", color: "#00E676", min: 80, max: 101 },
];

const APRENDIZADO = [
  { key: "INSUFICIENTE", label: "Insuficiente", color: "#FF3B30", short: "Insuf." },
  { key: "BÁSICO", label: "Básico", color: "#FF9F0A", short: "Básico" },
  { key: "PROFICIENTE", label: "Proficiente", color: "#3D7BFF", short: "Profic." },
  { key: "AVANÇADO", label: "Avançado", color: "#30D158", short: "Avanç." },
];

const NIVEIS_PROF = [
  { nivel: 0, color: "#FF3B30" },
  { nivel: 1, color: "#FF6B4A" },
  { nivel: 2, color: "#FF9F0A" },
  { nivel: 3, color: "#FFD60A" },
  { nivel: 4, color: "#5B9AFF" },
  { nivel: 5, color: "#3D7BFF" },
  { nivel: 6, color: "#30D158" },
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
  chartPanel: "comparativo",
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
  const dash = document.getElementById("viewDashboard");
  const table = document.getElementById("viewTable");
  if (dash) dash.hidden = view !== "dashboard";
  if (table) table.hidden = view !== "table";
  const chartNav = document.getElementById("chartNav");
  if (chartNav) chartNav.hidden = view !== "dashboard";
  const kpi = document.getElementById("kpiStrip");
  if (kpi) kpi.hidden = view !== "dashboard";
}

function setChartPanel(panel) {
  const allowed = ["comparativo", "faixasRanking", "questoes", "proficiencia"];
  if (panel === "faixas" || panel === "ranking") panel = "faixasRanking";
  if (!allowed.includes(panel)) return;
  state.chartPanel = panel;
  document.querySelectorAll(".nav-btn[data-chart]").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.chart === panel);
  });
  document.querySelectorAll(".chart-panel").forEach((el) => {
    el.hidden = el.dataset.panel !== panel;
  });
}

function syncComparativoWidth() {
  const wrap = document.getElementById("chartComparativoWrap");
  const scroller = document.getElementById("chartComparativoScroller");
  if (!wrap || !scroller) return;
  const labels = charts.comparativo?.data?.labels?.length || 0;
  const need = Math.max(1, labels) * 88;
  const avail = scroller.clientWidth || 0;
  wrap.style.width = "100%";
  wrap.style.minWidth = `${Math.max(avail, need)}px`;
}

function resizeVisibleCharts() {
  requestAnimationFrame(() => {
    syncComparativoWidth();
    Object.values(charts).forEach((chart) => {
      try {
        chart?.resize?.();
      } catch (_) {}
    });
  });
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
          ? `LP <span class="num">${fmt(prevLp)}</span> · MAT <span class="num">${fmt(prevMat)}</span> · <span class="num">${fmt(avaliadosCard)}</span> avaliados`
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
          ? "média simples LP + MAT"
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
    rightCards.push(
      {
        title: "Português",
        value: fmtPct(agg.mediaLp),
        foot: `<span class="num">${fmt(prevLp)}</span> prev · <span class="num">${fmt(avalLp)}</span> avaliados`,
        icon: "ava",
      },
      {
        title: "Matemática",
        value: fmtPct(agg.mediaMat),
        foot: `<span class="num">${fmt(prevMat)}</span> prev · <span class="num">${fmt(avalMat)}</span> avaliados`,
        icon: "pre",
      }
    );
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
  const kpiStrip = document.getElementById("kpiStrip");
  if (kpiStrip) kpiStrip.classList.toggle("kpi-strip--geral", state.disciplina === "geral");
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
    const bars = meta.data;

    const halfSpace = (index) => {
      const bar = bars[index];
      const props = bar.getProps(["x", "width"], true);
      let left = Math.abs(props.width || 0) / 2;
      let right = left;
      if (index > 0) {
        const prev = bars[index - 1].getProps(["x"], true);
        left = Math.min(left, (props.x - prev.x) / 2);
      }
      if (index < bars.length - 1) {
        const next = bars[index + 1].getProps(["x"], true);
        right = Math.min(right, (next.x - props.x) / 2);
      }
      return Math.max(0, Math.min(left, right));
    };

    ctx.save();
    bars.forEach((bar, index) => {
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

      const pctLabel = fmtPct(value);
      ctx.fillStyle = outside;
      ctx.font = "700 11px 'DM Sans', system-ui, sans-serif";
      const pctW = ctx.measureText(pctLabel).width;
      const fitsHorizontal =
        state.disciplina === "lp" ||
        state.disciplina === "mat" ||
        pctW / 2 + 1 <= halfSpace(index);

      if (fitsHorizontal) {
        ctx.textAlign = "center";
        ctx.textBaseline = "bottom";
        ctx.fillText(pctLabel, bar.x, pctY);
      } else {
        // Vertical 90° só quando o texto não cabe na largura disponível
        ctx.save();
        ctx.translate(bar.x, pctY);
        ctx.rotate(-Math.PI / 2);
        ctx.textAlign = "left";
        ctx.textBaseline = "middle";
        ctx.fillText(pctLabel, 2, 0);
        ctx.restore();
      }

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

const comparativoBarLabelsPlugin = {
  id: "comparativoBarLabels",
  afterDatasetsDraw(chart) {
    const { ctx } = chart;
    const { outside } = chartDefaults();
    const areaTop = chart.chartArea?.top ?? 0;
    ctx.save();
    ctx.font = "700 12px 'DM Sans', system-ui, sans-serif";
    ctx.fillStyle = outside;

    chart.data.datasets.forEach((dataset, datasetIndex) => {
      const meta = chart.getDatasetMeta(datasetIndex);
      if (!meta?.data?.length || meta.hidden) return;
      meta.data.forEach((bar, index) => {
        const value = dataset.data[index];
        if (value == null) return;

        const label = fmtPct(value);
        const props = bar.getProps(["x", "y", "base"], true);
        const top = Math.min(props.y, props.base);
        const cx = props.x;

        // Sempre fora da barra, vertical 90°, em qualquer disciplina
        const anchorY = Math.max(top - 4, areaTop + 2);
        ctx.save();
        ctx.translate(cx, anchorY);
        ctx.rotate(-Math.PI / 2);
        ctx.textAlign = "left";
        ctx.textBaseline = "middle";
        ctx.fillText(label, 2, 0);
        ctx.restore();
      });
    });
    ctx.restore();
  },
};

const comparativoStickyYAxisPlugin = {
  id: "comparativoStickyYAxis",
  afterDraw(chart) {
    const axis = document.getElementById("comparativoYAxis");
    const y = chart.scales?.y;
    if (!axis || !y) return;
    const { muted } = chartDefaults();
    axis.innerHTML = y.ticks
      .map((tick) => {
        const top = y.getPixelForValue(tick.value);
        const label =
          tick.label != null && tick.label !== ""
            ? Array.isArray(tick.label)
              ? tick.label.join("")
              : String(tick.label)
            : `${tick.value}%`;
        return `<span class="comparativo-y-tick" style="top:${top}px;color:${muted}">${label}</span>`;
      })
      .join("");
  },
};

function renderComparativo() {
  destroyChart("comparativo");
  const { muted } = chartDefaults();
  // Comparativo entre períodos: ignora o filtro de período para manter as 3 séries.
  const rows = state.visao === "escolas" ? escolasBase({ periodo: true }) : turmasBase({ periodo: true });
  const sortMedia = (r) =>
    mediaPeriodoRow(r, state.periodo) ?? mediaPeriodoRow(r, PERIODO_DADOS) ?? mediaPeriodoRow(r, "percurso") ?? 0;
  const sorted = [...rows].sort((a, b) => sortMedia(b) - sortMedia(a));

  const titleEl = document.getElementById("chartComparativoTitle");
  const subEl = document.getElementById("chartComparativoSub");
  if (titleEl) titleEl.textContent = "Diagnóstica × Percurso × Saída";
  if (subEl) {
    const escopo = state.visao === "escolas" ? "escolas" : "turmas";
    subEl.textContent = `${DISCIPLINAS[state.disciplina]} · ${sorted.length} ${escopo} · destaque: ${PERIODOS[state.periodo] || state.periodo}`;
  }

  const wrap = document.getElementById("chartComparativoWrap");
  const scroller = document.getElementById("chartComparativoScroller");
  if (wrap) {
    const need = Math.max(1, sorted.length) * 88;
    const avail = scroller?.clientWidth || 0;
    wrap.style.width = "100%";
    wrap.style.minWidth = `${Math.max(avail, need)}px`;
  }

  const periodoKeys = ["diagnostica", "percurso", "saida"];
  const isLight = currentTheme() === "light";
  const periodoColors = isLight
    ? {
        diagnostica: "#FF3B30",
        percurso: "#0000FF",
        saida: "#FF9F0A",
      }
    : {
        diagnostica: "#FF3B30",
        percurso: "#0000FF",
        saida: "#FFB020",
      };

  const legendEl = document.getElementById("comparativoLegend");
  if (legendEl) {
    legendEl.innerHTML = periodoKeys
      .map(
        (periodo) =>
          `<li data-periodo="${periodo}" class="${state.periodo === periodo ? "active" : ""}"><span class="swatch" style="background:${periodoColors[periodo]}"></span><span>${PERIODOS[periodo]}</span></li>`
      )
      .join("");
    legendEl.querySelectorAll("li").forEach((li) => {
      li.addEventListener("click", () => {
        const periodo = li.dataset.periodo;
        if (!periodo || !periodoTemDados(periodo)) return;
        state.periodo = periodo;
        state.page = 1;
        fillSelects();
        render();
      });
    });
  }

  const ctx = document.getElementById("chartComparativo");
  charts.comparativo = new Chart(ctx, {
    type: "bar",
    data: {
      labels: labelRows(sorted),
      datasets: periodoKeys.map((periodo) => {
        const color = periodoColors[periodo];
        return {
          label: PERIODOS[periodo],
          periodo,
          data: sorted.map((r) => mediaPeriodoRow(r, periodo)),
          backgroundColor: color,
          hoverBackgroundColor: color,
          borderColor: color,
          hoverBorderColor: color,
          borderWidth: 0,
          hoverBorderWidth: 0,
          borderRadius: 8,
          barPercentage: 0.98,
          categoryPercentage: 0.92,
        };
      }),
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      layout: { padding: { top: 56, bottom: 4, left: 0, right: 4 } },
      datasets: {
        bar: {
          barPercentage: 0.98,
          categoryPercentage: 0.92,
        },
      },
      scales: {
        x: { ticks: { color: muted, maxRotation: 45, minRotation: 0 }, grid: { display: false } },
        y: {
          max: 100,
          ticks: {
            display: false,
            callback: (v) => `${v}%`,
          },
          afterFit(scale) {
            scale.width = 0;
          },
          grid: {
            color: isLight ? "rgba(0,0,0,.08)" : "rgba(255,255,255,.06)",
            tickLength: 0,
          },
          border: { display: false },
        },
      },
      plugins: {
        legend: { display: false },
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
    plugins: [comparativoBarLabelsPlugin, comparativoStickyYAxisPlugin],
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

function questoesKeyParts(key) {
  const sep = String(key || "").lastIndexOf(" - ");
  if (sep === -1) return { escola: escolaBaseNome(key), turma: null };
  return {
    escola: escolaBaseNome(key.slice(0, sep)),
    turma: key.slice(sep + 3),
  };
}

function questoesEscopoKeys(source) {
  if (!state.escola || !source) return [];
  const base = escolaBaseNome(state.escola);
  return Object.keys(source).filter((k) => {
    const { escola, turma } = questoesKeyParts(k);
    if (escola !== base) return false;
    if (state.visao === "turmas" && state.turma && state.turma !== "ÚNICA") {
      return turma === state.turma;
    }
    return true;
  });
}

/** Agrega % (ponderado por avaliados) e acertos das chaves no escopo. */
function aggregateQuestoesFromKeys(source, keys, questionList) {
  const media = {};
  const acertos = {};
  if (!keys.length) return { media, acertos };

  if (keys.length === 1) {
    const entry = source[keys[0]] || {};
    return {
      media: { ...(entry.questoes || {}) },
      acertos: { ...(entry.acertos || {}) },
    };
  }

  for (const q of questionList) {
    let weighted = 0;
    let totalAval = 0;
    let totalAcertos = 0;
    let hasAcertos = false;
    for (const key of keys) {
      const entry = source[key];
      if (!entry) continue;
      const pct = entry.questoes?.[q];
      const aval = entry.avaliados || 0;
      if (pct != null && aval) {
        weighted += Number(pct) * aval;
        totalAval += aval;
      }
      const ac = entry.acertos?.[q];
      if (ac != null) {
        totalAcertos += Number(ac);
        hasAcertos = true;
      }
    }
    if (totalAval) media[q] = roundHalfUp(weighted / totalAval, 2);
    if (hasAcertos) acertos[q] = totalAcertos;
  }
  return { media, acertos };
}

function mergeQuestoesLpMat(lpMap, matMap, acLp, acMat, meta) {
  const maxLen = Math.max(meta.questoesLp.length, meta.questoesMat.length);
  const out = [];
  for (let i = 0; i < maxLen; i += 1) {
    const qLp = meta.questoesLp[i];
    const qMat = meta.questoesMat[i];
    if (qLp && lpMap[qLp] != null) {
      out.push({
        q: `LP ${qLp.replace("Questão ", "Q")}`,
        v: lpMap[qLp],
        acertos: acLp[qLp] ?? null,
        group: "lp",
      });
    }
    if (qMat && matMap[qMat] != null) {
      out.push({
        q: `MAT ${qMat.replace("Questão ", "Q")}`,
        v: matMap[qMat],
        acertos: acMat[qMat] ?? null,
        group: "mat",
      });
    }
  }
  return out;
}

function questoesData() {
  if (!periodoTemDados()) return [];
  const bundle = periodoBundle();
  const meta = bundle.meta;
  const isMat = state.disciplina === "mat";
  const isLp = state.disciplina === "lp";

  if (isMat || isLp) {
    const questoes = isMat ? meta.questoesMat : meta.questoesLp;
    const mediaMap = isMat ? meta.mediaQuestoesMat : meta.mediaQuestoesLp;
    const acertosMap = isMat ? meta.acertosQuestoesMat : meta.acertosQuestoesLp;
    const source = isMat ? bundle.escolasQuestoesMat : bundle.escolasQuestoesLp;

    if (state.escola) {
      const keys = questoesEscopoKeys(source);
      if (keys.length) {
        const { media, acertos } = aggregateQuestoesFromKeys(source, keys, questoes);
        return questoes.map((q) => ({
          q,
          v: media[q] ?? null,
          acertos: acertos[q] ?? null,
          group: isMat ? "mat" : "lp",
        }));
      }
    }

    return questoes.map((q) => ({
      q,
      v: mediaMap[q] ?? null,
      acertos: acertosMap?.[q] ?? null,
      group: isMat ? "mat" : "lp",
    }));
  }

  // Português + Matemática: sempre LP e MAT intercalados (rede, escola ou turma)
  let lp = meta.mediaQuestoesLp;
  let mat = meta.mediaQuestoesMat;
  let acLp = meta.acertosQuestoesLp || {};
  let acMat = meta.acertosQuestoesMat || {};

  if (state.escola) {
    const lpKeys = questoesEscopoKeys(bundle.escolasQuestoesLp);
    const matKeys = questoesEscopoKeys(bundle.escolasQuestoesMat);
    if (lpKeys.length || matKeys.length) {
      const aggLp = aggregateQuestoesFromKeys(bundle.escolasQuestoesLp, lpKeys, meta.questoesLp);
      const aggMat = aggregateQuestoesFromKeys(bundle.escolasQuestoesMat, matKeys, meta.questoesMat);
      lp = aggLp.media;
      mat = aggMat.media;
      acLp = aggLp.acertos;
      acMat = aggMat.acertos;
    }
  }

  return mergeQuestoesLpMat(lp, mat, acLp, acMat, meta);
}

function sumAvaliadosKeys(source, keys) {
  return keys.reduce((acc, key) => acc + (source[key]?.avaliados || 0), 0);
}

/** Avaliados de LP e MAT no escopo atual (rede / escola / turma). */
function questoesAvaliadosCounts() {
  if (!periodoTemDados()) return { lp: 0, mat: 0 };
  const bundle = periodoBundle();
  const meta = bundle.meta;
  const lpSource = bundle.escolasQuestoesLp;
  const matSource = bundle.escolasQuestoesMat;

  if (state.escola) {
    const lpKeys = questoesEscopoKeys(lpSource);
    const matKeys = questoesEscopoKeys(matSource);
    if (lpKeys.length || matKeys.length) {
      return {
        lp: sumAvaliadosKeys(lpSource, lpKeys),
        mat: sumAvaliadosKeys(matSource, matKeys),
      };
    }
  }

  return {
    lp: meta.avaliadosLp || 0,
    mat: meta.avaliadosMat || 0,
  };
}

function renderQuestoesAvaliadosTab() {
  const tab = document.getElementById("chartQuestoesAvaliados");
  const tabValue = tab?.querySelector(".chart-tab-value");
  const tabLabel = tab?.querySelector(".chart-tab-label");
  if (!tabValue) return;

  const { lp, mat } = questoesAvaliadosCounts();
  if (state.disciplina === "geral") {
    if (tabLabel) tabLabel.textContent = "Alunos avaliados";
    tabValue.classList.add("chart-tab-value--split");
    tabValue.innerHTML = `LP <span class="num">${fmt(lp)}</span> · MAT <span class="num">${fmt(mat)}</span>`;
    tab?.setAttribute("aria-label", `Alunos avaliados: Língua Portuguesa ${fmt(lp)}, Matemática ${fmt(mat)}`);
    return;
  }

  tabValue.classList.remove("chart-tab-value--split");
  if (tabLabel) tabLabel.textContent = "Alunos avaliados";
  const value = state.disciplina === "lp" ? lp : mat;
  tabValue.textContent = fmt(value);
  tab?.setAttribute("aria-label", `Alunos avaliados: ${fmt(value)}`);
}

function renderQuestoes() {
  destroyChart("questoes");
  const { muted, text } = chartDefaults();
  const data = questoesData().filter((d) => d.v != null);
  document.getElementById("chartQuestoesTitle").textContent =
    state.disciplina === "geral"
      ? "Desempenho por questão (LP e MAT)"
      : `Desempenho por questão — ${DISCIPLINAS[state.disciplina]}`;

  renderQuestoesAvaliadosTab();

  const COR_QUESTAO_LP = "rgba(61, 123, 255, 0.85)";
  const COR_QUESTAO_MAT = "rgba(0, 230, 118, 0.85)";
  const corQuestao = (d) => {
    const group = d.group || (state.disciplina === "mat" ? "mat" : state.disciplina === "lp" ? "lp" : null);
    if (group === "mat") return COR_QUESTAO_MAT;
    if (group === "lp") return COR_QUESTAO_LP;
    return state.disciplina === "mat" ? COR_QUESTAO_MAT : COR_QUESTAO_LP;
  };

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
          backgroundColor: data.map(corQuestao),
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


function aprendizadoMeta(key) {
  const norm = String(key || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toUpperCase();
  return (
    APRENDIZADO.find((item) => {
      const itemNorm = item.key.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase();
      return itemNorm === norm || item.key === key;
    }) || { key: key || "-", label: key || "-", color: "#9a9aa3", short: key || "-" }
  );
}

function proficienciaSourcePeriodo() {
  const order = ["diagnostica", state.periodo, ...periodosDisponiveis()];
  for (const periodo of order) {
    const bundle = periodoBundle(periodo);
    const lp = bundle?.proficienciaLp || [];
    const mat = bundle?.proficienciaMat || [];
    if (lp.length || mat.length) return { periodo, bundle, lp, mat };
  }
  return { periodo: "diagnostica", bundle: periodoBundle("diagnostica"), lp: [], mat: [] };
}

function proficienciaRows() {
  const { lp, mat } = proficienciaSourcePeriodo();
  const rows = state.disciplina === "mat" ? [...mat] : [...lp];
  const q = state.search.trim().toLowerCase();
  return rows.filter((row) => {
    if (state.escola) {
      const base = escolaBaseNome(state.escola);
      if (row.escola !== state.escola && row.escola !== base && !String(row.escola).includes(base)) {
        return false;
      }
    }
    if (state.turma && row.turma !== state.turma) return false;
    if (q) {
      const hay = `${row.escola} ${row.turma} ${row.aprendizado} ${row.nivelLabel}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });
}

const proficienciaBarLabelsPlugin = {
  id: "proficienciaBarLabels",
  afterDatasetsDraw(chart) {
    const meta = chart.getDatasetMeta(0);
    if (!meta?.data?.length) return;
    const { ctx } = chart;
    const dataset = chart.data.datasets[0];
    const { ink, outside } = chartDefaults();
    ctx.save();
    meta.data.forEach((bar, index) => {
      const value = dataset.data[index];
      const nivel = dataset.niveis?.[index];
      const pct = dataset.pcts?.[index];
      const start = Math.min(bar.x, bar.base);
      const end = Math.max(bar.x, bar.base);
      ctx.textBaseline = "middle";
      ctx.fillStyle = ink;
      ctx.font = "700 11px 'DM Sans', system-ui, sans-serif";
      ctx.textAlign = "left";
      if (nivel) ctx.fillText(nivel, start + 10, bar.y);
      ctx.fillStyle = outside;
      ctx.font = "700 12px 'DM Sans', system-ui, sans-serif";
      ctx.textAlign = "left";
      const right = Number(value).toFixed(1).replace(".", ",") + (pct != null ? " · " + fmtPct(pct) : "");
      ctx.fillText(right, end + 8, bar.y);
    });
    ctx.restore();
  },
};

function renderProfKpis(rows) {
  const el = document.getElementById("profKpis");
  if (!el) return;
  const total = rows.length || 1;
  el.innerHTML = APRENDIZADO.map((item) => {
    const count = rows.filter((r) => aprendizadoMeta(r.aprendizado).key === item.key).length;
    const pct = ((count / total) * 100).toFixed(0);
    return '<div class="prof-kpi" style="--prof-color:' + item.color + '">' +
      '<span class="prof-kpi-label">' + item.label + '</span>' +
      '<strong class="prof-kpi-value">' + count + '</strong>' +
      '<span class="prof-kpi-foot">' + pct + '% das turmas</span></div>';
  }).join("");
}

function renderProfNiveis(rows) {
  const el = document.getElementById("profNiveis");
  if (!el) return;
  const max = Math.max(1, ...NIVEIS_PROF.map((n) => rows.filter((r) => Number(r.nivel) === n.nivel).length));
  el.innerHTML = NIVEIS_PROF.map((n) => {
    const count = rows.filter((r) => Number(r.nivel) === n.nivel).length;
    const pct = Math.round((count / max) * 100);
    return '<div class="prof-nivel" style="--nivel-color:' + n.color + '">' +
      '<div class="prof-nivel-bar"><span style="--nivel-pct:' + pct + '%"></span></div>' +
      '<span class="prof-nivel-label">N' + n.nivel + '</span>' +
      '<strong class="prof-nivel-count">' + count + '</strong></div>';
  }).join("");
}

function renderAprendizadoDonut(rows) {
  destroyChart("aprendizado");
  const counts = Object.fromEntries(APRENDIZADO.map((a) => [a.key, 0]));
  rows.forEach((row) => {
    const meta = aprendizadoMeta(row.aprendizado);
    if (counts[meta.key] != null) counts[meta.key] += 1;
  });
  const legend = document.getElementById("aprendizadoLegend");
  if (legend) {
    legend.innerHTML = APRENDIZADO.map((a) =>
      '<li><span class="swatch" style="background:' + a.color + '"></span><span>' +
      a.label + '</span><b>' + counts[a.key] + '</b></li>'
    ).join("");
  }
  const isLight = currentTheme() === "light";
  const sliceBorder = isLight ? "#ffffff" : "#18181b";
  const ctx = document.getElementById("chartAprendizado");
  if (!ctx) return;
  charts.aprendizado = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: APRENDIZADO.map((a) => a.label),
      datasets: [{
        data: APRENDIZADO.map((a) => counts[a.key]),
        backgroundColor: APRENDIZADO.map((a) => a.color),
        hoverBackgroundColor: APRENDIZADO.map((a) => a.color),
        borderColor: sliceBorder,
        hoverBorderColor: sliceBorder,
        borderWidth: 3,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: "62%",
      layout: { padding: 18 },
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (c) => c.label + ": " + c.raw + " turma" + (c.raw === 1 ? "" : "s"),
          },
        },
      },
    },
    plugins: typeof donutSliceLabelsPlugin !== "undefined" ? [donutSliceLabelsPlugin] : [],
  });
}

function renderProficienciaBars(rows) {
  destroyChart("proficiencia");
  const wrap = document.getElementById("chartProficienciaWrap");
  const empty = document.getElementById("profEmpty");
  const canvas = document.getElementById("chartProficiencia");
  const sorted = [...rows]
    .filter((r) => r.proficiencia != null)
    .sort((a, b) => (b.proficiencia || 0) - (a.proficiencia || 0));

  if (!sorted.length) {
    if (wrap) wrap.hidden = true;
    if (canvas) canvas.hidden = true;
    if (empty) {
      empty.hidden = false;
      empty.textContent =
        state.disciplina === "mat"
          ? "A planilha Diagnostica ainda nao traz proficiencia para Matematica. Selecione Língua Portuguesa."
          : "Sem dados de proficiência para o filtro atual.";
    }
    return;
  }
  if (wrap) wrap.hidden = false;
  if (canvas) canvas.hidden = false;
  if (empty) empty.hidden = true;

  const { muted } = chartDefaults();
  const labels = sorted.map((row) => {
    const base = shortSchool(row.escola);
    return row.turma && row.turma !== "ÚNICA" ? base + " — " + row.turma : base;
  });
  const colors = sorted.map((row) => aprendizadoMeta(row.aprendizado).color);
  if (wrap) wrap.style.minHeight = Math.max(420, sorted.length * 28) + "px";

  const legend = document.getElementById("proficienciaLegend");
  if (legend) {
    legend.innerHTML = APRENDIZADO.map((a) =>
      '<li><span class="swatch" style="background:' + a.color + '"></span><span>' + a.short + '</span></li>'
    ).join("");
  }

  charts.proficiencia = new Chart(canvas, {
    type: "bar",
    data: {
      labels,
      datasets: [{
        label: "Proficiência",
        data: sorted.map((r) => r.proficiencia),
        niveis: sorted.map((r) => r.nivelLabel || (r.nivel != null ? "NÍVEL " + r.nivel : "")),
        pcts: sorted.map((r) => r.pctAcertos),
        backgroundColor: colors,
        hoverBackgroundColor: colors,
        borderRadius: 8,
        borderSkipped: false,
        barPercentage: 0.78,
        categoryPercentage: 0.82,
      }],
    },
    options: {
      indexAxis: "y",
      responsive: true,
      maintainAspectRatio: false,
      layout: { padding: { right: 88, left: 4, top: 8, bottom: 8 } },
      scales: {
        x: {
          beginAtZero: true,
          suggestedMax: Math.ceil(Math.max(...sorted.map((r) => r.proficiencia || 0)) / 20) * 20 + 20,
          ticks: { color: muted, font: { size: 11 } },
          grid: { color: "rgba(128,128,140,.12)" },
        },
        y: {
          ticks: { color: muted, font: { size: 11 } },
          grid: { display: false },
        },
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (ctx) => {
              const row = sorted[ctx.dataIndex];
              const aprend = aprendizadoMeta(row.aprendizado).label;
              const pct = row.pctAcertos != null ? " · " + fmtPct(row.pctAcertos) + " acertos" : "";
              return Number(ctx.raw).toFixed(1).replace(".", ",") + " pts · " + aprend + pct;
            },
          },
        },
      },
      onClick: (_, els) => {
        if (!els.length) return;
        const row = sorted[els[0].index];
        if (!row) return;
        const same = state.escola === row.escola && (!row.turma || state.turma === row.turma);
        if (same) {
          state.escola = "";
          state.turma = "";
        } else {
          state.escola = row.escola;
          state.turma = row.turma && row.turma !== "ÚNICA" ? row.turma : state.turma;
          state.visao = "turmas";
        }
        state.page = 1;
        fillSelects();
        render();
      },
    },
    plugins: [proficienciaBarLabelsPlugin],
  });
}

function renderProficiencia() {
  const source = proficienciaSourcePeriodo();
  const rows = proficienciaRows();
  const title = document.getElementById("chartProficienciaTitle");
  const sub = document.getElementById("chartProficienciaSub");
  const barsTitle = document.getElementById("chartProfBarsTitle");
  const barsSub = document.getElementById("chartProfBarsSub");
  if (title) title.textContent = "Mapa de Proficiência";
  if (sub) {
    sub.textContent =
      (PERIODOS[source.periodo] || source.periodo) +
      " · Língua Portuguesa · " +
      rows.length +
      " turma" +
      (rows.length === 1 ? "" : "s") +
      " · escala e níveis da planilha";
  }
  if (barsTitle) barsTitle.textContent = "Ranking de proficiência";
  if (barsSub) barsSub.textContent = "Pontuação · nível · % acertos · clique para filtrar";
  renderProfKpis(rows);
  renderProfNiveis(rows);
  renderAprendizadoDonut(rows);
  renderProficienciaBars(rows);
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
    <article class="status-card ${state.faixa === f.key ? "active" : ""}" data-faixa="${f.key}" style="--status-color:${f.color}">
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
        <td><span class="tag tag-ranking" style="--tag:${faixa.color}">${ranking}</span></td>
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
    setChartPanel(state.chartPanel);
    const panel = state.chartPanel;
    const { hideTurma, hideEscola } = syncRankingCards();

    if (panel === "comparativo") renderComparativo();
    else destroyChart("comparativo");

    if (panel === "faixasRanking") {
      renderDonut(rows);
      if (hideTurma) destroyChart("ranking");
      else renderRanking(rows);
      if (hideEscola) destroyChart("rankingEscolas");
      else renderRankingEscolas();
    } else {
      destroyChart("donut");
      destroyChart("ranking");
      destroyChart("rankingEscolas");
    }

    if (panel === "questoes") renderQuestoes();
    else destroyChart("questoes");

    if (panel === "proficiencia") renderProficiencia();
    else {
      destroyChart("aprendizado");
      destroyChart("proficiencia");
    }

    resizeVisibleCharts();
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
    btn.addEventListener("click", () => {
      setView(btn.dataset.view);
      render();
    });
  });

  document.querySelectorAll(".nav-btn[data-chart]").forEach((btn) => {
    btn.addEventListener("click", () => {
      setView("dashboard");
      setChartPanel(btn.dataset.chart);
      render();
    });
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

  window.addEventListener("resize", () => resizeVisibleCharts());
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
