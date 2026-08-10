import 'server-only';

import { createClient, type Client } from '@libsql/client';
import { COMUNIDADE_PADRAO, type ConteudoDasPreces, type Preces } from './tipos';

/**
 * Armazenamento das preces.
 *
 * As preces são geradas uma vez e lidas por toda a equipe: quem prepara a missa
 * de manhã gera, e quem vai proclamar abre no celular dele na hora. Por isso
 * ficam no servidor, e não no aparelho.
 *
 * Em produção usa Turso (libSQL). Sem as variáveis de ambiente, cai num arquivo
 * SQLite local — assim `npm run dev` funciona recém-clonado, sem cadastro em
 * lugar nenhum.
 */

let clientePromessa: Promise<Client> | null = null;

function urlDoBanco(): string {
  const url = process.env.TURSO_DATABASE_URL;
  if (url) return url;
  if (process.env.NODE_ENV === 'production') {
    throw new Error(
      'TURSO_DATABASE_URL não está configurada. Sem ela as preces não podem ser salvas nem compartilhadas com a equipe.',
    );
  }
  return 'file:.dados/preces.db';
}

async function cliente(): Promise<Client> {
  clientePromessa ??= (async () => {
    const c = createClient({
      url: urlDoBanco(),
      authToken: process.env.TURSO_AUTH_TOKEN,
    });

    await c.execute(`
      CREATE TABLE IF NOT EXISTS preces (
        data           TEXT NOT NULL,
        comunidade     TEXT NOT NULL,
        resposta       TEXT NOT NULL,
        intencao_local TEXT,
        conteudo       TEXT NOT NULL,
        modelo         TEXT NOT NULL,
        criado_em      TEXT NOT NULL,
        PRIMARY KEY (data, comunidade)
      )
    `);

    return c;
  })();

  return clientePromessa;
}

export async function buscarPreces(
  data: string,
  comunidade = COMUNIDADE_PADRAO,
): Promise<Preces | null> {
  const c = await cliente();
  const resultado = await c.execute({
    sql: 'SELECT * FROM preces WHERE data = ? AND comunidade = ?',
    args: [data, comunidade],
  });

  const linha = resultado.rows[0];
  if (!linha) return null;

  const conteudo = JSON.parse(String(linha.conteudo)) as ConteudoDasPreces;
  return {
    ...conteudo,
    data: String(linha.data),
    comunidade: String(linha.comunidade),
    intencaoLocal: linha.intencao_local ? String(linha.intencao_local) : undefined,
    modelo: String(linha.modelo),
    criadoEm: String(linha.criado_em),
  };
}

/** Só verifica existência — usado para etiquetar o botão na lista do dia. */
export async function precesExistem(
  data: string,
  comunidade = COMUNIDADE_PADRAO,
): Promise<boolean> {
  const c = await cliente();
  const resultado = await c.execute({
    sql: 'SELECT 1 FROM preces WHERE data = ? AND comunidade = ? LIMIT 1',
    args: [data, comunidade],
  });
  return resultado.rows.length > 0;
}

export async function salvarPreces(preces: Preces): Promise<void> {
  const { data, comunidade, resposta, introducao, intencoes, conclusao, intencaoLocal, modelo, criadoEm } =
    preces;

  const c = await cliente();
  // `REPLACE` porque "Refazer preces" sobrescreve: a equipe quer uma versão
  // por dia, não um histórico — duas versões na tela geraria confusão na missa.
  await c.execute({
    sql: `
      REPLACE INTO preces (data, comunidade, resposta, intencao_local, conteudo, modelo, criado_em)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `,
    args: [
      data,
      comunidade,
      resposta,
      intencaoLocal ?? null,
      JSON.stringify({ resposta, introducao, intencoes, conclusao }),
      modelo,
      criadoEm,
    ],
  });
}

export async function apagarPreces(data: string, comunidade = COMUNIDADE_PADRAO): Promise<void> {
  const c = await cliente();
  await c.execute({
    sql: 'DELETE FROM preces WHERE data = ? AND comunidade = ?',
    args: [data, comunidade],
  });
}
