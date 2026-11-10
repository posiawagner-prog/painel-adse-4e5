/**
 * Faixas = coluna APRENDIZADO sobre PROFICIÊNCIA (BA).
 * LP:  =SE(BA<=149;"INSUFICIENTE";SE(BA<200;"BÁSICO";SE(BA<250;"PROFICIENTE";"AVANÇADO")))
 * MAT: =SE(BA<=174;"INSUFICIENTE";SE(BA<=224;"BÁSICO";SE(BA<=274;"PROFICIENTE";"AVANÇADO")))  (escala 350)
 *
 * Escala SAEB 4º/5º ano — faixas de nível × aprendizado (planilhas ADSE).
 * LP (325): Insuf. ≤149 · Básico 150–199 · Profic. 200–249 · Avanç. ≥250
 * MAT (350): Insuf. ≤174 · Básico 175–224 · Profic. 225–274 · Avanç. ≥275
 *
 * Mesma cor para todos os níveis da mesma faixa de aprendizado.
 */
const COR_APREND = {
  insuficiente: "#FF3B30",
  basico: "#FF9F0A",
  proficiente: "#3D7BFF",
  avancado: "#30D158",
};

const FAIXAS_LP = [
  { key: "insuficiente", label: "Insuficiente (≤ 149)", color: COR_APREND.insuficiente, aprendizado: "INSUFICIENTE" },
  { key: "basico", label: "Básico (150–199)", color: COR_APREND.basico, aprendizado: "BÁSICO" },
  { key: "proficiente", label: "Proficiente (200–249)", color: COR_APREND.proficiente, aprendizado: "PROFICIENTE" },
  { key: "avancado", label: "Avançado (≥ 250)", color: COR_APREND.avancado, aprendizado: "AVANÇADO" },
];

const FAIXAS_MAT = [
  { key: "insuficiente", label: "Insuficiente (≤ 174)", color: COR_APREND.insuficiente, aprendizado: "INSUFICIENTE" },
  { key: "basico", label: "Básico (175–224)", color: COR_APREND.basico, aprendizado: "BÁSICO" },
  { key: "proficiente", label: "Proficiente (225–274)", color: COR_APREND.proficiente, aprendizado: "PROFICIENTE" },
  { key: "avancado", label: "Avançado (≥ 275)", color: COR_APREND.avancado, aprendizado: "AVANÇADO" },
];

const PROF_SCALE_LP = [
  {
    band: "insuficiente",
    title: "Insuficiente",
    levels: [
      { nivel: 0, color: COR_APREND.insuficiente, range: "0 – 124 pts" },
      { nivel: 1, color: COR_APREND.insuficiente, range: "125 – 149 pts" },
    ],
  },
  {
    band: "basico",
    title: "Básico",
    levels: [
      { nivel: 2, color: COR_APREND.basico, range: "150 – 174 pts" },
      { nivel: 3, color: COR_APREND.basico, range: "175 – 199 pts" },
    ],
  },
  {
    band: "proficiente",
    title: "Proficiente",
    levels: [
      { nivel: 4, color: COR_APREND.proficiente, range: "200 – 224 pts" },
      { nivel: 5, color: COR_APREND.proficiente, range: "225 – 249 pts" },
    ],
  },
  {
    band: "avancado",
    title: "Avançado",
    levels: [
      { nivel: 6, color: COR_APREND.avancado, range: "250 – 274 pts" },
      { nivel: 7, color: COR_APREND.avancado, range: "275 – 299 pts" },
      { nivel: 8, color: COR_APREND.avancado, range: "300 – 324 pts" },
      { nivel: 9, color: COR_APREND.avancado, range: "≥ 325 pts" },
    ],
  },
];

const PROF_SCALE_MAT = [
  {
    band: "insuficiente",
    title: "Insuficiente",
    levels: [
      { nivel: 0, color: COR_APREND.insuficiente, range: "0 – 124 pts" },
      { nivel: 1, color: COR_APREND.insuficiente, range: "125 – 149 pts" },
      { nivel: 2, color: COR_APREND.insuficiente, range: "150 – 174 pts" },
    ],
  },
  {
    band: "basico",
    title: "Básico",
    levels: [
      { nivel: 3, color: COR_APREND.basico, range: "175 – 199 pts" },
      { nivel: 4, color: COR_APREND.basico, range: "200 – 224 pts" },
    ],
  },
  {
    band: "proficiente",
    title: "Proficiente",
    levels: [
      { nivel: 5, color: COR_APREND.proficiente, range: "225 – 249 pts" },
      { nivel: 6, color: COR_APREND.proficiente, range: "250 – 274 pts" },
    ],
  },
  {
    band: "avancado",
    title: "Avançado",
    levels: [
      { nivel: 7, color: COR_APREND.avancado, range: "275 – 299 pts" },
      { nivel: 8, color: COR_APREND.avancado, range: "300 – 324 pts" },
      { nivel: 9, color: COR_APREND.avancado, range: "325 – 349 pts" },
      { nivel: 10, color: COR_APREND.avancado, range: "≥ 350 pts" },
    ],
  },
];

