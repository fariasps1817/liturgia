/**
 * Orações Eucarísticas — estrutura de dados.
 *
 * # Por que só o incipit da fala do sacerdote
 *
 * Os direitos do Missal Romano em português são da CNBB, e reproduzir o texto
 * presidencial inteiro exige autorização por escrito. O que o comentarista
 * precisa, porém, não é o texto do padre: é saber **onde ele está** e **o que a
 * assembleia responde a seguir**. Por isso cada seção do sacerdote traz o
 * `incipit` — as primeiras palavras, que servem de deixa — e as respostas do
 * povo vão na íntegra, que é a parte que a equipe realmente diz.
 *
 * Quando a autorização chegar, basta preencher `texto` nas seções do presidente
 * e ligar MOSTRAR_TEXTO_PRESIDENCIAL: a interface não muda.
 */

export type QuemFala = 'presidente' | 'assembleia' | 'concelebrantes' | 'diacono';

export const ROTULO_DE_QUEM: Record<QuemFala, string> = {
  presidente: 'Celebrante',
  assembleia: 'Assembleia',
  concelebrantes: 'Concelebrantes',
  diacono: 'Diácono',
};

export type Secao = {
  id: string;
  /** Nome da parte: "Prefácio", "Santo", "Narrativa da Instituição"… */
  titulo: string;
  quem: QuemFala;
  /** Texto integral. Nas falas do presidente, fica vazio até haver autorização. */
  texto?: string;
  /** Primeiras palavras da fala do sacerdote, como deixa. */
  incipit?: string;
  /** Observação para a equipe: gesto, postura, quando é cantado. */
  nota?: string;
  /**
   * Marca seções cuja redação exata não pôde ser conferida com o Missal
   * impresso. A tela avisa em vez de fingir certeza.
   */
  conferir?: boolean;
};

export type OracaoEucaristica = {
  id: string;
  numero: string;
  nome: string;
  /** Quando se usa esta oração, em uma linha. */
  quando: string;
  /** Aviso exibido no topo, quando há algo a conferir. */
  avisoDeRevisao?: string;
  secoes: Secao[];
};

/** Verdadeiro nas seções que a assembleia diz — as que precisam de corpo grande. */
export function ehResposta(secao: Secao): boolean {
  return secao.quem === 'assembleia';
}
