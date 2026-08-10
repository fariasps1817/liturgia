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
  texto: `Santo, Santo, Santo, Senhor, Deus do universo!
O céu e a terra proclamam a vossa glória.
Hosana nas alturas!
Bendito o que vem em nome do Senhor!
Hosana nas alturas!`,
  nota: 'Quase sempre cantado. A assembleia fica de pé até o fim do Santo e depois se ajoelha.',
};

/**
 * As três fórmulas do Mistério da Fé. O sacerdote escolhe uma; a assembleia
 * responde a que ele puxar — por isso as três aparecem juntas na tela.
 */
export const MISTERIO_DA_FE: Secao[] = [
  {
    id: 'misterio-convite',
    titulo: 'Mistério da Fé',
    quem: 'presidente',
    incipit: 'Eis o mistério da fé!',
    nota: 'Logo após a elevação do cálice.',
  },
  {
    id: 'misterio-r1',
    titulo: 'Mistério da Fé — 1ª fórmula',
    quem: 'assembleia',
    texto: `Anunciamos, Senhor, a vossa morte
e proclamamos a vossa ressurreição.
Vinde, Senhor Jesus!`,
  },
  {
    id: 'misterio-r2',
    titulo: 'Mistério da Fé — 2ª fórmula',
    quem: 'assembleia',
    texto: `Todas as vezes que comemos deste pão
e bebemos deste cálice,
anunciamos, Senhor, a vossa morte,
enquanto esperamos a vossa vinda!`,
  },
  {
    id: 'misterio-r3',
    titulo: 'Mistério da Fé — 3ª fórmula',
    quem: 'assembleia',
    texto: `Salvador do mundo, salvai-nos,
vós que nos libertastes pela cruz e ressurreição.`,
  },
];

export const DOXOLOGIA: Secao[] = [
  {
    id: 'doxologia',
    titulo: 'Doxologia final',
    quem: 'presidente',
    incipit: 'Por Cristo, com Cristo, em Cristo…',
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
