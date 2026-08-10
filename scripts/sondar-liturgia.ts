/**
 * Sonda a API de liturgia e mostra o que ela devolve de verdade.
 *
 * O normalizador foi escrito para ser tolerante justamente porque o schema
 * dessa API não está documentado e já mudou entre versões. Rode isto antes de
 * confiar no app, e sempre que as leituras vierem vazias:
 *
 *   npm run sondar                  # domingo, dia de semana e uma solenidade
 *   npm run sondar 2026-08-16       # uma data específica
 *
 * As respostas cruas ficam em `docs/amostras/`, para servirem de referência
 * caso a fonte mude de formato.
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { normalizar } from '../src/lib/liturgia/normalizar';
import { porExtenso } from '../src/lib/liturgia/datas';

const BASE = process.env.LITURGIA_API_BASE ?? 'https://liturgia.up.railway.app/v2';

const PADRAO = [
  { data: '2026-08-16', porque: 'domingo — deve trazer a 2ª leitura' },
  { data: '2026-08-10', porque: 'dia de semana — não deve trazer a 2ª leitura' },
  { data: '2026-08-15', porque: 'Assunção — solenidade em dia de semana' },
];

function url(data: string): string {
  const [ano, mes, dia] = data.split('-');
  const u = new URL(BASE);
  u.searchParams.set('dia', dia);
  u.searchParams.set('mes', mes);
  u.searchParams.set('ano', ano);
  return u.toString();
}

/** Mostra a árvore de chaves, que é o que interessa para escrever o normalizador. */
function esqueleto(valor: unknown, prefixo = '', profundidade = 0): string[] {
  if (profundidade > 3) return [`${prefixo} …`];
  if (Array.isArray(valor)) {
    if (valor.length === 0) return [`${prefixo}: [] (lista vazia)`];
    return [`${prefixo}: lista com ${valor.length}`, ...esqueleto(valor[0], `${prefixo}[0]`, profundidade + 1)];
  }
  if (valor !== null && typeof valor === 'object') {
    return Object.entries(valor).flatMap(([chave, v]) =>
      esqueleto(v, prefixo ? `${prefixo}.${chave}` : chave, profundidade + 1),
    );
  }
  const amostra =
    typeof valor === 'string'
      ? `"${valor.slice(0, 60).replace(/\n/g, '⏎')}${valor.length > 60 ? '…' : ''}"`
      : String(valor);
  return [`${prefixo}: ${amostra}`];
}

async function sondar(data: string, porque?: string) {
  console.log(`\n${'═'.repeat(72)}`);
  console.log(`${data} — ${porExtenso(data)}`);
  if (porque) console.log(`(${porque})`);
  console.log(`GET ${url(data)}`);
  console.log('═'.repeat(72));

  let bruto: unknown;
  try {
    const resposta = await fetch(url(data), { headers: { Accept: 'application/json' } });
    console.log(`HTTP ${resposta.status} ${resposta.statusText}`);
    if (!resposta.ok) {
      console.log(await resposta.text().then((t) => t.slice(0, 400)));
      return;
    }
    bruto = await resposta.json();
  } catch (erro) {
    console.log(`✗ falhou: ${erro instanceof Error ? erro.message : String(erro)}`);
    return;
  }

  mkdirSync('docs/amostras', { recursive: true });
  const arquivo = `docs/amostras/${data}.json`;
  writeFileSync(arquivo, JSON.stringify(bruto, null, 2));

  console.log('\n── estrutura devolvida ──');
  for (const linha of esqueleto(bruto)) console.log(`  ${linha}`);

  const liturgia = normalizar(data, bruto);
  console.log('\n── como o app entendeu ──');
  console.log(`  celebração: ${liturgia.celebracao}`);
  console.log(`  cor: ${liturgia.cor}   ano ${liturgia.anoLiturgico} · ciclo ${liturgia.cicloFerial}`);
  console.log(`  leituras: ${liturgia.leituras.length}`);
  for (const l of liturgia.leituras) {
    const previa = l.texto.slice(0, 70).replace(/\n/g, ' ');
    console.log(`    • ${l.titulo} — ${l.refResumida || '(sem referência)'}`);
    console.log(`      ${previa}…`);
    if (l.refrao) console.log(`      refrão: ${l.refrao}`);
  }

  if (liturgia.semTextos) {
    console.log('\n  ⚠ O normalizador não achou nenhuma leitura nesta resposta.');
    console.log('    Compare a árvore acima com CHAVES_POR_TIPO em src/lib/liturgia/normalizar.ts.');
  } else {
    console.log(`\n  ✓ resposta crua salva em ${arquivo}`);
  }
}

async function main() {
  const argumentos = process.argv.slice(2);
  const alvos = argumentos.length > 0 ? argumentos.map((data) => ({ data, porque: undefined })) : PADRAO;

  for (const alvo of alvos) {
    await sondar(alvo.data, alvo.porque);
  }
  console.log('');
}

main();
