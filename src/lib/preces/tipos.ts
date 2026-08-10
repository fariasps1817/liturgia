/** As quatro séries de intenções fixadas pela IGMR 70, nesta ordem. */
export type SerieDeIntencao = 'igreja' | 'mundo' | 'sofredores' | 'comunidade';

export const ROTULO_DA_SERIE: Record<SerieDeIntencao, string> = {
  igreja: 'Pelas necessidades da Igreja',
  mundo: 'Pelos governantes e pela salvação do mundo',
  sofredores: 'Pelos que sofrem sob qualquer dificuldade',
  comunidade: 'Pela comunidade local',
};

export const ORDEM_DAS_SERIES: SerieDeIntencao[] = ['igreja', 'mundo', 'sofredores', 'comunidade'];

export type Intencao = {
  serie: SerieDeIntencao;
  texto: string;
};

export type ConteudoDasPreces = {
  /** A aclamação que a assembleia repete depois de cada intenção. */
  resposta: string;
  /** Monição do sacerdote que abre a oração universal. */
  introducao: string;
  intencoes: Intencao[];
  /** Oração conclusiva do sacerdote. */
  conclusao: string;
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
