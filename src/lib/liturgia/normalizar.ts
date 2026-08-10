/**
 * Camada anticorrupção entre a API de liturgia e o resto do app.
 *
 * Só este arquivo conhece os nomes de campo de terceiros. Todo o resto fala
 * `LiturgiaDoDia`. Se a fonte mudar de schema (ou se trocarmos de fonte), a
 * mudança começa e termina aqui.
 *
 * O estilo é deliberadamente tolerante: aceita nomes de campo em variações
 * conhecidas, aceita objeto onde esperava lista, e ignora o que não reconhece.
 * Uma API de liturgia fora do ar em domingo de manhã é um problema real; um
 * campo com nome diferente do previsto não pode virar tela em branco.
 */

import { diaLiturgico } from './calendario';
import { porExtenso } from './datas';
import { ORDEM_LEITURAS, ROTULO_LEITURA, type Leitura, type LiturgiaDoDia, type TipoLeitura } from './tipos';

type Json = Record<string, unknown>;

function eObjeto(v: unknown): v is Json {
  return typeof v === 'object' && v !== null && !Array.isArray(v);
}

/** Primeiro valor de texto não vazio entre as chaves dadas. */
function texto(obj: unknown, ...chaves: string[]): string | undefined {
  if (!eObjeto(obj)) return undefined;
  for (const chave of chaves) {
    const v = obj[chave];
    if (typeof v === 'string' && v.trim()) return limpar(v);
    if (typeof v === 'number') return String(v);
  }
  return undefined;
}

/** Aceita lista, objeto solto ou nada, e sempre devolve lista. */
function comoLista(v: unknown): unknown[] {
  if (Array.isArray(v)) return v;
  if (eObjeto(v)) return [v];
  return [];
}

/** Procura uma chave em profundidade, tolerando acentos e maiúsculas. */
function achar(obj: unknown, ...nomes: string[]): unknown {
  if (!eObjeto(obj)) return undefined;
  const alvo = nomes.map(normalizarChave);
  for (const [chave, valor] of Object.entries(obj)) {
    if (alvo.includes(normalizarChave(chave))) return valor;
  }
  return undefined;
}

function normalizarChave(s: string): string {
  return s
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9]/g, '')
    .toLowerCase();
}

/**
 * As fontes costumam vir com HTML solto, entidades e espaços duplos.
 * O texto é proclamado em voz alta — precisa sair limpo.
 */
function limpar(s: string): string {
  return s
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\r\n/g, '\n')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .split('\n')
    .map((linha) => linha.trim())
    .join('\n')
    .trim();
}