/** Compat: default = LP (visão geral / português). Preferir faixasAtivas(). */
const FAIXAS = FAIXAS_LP;

const APRENDIZADO = [
  { key: "INSUFICIENTE", label: "Insuficiente", color: COR_APREND.insuficiente, short: "Insuf." },
  { key: "BÁSICO", label: "Básico", color: COR_APREND.basico, short: "Básico" },
  { key: "PROFICIENTE", label: "Proficiente", color: COR_APREND.proficiente, short: "Profic." },
  { key: "AVANÇADO", label: "Avançado", color: COR_APREND.avancado, short: "Avanç." },
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

/** Lista de níveis (a cor efetiva vem de aprendizadoFromNivel / niveisAtivos). */
const NIVEIS_PROF = [
  { nivel: 0 },
  { nivel: 1 },
  { nivel: 2 },
  { nivel: 3 },
  { nivel: 4 },
  { nivel: 5 },
  { nivel: 6 },
  { nivel: 7 },
  { nivel: 8 },
  { nivel: 9 },
  { nivel: 10 },
];

/** Disciplina usada nas faixas/níveis SAEB (geral e LP → português). */
function disciplinaProficiencia() {
  return state.disciplina === "mat" ? "mat" : "lp";
}

function faixasAtivas() {
  return disciplinaProficiencia() === "mat" ? FAIXAS_MAT : FAIXAS_LP;
}

function niveisAtivos() {
  // MAT e geral (média de níveis) podem chegar a 10; LP sozinho vai até 9.
  const max = state.disciplina === "lp" ? 9 : 10;
  return NIVEIS_PROF.filter((n) => n.nivel <= max).map((n) => ({
    nivel: n.nivel,
    color: aprendizadoFromNivel(n.nivel).color,
  }));
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

/** Cortes % SAEB (2 casas) — base da legenda de questões e da escala combinada. */
function saebPctCutoffs(disciplina) {
  const round2 = (n) => Math.round(n * 100) / 100;
  const scale = disciplina === "mat" ? 350 : 325;
  const toPct = (score) => (score / scale) * 100;
  const maxPctExclusive = (scoreLimite) => {
    const exact = toPct(scoreLimite);
    const cand = round2(exact);
    return (cand / 100) * scale < scoreLimite ? cand : round2(cand - 0.01);
  };
  const maxPctInclusive = (scoreLimite) => round2(toPct(scoreLimite));

  if (disciplina === "mat") {
    return {
      fimInsuf: maxPctInclusive(174),
      fimBasico: maxPctInclusive(224),
      fimProf: maxPctInclusive(274),
    };
  }
  if (disciplina === "geral") {
    const lp = saebPctCutoffs("lp");
    const mat = saebPctCutoffs("mat");
    return {
      fimInsuf: round2((lp.fimInsuf + mat.fimInsuf) / 2),
      fimBasico: round2((lp.fimBasico + mat.fimBasico) / 2),
      fimProf: round2((lp.fimProf + mat.fimProf) / 2),
    };
  }
  return {
    fimInsuf: maxPctInclusive(149),
    fimBasico: maxPctExclusive(200),
    fimProf: maxPctExclusive(250),
  };
}

/** Classifica um percentual pelas faixas SAEB (LP, MAT ou média LP+MAT). */
function faixaFromPct(pct, disciplina = "lp") {
  const faixas = disciplina === "mat" ? FAIXAS_MAT : FAIXAS_LP;
  const value = Number(pct);
  if (!Number.isFinite(value)) return faixas[0];
  const { fimInsuf, fimBasico, fimProf } = saebPctCutoffs(disciplina);
  if (value <= fimInsuf) return faixas[0];
  if (value <= fimBasico) return faixas[1];
  if (value <= fimProf) return faixas[2];
  return faixas[3];
}

/** Proficiência da turma como % da escala SAEB (325 LP / 350 MAT). */
function proficienciaPctTurma(row, disciplina) {
  const block = proficienciaBlock(row, disciplina);
  if (block?.proficiencia == null) return null;
  const scale = disciplina === "mat" ? 350 : 325;
  const score = Number(block.proficiencia);
  if (!Number.isFinite(score)) return null;
  return (score / scale) * 100;
}

/** Média das % de proficiência LP e MAT (filtro Português + Matemática). */
function proficienciaPctMediaGeral(row) {
  const lp = proficienciaPctTurma(row, "lp");
  const mat = proficienciaPctTurma(row, "mat");
  if (lp != null && mat != null) return (lp + mat) / 2;
  if (lp != null) return lp;
  if (mat != null) return mat;
  if (row?.mediaGeral != null && Number.isFinite(Number(row.mediaGeral))) return Number(row.mediaGeral);
  return null;
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

  // Português + Matemática: média das % de proficiência LP e MAT
  if (state.disciplina === "geral") {
    if (state.visao === "escolas" && !row?.turma) {
      const turmas = turmasForEscolaNome(row.escola);
      const pcts = turmas.map((t) => proficienciaPctMediaGeral(t)).filter((v) => v != null);
      if (pcts.length) {
        const media = pcts.reduce((acc, v) => acc + v, 0) / pcts.length;
        return faixaFromPct(media, "geral");
      }
    }
    const pct = proficienciaPctMediaGeral(row);
    if (pct != null) return faixaFromPct(pct, "geral");
    return faixas[0];
  }

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
  let discLabel = "Língua Portuguesa";
  let escala = "≤149 / 150–199 / 200–249 / ≥250";
  if (state.disciplina === "mat") {
    discLabel = "Matemática";
    escala = "≤174 / 175–224 / 225–274 / ≥275";
  } else if (state.disciplina === "geral") {
    discLabel = "média LP + MAT";
    const c = saebPctCutoffs("geral");
    escala = `até ${fmtPctLegenda(c.fimInsuf)} / ${fmtPctLegenda(c.fimBasico)} / ${fmtPctLegenda(c.fimProf)}`;
  }
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

  const corHint =
    state.disciplina === "geral"
      ? "cores = média LP + MAT"
      : "cores = faixa de aprendizado";
  document.getElementById("chartRankingEscolasTitle").textContent = "Ranking por escola";
  document.getElementById("chartRankingEscolasSub").textContent =
    `${DISCIPLINAS[state.disciplina]} · ${sorted.length} escolas · turmas agrupadas · ${corHint} · clique para filtrar`;

  const ctx = document.getElementById("chartRankingEscolas");
  const labels = sorted.map((row) => labelEscolaRow(row));
  const medias = sorted.map((row) => mediaEscolaRow(row));
  const ranks = competitionRanks(medias);
  const faixasRows = sorted.map((row) => faixaFromRow(row));
  renderRankingFaixasLegend("rankingEscolasLegend", faixasRows);
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
          // Mesma lógica da visão por turma: cor = faixa (em geral = média LP+MAT)
          backgroundColor: faixasRows.map((f) => f.color),
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
              const faixa = faixasRows[ctx.dataIndex];
              const qtd = qtdTurmasEscola(row.escola);
              const turmas = qtd > 1 ? `${qtd} turmas · média ponderada` : "Turma única";
              return faixa ? [`Faixa: ${faixa.aprendizado}`, turmas] : turmas;
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
  const corHint =
    state.disciplina === "geral"
      ? "cores = média LP + MAT"
      : "cores = faixa de aprendizado";
  document.getElementById("chartRankingSub").textContent =
    `${state.ano || anoPadrao()}º ano · ${DISCIPLINAS[state.disciplina]} · 1º ao ${sorted.length}º · ${corHint} · clique para filtrar`;

  const ctx = document.getElementById("chartRanking");
  const labels = labelRows(sorted);
  const medias = sorted.map((r) => mediaRow(r));
  const ranks = competitionRanks(medias);
  const faixasRows = sorted.map((r) => faixaFromRow(r));
  renderRankingFaixasLegend("rankingTurmaLegend", faixasRows);
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
          // Cor = faixa de aprendizado (proficiência), não o valor da média %
          backgroundColor: faixasRows.map((f) => f.color),
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
              const faixa = faixasRows[ctx.dataIndex];
              return faixa ? `Faixa: ${faixa.aprendizado}` : "";
            },
          },
        },
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
  if (disciplina === "geral") return faixaFromPct(pct, "geral").color;
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
 * Geral: média aritmética dos cortes % de LP e MAT
 */
