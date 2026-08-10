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
  const misterio = ids.indexOf('misterio-1');
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

console.log('\n— Fórmulas que saíram do Missal não podem voltar —');
{
  // "Eis o mistério da fé" era a tradução anterior. Varre também o título, que
  // é onde o chamado passou a morar — senão a fórmula velha volta por ali.
  const todas: Secao[] = ORACOES_EUCARISTICAS.flatMap((o) => o.secoes);
  const tudo = todas.map((s) => `${s.titulo} ${s.incipit ?? ''} ${s.texto ?? ''}`).join(' ');
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
