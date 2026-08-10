import { DIALOGO, DOXOLOGIA, MISTERIO_DA_FE, SANTO } from './comuns';
import type { OracaoEucaristica } from './tipos';

/**
 * Aviso comum às duas orações acrescentadas depois (I e IV).
 *
 * A estrutura, a ordem das partes, as rubricas e as respostas da assembleia são
 * firmes. Os incipits do celebrante, não: foram escritos de memória do Missal
 * brasileiro e nenhum foi cotejado com um exemplar impresso. Numa deixa que
 * alguém segue ao vivo, "quase certo" não serve — daí a marca em cada um.
 */
const AVISO_INCIPITS_NAO_CONFERIDOS =
  'As primeiras palavras das falas do celebrante ainda não foram conferidas com o Missal impresso — cada uma está marcada abaixo. A ordem das partes, as rubricas e as respostas da assembleia estão corretas.';

/**
 * Oração Eucarística I — o Cânon Romano.
 *
 * A mais antiga e a mais longa. Estrutura diferente de todas as outras: as
 * intercessões não ficam num bloco só no fim — vêm partidas em duas, pelos
 * vivos antes da consagração e pelos falecidos depois, cada uma com o seu
 * momento de silêncio. É por isso que ela vale a pena aqui: quem acompanha se
 * perde justamente nesses trechos, que não têm paralelo na II nem na III.
 */
const OE_I: OracaoEucaristica = {
  id: 'oe-i',
  numero: 'I',
  nome: 'Oração Eucarística I (Cânon Romano)',
  quando: 'Solenidades e dias festivos. A mais antiga e a mais longa.',
  avisoDeRevisao: AVISO_INCIPITS_NAO_CONFERIDOS,
  secoes: [
    ...DIALOGO,
    {
      id: 'i-prefacio',
      titulo: 'Prefácio',
      quem: 'presidente',
      incipit: 'Prefácio próprio do tempo litúrgico ou da festa.',
      nota: 'O Cânon Romano não tem prefácio próprio: aceita qualquer um.',
    },
    SANTO,
    {
      id: 'i-te-igitur',
      titulo: 'Intercessão inicial',
      quem: 'presidente',
      incipit: 'Pai de misericórdia, a quem sobem nossos louvores…',
      nota: 'Pede pela Igreja, pelo Papa e pelo bispo diocesano.',
      conferir: true,
    },
    {
      id: 'i-memento-vivos',
      titulo: 'Memento dos vivos',
      quem: 'presidente',
      incipit: 'Lembrai-vos, ó Pai, dos vossos filhos e filhas…',
      nota: 'Há um momento de silêncio: cada um reza pelos seus.',
      conferir: true,
    },
    {
      id: 'i-comunicantes',
      titulo: 'Comunicantes',
      quem: 'presidente',
      incipit: 'Em comunhão com toda a Igreja, veneramos a memória…',
      nota: 'A lista dos santos. Em algumas solenidades tem texto próprio, e pode ser abreviada.',
      conferir: true,
    },
    {
      id: 'i-hanc-igitur',
      titulo: 'Oferenda da família reunida',
      quem: 'presidente',
      incipit: 'Recebei, ó Pai, com bondade, esta oferenda…',
      conferir: true,
    },
    {
      id: 'i-quam-oblationem',
      titulo: 'Epiclese',
      quem: 'presidente',
      incipit: 'Dignai-vos, ó Deus, abençoar e aceitar esta oferenda…',
      nota: 'O sacerdote estende as mãos sobre as oferendas.',
      conferir: true,
    },
    {
      id: 'i-instituicao',
      titulo: 'Narrativa da Instituição',
      quem: 'presidente',
      incipit: 'Na véspera de sua paixão, ele tomou o pão…',
      nota: 'Consagração do pão e do vinho, com as duas elevações.',
      conferir: true,
    },
    ...MISTERIO_DA_FE,
    {
      id: 'i-anamnese',
      titulo: 'Anamnese e Oferenda',
      quem: 'presidente',
      incipit: 'Celebrando, pois, a memória da paixão do vosso Filho…',
      conferir: true,
    },
    {
      id: 'i-supra-quae',
      titulo: 'Aceitação do sacrifício',
      quem: 'presidente',
      incipit: 'Recebei, ó Pai, com olhar de bondade esta oferta…',
      nota: 'Faz memória de Abel, de Abraão e de Melquisedeque.',
      conferir: true,
    },
    {
      id: 'i-supplices',
      titulo: 'Súplica',
      quem: 'presidente',
      incipit: 'Nós vos suplicamos, Deus todo-poderoso…',
      conferir: true,
    },
    {
      id: 'i-memento-mortos',
      titulo: 'Memento dos falecidos',
      quem: 'presidente',
      incipit: 'Lembrai-vos também, ó Pai, dos vossos filhos e filhas que partiram…',
      nota: 'Segundo momento de silêncio: cada um reza pelos seus falecidos.',
      conferir: true,
    },
    {
      id: 'i-nobis-quoque',
      titulo: 'Intercessão pelos que servem ao altar',
      quem: 'presidente',
      incipit: 'E a nós, pecadores, que confiamos na vossa imensa misericórdia…',
      nota: 'O sacerdote bate no peito ao dizer as primeiras palavras.',
      conferir: true,
    },
    ...DOXOLOGIA,
  ],
};

