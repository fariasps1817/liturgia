import { DIALOGO, DOXOLOGIA, MISTERIO_DA_FE, SANTO } from './comuns';
import type { OracaoEucaristica } from './tipos';

/**
 * Oração Eucarística II — a mais usada no Brasil.
 * Breve, com prefácio próprio, adequada aos dias de semana.
 */
const OE_II: OracaoEucaristica = {
  id: 'oe-ii',
  numero: 'II',
  nome: 'Oração Eucarística II',
  quando: 'A mais usada. Breve — dias de semana e celebrações simples.',
  secoes: [
    ...DIALOGO,
    {
      id: 'ii-prefacio',
      titulo: 'Prefácio',
      quem: 'presidente',
      incipit: 'Na verdade, é justo e necessário, é nosso dever e salvação…',
      nota: 'A OE II tem prefácio próprio, mas admite outros prefácios do tempo.',
    },
    SANTO,
    {
      id: 'ii-pos-sanctus',
      titulo: 'Pós-Sanctus',
      quem: 'presidente',
      incipit: 'Na verdade, ó Pai, vós sois santo e fonte de toda santidade…',
      nota: 'A assembleia já está ajoelhada.',
    },
    {
      id: 'ii-epiclese',
      titulo: 'Epiclese',
      quem: 'presidente',
      incipit: 'Santificai estes dons, derramando sobre eles o vosso Espírito…',
      nota: 'O sacerdote estende as mãos sobre as oferendas.',
    },
    {
      id: 'ii-instituicao',
      titulo: 'Narrativa da Instituição',
      quem: 'presidente',
      incipit: 'Estando para ser entregue e abraçando livremente a paixão…',
      nota: 'Consagração do pão e do vinho, com as duas elevações.',
    },
    ...MISTERIO_DA_FE,
    {
      id: 'ii-anamnese',
      titulo: 'Anamnese e Oferenda',
      quem: 'presidente',
      incipit: 'Celebrando, pois, a memória da morte e ressurreição do vosso Filho…',
    },
    {
      id: 'ii-epiclese-comunhao',
      titulo: 'Epiclese da comunhão',
      quem: 'presidente',
      incipit: 'E nós vos suplicamos que, participando do Corpo e Sangue de Cristo…',
    },
    {
      id: 'ii-intercessoes',
      titulo: 'Intercessões',
      quem: 'presidente',
      incipit: 'Lembrai-vos, ó Pai, da vossa Igreja que se faz presente…',
      nota: 'Aqui entram o Papa, o bispo diocesano e os falecidos.',
    },
    ...DOXOLOGIA,
  ],
};

/**
 * Oração Eucarística III — a dos domingos e festas.
 * Mais desenvolvida, sem prefácio próprio (usa o do tempo ou da festa).
 */
const OE_III: OracaoEucaristica = {
  id: 'oe-iii',
  numero: 'III',
  nome: 'Oração Eucarística III',
  quando: 'Domingos e festas. Usa o prefácio do tempo ou da celebração.',
  secoes: [
    ...DIALOGO,
    {
      id: 'iii-prefacio',
      titulo: 'Prefácio',
      quem: 'presidente',
      incipit: 'Prefácio próprio do tempo litúrgico ou da festa.',
      nota: 'A OE III não tem prefácio próprio: o celebrante escolhe conforme o dia.',
    },
    SANTO,
    {
      id: 'iii-pos-sanctus',
      titulo: 'Pós-Sanctus',
      quem: 'presidente',
      incipit: 'Na verdade, ó Pai, vós sois santo, e com razão vos louvam todas as vossas criaturas…',
    },
    {
      id: 'iii-epiclese',
      titulo: 'Epiclese',
      quem: 'presidente',
      incipit: 'Por isso, nós vos suplicamos: santificai pelo mesmo Espírito estes dons…',
      nota: 'O sacerdote estende as mãos sobre as oferendas.',
    },
    {
      id: 'iii-instituicao',
      titulo: 'Narrativa da Instituição',
      quem: 'presidente',
      incipit: 'Na noite em que ia ser entregue, ele tomou o pão…',
      nota: 'Consagração do pão e do vinho, com as duas elevações.',
    },
    ...MISTERIO_DA_FE,
    {
      id: 'iii-anamnese',
      titulo: 'Anamnese e Oferenda',
      quem: 'presidente',
      incipit: 'Celebrando agora, ó Pai, a memória do vosso Filho…',
    },
    {
      id: 'iii-epiclese-comunhao',
      titulo: 'Epiclese da comunhão',
      quem: 'presidente',
      incipit: 'Olhai com bondade a oferenda da vossa Igreja…',
    },
    {
      id: 'iii-intercessoes',
      titulo: 'Intercessões',
      quem: 'presidente',
      incipit: 'Que ele faça de nós uma oferenda perfeita…',
      nota: 'Aqui entram o Papa, o bispo, os presentes e os falecidos.',
    },
    ...DOXOLOGIA,
  ],
};