/** Abreviações dos livros bíblicos, para o cabeçalho da tela de leitura. */
const ABREVIACOES: [RegExp, string][] = [
  [/^g[êe]nesis|^g[êe]n/i, 'Gn'],
  [/^[êe]xodo|^[êe]x/i, 'Ex'],
  [/^lev[íi]tico|^lev/i, 'Lv'],
  [/^n[úu]meros|^num/i, 'Nm'],
  [/^deuteron[ôo]mio|^dt/i, 'Dt'],
  [/^josu[ée]/i, 'Js'],
  [/^ju[íi]zes/i, 'Jz'],
  [/^rute/i, 'Rt'],
  [/^1.?\s*samuel/i, '1Sm'],
  [/^2.?\s*samuel/i, '2Sm'],
  [/^1.?\s*reis/i, '1Rs'],
  [/^2.?\s*reis/i, '2Rs'],
  [/^1.?\s*cr[ôo]nicas/i, '1Cr'],
  [/^2.?\s*cr[ôo]nicas/i, '2Cr'],
  [/^esdras/i, 'Esd'],
  [/^neemias/i, 'Ne'],
  [/^tobias/i, 'Tb'],
  [/^judite/i, 'Jt'],
  [/^ester/i, 'Est'],
  [/^1.?\s*macabeus/i, '1Mac'],
  [/^2.?\s*macabeus/i, '2Mac'],
  [/^j[óo]/i, 'Jó'],
  [/^salmos?/i, 'Sl'],
  [/^prov[ée]rbios/i, 'Pr'],
  [/^eclesiastes|^coelet/i, 'Ecl'],
  [/^c[âa]ntico dos c[âa]nticos|^cantico/i, 'Ct'],
  [/^sabedoria/i, 'Sb'],
  [/^eclesi[áa]stico|^sir[áa]cida/i, 'Eclo'],
  [/^isa[íi]as/i, 'Is'],
  [/^jeremias/i, 'Jr'],
  [/^lamenta[çc][õo]es/i, 'Lm'],
  [/^baruc/i, 'Br'],
  [/^ezequiel/i, 'Ez'],
  [/^daniel/i, 'Dn'],
  [/^oseias|^os[ée]ias/i, 'Os'],
  [/^joel/i, 'Jl'],
  [/^am[óo]s/i, 'Am'],
  [/^abdias/i, 'Ab'],
  [/^jonas/i, 'Jn'],
  [/^miqueias|^miqu[ée]ias/i, 'Mq'],
  [/^naum/i, 'Na'],
  [/^habacuc/i, 'Hab'],
  [/^sofonias/i, 'Sf'],
  [/^ageu/i, 'Ag'],
  [/^zacarias/i, 'Zc'],
  [/^malaquias/i, 'Ml'],
  [/^mateus/i, 'Mt'],
  [/^marcos/i, 'Mc'],
  [/^lucas/i, 'Lc'],
  [/^jo[ãa]o(?!.*carta)/i, 'Jo'],
  [/^atos(\s+dos\s+ap[óo]stolos)?/i, 'At'],
  [/^romanos/i, 'Rm'],
  [/^1.?\s*cor[íi]ntios/i, '1Cor'],
  [/^2.?\s*cor[íi]ntios/i, '2Cor'],
  [/^g[áa]latas/i, 'Gl'],
  [/^ef[ée]sios/i, 'Ef'],
  [/^filipenses/i, 'Fl'],
  [/^colossenses/i, 'Cl'],
  [/^1.?\s*tessalonicenses/i, '1Ts'],
  [/^2.?\s*tessalonicenses/i, '2Ts'],
  [/^1.?\s*tim[óo]teo/i, '1Tm'],
  [/^2.?\s*tim[óo]teo/i, '2Tm'],
  [/^tito/i, 'Tt'],
  [/^filemon|^filêmon/i, 'Fm'],
  [/^hebreus/i, 'Hb'],
  [/^tiago/i, 'Tg'],
  [/^1.?\s*pedro/i, '1Pd'],
  [/^2.?\s*pedro/i, '2Pd'],
  [/^1.?\s*jo[ãa]o/i, '1Jo'],
  [/^2.?\s*jo[ãa]o/i, '2Jo'],
  [/^3.?\s*jo[ãa]o/i, '3Jo'],
  [/^judas/i, 'Jd'],
  [/^apocalipse/i, 'Ap'],
];

/**
 * "Livro do Profeta Isaías 55,10-11" → "Is 55,10-11".
 * Se não reconhecer o livro, devolve a referência como veio — melhor uma
 * referência longa do que uma errada.
 */
export function abreviarReferencia(referencia: string): string {
  const limpa = referencia
    .replace(/^(leitura|proclama[çc][ãa]o)\s+d[oae]s?\s+/i, '')
    .replace(/^(livro|carta|primeira carta|segunda carta|profecia|evangelho)\s+d[oae]s?\s+/i, '')
    .replace(/^(santo|s[ãa]o)\s+/i, '')
    .replace(/^profeta\s+/i, '')
    .replace(/^apóstolo\s+/i, '')
    .trim();

  for (const [padrao, sigla] of ABREVIACOES) {
    if (padrao.test(limpa)) {
      const capitulos = limpa.replace(padrao, '').replace(/^[\s,;:]+/, '').trim();
      return capitulos ? `${sigla} ${capitulos}` : sigla;
    }
  }
  return referencia.trim();
}

const CHAVES_POR_TIPO: Record<TipoLeitura, string[]> = {
  primeira: ['primeiraLeitura', 'primeira_leitura', 'primeira', 'leitura1', 'first_reading'],
  salmo: ['salmo', 'salmoResponsorial', 'salmo_responsorial', 'psalm'],
  segunda: ['segundaLeitura', 'segunda_leitura', 'segunda', 'leitura2', 'second_reading'],
  evangelho: ['evangelho', 'gospel'],
};

