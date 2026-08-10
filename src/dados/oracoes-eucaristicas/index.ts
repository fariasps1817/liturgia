import { aclamacao, DIALOGO, DOXOLOGIA, MISTERIO_DA_FE, SANTO } from './comuns';
import type { OracaoEucaristica } from './tipos';

/**
 * As cinco Orações Eucarísticas, conferidas com a 3ª edição típica (2023).
 *
 * A fonte é o texto trazido pelo diácono da paróquia, uma oração por arquivo,
 * cotejado com uma edição publicada da OE II e da OE III. Antes disto os
 * incipits da I e da IV eram de memória — e a conferência mostrou que estavam
 * errados em quase todos: "Confessamos, ó Pai, a vossa grandeza" era "Nós
 * proclamamos vossa grandeza, Pai santo". Nada aqui é mais de memória.
 *
 * # O que mais mudou com a conferência
 *
 * As aclamações da assembleia. O app tinha só as comuns — diálogo, Santo,
 * Mistério da Fé e Amém — e afirmava, por omissão, que o povo fica calado da
 * consagração até o fim. É falso: cada oração é entrecortada por aclamações
 * próprias, de quatro a oito, e elas são exatamente a razão de ser desta tela.
 *
 * O texto integral do celebrante não mora aqui: fica em `missal.local.txt`,
 * fora do repositório, porque a tradução é da CNBB. Aqui só o incipit, que
 * serve de deixa a quem acompanha.
 */

/**
 * Oração Eucarística I — o Cânon Romano.
 *
 * A mais antiga e a mais longa. Estrutura diferente de todas as outras: as
 * intercessões não ficam num bloco só no fim — vêm partidas, pelos vivos antes
 * da consagração e pelos falecidos depois. É onde quem acompanha se perde.
 */
