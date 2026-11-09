/**
 * Faixas = coluna APRENDIZADO sobre PROFICIÊNCIA (BA).
 * LP:  =SE(BA<=149;"INSUFICIENTE";SE(BA<200;"BÁSICO";SE(BA<250;"PROFICIENTE";"AVANÇADO")))
 * MAT: =SE(BA<=174;"INSUFICIENTE";SE(BA<=224;"BÁSICO";SE(BA<=274;"PROFICIENTE";"AVANÇADO")))  (escala 350)
 */
const FAIXAS_LP = [
  { key: "insuficiente", label: "Insuficiente (≤ 149)", color: "#FF3B30", aprendizado: "INSUFICIENTE" },
  { key: "basico", label: "Básico (150–199)", color: "#FF9500", aprendizado: "BÁSICO" },
  { key: "proficiente", label: "Proficiente (200–249)", color: "#FFD60A", aprendizado: "PROFICIENTE" },
  { key: "avancado", label: "Avançado (≥ 250)", color: "#00E676", aprendizado: "AVANÇADO" },
];

const FAIXAS_MAT = [
  { key: "insuficiente", label: "Insuficiente (≤ 174)", color: "#FF3B30", aprendizado: "INSUFICIENTE" },
  { key: "basico", label: "Básico (175–224)", color: "#FF9500", aprendizado: "BÁSICO" },
  { key: "proficiente", label: "Proficiente (225–274)", color: "#FFD60A", aprendizado: "PROFICIENTE" },
  { key: "avancado", label: "Avançado (≥ 275)", color: "#00E676", aprendizado: "AVANÇADO" },
];

/** Compat: default = LP (visão geral / português). Preferir faixasAtivas(). */
const FAIXAS = FAIXAS_LP;

const APRENDIZADO = [
  { key: "INSUFICIENTE", label: "Insuficiente", color: "#FF3B30", short: "Insuf." },
  { key: "BÁSICO", label: "Básico", color: "#FF9F0A", short: "Básico" },
  { key: "PROFICIENTE", label: "Proficiente", color: "#3D7BFF", short: "Profic." },
  { key: "AVANÇADO", label: "Avançado", color: "#30D158", short: "Avanç." },
];

/**
 * Descritores da Avaliação de Saída (planilha Descritores_Avaliacao_4e5Ano_LP_MAT.xlsx).
 * Índice 0 = Questão 01 da disciplina no ranking (ordem do caderno LP/MAT).
 * Tooltip: título "D1 - H2 - N1" | corpo = descrição D + descrição H.
 */
const DESCRITORES_LP = [
  { d: "D1", h: "H2", n: "N1", descD: "Localizar informações explícitas em um texto", descH: "Localizar informação explícita" },
  { d: "D3", h: "H13", n: "N1", descD: "Inferir o sentido de uma palavra ou expressão", descH: "Inferir o sentido de palavras ou expressões em textos" },
  { d: "D6", h: "H1", n: "N1", descD: "Identificar o tema de um texto", descH: "Identificar a ideia central do texto" },
  { d: "D11", h: "H10", n: "N2", descD: "Distinguir um fato da opinião relativa a esse fato", descH: "Distinguir fatos de opiniões em textos" },
  { d: "D4", h: "H12", n: "N2", descD: "Inferir uma informação implícita em um texto", descH: "Inferir informações implícitas em textos" },
  { d: "D5", h: "H11", n: "N2", descD: "Interpretar texto com auxílio de material gráfico diverso (propagandas, quadrinhos, foto etc.)", descH: "Analisar informações apresentadas em gráficos, infográficos ou tabelas" },
  { d: "D9", h: "H3", n: "N3", descD: "Identificar a finalidade de textos de diferentes gêneros", descH: "Reconhecer diferentes gêneros textuais" },
  { d: "D7", h: "H4", n: "N3", descD: "Identificar o conflito gerador do enredo e os elementos que constroem a narrativa", descH: "Identificar elementos constitutivos de textos narrativos" },
  { d: "D9", h: "H5", n: "N3", descD: "Identificar a finalidade de textos de diferentes gêneros", descH: "Reconhecer diferentes modos de organização composicional de textos em versos" },
  { d: "D7", h: "H6", n: "N4", descD: "Identificar o conflito gerador do enredo e os elementos que constroem a narrativa", descH: "Identificar as marcas de organização de textos dramáticos" },
  { d: "D8", h: "H8", n: "N4", descD: "Estabelecer relação causa/consequência entre partes e elementos do texto", descH: "Analisar relações de causa e consequência" },
  { d: "D13", h: "H14", n: "N4", descD: "Identificar efeitos de ironia ou humor em textos variados", descH: "Analisar os efeitos de sentido de recursos multissemióticos em textos" },
  { d: "D2", h: "H21", n: "N5", descD: "Estabelecer relações entre partes de um texto, identificando repetições ou substituições que contribuem para a continuidade", descH: "Identificar os mecanismos de referenciação lexical e pronominal" },
  { d: "D12", h: "H25", n: "N5", descD: "Estabelecer relações lógico-discursivas presentes no texto, marcadas por conjunções, advérbios etc.", descH: "Analisar os efeitos de sentido decorrentes do uso dos advérbios" },
  { d: "D14", h: "H17/H22", n: "N5", descD: "Identificar o efeito de sentido decorrente do uso da pontuação e de outras notações", descH: "Reconhecer e analisar os efeitos de sentido da pontuação" },
  { d: "D5", h: "H9", n: "N6", descD: "Interpretar texto com auxílio de material gráfico diverso (propagandas, quadrinhos, foto etc.)", descH: "Analisar o uso de recursos de persuasão em textos verbais e/ou multimodais" },
  { d: "D9", h: "H7", n: "N6", descD: "Identificar a finalidade de textos de diferentes gêneros", descH: "Analisar elementos constitutivos de gêneros textuais diversos" },
  { d: "D15", h: "H16", n: "N6", descD: "Reconhecer diferentes formas de tratar uma informação na comparação de textos sobre o mesmo tema", descH: "Avaliar a fidedignidade de informações sobre um mesmo fato em diferentes mídias" },
  { d: "EF01LP05", h: null, n: null, descD: "Escrever o próprio nome completo em letra cursiva", descH: null },
  { d: "EF01LP05", h: null, n: null, descD: "Escrever o nome completo da escola em letra cursiva", descH: null },
];