function montarLeitura(tipo: TipoLeitura, bruto: unknown): Leitura | null {
  if (typeof bruto === 'string') {
    const corpo = limpar(bruto);
    if (!corpo) return null;
    return { tipo, titulo: ROTULO_LEITURA[tipo], referencia: '', refResumida: '', texto: corpo };
  }
  if (!eObjeto(bruto)) return null;

  const corpo = texto(bruto, 'texto', 'text', 'conteudo', 'body');
  if (!corpo) return null;

  const referencia = texto(bruto, 'referencia', 'reference', 'ref', 'citacao') ?? '';
  const introducao = texto(bruto, 'titulo', 'title', 'introducao', 'cabecalho');
  const refrao = texto(bruto, 'refrao', 'refrão', 'response', 'antifona');

  return {
    tipo,
    titulo: ROTULO_LEITURA[tipo],
    referencia,
    refResumida: referencia ? abreviarReferencia(referencia) : '',
    introducao,
    texto: corpo,
    refrao: tipo === 'salmo' ? refrao : undefined,
  };
}

/** Extrai as leituras de qualquer um dos formatos que a fonte já usou. */
function extrairLeituras(raiz: Json): Leitura[] {
  const bloco = achar(raiz, 'leituras', 'readings') ?? raiz;
  const leituras: Leitura[] = [];

  for (const tipo of ORDEM_LEITURAS) {
    const bruto = achar(bloco, ...CHAVES_POR_TIPO[tipo]);
    for (const item of comoLista(bruto)) {
      const leitura = montarLeitura(tipo, item);
      // Só a primeira opção de cada tipo: quando o lecionário oferece forma
      // longa e breve, a fonte manda as duas e a equipe usa a primeira.
      if (leitura) {
        leituras.push(leitura);
        break;
      }
    }
  }

  // Formato alternativo: lista única com um campo discriminando o tipo.
  if (leituras.length === 0 && Array.isArray(bloco)) {
    for (const item of bloco) {
      const marca = normalizarChave(texto(item, 'tipo', 'type', 'nome') ?? '');
      const tipo = ORDEM_LEITURAS.find((t) => marca.includes(t));
      const leitura = tipo ? montarLeitura(tipo, item) : null;
      if (leitura) leituras.push(leitura);
    }
  }

  return leituras;
}

const CORES: Record<string, LiturgiaDoDia['cor']> = {
  verde: 'verde',
  branco: 'branco',
  vermelho: 'vermelho',
  roxo: 'roxo',
  violeta: 'roxo',
  rosa: 'rosa',
  dourado: 'branco',
  preto: 'roxo',
};

/**
 * Constrói a liturgia do dia a partir da resposta da fonte, completando com o
 * calendário calculado localmente o que a fonte não trouxer.
 */
export function normalizar(data: string, bruto: unknown): LiturgiaDoDia {
  const local = diaLiturgico(data);
  const base: LiturgiaDoDia = {
    data,
    dataExtenso: porExtenso(data),
    celebracao: local.celebracao,
    cor: local.cor,
    tempo: local.tempo,
    grau: local.grau,
    anoLiturgico: local.anoLiturgico,
    cicloFerial: local.cicloFerial,
    leituras: [],
    semTextos: true,
  };

  if (!eObjeto(bruto)) return base;

  const leituras = extrairLeituras(bruto);
  const corBruta = texto(bruto, 'cor', 'color', 'corLiturgica');
  const corDaFonte = corBruta ? CORES[normalizarChave(corBruta)] : undefined;
  const celebracaoDaFonte = texto(bruto, 'liturgia', 'celebracao', 'celebration', 'titulo', 'nome');

  return {
    ...base,
    // A fonte tem o santo do dia e as memórias, que o cálculo local não cobre.
    // O cálculo local tem precedência nas solenidades, onde ele é confiável e
    // a fonte às vezes traz só o nome do tempo.
    celebracao:
      local.grau === 'solenidade' ? local.celebracao : (celebracaoDaFonte ?? local.celebracao),
    cor: corDaFonte ?? local.cor,
    leituras,
    semTextos: leituras.length === 0,
  };
}

/** Só para o script de sondagem: expõe a limpeza de texto. */
export { limpar as limparTexto };