const OE_I: OracaoEucaristica = {
  id: 'oe-i',
  numero: 'I',
  nome: 'Oração Eucarística I (Cânon Romano)',
  quando: 'Solenidades e dias festivos. A mais antiga e a mais longa.',
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
    },
    aclamacao('i-aclamacao-oferenda', 'Abençoai nossa oferenda, ó Senhor!'),
    {
      id: 'i-memento-vivos',
      titulo: 'Memento dos vivos',
      quem: 'presidente',
      incipit: 'Lembrai-vos, ó Pai, dos vossos filhos e filhas N. N. …',
      nota: 'Há um momento de silêncio: cada um reza pelos seus.',
    },
    aclamacao('i-aclamacao-vivos', 'Lembrai-vos, ó Pai, dos vossos filhos!'),
    {
      id: 'i-comunicantes',
      titulo: 'Comunicantes',
      quem: 'presidente',
      incipit: 'Em comunhão com toda a Igreja, celebramos em primeiro lugar a memória…',
      nota: 'A lista dos santos. Em algumas solenidades tem texto próprio, e pode ser abreviada.',
    },
    aclamacao('i-aclamacao-santos', 'Em comunhão com vossos Santos vos louvamos!'),
    {
      id: 'i-hanc-igitur',
      titulo: 'Oferenda da família reunida',
      quem: 'presidente',
      incipit: 'Aceitai, ó Pai, com bondade, a oblação dos vossos servos…',
      nota: 'Da Vigília Pascal ao 2º Domingo da Páscoa, e em Missa com Batismo, Crisma, Primeira Comunhão, Unção ou Matrimônio, tem texto próprio.',
    },
    {
      id: 'i-quam-oblationem',
      titulo: 'Epiclese',
      quem: 'presidente',
      incipit: 'Dignai-vos, ó Pai, aceitar, abençoar e santificar estas oferendas…',
      nota: 'O sacerdote estende as mãos sobre as oferendas.',
    },
    aclamacao('i-aclamacao-epiclese', 'Enviai o vosso Espírito Santo!'),
    {
      id: 'i-instituicao',
      titulo: 'Narrativa da Instituição',
      quem: 'presidente',
      incipit: 'Na véspera de sua paixão, ele tomou o pão em suas santas e veneráveis mãos…',
      nota: 'Consagração do pão e do vinho, com as duas elevações.',
    },
    ...MISTERIO_DA_FE,
    {
      id: 'i-anamnese',
      titulo: 'Anamnese e Oferenda',
      quem: 'presidente',
      incipit: 'Celebrando, pois, a memória da bem-aventurada paixão do vosso Filho…',
    },
    {
      id: 'i-supra-quae',
      titulo: 'Aceitação do sacrifício',
      quem: 'presidente',
      incipit: 'Recebei, ó Pai, com olhar benigno, esta oferta…',
      nota: 'Faz memória de Abel, de Abraão e de Melquisedeque.',
    },
    aclamacao('i-aclamacao-oferta', 'Aceitai, ó Senhor, a nossa oferta!'),
    {
      id: 'i-supplices',
      titulo: 'Súplica',
      quem: 'presidente',
      incipit: 'Suplicantes, vos pedimos, ó Deus onipotente…',
    },
    aclamacao('i-aclamacao-corpo', 'O Espírito nos una num só corpo!'),
    {
      id: 'i-memento-mortos',
      titulo: 'Memento dos falecidos',
      quem: 'presidente',
      incipit: 'Lembrai-vos, ó Pai, dos vossos filhos e filhas N. N. que nos precederam…',
      nota: 'Segundo momento de silêncio: cada um reza pelos seus falecidos.',
    },
    aclamacao('i-aclamacao-defuntos', 'Concedei-lhes, ó Senhor, a luz eterna!'),
    {
      id: 'i-nobis-quoque',
      titulo: 'Intercessão pelos que servem ao altar',
      quem: 'presidente',
      incipit: 'E a todos nós pecadores, que esperamos na vossa infinita misericórdia…',
      nota: 'O sacerdote bate no peito ao dizer as primeiras palavras.',
    },
    {
      id: 'i-per-quem',
      titulo: 'Conclusão',
      quem: 'presidente',
      incipit: 'Por ele não cessais de criar, santificar, vivificar…',
    },
    ...DOXOLOGIA,
  ],
};

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
    aclamacao('ii-aclamacao-epiclese', 'Enviai o vosso Espírito Santo!'),
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
    aclamacao('ii-aclamacao-oferta', 'Aceitai, ó Senhor, a nossa oferta!'),
    {
      id: 'ii-epiclese-comunhao',
      titulo: 'Epiclese da comunhão',
      quem: 'presidente',
      incipit: 'Suplicantes, vos pedimos que, participando do Corpo e Sangue de Cristo…',
    },
    aclamacao('ii-aclamacao-corpo', 'O Espírito nos una num só corpo!'),
    {
      id: 'ii-intercessoes-igreja',
      titulo: 'Intercessões pela Igreja',
      quem: 'presidente',
      incipit: 'Lembrai-vos, ó Pai, da vossa Igreja que se faz presente pelo mundo inteiro…',
      nota: 'Aqui entram o Papa e o bispo diocesano. Em Missa com Batismo, Crisma, Primeira Comunhão, Unção ou Matrimônio, entra também uma intercessão própria, seguida de "Lembrai-vos, ó Pai, dos vossos filhos!".',
    },
    aclamacao('ii-aclamacao-igreja', 'Lembrai-vos, ó Pai, da vossa Igreja!'),
    {
      id: 'ii-intercessoes-defuntos',
      titulo: 'Intercessões pelos falecidos',
      quem: 'presidente',
      incipit: 'Lembrai-vos também, na vossa misericórdia, dos nossos irmãos e irmãs…',
    },
    aclamacao('ii-aclamacao-defuntos', 'Concedei-lhes, ó Senhor, a luz eterna!'),
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
      incipit: 'Na verdade, vós sois Santo, ó Deus do universo…',
    },
    {
      id: 'iii-epiclese',
      titulo: 'Epiclese',
      quem: 'presidente',
      incipit: 'Por isso, ó Pai, nós vos suplicamos: santificai pelo Espírito Santo…',
      nota: 'O sacerdote estende as mãos sobre as oferendas.',
    },
    aclamacao('iii-aclamacao-epiclese', 'Enviai o vosso Espírito Santo!'),
    {
      id: 'iii-instituicao',
      titulo: 'Narrativa da Instituição',
      quem: 'presidente',
      incipit: 'Na noite em que ia ser entregue, Jesus tomou o pão…',
      nota: 'Consagração do pão e do vinho, com as duas elevações.',
    },
    ...MISTERIO_DA_FE,
    {
      id: 'iii-anamnese',
      titulo: 'Anamnese e Oferenda',
      quem: 'presidente',
      incipit: 'Celebrando agora, ó Pai, o memorial da paixão redentora do vosso Filho…',
    },
    aclamacao('iii-aclamacao-oferta', 'Aceitai, ó Senhor, a nossa oferta!'),
    {
      id: 'iii-epiclese-comunhao',
      titulo: 'Epiclese da comunhão',
      quem: 'presidente',
      incipit: 'Olhai com bondade a oblação da vossa Igreja…',
    },
    aclamacao('iii-aclamacao-corpo', 'O Espírito nos una num só corpo!'),
    {
      id: 'iii-intercessoes-oferenda',
      titulo: 'Intercessão pelos eleitos',
      quem: 'presidente',
      incipit: 'Que o mesmo Espírito faça de nós uma eterna oferenda…',
      nota: 'Recorda a Virgem Maria, São José, os Apóstolos, os Mártires e o santo do dia.',
    },
    aclamacao('iii-aclamacao-oferenda', 'Fazei de nós uma perfeita oferenda!'),
    {
      id: 'iii-intercessoes-igreja',
      titulo: 'Intercessões pela Igreja',
      quem: 'presidente',
      incipit: 'Nós vos suplicamos, Senhor, que este sacrifício da nossa reconciliação…',
      nota: 'Aqui entram o Papa e o bispo diocesano. Em Missa com Batismo, Crisma, Primeira Comunhão ou Matrimônio, tem texto próprio.',
    },
    aclamacao('iii-aclamacao-igreja', 'Lembrai-vos, ó Pai, da vossa Igreja!'),
    {
      id: 'iii-intercessoes-defuntos',
      titulo: 'Intercessões pelos falecidos',
      quem: 'presidente',
      incipit: 'Acolhei com bondade no vosso reino os nossos irmãos e irmãs…',
      nota: 'Nas Missas pelos fiéis defuntos tem texto próprio, mais longo.',
    },
    ...DOXOLOGIA,
  ],
};

