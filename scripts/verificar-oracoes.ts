/**
 * Confere a estrutura das Orações Eucarísticas.
 *
 * Nada aqui julga a redação litúrgica — isso é o Missal que decide, e a marca
 * `conferir` é como o app admite o que ainda não foi cotejado. O que se confere
 * são os erros que a tela não denuncia sozinha: uma resposta da assembleia sem
 * texto, um convite sem a resposta correspondente, uma parte que sumiu da
 * sequência.
 *
 * O caso que deu origem a este script: o Mistério da Fé tinha um convite só,
 * seguido das três respostas soltas. Ninguém percebe olhando a tela — ela
 * mostra tudo bonito — mas a resposta é determinada pelo convite que o
 * sacerdote puxa, e o app deixava a assembleia escolher.
 *
 *   npm run verificar
 */
import { ORACOES_EUCARISTICAS, ehResposta, type Secao } from '../src/dados/oracoes-eucaristicas';

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
  const instituicao = oracao.secoes.findIndex((s) => /Narrativa da Institui/.test(s.titulo));
  const misterio = ids.indexOf('misterio-convite-1');
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

console.log('\n— Mistério da Fé: cada convite com a SUA resposta —');
{
  /*
   * A regra que o app violava: as três fórmulas são pares. O sacerdote escolhe
   * o convite e a resposta decorre dele — a assembleia não escolhe. Aqui se
   * confere que cada convite é seguido imediatamente pela resposta de mesmo
   * título, e que são três pares, não um convite e três respostas.
   */
  const secoes = ORACOES_EUCARISTICAS[0].secoes;
  const doMisterio = secoes.filter((s) => s.titulo.startsWith('Mistério da Fé'));

  conferir('são seis seções — três pares', doMisterio.length, 6);

  const convites = doMisterio.filter((s) => !ehResposta(s));
  const respostas = doMisterio.filter((s) => ehResposta(s));
  conferir('três convites', convites.length, 3);
  conferir('três respostas', respostas.length, 3);

  for (let i = 0; i < doMisterio.length; i += 2) {
    const convite = doMisterio[i];
    const resposta = doMisterio[i + 1];
    const par = `${i / 2 + 1}º par`;
    conferir(`${par}: convite antes da resposta`, !ehResposta(convite) && ehResposta(resposta), true);
    conferir(`${par}: mesmo título nos dois`, convite.titulo, resposta.titulo);
  }

  // Pareamento exato, como está no Missal.
  const esperado: [string, string][] = [
    ['Mistério da fé!', 'Anunciamos, Senhor, a vossa morte'],
    ['Mistério da fé e do amor!', 'Todas as vezes que comemos deste pão'],
    ['Mistério da fé para a salvação do mundo!', 'Salvador do mundo, salvai-nos'],
  ];
  esperado.forEach(([convite, inicioDaResposta], i) => {
    conferir(`convite ${i + 1}`, convites[i]?.incipit, convite);
    conferir(`resposta ${i + 1} começa certo`, respostas[i]?.texto?.startsWith(inicioDaResposta), true);
  });
}

console.log('\n— Fórmulas que saíram do Missal não podem voltar —');
{
  // "Eis o mistério da fé" era a tradução anterior. Ficou onze meses no app.
  const todas: Secao[] = ORACOES_EUCARISTICAS.flatMap((o) => o.secoes);
  const tudo = todas.map((s) => `${s.incipit ?? ''} ${s.texto ?? ''}`).join(' ');
  conferir('"Eis o mistério da fé" não aparece', /Eis o mist[ée]rio da f[ée]/i.test(tudo), false);
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
