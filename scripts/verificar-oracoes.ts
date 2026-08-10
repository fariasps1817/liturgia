/**
 * Confere a estrutura das Orações Eucarísticas.
 *
 * Nada aqui julga a redação litúrgica — isso é o Missal que decide, e a marca
 * `conferir` é como o app admite o que ainda não foi cotejado. O que se confere
 * são os erros que a tela não denuncia sozinha: uma resposta da assembleia sem
 * texto, um convite sem a resposta correspondente, uma parte que sumiu da
 * sequência.
 *
 * O caso que deu origem a este script: o Mistério da Fé tinha um chamado só,
 * seguido das três respostas soltas. Ninguém percebe olhando a tela — ela
 * mostra tudo bonito — mas a resposta é determinada pelo chamado que o
 * sacerdote puxa, e o app deixava a assembleia escolher.
 *
 *   npm run verificar
 */
import {
  ORACOES_EUCARISTICAS,
  ehResposta,
  type OracaoEucaristica,
  type Secao,
} from '../src/dados/oracoes-eucaristicas';
import {
  carregarTextosDoMissal,
  comTextosDoMissal,
  interpretarMissal,
} from '../src/dados/oracoes-eucaristicas/missal-local';
import {
  aplicarTextoPresidencial,
  mostrarTextoPresidencial,
} from '../src/dados/oracoes-eucaristicas/presidencial';

let falhas = 0;
let total = 0;

function conferir(descricao: string, obtido: unknown, esperado: unknown) {
  total++;
  if (obtido === esperado) {
    console.log(`  ok   ${descricao} → ${String(obtido)}`);
  } else {
    falhas++;
    console.log(`  FALHA ${descricao}\n          obtido: ${String(obtido)}\n        esperado: ${String(esperado)}`);
  }
}

console.log('\n— As orações que o Missal traz —');
{
  const numeros = ORACOES_EUCARISTICAS.map((o) => o.numero);
  conferir('estão na ordem do Missal', numeros.join(', '), 'I, II, III, IV, V');
  conferir('ids únicos', new Set(ORACOES_EUCARISTICAS.map((o) => o.id)).size, numeros.length);
}

console.log('\n— Cada oração tem a espinha completa —');
for (const oracao of ORACOES_EUCARISTICAS) {
  const ids = oracao.secoes.map((s) => s.id);
  const titulos = oracao.secoes.map((s) => s.titulo).join(' | ');

  conferir(`${oracao.numero}: sem id repetido`, new Set(ids).size, ids.length);
  conferir(`${oracao.numero}: abre com o diálogo do prefácio`, ids[0], 'dialogo-saudacao');
  conferir(`${oracao.numero}: tem o Santo`, ids.includes('santo'), true);
  conferir(`${oracao.numero}: tem a Narrativa da Instituição`, /Narrativa da Institui/.test(titulos), true);
  conferir(`${oracao.numero}: termina no Amém`, ids[ids.length - 1], 'amem');

  // A consagração vem antes do Mistério da Fé, e este antes da doxologia.
  // A OE V tem fórmula própria, então procura-se pelo título, não pelo id.
  const instituicao = oracao.secoes.findIndex((s) => /Narrativa da Institui/.test(s.titulo));
  const misterio = oracao.secoes.findIndex((s) => /Mist[ée]rio da F[ée]/i.test(s.titulo));
  const doxologia = ids.indexOf('doxologia');
  conferir(`${oracao.numero}: Mistério da Fé depois da consagração`, misterio > instituicao, true);
  conferir(`${oracao.numero}: doxologia depois do Mistério da Fé`, doxologia > misterio, true);
}

console.log('\n— O que a assembleia diz nunca pode vir vazio —');
for (const oracao of ORACOES_EUCARISTICAS) {
  const mudas = oracao.secoes.filter((s) => ehResposta(s) && !s.texto?.trim() && !s.conferir);
  conferir(
    `${oracao.numero}: nenhuma resposta muda e sem aviso${mudas.length ? ` (${mudas.map((s) => s.id).join(', ')})` : ''}`,
    mudas.length,
    0,
  );

  // Uma fala do celebrante sem incipit não serve de deixa para nada.
  const semDeixa = oracao.secoes.filter((s) => !ehResposta(s) && !s.incipit?.trim() && !s.texto?.trim());
  conferir(
    `${oracao.numero}: toda fala do celebrante tem deixa${semDeixa.length ? ` (${semDeixa.map((s) => s.id).join(', ')})` : ''}`,
    semDeixa.length,
    0,
  );
}

