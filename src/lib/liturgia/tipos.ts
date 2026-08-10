import type { CorLiturgica, GrauCelebracao, TempoLiturgico } from './calendario';

export type TipoLeitura = 'primeira' | 'salmo' | 'segunda' | 'evangelho';

export const ROTULO_LEITURA: Record<TipoLeitura, string> = {
  primeira: 'Primeira Leitura',
  salmo: 'Salmo Responsorial',
  segunda: 'Segunda Leitura',
  evangelho: 'Evangelho',
};

/** Ordem em que as leituras aparecem na missa. */
export const ORDEM_LEITURAS: TipoLeitura[] = ['primeira', 'salmo', 'segunda', 'evangelho'];

export type Leitura = {
  tipo: TipoLeitura;
  /** "Primeira Leitura" */
  titulo: string;
  /** Referência como a fonte entrega: "Isaías 55,10-11" */
  referencia: string;
  /** Forma abreviada para o cabeçalho: "Is 55,10-11" */
  refResumida: string;
  /** Linha de abertura do lecionário: "Leitura do Livro do Profeta Isaías" */
  introducao?: string;
  texto: string;
  /** Só no salmo responsorial. */
  refrao?: string;
};

export type LiturgiaDoDia = {
  data: string;
  dataExtenso: string;
  celebracao: string;
  cor: CorLiturgica;
  tempo: TempoLiturgico;
  grau: GrauCelebracao;
  anoLiturgico: 'A' | 'B' | 'C';
  cicloFerial: 'I' | 'II';
  leituras: Leitura[];
  /** Verdadeiro quando os textos não puderam ser obtidos e só há o calendário. */
  semTextos: boolean;
  fonte?: { nome: string; url: string };
};

export type RespostaLiturgia =
  | { ok: true; liturgia: LiturgiaDoDia }
  | { ok: false; erro: string; liturgia: LiturgiaDoDia };