/**
 * Oração Eucarística II — a mais usada no Brasil.
 *
 * Conferida contra o texto da 3ª edição típica (2023) trazido pelo diácono da
 * paróquia, e cotejada com uma edição publicada da mesma oração. É a única das
 * cinco cujos incipits não são de memória.
 *
 * Traz **cinco aclamações próprias da assembleia** ao longo da oração, além
 * das comuns. Elas faltavam aqui — e são justamente o que esta tela existe
 * para mostrar. Sem elas o app dizia, por omissão, que a assembleia fica calada
 * da consagração até o Amém, o que é falso na forma como se celebra no Brasil.
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
      incipit: 'Na verdade, é digno e justo, é nosso dever e salvação dar-vos graças…',
      nota: 'A OE II tem prefácio próprio, mas admite outros prefácios do tempo.',
    },
    SANTO,
    {
      id: 'ii-pos-sanctus',
      titulo: 'Pós-Sanctus',
      quem: 'presidente',
      incipit: 'Na verdade, ó Pai, vós sois Santo, fonte de toda santidade.',
      nota: 'A assembleia já está ajoelhada.',
    },
    {
      id: 'ii-epiclese',
      titulo: 'Epiclese',
      quem: 'presidente',
      incipit: 'Santificai, pois, estes dons, derramando sobre eles o vosso Espírito…',
      nota: 'O sacerdote estende as mãos sobre as oferendas.',
    },
    {
      id: 'ii-aclamacao-epiclese',
      titulo: 'Aclamação após a epiclese',
      quem: 'assembleia',
      texto: 'Enviai o vosso Espírito Santo!',
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
      incipit: 'Celebrando, pois, o memorial da morte e ressurreição do vosso Filho…',
    },
    {
      id: 'ii-aclamacao-oferta',
      titulo: 'Aclamação após a oferenda',
      quem: 'assembleia',
      texto: 'Aceitai, ó Senhor, a nossa oferta!',
    },
    {
      id: 'ii-epiclese-comunhao',
      titulo: 'Epiclese da comunhão',
      quem: 'presidente',
      incipit: 'Suplicantes, vos pedimos que, participando do Corpo e Sangue de Cristo…',
    },
    {
      id: 'ii-aclamacao-corpo',
      titulo: 'Aclamação após a epiclese da comunhão',
      quem: 'assembleia',
      texto: 'O Espírito nos una num só corpo!',
    },
    {
      id: 'ii-intercessoes-igreja',
      titulo: 'Intercessões pela Igreja',
      quem: 'presidente',
      incipit: 'Lembrai-vos, ó Pai, da vossa Igreja que se faz presente pelo mundo inteiro…',
      nota: 'Aqui entram o Papa e o bispo diocesano. Em Missa com Batismo, Crisma, Primeira Comunhão, Unção ou Matrimônio, entra também uma intercessão própria, seguida de "Lembrai-vos, ó Pai, dos vossos filhos!".',
    },
    {
      id: 'ii-aclamacao-igreja',
      titulo: 'Aclamação após as intercessões pela Igreja',
      quem: 'assembleia',
      texto: 'Lembrai-vos, ó Pai, da vossa Igreja!',
    },
    {
      id: 'ii-intercessoes-defuntos',
      titulo: 'Intercessões pelos falecidos',
      quem: 'presidente',
      incipit: 'Lembrai-vos também, na vossa misericórdia, dos nossos irmãos e irmãs…',
    },
    {
      id: 'ii-aclamacao-defuntos',
      titulo: 'Aclamação após as intercessões pelos falecidos',
      quem: 'assembleia',
      texto: 'Concedei-lhes, ó Senhor, a luz eterna!',
    },
    {
      id: 'ii-intercessoes-todos',
      titulo: 'Intercessão por todos nós',
      quem: 'presidente',
      incipit: 'Enfim, nós vos pedimos, tende piedade de todos nós…',
      nota: 'Recorda a Virgem Maria, São José, os Apóstolos e o santo do dia ou padroeiro.',
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
 * Oração Eucarística IV — a história da salvação inteira.
 *
 * O detalhe que mais pega a equipe de liturgia não é o texto: é que o prefácio
 * dela é **obrigatório e não se troca**. Por isso ela não entra nos dias em que
 * o próprio dia pede um prefácio — o que exclui boa parte do calendário.
 */