/**
 * Oração Eucarística V — própria do Brasil.
 *
 * ⚠️ Diferente das outras, esta tem **aclamações próprias da assembleia** ao
 * longo das intercessões, que variam conforme a edição. Não consegui conferir a
 * redação exata delas com um Missal impresso, então elas vão marcadas para
 * revisão em vez de entrar como se fossem certas. As respostas comuns (diálogo,
 * Santo, Mistério da Fé e Amém) são as mesmas de sempre e estão corretas.
 */
const OE_V: OracaoEucaristica = {
  id: 'oe-v',
  numero: 'V',
  nome: 'Oração Eucarística V',
  quando: 'Própria do Brasil. Tem aclamações da assembleia ao longo das intercessões.',
  avisoDeRevisao:
    'As aclamações próprias desta oração ainda precisam ser conferidas com o Missal impresso da paróquia — estão marcadas abaixo. As respostas comuns (diálogo, Santo, Mistério da Fé e Amém) estão corretas.',
  secoes: [
    ...DIALOGO,
    {
      id: 'v-prefacio',
      titulo: 'Prefácio',
      quem: 'presidente',
      incipit: 'Prefácio próprio da Oração Eucarística V.',
    },
    SANTO,
    {
      id: 'v-pos-sanctus',
      titulo: 'Pós-Sanctus',
      quem: 'presidente',
      incipit: 'Na verdade, vós sois santo e digno de louvor, ó Deus…',
    },
    {
      id: 'v-epiclese',
      titulo: 'Epiclese',
      quem: 'presidente',
      incipit: 'Sendo, pois, vós mesmos o autor da santidade…',
      nota: 'O sacerdote estende as mãos sobre as oferendas.',
    },
    {
      id: 'v-instituicao',
      titulo: 'Narrativa da Instituição',
      quem: 'presidente',
      incipit: 'Na noite em que ia ser entregue…',
      nota: 'Consagração do pão e do vinho, com as duas elevações.',
    },
    ...MISTERIO_DA_FE,
    {
      id: 'v-anamnese',
      titulo: 'Anamnese e Oferenda',
      quem: 'presidente',
      incipit: 'Celebrando, pois, ó Pai santo, a memória de Cristo…',
    },
    {
      id: 'v-intercessoes',
      titulo: 'Intercessões com aclamação',
      quem: 'presidente',
      incipit: 'Lembrai-vos, ó Pai, da vossa Igreja…',
      nota: 'Nesta oração as intercessões são entrecortadas por uma aclamação da assembleia.',
    },
    {
      id: 'v-aclamacao',
      titulo: 'Aclamação própria da assembleia',
      quem: 'assembleia',
      conferir: true,
      nota: 'Transcreva aqui a aclamação como está no Missal usado na paróquia. Ela se repete depois de cada bloco de intercessões.',
    },
    ...DOXOLOGIA,
  ],
};

export const ORACOES_EUCARISTICAS: OracaoEucaristica[] = [OE_II, OE_III, OE_V];

export function acharOracao(id: string): OracaoEucaristica | undefined {
  return ORACOES_EUCARISTICAS.find((o) => o.id === id);
}

export * from './tipos';
