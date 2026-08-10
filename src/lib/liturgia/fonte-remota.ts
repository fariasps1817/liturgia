/**
 * Cliente da fonte externa de leituras.
 *
 * Roda só no servidor. O celular nunca fala com a fonte direto — passa sempre
 * pela nossa rota `/api/liturgia/[data]`, o que nos dá cache, tolerância a
 * queda e liberdade de trocar de fonte sem atualizar o app instalado.
 */

import { ano, dia, mes } from './datas';
import { normalizar } from './normalizar';
import type { LiturgiaDoDia } from './tipos';

const BASE = process.env.LITURGIA_API_BASE ?? 'https://liturgia.up.railway.app/v2';

export const FONTE = {
  nome: 'liturgia.up.railway.app',
  url: 'https://github.com/Dancrf/liturgia-diaria',
};

/** Um dia de liturgia não muda depois de publicado — cache generoso. */
const SEGUNDOS_DE_CACHE = 60 * 60 * 24;

const TEMPO_LIMITE_MS = 8_000;

export function urlDaFonte(data: string): string {
  const url = new URL(BASE);
  url.searchParams.set('dia', String(dia(data)).padStart(2, '0'));
  url.searchParams.set('mes', String(mes(data)).padStart(2, '0'));
  url.searchParams.set('ano', String(ano(data)));
  return url.toString();
}

export type ResultadoBusca = {
  liturgia: LiturgiaDoDia;
  /** Preenchido quando a fonte falhou e só há o calendário calculado. */
  erro?: string;
};

/**
 * Busca a liturgia do dia.
 *
 * Nunca lança: se a fonte cair, devolve a liturgia montada só com o calendário
 * local (celebração, cor, ciclos) e o motivo em `erro`. Quem chama decide como
 * avisar — mas a tela nunca fica vazia.
 */
export async function buscarLiturgia(data: string): Promise<ResultadoBusca> {
  const controle = new AbortController();
  const limite = setTimeout(() => controle.abort(), TEMPO_LIMITE_MS);

  try {
    const resposta = await fetch(urlDaFonte(data), {
      signal: controle.signal,
      headers: { Accept: 'application/json' },
      next: { revalidate: SEGUNDOS_DE_CACHE },
    });

    if (!resposta.ok) {
      return {
        liturgia: normalizar(data, null),
        erro: `A fonte respondeu ${resposta.status}.`,
      };
    }

    const bruto = await resposta.json();
    const liturgia = normalizar(data, bruto);

    if (liturgia.semTextos) {
      return {
        liturgia,
        erro: 'A fonte respondeu, mas sem as leituras deste dia.',
      };
    }

    return { liturgia: { ...liturgia, fonte: FONTE } };
  } catch (causa) {
    const motivo =
      causa instanceof Error && causa.name === 'AbortError'
        ? 'A fonte demorou demais para responder.'
        : 'Não foi possível falar com a fonte das leituras.';
    return { liturgia: normalizar(data, null), erro: motivo };
  } finally {
    clearTimeout(limite);
  }
}
