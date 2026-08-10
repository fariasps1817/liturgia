import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { OracaoEucaristica } from './tipos';

/**
 * Os textos do Missal, num arquivo de fora do repositório.
 *
 * # Por que não dentro de `index.ts`
 *
 * Duas razões, e as duas são práticas.
 *
 * A primeira é de direitos: a tradução do Missal é da CNBB. Num arquivo de
 * código, o texto vai para o GitHub junto com o resto — publicado, indexado,
 * clonável. Em `missal.local.txt`, que o .gitignore barra, ele fica na máquina
 * da paróquia e no servidor de vocês, que é uso interno da equipe.
 *
 * A segunda é de erro humano: colar parágrafos dentro de um objeto TypeScript
 * pede escapar aspas, cuidar de vírgula e de crase, e um deslize quebra o app
 * inteiro. Num arquivo de texto puro, o pior que acontece é um parágrafo ficar
 * no lugar errado — e o `npm run missal` mostra isso antes da Missa.
 *
 * # O formato
 *
 *     # ii-pos-sanctus
 *     Na verdade, ó Pai, vós sois santo e fonte de toda santidade…
 *     (pode ter quantas linhas e parágrafos precisar)
 *
 *     # ii-epiclese
 *     …
 *
 * Linhas iniciadas por `#` nomeiam a seção; `//` é comentário e some. O id é o
 * mesmo que está em `index.ts`, e `npm run missal` gera o arquivo já com todos
 * eles na ordem, para ser só preencher.
 */

export const ARQUIVO_DO_MISSAL = 'missal.local.txt';

export type TextosDoMissal = Record<string, string>;

/** Lê o arquivo e devolve `{ id da seção: texto }`. Sem arquivo, devolve vazio. */
export function carregarTextosDoMissal(raiz = process.cwd()): TextosDoMissal {
  let bruto: string;
  try {
    bruto = readFileSync(join(raiz, ARQUIVO_DO_MISSAL), 'utf8');
  } catch {
    // Nenhum arquivo é o caso normal: o app funciona sem ele, com os incipits.
    return {};
  }
  return interpretarMissal(bruto);
}

/** Separado da leitura para poder ser conferido sem tocar em disco. */
export function interpretarMissal(bruto: string): TextosDoMissal {
  const textos: TextosDoMissal = {};
  let idAtual: string | null = null;
  let linhas: string[] = [];

  const fechar = () => {
    if (!idAtual) return;
    const texto = linhas.join('\n').replace(/\n{3,}/g, '\n\n').trim();
    if (texto) textos[idAtual] = texto;
    linhas = [];
  };

  for (const linha of bruto.replace(/\r\n/g, '\n').split('\n')) {
    if (/^\s*\/\//.test(linha)) continue;
    const cabecalho = linha.match(/^\s*#\s*([\w-]+)\s*$/);
    if (cabecalho) {
      fechar();
      idAtual = cabecalho[1];
      continue;
    }
    if (idAtual) linhas.push(linha);
  }
  fechar();

  return textos;
}

/**
 * Encaixa os textos do arquivo nas seções correspondentes.
 *
 * Só preenche `texto` onde ele ainda está vazio: o que já vem no código —
 * as respostas da assembleia — é a fonte conferida e não se deixa sobrescrever
 * por um arquivo solto.
 */
export function comTextosDoMissal(
  oracao: OracaoEucaristica,
  textos: TextosDoMissal,
): OracaoEucaristica {
  return {
    ...oracao,
    secoes: oracao.secoes.map((secao) =>
      !secao.texto && textos[secao.id] ? { ...secao, texto: textos[secao.id] } : secao,
    ),
  };
}