/**
 * Oração Eucarística IV — a história da salvação inteira.
 *
 * O detalhe que mais pega a equipe não é o texto: é que o prefácio dela é
 * obrigatório e não se troca. Por isso ela não entra nos dias em que o próprio
 * dia pede um prefácio — o que exclui boa parte do calendário.
 */
const OE_IV: OracaoEucaristica = {
  id: 'oe-iv',
  numero: 'IV',
  nome: 'Oração Eucarística IV',
  quando: 'Tempo Comum, nos dias que não pedem prefácio próprio. Percorre toda a história da salvação.',
  secoes: [
    ...DIALOGO,
    {
      id: 'iv-prefacio',
      titulo: 'Prefácio próprio',
      quem: 'presidente',
      incipit: 'Na verdade, ó Pai, é nosso dever dar-vos graças, é nossa salvação dar-vos glória…',
      nota: 'Obrigatório: esta oração não aceita outro prefácio. Por isso não se usa quando o dia tem prefácio próprio — domingos do Advento, da Quaresma e da Páscoa, solenidades e festas.',
    },
    SANTO,
    {
      id: 'iv-pos-sanctus',
      titulo: 'Pós-Sanctus — a criação',
      quem: 'presidente',
      incipit: 'Nós proclamamos vossa grandeza, Pai santo…',
      nota: 'A assembleia já está ajoelhada. Esta oração percorre a história da salvação em três blocos, cada um fechado por uma aclamação.',
    },
    aclamacao('iv-aclamacao-criacao', 'A todos socorrestes com bondade!'),
    {
      id: 'iv-encarnacao',
      titulo: 'A vinda do Filho',
      quem: 'presidente',
      incipit: 'E de tal modo, Pai santo, amastes o mundo…',
    },
    aclamacao('iv-aclamacao-filho', 'Por amor nos enviastes vosso Filho!'),
    {
      id: 'iv-epiclese',
      titulo: 'Epiclese',
      quem: 'presidente',
      incipit: 'Por isso, nós vos pedimos, ó Pai, que o mesmo Espírito Santo…',
      nota: 'O sacerdote estende as mãos sobre as oferendas.',
    },
    aclamacao('iv-aclamacao-epiclese', 'Enviai o vosso Espírito Santo!'),
    {
      id: 'iv-instituicao',
      titulo: 'Narrativa da Instituição',
      quem: 'presidente',
      incipit: 'Quando, pois, chegou a hora em que por vós, ó Pai, ia ser glorificado…',
      nota: 'Consagração do pão e do vinho, com as duas elevações.',
    },
    ...MISTERIO_DA_FE,
    {
      id: 'iv-anamnese',
      titulo: 'Anamnese e Oferenda',
      quem: 'presidente',
      incipit: 'Celebrando, agora, ó Pai, a memória da nossa redenção…',
    },
    aclamacao('iv-aclamacao-oferta', 'Aceitai, ó Senhor, a nossa oferta!'),
    {
      id: 'iv-epiclese-comunhao',
      titulo: 'Epiclese da comunhão',
      quem: 'presidente',
      incipit: 'Olhai, com bondade, a oblação que destes à vossa Igreja…',
    },
    aclamacao('iv-aclamacao-corpo', 'O Espírito nos una num só corpo!'),
    {
      id: 'iv-intercessoes-igreja',
      titulo: 'Intercessões pela Igreja',
      quem: 'presidente',
      incipit: 'E agora, ó Pai, lembrai-vos de todos pelos quais vos oferecemos este sacrifício…',
      nota: 'Em Missa com Batismo, Crisma ou Primeira Comunhão, tem texto próprio.',
    },
    aclamacao('iv-aclamacao-igreja', 'Lembrai-vos, ó Pai, da vossa Igreja!'),
    {
      id: 'iv-intercessoes-defuntos',
      titulo: 'Intercessões pelos falecidos',
      quem: 'presidente',
      incipit: 'Lembrai-vos também dos que morreram na paz do vosso Cristo…',
    },
    aclamacao('iv-aclamacao-defuntos', 'Concedei-lhes, ó Senhor, a luz eterna!'),
    {
      id: 'iv-intercessoes-todos',
      titulo: 'Intercessão por todos nós',
      quem: 'presidente',
      incipit: 'E a todos nós, vossos filhos e filhas, concedei, ó Pai de bondade…',
    },
    ...DOXOLOGIA,
  ],
};