const DESCRITORES_MAT = [
  { d: "D13/D15", h: "5N1.2", n: "N1", descD: "Identificar a ordem ocupada por um algarismo ou seu valor posicional em um número natural de até 6 ordens", descH: null },
  { d: "D15", h: "5N1.4", n: "N1", descD: "Compor ou decompor números naturais de até 6 ordens na forma aditiva, em ordens, ou em adições e multiplicações", descH: null },
  { d: "D17", h: "5N1.5", n: "N1", descD: "Calcular o resultado de adições ou subtrações envolvendo números naturais de até 6 ordens", descH: null },
  { d: "D18", h: "5N1.6", n: "N1", descD: "Calcular o resultado de multiplicações ou divisões envolvendo números naturais de até 6 ordens", descH: null },
  { d: "D24", h: "5N1.8", n: "N2", descD: "Representar frações menores ou maiores que a unidade ou associar frações a representações pictóricas", descH: null },
  { d: "D24", h: "5N1.9", n: "N2", descD: "Identificar frações equivalentes", descH: null },
  { d: "D19", h: "5N2.1", n: "N2", descD: "Resolver problemas de adição ou subtração com números naturais (juntar, acrescentar, separar, retirar, comparar ou completar)", descH: null },
  { d: "D20", h: "5N2.2", n: "N3", descD: "Resolver problemas de multiplicação ou divisão com números naturais (grupos iguais, proporcionalidade ou disposição retangular)", descH: null },
  { d: "D26", h: "5N2.7", n: "N3", descD: "Resolver problemas com 10%, 25%, 50%, 75% e 100%", descH: null },
  { d: "D14", h: "5A1.3", n: "N3", descD: "Inferir elementos ausentes em uma sequência de números naturais, objetos e figuras", descH: null },
  { d: "D17/D19", h: "5A1.4", n: "N3", descD: "Comparar diferentes sentenças de adições ou subtrações de dois números naturais", descH: null },
  { d: "D20", h: "5A2.2", n: "N4", descD: "Resolver problemas que envolvam a partilha de uma quantidade em duas partes proporcionais", descH: null },
  { d: "D1", h: "5G1.1", n: "N4", descD: "Identificar localização ou deslocamento de pessoas/objetos em representações bidimensionais (mapas, croquis etc.)", descH: null },
  { d: "D2", h: "5G1.3", n: "N4", descD: "Reconhecer/nomear figuras geométricas espaciais (prismas, pirâmides, cilindros, cones ou esferas)", descH: null },
  { d: "D2", h: "5G1.4", n: "N4", descD: "Reconhecer/nomear, contar ou comparar elementos de figuras geométricas espaciais (vértice, aresta, face, base)", descH: null },
  { d: "D2", h: "5G1.6", n: "N5", descD: "Reconhecer/nomear figuras geométricas planas (polígonos, circunferência ou círculo)", descH: null },
  { d: "D6", h: "5M1.1", n: "N5", descD: "Reconhecer a unidade de medida ou o instrumento mais apropriado (comprimento, área, massa, tempo, capacidade ou temperatura)", descH: null },
  { d: "D8", h: "5M1.5", n: "N5", descD: "Identificar horas em relógios analógicos ou associar analógico e digital", descH: null },
  { d: "D23", h: "5M2.6", n: "N5", descD: "Resolver problemas com moedas e/ou cédulas do sistema monetário brasileiro", descH: null },
  { d: "D27", h: "5E1.2", n: "N6", descD: "Ler/identificar ou comparar dados estatísticos em tabelas (simples ou de dupla entrada)", descH: null },
  { d: "D28", h: "5E1.3", n: "N6", descD: "Ler/identificar ou comparar dados estatísticos em gráficos (barras, colunas, pictóricos ou linhas)", descH: null },
];

function formatDescritorTooltip(entry) {
  if (!entry?.d) return null;
  return [entry.d, entry.h, entry.n].filter((part) => part && part !== "—").join(" - ");
}

function formatDescricaoTooltip(entry) {
  if (!entry) return null;
  const parts = [entry.descD, entry.descH].filter((part) => part && part !== "—");
  return parts.length ? parts.join(" - ") : null;
}

/** Índice 0-based da "Questão NN" no caderno da disciplina. */
function questaoIndexFromLabel(q) {
  const m = String(q || "").match(/(\d+)/);
  if (!m) return -1;
  return Number(m[1]) - 1;
}

function descritorEntryForQuestion(q, group = "lp") {
  const idx = questaoIndexFromLabel(q);
  if (idx < 0) return null;
  const list = group === "mat" ? DESCRITORES_MAT : DESCRITORES_LP;
  return list[idx] || null;
}

function descritorTooltipForQuestion(q, group = "lp") {
  return formatDescritorTooltip(descritorEntryForQuestion(q, group));
}

function descricaoTooltipForQuestion(q, group = "lp") {
  return formatDescricaoTooltip(descritorEntryForQuestion(q, group));
}

const NIVEIS_PROF = [
  { nivel: 0, color: "#FF3B30" },
  { nivel: 1, color: "#FF6B4A" },
  { nivel: 2, color: "#FF9F0A" },
  { nivel: 3, color: "#FFD60A" },
  { nivel: 4, color: "#5B9AFF" },
  { nivel: 5, color: "#3D7BFF" },
  { nivel: 6, color: "#30D158" },
  { nivel: 7, color: "#00C2A0" },
  { nivel: 8, color: "#00A3FF" },
  { nivel: 9, color: "#7C5CFF" },
  { nivel: 10, color: "#BF5AF2" },
];

/** Disciplina usada nas faixas/níveis SAEB (geral e LP → português). */
function disciplinaProficiencia() {
  return state.disciplina === "mat" ? "mat" : "lp";
}

function faixasAtivas() {
  return disciplinaProficiencia() === "mat" ? FAIXAS_MAT : FAIXAS_LP;
}

function niveisAtivos() {
  const max = disciplinaProficiencia() === "mat" ? 10 : 9;
  return NIVEIS_PROF.filter((n) => n.nivel <= max);
}

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