console.log('\n— Mistério da Fé: o chamado no título da resposta —');
{
  /*
   * A resposta decorre do chamado que o sacerdote puxa — a assembleia não
   * escolhe. Como se procura pelo que se ouviu, o chamado precisa estar no
   * título do cartão: um cartão por fórmula, e não um para o chamado e outro
   * para a resposta, que foi por onde esta tela já passou e ficou confusa.
   */
  const doMisterio = ORACOES_EUCARISTICAS[0].secoes.filter((s) => /Mist[ée]rio da f[ée]/i.test(s.titulo));

  conferir('três seções — uma por fórmula', doMisterio.length, 3);
  conferir('todas são resposta da assembleia', doMisterio.every(ehResposta), true);

  // Pareamento exato, como está no Missal: título traz o chamado, corpo traz a
  // resposta que lhe corresponde.
  const esperado: [string, string][] = [
    ['Chamado: Mistério da fé!', 'Anunciamos, Senhor, a vossa morte'],
    ['Chamado: Mistério da fé e do amor!', 'Todas as vezes que comemos deste pão'],
    ['Chamado: Mistério da fé para a salvação do mundo!', 'Salvador do mundo, salvai-nos'],
  ];
  esperado.forEach(([titulo, inicioDaResposta], i) => {
    conferir(`fórmula ${i + 1}: chamado no título`, doMisterio[i]?.titulo, titulo);
    conferir(
      `fórmula ${i + 1}: resposta que lhe corresponde`,
      doMisterio[i]?.texto?.startsWith(inicioDaResposta),
      true,
    );
  });
}

console.log('\n— A OE V tem Mistério da Fé próprio —');
{
  /*
   * A armadilha: por sete commits a OE V usou as três fórmulas comuns, que não
   * são as dela. O celebrante diz "Tudo isto é mistério da fé!" e a resposta é
   * outra — quem chegasse à tela com as fórmulas comuns responderia errado.
   */
  const v = ORACOES_EUCARISTICAS.find((o) => o.id === 'oe-v')!;
  const misterio = v.secoes.filter((s) => /Mist[ée]rio da F[ée]/i.test(s.titulo));

  conferir('são duas seções, não seis', misterio.length, 2);
  conferir('o chamado é o próprio dela', misterio[0]?.incipit, 'Tudo isto é mistério da fé!');
  conferir(
    'a resposta é a própria dela',
    misterio[1]?.texto?.startsWith('Toda vez que comemos deste Pão'),
    true,
  );
  conferir('não usa as fórmulas comuns', v.secoes.some((s) => s.id.startsWith('misterio-')), false);
}

console.log('\n— As aclamações da assembleia, que faltavam nas cinco —');
{
  /*
   * O app já afirmou, por omissão, que a assembleia fica calada da consagração
   * até o Amém. Cada oração tem as suas; nenhuma tem menos de quatro fora as
   * comuns. Se este número cair, alguma sumiu.
   */
  const minimo: Record<string, number> = { 'oe-i': 7, 'oe-ii': 5, 'oe-iii': 5, 'oe-iv': 7, 'oe-v': 7 };
  for (const oracao of ORACOES_EUCARISTICAS) {
    const proprias = oracao.secoes.filter(
      (s) => ehResposta(s) && !['santo', 'amem'].includes(s.id) && !s.id.startsWith('dialogo') && !/Mist[ée]rio da F[ée]/i.test(s.titulo),
    );
    conferir(`${oracao.numero}: aclamações próprias`, proprias.length, minimo[oracao.id]);
    conferir(
      `${oracao.numero}: todas com texto`,
      proprias.every((s) => Boolean(s.texto?.trim())),
      true,
    );
  }
}

console.log('\n— Fórmulas que saíram do Missal não podem voltar —');
{
  // "Eis o mistério da fé" era a tradução anterior. Varre também o título, que
  // é onde o chamado passou a morar — senão a fórmula velha volta por ali.
  const todas: Secao[] = ORACOES_EUCARISTICAS.flatMap((o) => o.secoes);
  const tudo = todas.map((s) => `${s.titulo} ${s.incipit ?? ''} ${s.texto ?? ''}`).join(' ');
  conferir('"Eis o mistério da fé" não aparece', /Eis o mist[ée]rio da f[ée]/i.test(tudo), false);
}

