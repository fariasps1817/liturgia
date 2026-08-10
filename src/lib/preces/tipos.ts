/** As quatro séries de intenções fixadas pela IGMR 70, nesta ordem. */
export type SerieDeIntencao = 'igreja' | 'mundo' | 'sofredores' | 'comunidade';

export const ORDEM_DAS_SERIES: SerieDeIntencao[] = ['igreja', 'mundo', 'sofredores', 'comunidade'];

export type Intencao = {
  /**
   * A série da IGMR 70 a que a intenção pertence.
   *
   * Não aparece na tela — a equipe lê as intenções corridas, numeradas. Continua
   * aqui porque é o que garante que vieram as quatro, uma de cada, na ordem:
   * é sobre este campo que `seriesEstaoCorretas` decide se aceita a geração.
   */
  serie: SerieDeIntencao;
  texto: string;
};

/**
 * O app cobre só o que o leitor proclama: a aclamação da assembleia e as quatro
 * intenções. A monição de abertura e a oração conclusiva são falas do sacerdote,
 * que ele lê do Missal — gerá-las seria escrever para ninguém.
 */
export type ConteudoDasPreces = {
  /** A aclamação que a assembleia repete depois de cada intenção. */
  resposta: string;
  /**
   * O chamado com que as quatro intenções terminam — "rezemos ao Senhor" e
   * semelhantes. É a deixa que avisa a assembleia de que chegou a hora de
   * responder; sem ele, ninguém sabe quando entrar.
   */
  chamado: string;
  intencoes: Intencao[];
};

export type Preces = ConteudoDasPreces & {
  data: string;
  comunidade: string;
  intencaoLocal?: string;
  criadoEm: string;
  modelo: string;
};

export const RESPOSTA_PADRAO = 'Senhor, escutai a nossa prece';

/** Comunidade usada quando o app ainda não distingue mais de uma. */
export const COMUNIDADE_PADRAO = 'principal';