function anosDisponiveis() {
  const list = DADOS.meta?.anosDisponiveis;
  if (Array.isArray(list) && list.length) return list.map(Number);
  if (DADOS.byAno) return Object.keys(DADOS.byAno).map(Number).sort((a, b) => a - b);
  return [Number(DADOS.meta?.ano || 5)];
}

function anoPadrao() {
  return Number(DADOS.meta?.anoPadrao || DADOS.meta?.ano || anosDisponiveis()[0] || 5);
}

/** Pacote do ano ativo (4º ou 5º), sem misturar turmas. */
function dadosAno(ano = state.ano) {
  const bloco = DADOS.byAno?.[String(ano)];
  if (bloco) return bloco;
  return DADOS;
}

const state = {
  view: "dashboard",
  chartPanel: "comparativo",
  visao: "turmas",
  disciplina: "geral",
  escola: "",
  turma: "",
  ano: anoPadrao(),
  periodo: "percurso",
  faixa: "",
  search: "",
  page: 1,
  pageSize: 10,
  sort: { key: "ranking", dir: 1 },
};

function periodoPadrao() {
  const meta = dadosAno().meta || DADOS.meta;
  return meta?.periodoPadrao || meta?.periodo || PERIODO_DADOS;
}

function periodosDisponiveis() {
  const pack = dadosAno();
  return pack.meta?.periodosDisponiveis || Object.keys(pack.byPeriodo || {}) || [periodoPadrao()];
}

function periodoBundle(periodo = state.periodo) {
  const pack = dadosAno();
  if (pack.byPeriodo?.[periodo]) return pack.byPeriodo[periodo];
  if (periodo === periodoPadrao()) {
    return {
      meta: pack.meta,
      escolasQuestoesLp: pack.escolasQuestoesLp,
      escolasQuestoesMat: pack.escolasQuestoesMat,
    };
  }
  return null;
}

function metaAtivo() {
  return periodoBundle()?.meta || dadosAno().meta || DADOS.meta;
}

function syncAnoTitle() {
  const ano = state.ano || anoPadrao();
  document.title = `ADSE — Painel ${ano}º Ano (Aprendizado)`;
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

/** Classifica pela fórmula Excel da coluna BA (PROFICIÊNCIA), LP ou MAT. */
function faixaFromProficiencia(ba, disciplina = disciplinaProficiencia()) {
  const score = Number(ba);
  const faixas = disciplina === "mat" ? FAIXAS_MAT : FAIXAS_LP;
  if (!Number.isFinite(score)) return faixas[0];
  if (disciplina === "mat") {
    if (score <= 174) return faixas[0];
    if (score <= 224) return faixas[1];
    if (score <= 274) return faixas[2];
    return faixas[3];
  }
  // Faixas contínuas (evita buraco entre 249 e 250 em valores fracionários).
  if (score <= 149) return faixas[0];
  if (score < 200) return faixas[1];
  if (score < 250) return faixas[2];
  return faixas[3];
}

function faixaFromAprendizadoLabel(label) {
  const faixas = faixasAtivas();
  const norm = String(label || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toUpperCase();
  return (
    faixas.find((f) => f.aprendizado.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase() === norm) ||
    faixas[0]
  );
}

/** Bloco de proficiência da turma no período (LP ou MAT conforme disciplina). */
function proficienciaBlock(row, disciplina = disciplinaProficiencia()) {
  const field = disciplina === "mat" ? "proficienciaMat" : "proficienciaLp";
  if (row?.[field]?.proficiencia != null || row?.[field]?.aprendizado) {
    return row[field];
  }
  const raw = dadosAno().turmas.find((t) => t.escola === row?.escola && t.turma === row?.turma);
  return raw?.periodos?.[state.periodo]?.[field] || null;
}

/** @deprecated Preferir proficienciaBlock — mantido para trechos antigos de LP. */
function proficienciaLpBlock(row) {
  return proficienciaBlock(row, "lp");
}

function proficienciaScoreTurma(row) {
  const block = proficienciaBlock(row);
  return block?.proficiencia != null ? Number(block.proficiencia) : null;
}

function faixaFromRow(row) {
  const faixas = faixasAtivas();
  if (state.visao === "escolas" && !row?.turma) {
    const turmas = turmasForEscolaNome(row.escola);
    const scores = turmas.map((t) => proficienciaScoreTurma(t)).filter((v) => v != null);
    if (scores.length) {
      const media = scores.reduce((acc, v) => acc + v, 0) / scores.length;
      return faixaFromProficiencia(media);
    }
  }
  const block = proficienciaBlock(row);
  if (block?.proficiencia != null) return faixaFromProficiencia(block.proficiencia);
  if (block?.aprendizado) return faixaFromAprendizadoLabel(block.aprendizado);
  return faixas[0];
}

/** @deprecated Use faixaFromRow — mantido só se algum trecho passar média %. */
function faixaFromMedia(media) {
  return faixaFromProficiencia(media);
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
  return dadosAno().turmas
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
      if (!exclude.faixa && state.faixa && faixaFromRow(row).key !== state.faixa) return false;
      if (!exclude.search && !matchesSearchTurma(row, q)) return false;
      return true;
    });
}

function escolasBase(exclude = {}) {
  const q = exclude.search ? "" : state.search.trim().toLowerCase();
  if (!exclude.periodo && !periodoTemDados()) return [];
  return dadosAno().escolas
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
      if (!exclude.faixa && state.faixa && faixaFromRow(row).key !== state.faixa) return false;
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

  const anoSelect = document.getElementById("filterAno");
  if (anoSelect) {
    anoSelect.innerHTML = anosDisponiveis()
      .map((ano) => `<option value="${ano}">${ano}º ano</option>`)
      .join("");
  }

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
  ["filterAno", "filterVisao", "filterDisciplina", "filterEscola", "filterTurma", "filterPeriodo"].forEach((id) => {
    const el = document.getElementById(id);
    if (!el) return;
    const key = id.replace("filter", "").toLowerCase();
    el.value =
      state[key] ||
      (id === "filterDisciplina"
        ? "geral"
        : id === "filterVisao"
          ? "turmas"
          : id === "filterPeriodo"
            ? periodoPadrao()
            : id === "filterAno"
              ? String(anoPadrao())
              : "");
  });
  syncAnoTitle();
}