console.log('\n— A chave do texto presidencial —');
{
  /*
   * Uma oração fictícia, para não depender do que os dados trazem hoje: se um
   * dia alguém preencher `texto` numa fala do celebrante, é esta conferência
   * que garante que ele não vaza com a chave desligada.
   */
  const comTexto: OracaoEucaristica = {
    id: 'teste',
    numero: 'X',
    nome: 'Oração de teste',
    quando: 'Só para conferência.',
    secoes: [
      { id: 't-presidente', titulo: 'Fala do celebrante', quem: 'presidente', incipit: 'Na verdade…', texto: 'TEXTO INTEGRAL DO MISSAL' },
      { id: 't-assembleia', titulo: 'Resposta', quem: 'assembleia', texto: 'Amém!' },
    ],
  };

  const desligada = aplicarTextoPresidencial(comTexto, false);
  const serializada = JSON.stringify(desligada);
  conferir('desligada: o texto do celebrante some', /TEXTO INTEGRAL DO MISSAL/.test(serializada), false);
  conferir('desligada: a deixa continua', desligada.secoes[0].incipit, 'Na verdade…');
  conferir('desligada: a resposta da assembleia fica intacta', desligada.secoes[1].texto, 'Amém!');

  const ligada = aplicarTextoPresidencial(comTexto, true);
  conferir('ligada: o texto do celebrante aparece', ligada.secoes[0].texto, 'TEXTO INTEGRAL DO MISSAL');

  // Só o literal "true" liga. Um "1" ou "sim" esquecido no .env não pode
  // publicar o Missal inteiro sem querer.
  for (const valor of ['true', 'false', '1', 'sim', 'TRUE', '', undefined]) {
    if (valor === undefined) delete process.env.MOSTRAR_TEXTO_PRESIDENCIAL;
    else process.env.MOSTRAR_TEXTO_PRESIDENCIAL = valor;
    conferir(`chave = ${JSON.stringify(valor)}`, mostrarTextoPresidencial(), valor === 'true');
  }
}

console.log('\n— O arquivo missal.local.txt —');
{
  const bruto = [
    '// comentário some',
    '# ii-pos-sanctus',
    'Primeiro parágrafo.',
    '',
    'Segundo parágrafo.',
    '',
    '// outro comentário',
    '# ii-epiclese',
    'Texto da epiclese.',
    '# ii-vazia',
    '',
  ].join('\n');

  const textos = interpretarMissal(bruto);
  conferir('separa as seções', Object.keys(textos).length, 2);
  conferir('preserva o parágrafo em branco', textos['ii-pos-sanctus'], 'Primeiro parágrafo.\n\nSegundo parágrafo.');
  conferir('comentário não entra no texto', /coment[áa]rio/.test(JSON.stringify(textos)), false);
  conferir('seção sem texto é ignorada', 'ii-vazia' in textos, false);
  conferir('sem arquivo não quebra', Object.keys(carregarTextosDoMissal('/pasta/que/nao/existe')).length, 0);

  // O encaixe nunca sobrescreve o que já está conferido no código.
  const oracao = ORACOES_EUCARISTICAS.find((o) => o.id === 'oe-ii')!;
  const comTexto = comTextosDoMissal(oracao, {
    'ii-pos-sanctus': 'VEIO DO ARQUIVO',
    santo: 'TENTATIVA DE SOBRESCREVER O SANTO',
  });
  const posSanctus = comTexto.secoes.find((s) => s.id === 'ii-pos-sanctus');
  const santo = comTexto.secoes.find((s) => s.id === 'santo');
  conferir('preenche fala do celebrante que estava vazia', posSanctus?.texto, 'VEIO DO ARQUIVO');
  conferir('não sobrescreve resposta da assembleia', santo?.texto?.startsWith('Santo, Santo, Santo'), true);

  // E o que veio do arquivo continua sujeito à chave.
  const barrado = aplicarTextoPresidencial(comTexto, false);
  conferir('chave desligada barra o texto do arquivo', /VEIO DO ARQUIVO/.test(JSON.stringify(barrado)), false);
}

console.log('\n— Quem tem seção a conferir avisa no topo —');
for (const oracao of ORACOES_EUCARISTICAS) {
  const temMarca = oracao.secoes.some((s) => s.conferir);
  if (temMarca) {
    conferir(`${oracao.numero}: tem aviso de revisão`, Boolean(oracao.avisoDeRevisao), true);
  }
}

console.log(
  falhas === 0
    ? `\n✓ ${total} conferências passaram.\n`
    : `\n✗ ${falhas} de ${total} conferências falharam.\n`,
);
process.exit(falhas === 0 ? 0 : 1);
