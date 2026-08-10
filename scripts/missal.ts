/**
 * Prepara e confere o arquivo com os textos do Missal.
 *
 *   npm run missal
 *
 * Sem `missal.local.txt`, cria o arquivo já com todas as seções na ordem em que
 * aparecem na tela, cada uma com o incipit ao lado como referência — é só ir
 * completando a partir do Missal impresso.
 *
 * Com o arquivo, mostra o que já está preenchido, o que falta e o que sobrou
 * (id que não corresponde a seção nenhuma, quase sempre erro de digitação).
 * Melhor descobrir aqui do que na hora da Missa.
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { ORACOES_EUCARISTICAS, type Secao } from '../src/dados/oracoes-eucaristicas';
import { ARQUIVO_DO_MISSAL, interpretarMissal } from '../src/dados/oracoes-eucaristicas/missal-local';

/** As falas do celebrante que ainda não têm texto no próprio código. */
function secoesDoCelebrante(): { oracao: string; secao: Secao }[] {
  const vistas = new Set<string>();
  const lista: { oracao: string; secao: Secao }[] = [];
  for (const oracao of ORACOES_EUCARISTICAS) {
    for (const secao of oracao.secoes) {
      if (secao.quem !== 'presidente' || secao.texto) continue;
      // As comuns (diálogo, doxologia) aparecem nas cinco: uma entrada basta.
      if (vistas.has(secao.id)) continue;
      vistas.add(secao.id);
      lista.push({ oracao: oracao.numero, secao });
    }
  }
  return lista;
}

function criarModelo(): string {
  const linhas = [
    `// Textos do Missal — falas do celebrante.`,
    `//`,
    `// Escreva o texto abaixo de cada "#", a partir do Missal impresso.`,
    `// Linhas com "//" são comentário e não aparecem no app.`,
    `//`,
    `// Este arquivo NÃO vai para o GitHub: o .gitignore o barra, porque a`,
    `// tradução do Missal é da CNBB. Ele fica só aqui e no servidor da paróquia.`,
    `//`,
    `// Depois de preencher: MOSTRAR_TEXTO_PRESIDENCIAL=true no .env.local`,
    `// e reinicie o servidor. Rode "npm run missal" para conferir o que falta.`,
    ``,
  ];

  let oracaoAtual = '';
  for (const { oracao, secao } of secoesDoCelebrante()) {
    if (oracao !== oracaoAtual) {
      oracaoAtual = oracao;
      linhas.push(``, `// ─────────────────────────────────────────────`, `// Oração Eucarística ${oracao}`, `// ─────────────────────────────────────────────`, ``);
    }
    linhas.push(`// ${secao.titulo}${secao.incipit ? ` — ${secao.incipit}` : ''}`);
    linhas.push(`# ${secao.id}`);
    linhas.push(``, ``);
  }

  return linhas.join('\n');
}

const secoes = secoesDoCelebrante();

if (!existsSync(ARQUIVO_DO_MISSAL)) {
  writeFileSync(ARQUIVO_DO_MISSAL, criarModelo(), 'utf8');
  console.log(`\n✓ Criei ${ARQUIVO_DO_MISSAL} com ${secoes.length} seções para preencher.`);
  console.log(`  Abra o arquivo, escreva o texto abaixo de cada "#" e rode este comando de novo.\n`);
  process.exit(0);
}

const textos = interpretarMissal(readFileSync(ARQUIVO_DO_MISSAL, 'utf8'));
const idsValidos = new Set(secoes.map((s) => s.secao.id));

const preenchidas = secoes.filter(({ secao }) => textos[secao.id]);
const faltando = secoes.filter(({ secao }) => !textos[secao.id]);
const sobrando = Object.keys(textos).filter((id) => !idsValidos.has(id));

console.log(`\n${ARQUIVO_DO_MISSAL}: ${preenchidas.length} de ${secoes.length} seções preenchidas.\n`);

if (faltando.length > 0) {
  console.log('— Ainda sem texto —');
  let oracaoAtual = '';
  for (const { oracao, secao } of faltando) {
    if (oracao !== oracaoAtual) {
      oracaoAtual = oracao;
      console.log(`\n  Oração ${oracao}`);
    }
    console.log(`    # ${secao.id}  ${secao.titulo}`);
  }
  console.log('');
}

if (sobrando.length > 0) {
  console.log('— Ids que não correspondem a nenhuma seção (confira a digitação) —');
  for (const id of sobrando) console.log(`    # ${id}`);
  console.log('');
}

if (faltando.length === 0 && sobrando.length === 0) {
  console.log('✓ Todas as seções preenchidas, nenhum id sobrando.');
  console.log('  Ligue MOSTRAR_TEXTO_PRESIDENCIAL=true no .env.local e reinicie o servidor.\n');
}

// Sobra é erro de digitação e some da tela sem avisar; falta é trabalho normal.
process.exit(sobrando.length > 0 ? 1 : 0);