const OE_IV: OracaoEucaristica = {
  id: 'oe-iv',
  numero: 'IV',
  nome: 'Oração Eucarística IV',
  quando: 'Tempo Comum, nos dias que não pedem prefácio próprio. Percorre toda a história da salvação.',
  avisoDeRevisao: AVISO_INCIPITS_NAO_CONFERIDOS,
  secoes: [
    ...DIALOGO,
    {
      id: 'iv-prefacio',
      titulo: 'Prefácio próprio',
      quem: 'presidente',
      incipit: 'Na verdade, é nosso dever e salvação dar-vos graças…',
      nota: 'Obrigatório: esta oração não aceita outro prefácio. Por isso não se usa quando o dia tem prefácio próprio — domingos do Advento, da Quaresma e da Páscoa, solenidades e festas.',
      conferir: true,
    },
    SANTO,
    {
      id: 'iv-pos-sanctus',
      titulo: 'Pós-Sanctus — história da salvação',
      quem: 'presidente',
      incipit: 'Confessamos, ó Pai, a vossa grandeza…',
      nota: 'A parte mais longa desta oração: percorre a criação, a aliança e os profetas. A assembleia fica ajoelhada um bom tempo aqui.',
      conferir: true,
    },
    {
      id: 'iv-epiclese',
      titulo: 'Epiclese',
      quem: 'presidente',
      incipit: 'Santificai, ó Pai, estas oferendas pelo vosso Espírito…',
      nota: 'O sacerdote estende as mãos sobre as oferendas.',
      conferir: true,
    },
    {
      id: 'iv-instituicao',
      titulo: 'Narrativa da Instituição',
      quem: 'presidente',
      incipit: 'Tendo amado os seus que estavam no mundo, amou-os até o fim…',
      nota: 'Consagração do pão e do vinho, com as duas elevações.',
      conferir: true,
    },
    ...MISTERIO_DA_FE,
    {
      id: 'iv-anamnese',
      titulo: 'Anamnese e Oferenda',
      quem: 'presidente',
      incipit: 'Celebrando, pois, ó Pai, a memória da nossa redenção…',
      conferir: true,
    },
    {
      id: 'iv-epiclese-comunhao',
      titulo: 'Epiclese da comunhão',
      quem: 'presidente',
      incipit: 'Olhai, ó Pai, esta oferenda que destes à vossa Igreja…',
      conferir: true,
    },
    {
      id: 'iv-intercessoes',
      titulo: 'Intercessões',
      quem: 'presidente',
      incipit: 'Lembrai-vos, ó Pai, de todos por quem oferecemos este sacrifício…',
      nota: 'Entram o Papa, o bispo, o clero, os presentes, o povo todo e os falecidos.',
      conferir: true,
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

/** Na ordem do Missal — é como a equipe as procura. */
export const ORACOES_EUCARISTICAS: OracaoEucaristica[] = [OE_I, OE_II, OE_III, OE_IV, OE_V];

export function acharOracao(id: string): OracaoEucaristica | undefined {
  return ORACOES_EUCARISTICAS.find((o) => o.id === id);
}

export * from './tipos';