function renderChips() {
  const chips = document.getElementById("chips");
  const items = [];
  if (state.visao === "escolas") items.push({ key: "visao", label: "Visão: escolas" });
  if (state.disciplina !== "geral") items.push({ key: "disciplina", label: DISCIPLINAS[state.disciplina] });
  if (state.escola) items.push({ key: "escola", label: shortSchool(state.escola) });
  if (state.turma) items.push({ key: "turma", label: `Turma ${state.turma}` });
  if (state.ano && state.ano !== anoPadrao()) {
    items.push({ key: "ano", label: `Ano: ${state.ano}º` });
  }
  if (state.periodo && state.periodo !== periodoPadrao()) {
    items.push({ key: "periodo", label: `Período: ${PERIODOS[state.periodo] || state.periodo}` });
  }
  if (state.faixa) items.push({ key: "faixa", label: faixasAtivas().find((f) => f.key === state.faixa)?.label || state.faixa });
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

function isFullscreenActive() {
  return Boolean(
    document.fullscreenElement ||
      document.webkitFullscreenElement ||
      document.msFullscreenElement
  );
}

function syncFullscreenUi() {
  const active = isFullscreenActive();
  const btn = document.getElementById("btnFullscreen");
  if (btn) {
    btn.classList.toggle("active", active);
    btn.setAttribute("aria-pressed", active ? "true" : "false");
    btn.title = active ? "Sair da tela cheia (Esc)" : "Tela cheia";
    btn.setAttribute("aria-label", active ? "Sair da tela cheia" : "Entrar em tela cheia");
    const expand = btn.querySelector(".fs-icon-expand");
    const compress = btn.querySelector(".fs-icon-compress");
    if (expand) expand.hidden = active;
    if (compress) compress.hidden = !active;
  }
  requestAnimationFrame(() => resizeVisibleCharts());
}

async function enterFullscreen() {
  const root = document.documentElement;
  try {
    if (root.requestFullscreen) await root.requestFullscreen();
    else if (root.webkitRequestFullscreen) root.webkitRequestFullscreen();
    else if (root.msRequestFullscreen) root.msRequestFullscreen();
  } catch (_) {
    /* Permissão negada / API indisponível */
  }
  syncFullscreenUi();
}

async function exitFullscreen() {
  try {
    if (!isFullscreenActive()) return;
    if (document.exitFullscreen) await document.exitFullscreen();
    else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
    else if (document.msExitFullscreen) document.msExitFullscreen();
  } catch (_) {
    /* ignore */
  }
  syncFullscreenUi();
}

async function toggleFullscreen() {
  if (isFullscreenActive()) await exitFullscreen();
  else await enterFullscreen();
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
    const ano = state.ano || anoPadrao();
    subEl.textContent = `${ano}º ano · ${DISCIPLINAS[state.disciplina]} · ${sorted.length} ${escopo} · destaque: ${PERIODOS[state.periodo] || state.periodo}`;
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
  const faixas = faixasAtivas();
  const counts = Object.fromEntries(faixas.map((f) => [f.key, 0]));
  rows.forEach((r) => {
    counts[faixaFromRow(r).key] += 1;
  });
  const legend = document.getElementById("donutLegend");
  legend.innerHTML = faixas.map(
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
      labels: faixas.map((f) => f.label),
      datasets: [
        {
          data: faixas.map((f) => counts[f.key]),
          backgroundColor: faixas.map((f) => f.color),
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
        toggleFilter("faixa", faixas[els[0].index].key);
      },
    },
    plugins: [donutSliceLabelsPlugin],
  });
  const discLabel = disciplinaProficiencia() === "mat" ? "Matemática" : "Língua Portuguesa";
  const escala = disciplinaProficiencia() === "mat" ? "≤174 / 175–224 / 225–274 / ≥275" : "≤149 / 150–199 / 200–249 / ≥250";
  document.getElementById("chartDonutTitle").textContent = "Faixas de desempenho";
  document.getElementById("chartDonutSub").textContent =
    `${state.ano || anoPadrao()}º ano · ${DISCIPLINAS[state.disciplina]} · proficiência ${discLabel} (${escala})`;
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
            const faixa = faixaFromRow(row);
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
  document.getElementById("chartRankingSub").textContent = `${state.ano || anoPadrao()}º ano · ${DISCIPLINAS[state.disciplina]} · 1º ao ${sorted.length}º · clique para filtrar`;

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
          backgroundColor: sorted.map((r) => faixaFromRow(r).color),
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
        descritor: descritorTooltipForQuestion(qLp, "lp"),
        descricao: descricaoTooltipForQuestion(qLp, "lp"),
      });
    }
    if (qMat && matMap[qMat] != null) {
      out.push({
        q: `MAT ${qMat.replace("Questão ", "Q")}`,
        v: matMap[qMat],
        acertos: acMat[qMat] ?? null,
        group: "mat",
        descritor: descritorTooltipForQuestion(qMat, "mat"),
        descricao: descricaoTooltipForQuestion(qMat, "mat"),
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

    const group = isMat ? "mat" : "lp";
    if (state.escola) {
      const keys = questoesEscopoKeys(source);
      if (keys.length) {
        const { media, acertos } = aggregateQuestoesFromKeys(source, keys, questoes);
        return questoes.map((q) => ({
          q,
          v: media[q] ?? null,
          acertos: acertos[q] ?? null,
          group,
          descritor: descritorTooltipForQuestion(q, group),
          descricao: descricaoTooltipForQuestion(q, group),
        }));
      }
    }

    return questoes.map((q) => ({
      q,
      v: mediaMap[q] ?? null,
      acertos: acertosMap?.[q] ?? null,
      group,
      descritor: descritorTooltipForQuestion(q, group),
      descricao: descricaoTooltipForQuestion(q, group),
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

/** Cor da barra de questão pelas faixas SAEB (mesmo padrão do donut). */
function corQuestaoPorFaixa(pct, disciplina = "lp") {
  const scale = disciplina === "mat" ? 350 : 325;
  const score = (Number(pct) / 100) * scale;
  return faixaFromProficiencia(score, disciplina).color;
}

/** Formata % da legenda de questões (pt-BR, 2 casas). */
function fmtPctLegenda(pct) {
  return `${pct.toFixed(2).replace(".", ",")}%`;
}

/**
 * Converte cortes da escala SAEB em faixas % contínuas (sem buracos).
 * Cada faixa começa 0,01 p.p. após o fim da anterior — a sequência fica
 * contínua na legenda (ex.: …45,85% → 45,86%…), em vez de pular os inteiros
 * da escala (149→150 vira 45,85%→46,15%).
 * LP (325): ≤149 | <200 | <250 | ≥250
 * MAT (350): ≤174 | ≤224 | ≤274 | >274
 */
function buildQuestoesLegendRanges(disciplina) {
  const cores = {
    insuficiente: "#FF3B30",
    basico: "#FF9500",
    proficiente: "#FFD60A",
    avancado: "#00E676",
  };
  const scale = disciplina === "mat" ? 350 : 325;
  const round2 = (n) => Math.round(n * 100) / 100;
  const toPct = (score) => (score / scale) * 100;

  /** Maior % (2 casas) ainda classificada na faixa antes do corte exclusivo. */
  const maxPctExclusive = (scoreLimite) => {
    const exact = toPct(scoreLimite);
    const cand = round2(exact);
    return (cand / 100) * scale < scoreLimite ? cand : round2(cand - 0.01);
  };

  /** % (2 casas) do corte inclusivo (≤ score). */
  const maxPctInclusive = (scoreLimite) => round2(toPct(scoreLimite));

  let fimInsuf;
  let fimBasico;
  let fimProf;
  if (disciplina === "mat") {
    fimInsuf = maxPctInclusive(174);
    fimBasico = maxPctInclusive(224);
    fimProf = maxPctInclusive(274);
  } else {
    fimInsuf = maxPctInclusive(149);
    fimBasico = maxPctExclusive(200);
    fimProf = maxPctExclusive(250);
  }

  const iniBasico = round2(fimInsuf + 0.01);
  const iniProf = round2(fimBasico + 0.01);
  const iniAvanc = round2(fimProf + 0.01);

  return [
    { key: "insuficiente", label: "Insuficiente", range: `até ${fmtPctLegenda(fimInsuf)}`, color: cores.insuficiente },
    {
      key: "basico",
      label: "Básico",
      range: `${fmtPctLegenda(iniBasico)} – ${fmtPctLegenda(fimBasico)}`,
      color: cores.basico,
    },
    {
      key: "proficiente",
      label: "Proficiente",
      range: `${fmtPctLegenda(iniProf)} – ${fmtPctLegenda(fimProf)}`,
      color: cores.proficiente,
    },
    { key: "avancado", label: "Avançado", range: `a partir de ${fmtPctLegenda(iniAvanc)}`, color: cores.avancado },
  ];
}

/** Legendas de faixas por disciplina (escala SAEB → % contínuas). */
const QUESTOES_LEGEND = {
  lp: buildQuestoesLegendRanges("lp"),
  mat: buildQuestoesLegendRanges("mat"),
};

function renderQuestoesLegend(data) {
  const layout = document.getElementById("questoesLayout");
  const panel = document.getElementById("questoesLegendPanel");
  const legend = document.getElementById("questoesLegend");
  if (!layout || !panel || !legend) return;

  const disciplina = state.disciplina === "mat" ? "mat" : state.disciplina === "lp" ? "lp" : null;
  const items = disciplina ? QUESTOES_LEGEND[disciplina] : null;
  const show = Boolean(items);
  layout.classList.toggle("has-legend", show);
  panel.hidden = !show;
  if (!show) {
    legend.innerHTML = "";
    return;
  }

  const scale = disciplina === "mat" ? 350 : 325;
  const counts = Object.fromEntries(items.map((item) => [item.key, 0]));
  (data || []).forEach((d) => {
    if (d.v == null) return;
    const key = faixaFromProficiencia((Number(d.v) / 100) * scale, disciplina).key;
    if (counts[key] != null) counts[key] += 1;
  });

  legend.innerHTML = items
    .map(
      (item) => `
    <li class="questoes-legend-item" style="--faixa-color:${item.color}" title="${item.label}: ${item.range}">
      <span class="questoes-legend-dot" aria-hidden="true"></span>
      <span class="questoes-legend-label">${item.label}</span>
      <span class="questoes-legend-range">${item.range}</span>
      <b class="questoes-legend-count">${counts[item.key]}</b>
    </li>`
    )
    .join("");
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
  renderQuestoesLegend(data);

  const corQuestao = (d) => {
    const group = d.group || (state.disciplina === "mat" ? "mat" : state.disciplina === "lp" ? "lp" : null);
    // LP e MAT: vermelho / laranja / amarelo / verde pelas faixas SAEB
    if (group === "lp" || state.disciplina === "lp") {
      return corQuestaoPorFaixa(d.v, "lp");
    }
    if (group === "mat" || state.disciplina === "mat") {
      return corQuestaoPorFaixa(d.v, "mat");
    }
    return corQuestaoPorFaixa(d.v, "lp");
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
          descritores: data.map((d) => d.descritor || null),
          descricoes: data.map((d) => d.descricao || null),
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
        tooltip: {
          callbacks: {
            title: (items) => {
              const item = items?.[0];
              if (!item) return "";
              const descritor = item.dataset?.descritores?.[item.dataIndex];
              return descritor || item.label || "";
            },
            label: (ctx) => {
              const descricao = ctx.dataset?.descricoes?.[ctx.dataIndex];
              return descricao || fmtPct(ctx.raw);
            },
          },
        },
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
  const periodo = state.periodo;
  const bundle = periodoBundle(periodo);
  const lp = bundle?.proficienciaLp || [];
  const mat = bundle?.proficienciaMat || [];
  return { periodo, bundle, lp, mat };
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

function aprendizadoFromNivel(nivel) {
  const n = Number(nivel);
  if (disciplinaProficiencia() === "mat") {
    // MAT: ≤174 → N0–2; 175–224 → N3–4; 225–274 → N5–6; ≥275 → N7+
    if (n <= 2) return APRENDIZADO[0];
    if (n <= 4) return APRENDIZADO[1];
    if (n <= 6) return APRENDIZADO[2];
    return APRENDIZADO[3];
  }
  // LP: ≤149 → N0–1; 150–199 → N2–3; 200–249 → N4–5; ≥250 → N6+
  if (n <= 1) return APRENDIZADO[0];
  if (n <= 3) return APRENDIZADO[1];
  if (n <= 5) return APRENDIZADO[2];
  return APRENDIZADO[3];
}

function renderProfNiveis(rows) {
  const el = document.getElementById("profNiveis");
  if (!el) return;
  const body = niveisAtivos().map((n) => {
    const count = rows.filter((r) => Number(r.nivel) === n.nivel).length;
    const apr = aprendizadoFromNivel(n.nivel);
    return (
      "<tr>" +
      '<td class="niveis-td-nivel"><span class="niveis-pill" style="--nivel-color:' + n.color + '">NÍVEL ' + n.nivel + "</span></td>" +
      '<td class="niveis-td-turmas"><strong>' + count + "</strong></td>" +
      '<td class="niveis-td-aprend"><span class="niveis-dot" style="background:' + apr.color + '"></span>' + apr.label + "</td>" +
      "</tr>"
    );
  }).join("");
  el.innerHTML =
    '<table class="niveis-table">' +
    "<thead><tr><th>Nível</th><th>Turmas</th><th>Aprendizado</th></tr></thead>" +
    "<tbody>" + body + "</tbody>" +
    "</table>";
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
          ? "Sem dados de proficiência de Matemática para " + (PERIODOS[state.periodo] || state.periodo) + " com o filtro atual."
          : "Sem dados de proficiência para " + (PERIODOS[state.periodo] || state.periodo) + " com o filtro atual.";
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
  const kicker = document.querySelector(".prof-kicker");
  if (title) title.textContent = "Mapa de Proficiência";
  if (kicker) {
    kicker.textContent =
      `${state.ano || anoPadrao()}º ano · ` +
      (PERIODOS[source.periodo] || source.periodo) +
      " · " +
      (state.disciplina === "mat" ? "Matemática" : "Língua Portuguesa");
  }
  if (sub) {
    const disc = state.disciplina === "mat" ? "Matemática" : "Língua Portuguesa";
    const escala = state.disciplina === "mat" ? "escala 350 · níveis 0–10" : "escala 325 · níveis 0–9";
    sub.textContent =
      `${state.ano || anoPadrao()}º ano · ` +
      (PERIODOS[source.periodo] || source.periodo) +
      " · " +
      disc +
      " · " +
      rows.length +
      " turma" +
      (rows.length === 1 ? "" : "s") +
      " · " +
      escala;
  }
  if (barsTitle) barsTitle.textContent = "Ranking de proficiência";
  if (barsSub) barsSub.textContent = "Pontuação · nível · % acertos · clique para filtrar";
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
  const faixas = faixasAtivas();
  const counts = Object.fromEntries(faixas.map((f) => [f.key, 0]));
  rows.forEach((r) => {
    counts[faixaFromRow(r).key] += 1;
  });
  document.getElementById("statusRow").innerHTML = faixas.map(
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
  if (scope) scope.textContent = ` · ${DISCIPLINAS[state.disciplina]} · ${state.ano || anoPadrao()}º ano`;
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
      const faixa = faixaFromRow(r);
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
  a.download = `adse-${state.ano || anoPadrao()}ano-ranking.csv`;
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

  document.getElementById("filterPeriodo")?.addEventListener("change", (e) => {
    state.periodo = e.target.value;
    state.page = 1;
    fillSelects();
    render();
  });

  document.getElementById("filterAno")?.addEventListener("change", (e) => {
    state.ano = Number(e.target.value) || anoPadrao();
    state.escola = "";
    state.turma = "";
    state.faixa = "";
    state.periodo = periodoPadrao();
    state.page = 1;
    fillSelects();
    render();
  });

  document.getElementById("btnTheme").addEventListener("click", () => {
    applyTheme(currentTheme() === "light" ? "dark" : "light");
    render();
  });

  const onFullscreenClick = (e) => {
    e.preventDefault();
    toggleFullscreen();
  };
  document.getElementById("btnFullscreen")?.addEventListener("click", onFullscreenClick);
  document.addEventListener("fullscreenchange", syncFullscreenUi);
  document.addEventListener("webkitfullscreenchange", syncFullscreenUi);
  document.addEventListener("keydown", (e) => {
    if ((e.key === "f" || e.key === "F") && (e.altKey || e.ctrlKey) && !e.metaKey) {
      const tag = (e.target && e.target.tagName) || "";
      if (tag === "INPUT" || tag === "SELECT" || tag === "TEXTAREA") return;
      e.preventDefault();
      toggleFullscreen();
    }
  });

  document.getElementById("btnResetAll").addEventListener("click", () => {
    Object.assign(state, {
      visao: "turmas",
      disciplina: "geral",
      escola: "",
      turma: "",
      ano: anoPadrao(),
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
    else if (key === "ano") {
      state.ano = anoPadrao();
      state.escola = "";
      state.turma = "";
      state.periodo = periodoPadrao();
    } else state[key] = "";
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

  document.getElementById("btnPrintChart")?.addEventListener("click", () => {
    openPrintPreview().catch((err) => {
      console.error(err);
      alert("Não foi possível gerar a pré-visualização do gráfico.");
    });
  });
  document.getElementById("btnDownloadJpg")?.addEventListener("click", () => {
    downloadPrintJpg().catch((err) => {
      console.error(err);
      alert("Não foi possível gerar o JPG.");
    });
  });
  document.getElementById("btnDownloadPdf")?.addEventListener("click", () => {
    downloadPrintPdf().catch((err) => {
      console.error(err);
      alert("Não foi possível gerar o PDF. Verifique se a biblioteca jsPDF carregou.");
    });
  });
  document.getElementById("btnConfirmPrint")?.addEventListener("click", () => {
    confirmPrintPreview();
  });
  document.querySelectorAll("[data-close-preview]").forEach((el) => {
    el.addEventListener("click", closePrintPreview);
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !document.getElementById("printPreview")?.hidden) {
      closePrintPreview();
    }
  });

  window.addEventListener("resize", () => resizeVisibleCharts());
}

const printPreviewState = {
  dataUrl: null,
  title: "",
  baseName: "adse-grafico",
  filename: "adse-grafico.pdf",
};

function chartPanelTitle() {
  const map = {
    comparativo: "Diagnóstica × Percurso × Saída",
    faixasRanking: "Faixas e Ranking",
    questoes: "Desempenho por questão",
    proficiencia: "Mapa de Proficiência",
  };
  return map[state.chartPanel] || "Gráfico ADSE";
}

function printCaptureTarget() {
  if (state.view === "table") return document.getElementById("viewTable");
  const map = {
    comparativo: "#panelComparativo .chart-card",
    faixasRanking: "#panelFaixasRanking",
    questoes: "#panelQuestoes .chart-card",
    proficiencia: "#panelProficiencia",
  };
  return document.querySelector(map[state.chartPanel] || map.comparativo);
}

function printFilterLabels() {
  const items = [];
  items.push(`Ano: ${state.ano || anoPadrao()}º ano`);
  items.push(`Visão: ${state.visao === "escolas" ? "escolas" : "turmas"}`);
  items.push(`Disciplina: ${DISCIPLINAS[state.disciplina] || state.disciplina}`);
  items.push(`Período: ${PERIODOS[state.periodo] || state.periodo}`);
  if (state.escola) items.push(`Escola: ${shortSchool(state.escola)}`);
  if (state.turma) items.push(`Turma: ${state.turma}`);
  if (state.faixa) {
    items.push(`Faixa: ${faixasAtivas().find((f) => f.key === state.faixa)?.label || state.faixa}`);
  }
  items.push(`Painel: ${chartPanelTitle()}`);
  return items;
}

function renderPrintFilters() {
  const list = document.getElementById("printPreviewFilters");
  if (!list) return;
  list.innerHTML = printFilterLabels()
    .map((label) => `<li>${label}</li>`)
    .join("");
}

function closePrintPreview() {
  const modal = document.getElementById("printPreview");
  if (modal) modal.hidden = true;
}

function waitFrames(n = 2) {
  return new Promise((resolve) => {
    const step = () => {
      if (n <= 0) return resolve();
      n -= 1;
      requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  });
}

/** Expande áreas com scroll para a captura incluir TODO o gráfico. */
async function withFullChartCapture(target, run) {
  const backups = [];
  const save = (el) => {
    if (!el || backups.some((b) => b.el === el)) return;
    backups.push({
      el,
      cssText: el.style.cssText,
    });
  };
  const expand = (el) => {
    if (!el) return;
    save(el);
    el.style.overflow = "visible";
    el.style.overflowX = "visible";
    el.style.overflowY = "visible";
    el.style.maxWidth = "none";
    el.style.maxHeight = "none";
  };

  expand(target);
  target
    .querySelectorAll(
      ".chart-comparativo-scroll, .chart-comparativo-inner, .chart-wrap, .chart-wrap.tall, .table-scroll, .ranking-slot, .layout-bottom, .questoes-layout"
    )
    .forEach(expand);

  const wrap = document.getElementById("chartComparativoWrap");
  const scroller = document.getElementById("chartComparativoScroller");
  if (wrap && target.contains(wrap)) {
    const labels = charts.comparativo?.data?.labels?.length || 0;
    const need = Math.max(wrap.scrollWidth, Math.max(1, labels) * 88, scroller?.clientWidth || 0);
    expand(scroller);
    save(wrap);
    wrap.style.width = `${need}px`;
    wrap.style.minWidth = `${need}px`;
    if (scroller) {
      scroller.style.width = `${need}px`;
      scroller.style.minWidth = `${need}px`;
      scroller.scrollLeft = 0;
    }
  }

  // Rankings verticais longos: libera altura total
  ["chartRankingWrap", "chartRankingEscolasWrap", "chartProficienciaWrap"].forEach((id) => {
    const el = document.getElementById(id);
    if (!el || !target.contains(el)) return;
    expand(el);
    const fullH = Math.max(el.scrollHeight, el.clientHeight);
    el.style.height = `${fullH}px`;
    el.style.minHeight = `${fullH}px`;
  });

  // Card/painel acompanha a largura total expandida
  const fullW = Math.max(target.scrollWidth, wrap?.scrollWidth || 0, scroller?.scrollWidth || 0);
  if (fullW > target.clientWidth) {
    save(target);
    target.style.width = `${fullW}px`;
    target.style.minWidth = `${fullW}px`;
  }

  resizeVisibleCharts();
  await waitFrames(3);

  try {
    return await run(target);
  } finally {
    backups
      .slice()
      .reverse()
      .forEach(({ el, cssText }) => {
        el.style.cssText = cssText;
      });
    syncComparativoWidth();
    resizeVisibleCharts();
  }
}

async function capturePrintCanvas(target) {
  const bg = getComputedStyle(document.documentElement).getPropertyValue("--card").trim() || "#ffffff";
  return withFullChartCapture(target, async (el) => {
    const width = Math.ceil(Math.max(el.scrollWidth, el.offsetWidth));
    const height = Math.ceil(Math.max(el.scrollHeight, el.offsetHeight));
    return html2canvas(el, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: bg,
      logging: false,
      width,
      height,
      windowWidth: width,
      windowHeight: height,
      scrollX: 0,
      scrollY: 0,
      x: 0,
      y: 0,
    });
  });
}

async function openPrintPreview() {
  if (typeof html2canvas !== "function") {
    throw new Error("html2canvas não carregou");
  }
  const btn = document.getElementById("btnPrintChart");
  const target = printCaptureTarget();
  if (!target) throw new Error("Painel do gráfico não encontrado");

  btn?.classList.add("is-busy");
  try {
    const canvas = await capturePrintCanvas(target);
    const dataUrl = canvas.toDataURL("image/png");
    const title = chartPanelTitle();
    const safeName = title
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^\w]+/g, "-")
      .replace(/^-|-$/g, "")
      .toLowerCase();

    printPreviewState.dataUrl = dataUrl;
    printPreviewState.title = title;
    printPreviewState.baseName = `adse-${state.ano || anoPadrao()}ano-${safeName || "grafico"}`;
    printPreviewState.filename = `${printPreviewState.baseName}.pdf`;

    const img = document.getElementById("printPreviewImg");
    const htmlBox = document.getElementById("printPreviewHtml");
    if (img) {
      img.hidden = false;
      img.src = dataUrl;
    }
    if (htmlBox) {
      htmlBox.hidden = true;
      htmlBox.innerHTML = "";
    }

    const sub = document.getElementById("printPreviewSub");
    if (sub) {
      sub.textContent = `${state.ano || anoPadrao()}º ano · ${title} · gráfico completo (todas as turmas/escolas)`;
    }

    renderPrintFilters();
    const modal = document.getElementById("printPreview");
    if (modal) modal.hidden = false;
  } finally {
    btn?.classList.remove("is-busy");
  }
}

async function downloadPrintJpg() {
  if (!printPreviewState.dataUrl) {
    await openPrintPreview();
  }
  if (!printPreviewState.dataUrl) throw new Error("Sem imagem para o JPG");

  const img = new Image();
  img.src = printPreviewState.dataUrl;
  await new Promise((resolve, reject) => {
    img.onload = resolve;
    img.onerror = reject;
  });

  const canvas = document.createElement("canvas");
  canvas.width = img.naturalWidth || img.width;
  canvas.height = img.naturalHeight || img.height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas indisponível");
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(img, 0, 0);

  const jpgUrl = canvas.toDataURL("image/jpeg", 0.92);
  const link = document.createElement("a");
  link.href = jpgUrl;
  link.download = `${printPreviewState.baseName || "adse-grafico"}.jpg`;
  document.body.appendChild(link);
  link.click();
  link.remove();
}

async function downloadPrintPdf() {
  if (!printPreviewState.dataUrl) {
    await openPrintPreview();
  }
  const jsPdfNs = window.jspdf;
  const JsPDF = jsPdfNs?.jsPDF || window.jsPDF;
  if (!JsPDF) throw new Error("jsPDF não carregou");
  if (!printPreviewState.dataUrl) throw new Error("Sem imagem para o PDF");

  const img = new Image();
  img.src = printPreviewState.dataUrl;
  await new Promise((resolve, reject) => {
    img.onload = resolve;
    img.onerror = reject;
  });

  const margin = 10;
  const headerH = 16;
  // Página sob medida para caber o gráfico inteiro sem cortar
  const pxToMm = 0.264583;
  const contentW = img.width * pxToMm;
  const contentH = img.height * pxToMm;
  const pageW = Math.max(297, contentW + margin * 2);
  const pageH = Math.max(210, contentH + margin * 2 + headerH);
  const orientation = pageW >= pageH ? "landscape" : "portrait";
  const pdf = new JsPDF({ orientation, unit: "mm", format: [pageW, pageH] });

  const maxW = pageW - margin * 2;
  const maxH = pageH - margin * 2 - headerH;
  const ratio = Math.min(maxW / img.width, maxH / img.height);
  const drawW = img.width * ratio;
  const drawH = img.height * ratio;
  const x = (pageW - drawW) / 2;
  const y = margin + headerH;

  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(12);
  pdf.text(`ADSE · ${state.ano || anoPadrao()}º Ano · São José da Tapera`, margin, margin + 5);
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(10);
  pdf.text(printPreviewState.title || "Gráfico", margin, margin + 11);
  pdf.addImage(printPreviewState.dataUrl, "PNG", x, y, drawW, drawH);
  pdf.save(printPreviewState.filename || "adse-grafico.pdf");
}

function confirmPrintPreview() {
  if (!printPreviewState.dataUrl) {
    alert("Gere a pré-visualização antes de imprimir.");
    return;
  }

  // Impressão via iframe oculto (evita bloqueio de pop-up do navegador)
  let frame = document.getElementById("printFrame");
  if (!frame) {
    frame = document.createElement("iframe");
    frame.id = "printFrame";
    frame.title = "Impressão do gráfico";
    frame.setAttribute("aria-hidden", "true");
    frame.style.cssText =
      "position:fixed;right:0;bottom:0;width:0;height:0;border:0;opacity:0;pointer-events:none;";
    document.body.appendChild(frame);
  }

  const filters = printFilterLabels().map((f) => `<li>${f}</li>`).join("");
  const title = printPreviewState.title || "Gráfico";
  const doc = frame.contentDocument || frame.contentWindow?.document;
  if (!doc) {
    alert("Não foi possível preparar a impressão.");
    return;
  }

  doc.open();
  doc.write(`<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8"><title>${title}</title>
    <style>
      @page { size: auto; margin: 10mm; }
      html, body { margin: 0; padding: 0; background: #fff; color: #141418; }
      body { font-family: "DM Sans", Segoe UI, sans-serif; padding: 12px; }
      h1 { font-size: 16px; margin: 0 0 8px; }
      ul { padding-left: 18px; margin: 0 0 12px; color: #555; font-size: 12px; }
      img { max-width: 100%; height: auto; display: block; }
      @media print {
        body { padding: 0; }
        h1 { font-size: 13px; }
      }
    </style></head><body>
    <h1>ADSE · ${state.ano || anoPadrao()}º Ano — ${title}</h1>
    <ul>${filters}</ul>
    <img id="printImg" src="${printPreviewState.dataUrl}" alt="${title}" />
    </body></html>`);
  doc.close();

  const triggerPrint = () => {
    try {
      frame.contentWindow?.focus();
      frame.contentWindow?.print();
    } catch (err) {
      console.error(err);
      alert("Não foi possível abrir a impressão.");
    }
  };

  const img = doc.getElementById("printImg");
  if (img && !img.complete) {
    img.onload = () => setTimeout(triggerPrint, 50);
    img.onerror = triggerPrint;
  } else {
    setTimeout(triggerPrint, 50);
  }
}

function init() {
  state.ano = anoPadrao();
  state.periodo = periodoPadrao();
  document.getElementById("todayLabel").textContent = new Date().toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  syncAnoTitle();
  fillSelects();
  bindEvents();
  render();
}

init();