function buildQuestoesLegendRanges(disciplina) {
  const cores = {
    insuficiente: COR_APREND.insuficiente,
    basico: COR_APREND.basico,
    proficiente: COR_APREND.proficiente,
    avancado: COR_APREND.avancado,
  };
  const round2 = (n) => Math.round(n * 100) / 100;
  const { fimInsuf, fimBasico, fimProf } = saebPctCutoffs(disciplina);

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
  geral: buildQuestoesLegendRanges("geral"),
};

/** Chave da escala de faixas conforme o filtro de disciplina. */
function disciplinaFaixaKey() {
  if (state.disciplina === "mat") return "mat";
  if (state.disciplina === "geral") return "geral";
  return "lp";
}

/**
 * Preenche a legenda estilo FAIXAS (rótulo · faixa % · contagem).
 * Escalas: LP, MAT ou Combinada (média dos cortes LP+MAT).
 */
function fillFaixasLegend(legendEl, countsByKey) {
  if (!legendEl) return;
  const disciplina = disciplinaFaixaKey();
  const items = QUESTOES_LEGEND[disciplina] || QUESTOES_LEGEND.lp;
  const ariaDisc =
    disciplina === "mat" ? "Matemática" : disciplina === "geral" ? "média Português + Matemática" : "Português";
  legendEl.setAttribute("aria-label", `Faixas de desempenho em ${ariaDisc}`);
  legendEl.innerHTML = items
    .map((item) => {
      const count = countsByKey?.[item.key] ?? 0;
      return `
    <li class="questoes-legend-item" style="--faixa-color:${item.color}" title="${item.label}: ${item.range}">
      <span class="questoes-legend-dot" aria-hidden="true"></span>
      <span class="questoes-legend-label">${item.label}</span>
      <span class="questoes-legend-range">${item.range}</span>
      <b class="questoes-legend-count">${count}</b>
    </li>`;
    })
    .join("");
}

