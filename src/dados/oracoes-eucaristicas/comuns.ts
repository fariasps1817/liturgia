import type { Secao } from './tipos';

/**
 * As partes que a assembleia diz são as mesmas em todas as Orações
 * Eucarísticas: o diálogo do prefácio, o Santo, a aclamação do Mistério da Fé e
 * o Amém final. O que muda de uma oração para outra é a fala do sacerdote.
 *
 * Para o comentarista, portanto, a diferença prática entre a OE II e a OE III
 * não está no que ele diz — está em **quando** ele diz. Daí este arquivo: as
 * respostas ficam num lugar só, e cada oração monta a própria sequência de
 * deixas ao redor delas.
 */

export const DIALOGO: Secao[] = [
  {
    id: 'dialogo-saudacao',
    titulo: 'Diálogo do Prefácio',
    quem: 'presidente',
    incipit: 'O Senhor esteja convosco.',
    nota: 'O sacerdote abre os braços.',
  },
  {
    id: 'dialogo-saudacao-r',
    titulo: 'Diálogo do Prefácio',
    quem: 'assembleia',
    texto: 'Ele está no meio de nós.',
  },
  {
    id: 'dialogo-coracoes',
    titulo: 'Diálogo do Prefácio',
    quem: 'presidente',
    incipit: 'Corações ao alto.',
  },
  {
    id: 'dialogo-coracoes-r',
    titulo: 'Diálogo do Prefácio',
    quem: 'assembleia',
    texto: 'O nosso coração está em Deus.',
  },
  {
    id: 'dialogo-gracas',
    titulo: 'Diálogo do Prefácio',
    quem: 'presidente',
    incipit: 'Demos graças ao Senhor, nosso Deus.',
  },
  {
    id: 'dialogo-gracas-r',
    titulo: 'Diálogo do Prefácio',
    quem: 'assembleia',
    texto: 'É nosso dever e nossa salvação.',
  },
];

export const SANTO: Secao = {
  id: 'santo',
  titulo: 'Santo',
  quem: 'assembleia',
  texto: `Santo, Santo, Santo,
Senhor, Deus do universo.
O céu e a terra proclamam a vossa glória.
Hosana nas alturas!
Bendito o que vem em nome do Senhor!
Hosana nas alturas!`,
  nota: 'Quase sempre cantado. A assembleia fica de pé até o fim do Santo e depois se ajoelha.',
};

/**
 * As três fórmulas do Mistério da Fé.
 *
 * A resposta não é escolha da assembleia: ela decorre do chamado que o
 * sacerdote puxa. Por isso o chamado vai no **título** de cada resposta — é
 * assim que se procura na hora, logo após a elevação do cálice: ouve-se o
 * chamado e busca-se o cartão que o traz.
 *
 * Não há cartão separado para a fala do sacerdote. Já houve, um para cada
 * chamado, e virou seis cartões com os títulos repetidos dois a dois — longo
 * de rolar e confuso justamente no instante em que se tem menos tempo.
 *
 * O chamado antigo, "Eis o mistério da fé", era o da tradução anterior e não
 * está mais no Missal: a 3ª edição típica em português traz estes três.
 */
export const MISTERIO_DA_FE: Secao[] = [
  {
    id: 'misterio-1',
    titulo: 'Chamado: Mistério da fé!',
    quem: 'assembleia',
    texto: `Anunciamos, Senhor, a vossa morte
e proclamamos a vossa ressurreição.
Vinde, Senhor Jesus!`,
    nota: 'Logo após a elevação do cálice. O sacerdote escolhe um dos três chamados; procure abaixo o que ele disser.',
  },
  {
    id: 'misterio-2',
    titulo: 'Chamado: Mistério da fé e do amor!',
    quem: 'assembleia',
    texto: `Todas as vezes que comemos deste pão
e bebemos deste cálice,
anunciamos, Senhor, a vossa morte,
enquanto esperamos a vossa vinda!`,
  },
  {
    id: 'misterio-3',
    titulo: 'Chamado: Mistério da fé para a salvação do mundo!',
    quem: 'assembleia',
    texto: `Salvador do mundo, salvai-nos,
vós que nos libertastes pela cruz e ressurreição.`,
  },
];

/**
 * Aclamação da assembleia no meio da oração.
 *
 * No Brasil as Orações Eucarísticas são entrecortadas por aclamações do povo —
 * de quatro a oito, conforme a oração. Não são enfeite: são as falas que este
 * app existe para pôr em letra grande. O id muda de oração para oração porque
 * a mesma aclamação aparece em pontos diferentes de cada uma.
 */
export function aclamacao(id: string, texto: string, titulo = 'Aclamação da assembleia'): Secao {
  return { id, titulo, quem: 'assembleia', texto };
}

export const DOXOLOGIA: Secao[] = [
  {
    id: 'doxologia',
    titulo: 'Doxologia final',
    quem: 'presidente',
    incipit: 'Por Cristo, com Cristo, e em Cristo…',
    nota: 'O sacerdote eleva a patena com a hóstia e o cálice.',
  },
  {
    id: 'amem',
    titulo: 'Amém',
    quem: 'assembleia',
    texto: 'Amém!',
    nota: 'É a resposta mais importante da Missa — o Amém que ratifica toda a Oração Eucarística. Costuma ser cantado e prolongado.',
  },
];