/**
 * Oração Eucarística V — própria do Brasil.
 *
 * É a que mais depende desta tela: sete aclamações da assembleia, quase uma por
 * parágrafo, e — o que o app errava — **Mistério da Fé próprio**. Não usa
 * nenhuma das três fórmulas comuns: o celebrante diz "Tudo isto é mistério da
 * fé!" e a resposta é outra. Quem chegasse aqui com as fórmulas comuns na tela
 * responderia errado.
 *
 * O texto é em verso, com métrica: foi feito para ser cantado.
 */
const OE_V: OracaoEucaristica = {
  id: 'oe-v',
  numero: 'V',
  nome: 'Oração Eucarística V',
  quando: 'Própria do Brasil, em verso. Sete aclamações da assembleia e Mistério da Fé próprio.',
  secoes: [
    ...DIALOGO,
    {
      id: 'v-prefacio',
      titulo: 'Prefácio próprio',
      quem: 'presidente',
      incipit: 'É justo e nos faz todos ser mais santos…',
    },
    SANTO,
    {
      id: 'v-pos-sanctus',
      titulo: 'Pós-Sanctus e Epiclese',
      quem: 'presidente',
      incipit: 'Ó Pai, vós que sempre quisestes ficar muito perto de nós…',
      nota: 'O sacerdote estende as mãos sobre as oferendas.',
    },
    aclamacao('v-aclamacao-epiclese', 'Mandai vosso Espírito Santo!'),
    {
      id: 'v-instituicao',
      titulo: 'Narrativa da Instituição',
      quem: 'presidente',
      incipit: 'Na noite em que ia ser entregue, ceando com seus Apóstolos…',
      nota: 'Consagração do pão e do vinho, com as duas elevações.',
    },
    {
      id: 'v-misterio-convite',
      titulo: 'Mistério da Fé — próprio desta oração',
      quem: 'presidente',
      incipit: 'Tudo isto é mistério da fé!',
      nota: 'Atenção: esta oração NÃO usa as três fórmulas comuns. O chamado é outro, e a resposta também.',
    },
    {
      id: 'v-misterio-resposta',
      titulo: 'Mistério da Fé — próprio desta oração',
      quem: 'assembleia',
      texto: `Toda vez que comemos deste Pão,
toda vez que bebemos deste Vinho,
recordamos a paixão de Jesus Cristo
e ficamos esperando sua vinda.`,
    },
    {
      id: 'v-anamnese',
      titulo: 'Anamnese e Oferenda',
      quem: 'presidente',
      incipit: 'Recordando, ó Pai, neste momento, a paixão de Jesus, nosso Senhor…',
    },
    aclamacao('v-aclamacao-oferta', 'Recebei, ó Senhor, a nossa oferta!'),
    {
      id: 'v-epiclese-comunhao',
      titulo: 'Epiclese da comunhão',
      quem: 'presidente',
      incipit: 'E quando recebermos Pão e Vinho, o Corpo e Sangue dele oferecidos…',
    },
    aclamacao('v-aclamacao-corpo', 'O Espírito nos una num só corpo!'),
    {
      id: 'v-intercessoes-igreja',
      titulo: 'Intercessão pela Igreja peregrina',
      quem: 'presidente',
      incipit: 'Protegei vossa Igreja que caminha nas estradas do mundo rumo ao céu…',
    },
    aclamacao('v-aclamacao-caminho', 'Caminhamos na estrada de Jesus!'),
    {
      id: 'v-intercessoes-pastores',
      titulo: 'Intercessão pelo Papa e pelo Bispo',
      quem: 'presidente',
      incipit: 'Dai ao vosso servo, o Papa N., ser bem firme na fé, na caridade…',
    },
    aclamacao('v-aclamacao-igreja', 'Lembrai-vos, ó Pai, da vossa Igreja!'),
    {
      id: 'v-intercessoes-santos',
      titulo: 'Intercessão pela vida eterna',
      quem: 'presidente',
      incipit: 'Esperamos entrar na vida eterna com Maria, Mãe de Deus e da Igreja…',
    },
    aclamacao('v-aclamacao-eterna', 'Esperamos entrar na vida eterna!'),
    {
      id: 'v-intercessoes-defuntos',
      titulo: 'Intercessões pelos falecidos',
      quem: 'presidente',
      incipit: 'Abri as portas da misericórdia aos que chamastes para a outra vida…',
    },
    aclamacao('v-aclamacao-luz', 'A todos dai a luz que não se apaga!'),
    {
      id: 'v-intercessoes-todos',
      titulo: 'Intercessão por todos nós',
      quem: 'presidente',
      incipit: 'E a todos nós, aqui reunidos, que somos povo santo e pecador…',
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