function countFaixasKeys(faixasRows) {
  const items = QUESTOES_LEGEND[disciplinaFaixaKey()] || QUESTOES_LEGEND.lp;
  const counts = Object.fromEntries(items.map((item) => [item.key, 0]));
  (faixasRows || []).forEach((f) => {
    const key = f?.key;
    if (key != null && counts[key] != null) counts[key] += 1;
  });
  return counts;
}

function renderRankingFaixasLegend(legendId, faixasRows) {
  fillFaixasLegend(document.getElementById(legendId), countFaixasKeys(faixasRows));
}

function renderQuestoesLegend(data) {
  const layout = document.getElementById("questoesLayout");
  const panel = document.getElementById("questoesLegendPanel");
  const legend = document.getElementById("questoesLegend");
  if (!layout || !panel || !legend) return;

  const disciplina = disciplinaFaixaKey();
  const items = QUESTOES_LEGEND[disciplina];
  const show = Boolean(items);
  layout.classList.toggle("has-legend", show);
  panel.hidden = !show;
  if (!show) {
    legend.innerHTML = "";
    return;
  }

  const counts = Object.fromEntries(items.map((item) => [item.key, 0]));
  (data || []).forEach((d) => {
    if (d.v == null) return;
    let key;
    if (disciplina === "geral") {
      key = faixaFromPct(d.v, "geral").key;
    } else {
      const scale = disciplina === "mat" ? 350 : 325;
      key = faixaFromProficiencia((Number(d.v) / 100) * scale, disciplina).key;
    }
    if (counts[key] != null) counts[key] += 1;
  });

  fillFaixasLegend(legend, counts);
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
    // Português + Matemática: escala única = média dos cortes % LP e MAT
    if (state.disciplina === "geral") {
      return corQuestaoPorFaixa(d.v, "geral");
    }
    const group = d.group || (state.disciplina === "mat" ? "mat" : "lp");
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

function profRowKey(row) {
  return `${row?.escola || ""}|${row?.turma || ""}`;
}

/**
 * Português + Matemática: média LP+MAT por turma.
 * - % acertos = média simples
 * - índice de proficiência = média das % nas escalas (LP/325 e MAT/350)
 * - aprendizado = faixas combinadas (mesma legenda do ranking/questões)
 * - nível = média arredondada dos níveis LP e MAT
 * - proficiencia (barra) = índice remapeado à escala 325 para manter a ordem visual
 */
function mergeProficienciaGeral(lpRows, matRows) {
  const map = new Map();
  (lpRows || []).forEach((row) => {
    map.set(profRowKey(row), { lp: row, mat: null });
  });
  (matRows || []).forEach((row) => {
    const key = profRowKey(row);
    const cur = map.get(key) || { lp: null, mat: null };
    cur.mat = row;
    if (!cur.lp) {
      cur.lp = null;
    }
    map.set(key, cur);
  });

  return [...map.values()]
    .map(({ lp, mat }) => {
      const base = lp || mat;
      if (!base) return null;

      const lpPct = lp?.proficiencia != null ? (Number(lp.proficiencia) / 325) * 100 : null;
      const matPct = mat?.proficiencia != null ? (Number(mat.proficiencia) / 350) * 100 : null;
      let pctProf = null;
      if (lpPct != null && matPct != null) pctProf = (lpPct + matPct) / 2;
      else pctProf = lpPct ?? matPct;
      if (pctProf == null) return null;

      const faixa = faixaFromPct(pctProf, "geral");
      const pctLp = lp?.pctAcertos != null ? Number(lp.pctAcertos) : null;
      const pctMat = mat?.pctAcertos != null ? Number(mat.pctAcertos) : null;
      let pctAcertos = null;
      if (pctLp != null && pctMat != null) pctAcertos = roundHalfUp((pctLp + pctMat) / 2);
      else pctAcertos = pctLp ?? pctMat;

      const nLp = lp?.nivel != null ? Number(lp.nivel) : null;
      const nMat = mat?.nivel != null ? Number(mat.nivel) : null;
      let nivel = null;
      if (nLp != null && nMat != null) nivel = roundHalfUp((nLp + nMat) / 2, 0);
      else nivel = nLp ?? nMat;

      return {
        disciplina: "geral",
        escola: base.escola,
        turma: base.turma,
        chave: base.chave || `${base.escola} - ${base.turma}`,
        previstos: roundHalfUp(((lp?.previstos || 0) + (mat?.previstos || 0)) / (lp && mat ? 2 : 1), 0),
        avaliados: roundHalfUp(((lp?.avaliados || 0) + (mat?.avaliados || 0)) / (lp && mat ? 2 : 1), 0),
        pctAcertos,
        aprendizado: faixa.aprendizado,
        // Barra = índice médio % (LP/325 e MAT/350) — eixo 0–100 no mapa geral
        proficiencia: roundHalfUp(pctProf, 2),
        indicePct: roundHalfUp(pctProf, 2),
        nivel,
        nivelLabel: nivel != null ? `NÍVEL ${nivel}` : "",
        origem: { lp, mat },
      };
    })
    .filter(Boolean);
}

function proficienciaRows() {
  const { lp, mat } = proficienciaSourcePeriodo();
  const rows =
    state.disciplina === "mat"
      ? [...mat]
      : state.disciplina === "geral"
        ? mergeProficienciaGeral(lp, mat)
        : [...lp];
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

function profScaleAtiva() {
  if (state.disciplina === "mat") return PROF_SCALE_MAT;
  return PROF_SCALE_LP;
}

/** Arredonda como o Excel (0,5 para cima) — exibe a proficiência igual à planilha. */
function roundHalfUp(value, digits = 2) {
  const n = Number(value);
  if (!Number.isFinite(n)) return n;
  const factor = 10 ** digits;
  const scaled = n * factor;
  const rounded = (scaled >= 0 ? Math.floor(scaled + 0.5) : Math.ceil(scaled - 0.5)) / factor;
  return rounded;
}

function fmtProfScore(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return "—";
  // Parte inteira arredondada como na planilha (ex.: 289,4 → 289; 283,8 → 284).
  return String(roundHalfUp(n, 0));
}

function renderProfScaleLegend() {
  const el = document.getElementById("profScaleLegend");
  if (!el) return;
  const ano = state.ano || anoPadrao();

  // Português + Matemática: legenda das faixas combinadas (%), sem misturar escalas 325/350.
  if (state.disciplina === "geral") {
    const items = QUESTOES_LEGEND.geral || buildQuestoesLegendRanges("geral");
    el.hidden = false;
    el.dataset.disciplina = "geral";
    el.setAttribute("aria-label", `Escala de proficiência — ${ano}º ano · média LP + MAT`);
    el.innerHTML =
      `<div class="prof-scale-caption"><strong>${ano}º ano · Português + Matemática</strong>` +
      `<span>média das % nas escalas SAEB · nível = média LP+MAT</span></div>` +
      `<div class="prof-scale-bands">` +
      items
        .map((item) => {
          const color = item.color;
          return (
            `<div class="prof-scale-group" data-band="${item.key}">` +
            `<span class="prof-scale-title">${item.label}</span>` +
            `<ul class="prof-scale-levels">` +
            `<li><span class="niveis-pill" style="--nivel-color:${color}">${item.label}</span>` +
            `<span>${item.range}</span></li>` +
            `</ul></div>`
          );
        })
        .join("") +
      `</div>`;
    return;
  }

  const isMat = state.disciplina === "mat";
  const disc = isMat ? "Matemática" : "Língua Portuguesa";
  const escala = isMat ? "escala 350 · níveis 0–10" : "escala 325 · níveis 0–9";
  const bands = profScaleAtiva();
  el.hidden = false;
  el.dataset.disciplina = isMat ? "mat" : "lp";
  el.setAttribute("aria-label", `Escala de proficiência — ${ano}º ano · ${disc}`);
  const groupsHtml = bands
    .map((group) => {
      const color = COR_APREND[group.band] || group.levels[0]?.color || "#9a9aa3";
      return (
        `<div class="prof-scale-group" data-band="${group.band}">` +
        `<span class="prof-scale-title">${group.title}</span>` +
        `<ul class="prof-scale-levels">` +
        group.levels
          .map(
            (lv) =>
              `<li><span class="niveis-pill" style="--nivel-color:${color}">NÍVEL ${lv.nivel}</span>` +
              `<span>${lv.range}</span></li>`
          )
          .join("") +
        `</ul></div>`
      );
    })
    .join("");
  el.innerHTML =
    `<div class="prof-scale-caption"><strong>${ano}º ano · ${disc}</strong><span>${escala}</span></div>` +
    `<div class="prof-scale-bands">${groupsHtml}</div>`;
}

const PROF_INK = "#000000";

const proficienciaBarLabelsPlugin = {
  id: "proficienciaBarLabels",
  afterDatasetsDraw(chart) {
    const meta = chart.getDatasetMeta(0);
    if (!meta?.data?.length) return;
    const { ctx } = chart;
    const dataset = chart.data.datasets[0];
    ctx.save();
    meta.data.forEach((bar, index) => {
      const value = dataset.data[index];
      const nivel = dataset.niveis?.[index];
      const pct = dataset.pcts?.[index];
      const start = Math.min(bar.x, bar.base);
      const end = Math.max(bar.x, bar.base);
      const width = end - start;
      const isGeral = state.disciplina === "geral";
      const profText = isGeral ? fmtPct(value) : fmtProfScore(value);
      const pctText = pct != null ? fmtPct(pct) : "";

      ctx.textBaseline = "middle";
      ctx.fillStyle = PROF_INK;

      // Nível à esquerda dentro da barra
      if (nivel && width > 70) {
        ctx.font = "700 11px 'DM Sans', system-ui, sans-serif";
        ctx.textAlign = "left";
        ctx.fillText(nivel, start + 10, bar.y);
      }

      // Pontuação / índice à direita dentro da barra
      if (width > 48) {
        ctx.font = "700 12px 'DM Sans', system-ui, sans-serif";
        ctx.textAlign = "right";
        ctx.fillText(profText, end - 8, bar.y);
      }

      // % de acertos fora da barra
      if (pctText) {
        ctx.font = "700 12px 'DM Sans', system-ui, sans-serif";
        ctx.textAlign = "left";
        ctx.fillText(pctText, end + 8, bar.y);
      }
    });
    ctx.restore();
  },
};

function aprendizadoFromNivel(nivel) {
  const n = Number(nivel);
  if (state.disciplina === "mat") {
    // MAT: ≤174 → N0–2; 175–224 → N3–4; 225–274 → N5–6; ≥275 → N7+
    if (n <= 2) return APRENDIZADO[0];
    if (n <= 4) return APRENDIZADO[1];
    if (n <= 6) return APRENDIZADO[2];
    return APRENDIZADO[3];
  }
  // LP e geral (nível médio LP+MAT): ≤149 → N0–1; 150–199 → N2–3; 200–249 → N4–5; ≥250 → N6+
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
      '<td class="niveis-td-nivel"><span class="niveis-pill" style="--nivel-color:' + apr.color + '">NÍVEL ' + n.nivel + "</span></td>" +
      '<td class="niveis-td-turmas"><strong>' + count + "</strong></td>" +
      '<td class="niveis-td-aprend"><span class="niveis-aprend-wrap"><span class="niveis-dot" style="background:' + apr.color + '"></span>' + apr.label + "</span></td>" +
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
  const scaleLegend = document.getElementById("profScaleLegend");
  const sorted = [...rows]
    .filter((r) => r.proficiencia != null)
    .sort((a, b) => (b.proficiencia || 0) - (a.proficiencia || 0));

  // Legenda SAEB acompanha o filtro (LP ≠ MAT), mesmo sem barras.
  renderProfScaleLegend();

  if (!sorted.length) {
    if (wrap) wrap.hidden = true;
    if (canvas) canvas.hidden = true;
    if (empty) {
      empty.hidden = false;
      const periodoLabel = PERIODOS[state.periodo] || state.periodo;
      empty.textContent =
        state.disciplina === "mat"
          ? `Sem dados de proficiência de Matemática para ${periodoLabel} com o filtro atual.`
          : state.disciplina === "geral"
            ? `Sem dados de proficiência (média LP + MAT) para ${periodoLabel} com o filtro atual.`
            : `Sem dados de proficiência para ${periodoLabel} com o filtro atual.`;
    }
    return;
  }
  if (wrap) wrap.hidden = false;
  if (canvas) canvas.hidden = false;
  if (empty) empty.hidden = true;

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
          ...(state.disciplina === "geral"
            ? { max: 100, ticks: { color: PROF_INK, font: { size: 11, weight: "600" }, callback: (v) => `${v}%` } }
            : {
                suggestedMax: Math.ceil(Math.max(...sorted.map((r) => r.proficiencia || 0)) / 20) * 20 + 20,
                ticks: { color: PROF_INK, font: { size: 11, weight: "600" } },
              }),
          grid: { color: "rgba(128,128,140,.12)" },
        },
        y: {
          ticks: { color: PROF_INK, font: { size: 11, weight: "600" } },
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
              if (state.disciplina === "geral") {
                return `índice ${fmtPct(ctx.raw)} · ${aprend}${pct}`;
              }
              return fmtProfScore(ctx.raw) + " pts · " + aprend + pct;
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

  const disc =
    state.disciplina === "mat"
      ? "Matemática"
      : state.disciplina === "geral"
        ? "Português + Matemática"
        : "Língua Portuguesa";
  const escala =
    state.disciplina === "mat"
      ? "escala 350 · níveis 0–10"
      : state.disciplina === "geral"
        ? "média LP + MAT · faixas combinadas"
        : "escala 325 · níveis 0–9";

  if (kicker) {
    kicker.textContent =
      `${state.ano || anoPadrao()}º ano · ` + (PERIODOS[source.periodo] || source.periodo) + " · " + disc;
  }
  if (sub) {
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
  if (barsSub) {
    barsSub.textContent =
      state.disciplina === "mat"
        ? "Matemática · pontuação · nível · % acertos · clique para filtrar"
        : state.disciplina === "geral"
          ? "Média LP + MAT · índice · nível médio · % acertos · clique para filtrar"
          : "Língua Portuguesa · pontuação · nível · % acertos · clique para filtrar";
  }
  // Atualiza a legenda SAEB sempre que o filtro de disciplina/ano muda.
  renderProfScaleLegend();
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

function syncTableDisciplineCols() {
  const table = document.getElementById("rankingTable");
  if (table) table.dataset.disciplina = state.disciplina || "geral";
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

  syncTableDisciplineCols();
  document.querySelectorAll("#rankingTable th[data-sort]").forEach((th) => {
    th.classList.toggle("col-active", false);
  });
  const activeSort =
    state.disciplina === "lp" ? "mediaLp" : state.disciplina === "mat" ? "mediaMat" : "mediaGeral";
  document.querySelector(`#rankingTable th[data-sort="${activeSort}"]`)?.classList.add("col-active");

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
        <td class="num col-disc-lp ${state.disciplina === "lp" ? "col-active" : ""}">${fmtPct(r.mediaLp)}</td>
        <td class="num col-disc-mat ${state.disciplina === "mat" ? "col-active" : ""}">${fmtPct(r.mediaMat)}</td>
        <td class="num col-disc-geral ${state.disciplina === "geral" ? "col-active" : ""}">${fmtPct(r.mediaGeral)}</td>
      </tr>`;
    })
    .join("");

  renderStatusRow(rows);
}

function exportCsv(rows) {
  const base = ["Ranking", "Escola", "Turma", "Previstos", "Avaliados", "Participacao"];
  const mediaCols =
    state.disciplina === "lp"
      ? ["Portugues"]
      : state.disciplina === "mat"
        ? ["Matematica"]
        : ["Portugues", "Matematica", "MediaGeral"];
  const lines = [[...base, ...mediaCols].join(";")];
  sortedTableRows(rows).forEach((r) => {
    const metrics = rowMetrics(r);
    const participacao = metrics.previstos ? (metrics.avaliados / metrics.previstos) * 100 : 0;
    const vals = [
      rankingField(r),
      r.escola,
      state.visao === "escolas" ? "" : r.turma,
      metrics.previstos,
      metrics.avaliados,
      participacao.toFixed(2),
    ];
    if (state.disciplina === "lp") vals.push(r.mediaLp.toFixed(2));
    else if (state.disciplina === "mat") vals.push(r.mediaMat.toFixed(2));
    else vals.push(r.mediaLp.toFixed(2), r.mediaMat.toFixed(2), r.mediaGeral.toFixed(2));
    lines.push(vals.join(";"));
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
      console.error("Pré-visualização:", err);
      alert(
        "Não foi possível gerar a pré-visualização do gráfico." +
          (err?.message ? `\n\nDetalhe: ${err.message}` : "")
      );
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

function hexToRgba(hex, alpha = 1) {
  const raw = String(hex || "").trim().replace("#", "");
  if (raw.length !== 6 && raw.length !== 3) return `rgba(0,0,0,${alpha})`;
  const full =
    raw.length === 3
      ? raw
          .split("")
          .map((c) => c + c)
          .join("")
      : raw;
  const r = parseInt(full.slice(0, 2), 16);
  const g = parseInt(full.slice(2, 4), 16);
  const b = parseInt(full.slice(4, 6), 16);
  if (![r, g, b].every(Number.isFinite)) return `rgba(0,0,0,${alpha})`;
  return `rgba(${r},${g},${b},${alpha})`;
}

/** html2canvas 1.4 não entende color-mix()/color() — remove e troca por rgba sólido. */
function sanitizeCloneForHtml2Canvas(clonedDoc) {
  const sheets = [...clonedDoc.querySelectorAll('style, link[rel="stylesheet"]')];
  sheets.forEach((node) => {
    if (node.tagName === "STYLE" && /color-mix\s*\(/i.test(node.textContent || "")) {
      node.textContent = (node.textContent || "").replace(/color-mix\([^)]*\)/gi, "transparent");
    }
  });

  try {
    [...clonedDoc.styleSheets].forEach((sheet) => {
      try {
        const rules = sheet.cssRules;
        if (!rules) return;
        for (let i = rules.length - 1; i >= 0; i -= 1) {
          const text = rules[i]?.cssText || "";
          if (/color-mix\s*\(/i.test(text) || /lab\s*\(/i.test(text) || /oklch\s*\(/i.test(text)) {
            sheet.deleteRule(i);
          }
        }
      } catch {
        /* stylesheet cross-origin / file:// */
      }
    });
  } catch {
    /* ignore */
  }

  const isDark = clonedDoc.documentElement.getAttribute("data-theme") === "dark";
  const panelBg = isDark ? "#2a2a30" : "#f0f0f2";
  const panelBorder = isDark ? "#3a3a42" : "#d8d8de";
  const itemBg = isDark ? "#1c1c22" : "#ffffff";
  const softBg = isDark ? "#24242a" : "#f4f4f6";

  const fixVar = (el, varName, alphaBg = 0.28, alphaBorder = 0.55) => {
    const color =
      el.style.getPropertyValue(varName).trim() ||
      getComputedStyle(el).getPropertyValue(varName).trim();
    if (!color || color.startsWith("color")) return;
    el.style.setProperty("background", hexToRgba(color, alphaBg), "important");
    el.style.setProperty("border-color", hexToRgba(color, alphaBorder), "important");
    el.style.setProperty("box-shadow", "none", "important");
  };

  clonedDoc.querySelectorAll(".niveis-pill").forEach((el) => fixVar(el, "--nivel-color", 0.28, 0.55));
  clonedDoc.querySelectorAll(".status-card").forEach((el) => fixVar(el, "--status-color", 0.16, 0.28));
  clonedDoc.querySelectorAll(".questoes-legend-item, [style*='--faixa-color']").forEach((el) =>
    fixVar(el, "--faixa-color", 0.14, 0.28)
  );
  clonedDoc.querySelectorAll(".prof-kpi, [style*='--prof-color']").forEach((el) =>
    fixVar(el, "--prof-color", 0.18, 0.4)
  );
  clonedDoc.querySelectorAll(".tag-ranking, [style*='--tag']").forEach((el) =>
    fixVar(el, "--tag", 0.18, 0.4)
  );

  // Painéis/legendas com color-mix no CSS externo (file:// não deixa apagar a regra)
  clonedDoc.querySelectorAll(".questoes-legend-panel, .ranking-faixas-legend").forEach((el) => {
    el.style.setProperty("background", panelBg, "important");
    el.style.setProperty("border-color", panelBorder, "important");
  });
  clonedDoc.querySelectorAll(".questoes-legend-item").forEach((el) => {
    const color = el.style.getPropertyValue("--faixa-color").trim();
    el.style.setProperty("background", itemBg, "important");
    if (color) el.style.setProperty("border-color", color, "important");
    el.style.setProperty("box-shadow", "none", "important");
  });
  clonedDoc.querySelectorAll(".questoes-legend-dot").forEach((el) => {
    el.style.setProperty("box-shadow", "none", "important");
  });
  clonedDoc.querySelectorAll(".chart-tab, .prof-scale-legend").forEach((el) => {
    el.style.setProperty("background", softBg, "important");
    el.style.setProperty("border-color", panelBorder, "important");
  });

  // Última passagem: qualquer computed style ainda com color-mix/lab/oklch
  clonedDoc.body.querySelectorAll("*").forEach((el) => {
    try {
      const cs = getComputedStyle(el);
      ["backgroundColor", "borderColor", "color", "boxShadow"].forEach((prop) => {
        const val = String(cs[prop] || "");
        if (!/color-mix|lab\(|oklch\(|color\(/i.test(val)) return;
        if (prop === "backgroundColor") el.style.setProperty("background", itemBg, "important");
        else if (prop === "borderColor") el.style.setProperty("border-color", panelBorder, "important");
        else if (prop === "boxShadow") el.style.setProperty("box-shadow", "none", "important");
        else el.style.setProperty("color", isDark ? "#f2f2f4" : "#141418", "important");
      });
    } catch {
      /* ignore elemento problemático no clone */
    }
  });

  const safe = clonedDoc.createElement("style");
  safe.setAttribute("data-print-safe", "1");
  safe.textContent = `
    .niveis-pill, .status-card, .questoes-legend-item, .prof-kpi, .tag-ranking,
    .chart-tab, .prof-scale-legend, .prof-nivel, .legend li,
    .questoes-legend-panel, .ranking-faixas-legend {
      backdrop-filter: none !important;
      -webkit-backdrop-filter: none !important;
    }
    .questoes-legend-panel, .ranking-faixas-legend {
      background: ${panelBg} !important;
      border-color: ${panelBorder} !important;
    }
    .questoes-legend-item {
      background: ${itemBg} !important;
      box-shadow: none !important;
    }
    .questoes-legend-dot { box-shadow: none !important; }
    .niveis-table tbody tr:hover td { background: transparent !important; }
    .prof-scale-group[data-band="insuficiente"] .niveis-pill { background: rgba(255,59,48,.28) !important; border-color: rgba(255,59,48,.55) !important; }
    .prof-scale-group[data-band="basico"] .niveis-pill { background: rgba(255,159,10,.28) !important; border-color: rgba(255,159,10,.55) !important; }
    .prof-scale-group[data-band="proficiente"] .niveis-pill { background: rgba(61,123,255,.28) !important; border-color: rgba(61,123,255,.55) !important; }
    .prof-scale-group[data-band="avancado"] .niveis-pill { background: rgba(48,209,88,.28) !important; border-color: rgba(48,209,88,.55) !important; }
  `;
  clonedDoc.head.appendChild(safe);
}

async function capturePrintCanvas(target) {
  const rawBg = getComputedStyle(document.documentElement).getPropertyValue("--card").trim() || "#ffffff";
  const bg = /color-mix|lab\(|oklch\(|color\(/i.test(rawBg) ? "#ffffff" : rawBg || "#ffffff";
  return withFullChartCapture(target, async (el) => {
    const width = Math.max(1, Math.ceil(Math.max(el.scrollWidth, el.offsetWidth, 320)));
    const height = Math.max(1, Math.ceil(Math.max(el.scrollHeight, el.offsetHeight, 240)));
    // Evita estourar o limite de pixels do canvas do navegador
    const maxSide = Math.max(width, height);
    const scale = Math.max(0.6, Math.min(2, 3600 / maxSide));
    const opts = {
      scale,
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
      onclone: (clonedDoc) => sanitizeCloneForHtml2Canvas(clonedDoc),
    };
    try {
      return await html2canvas(el, opts);
    } catch (err) {
      console.warn("html2canvas falhou na 1ª tentativa:", err);
      // Retry mais conservador (sem width/height fixos + escala menor)
      return await html2canvas(el, {
        ...opts,
        width: undefined,
        height: undefined,
        windowWidth: undefined,
        windowHeight: undefined,
        scale: 1,
        allowTaint: true,
        foreignObjectRendering: false,
      });
    }
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
