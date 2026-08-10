/**
 * O que dizer à equipe quando a geração de preces falha.
 *
 * Fica fora de `gerar.ts` — e sem `server-only` — porque é lógica pura, que
 * precisa ser conferida por script: são seis desfechos e, na prática, só um
 * aparece por vez. Mensagem errada aqui não quebra nada visivelmente, só faz a
 * pessoa insistir num botão que nunca vai funcionar.
 */

import { APIError } from '@anthropic-ai/sdk';

export class ErroAoGerarPreces extends Error {}

/** Mensagem que a Anthropic mandou no corpo do erro, quando mandou alguma. */
function detalheDaApi(erro: APIError): string {
  const corpo = erro.error as { error?: { message?: unknown } } | undefined;
  const mensagem = corpo?.error?.message;
  return typeof mensagem === 'string' ? mensagem : '';
}

/**
 * Traduz as falhas da API para o que a equipe precisa saber na sacristia.
 *
 * A rota só distingue `ErroAoGerarPreces` do resto, e o resto vira "tente de
 * novo em instantes". Para uma conta sem créditos ou uma chave recusada isso é
 * mentira: nenhuma tentativa vai funcionar, e quem está com a missa em cima
 * insiste no botão em vez de ir resolver o que de fato está errado.
 *
 * Declarada como `never` para ser usada direto em `.catch()`.
 */
export function traduzirErroDaApi(erro: unknown, modelo: string): never {
  if (!(erro instanceof APIError)) throw erro;

  const detalhe = detalheDaApi(erro);

  // Sem créditos vem como 400 invalid_request_error, não como 402.
  if (/credit balance|billing|quota|insufficient/i.test(detalhe)) {
    throw new ErroAoGerarPreces(
      'A conta da Anthropic está sem créditos. Adicione créditos em console.anthropic.com, ' +
        'em Plans & Billing — tentar de novo não resolve.',
    );
  }

  if (erro.status === 401 || erro.status === 403) {
    throw new ErroAoGerarPreces(
      'A chave da IA foi recusada pela Anthropic. Confira ANTHROPIC_API_KEY no servidor — ' +
        'tentar de novo não resolve.',
    );
  }

  if (erro.status === 404 && /model/i.test(detalhe)) {
    throw new ErroAoGerarPreces(
      `O modelo "${modelo}" não existe ou não está liberado para esta chave. Confira MODELO_IA.`,
    );
  }

  if (erro.status === 429) {
    throw new ErroAoGerarPreces(
      'A Anthropic está limitando os pedidos agora. Espere um minuto e gere de novo.',
    );
  }

  if (erro.status >= 500) {
    throw new ErroAoGerarPreces(
      'A Anthropic está fora do ar ou sobrecarregada. Tente de novo em instantes.',
    );
  }

  // Só sobra o que não previmos: repassa o que veio, que é melhor que silêncio.
  throw new ErroAoGerarPreces(
    `A Anthropic recusou o pedido${erro.status ? ` (${erro.status})` : ''}.${detalhe ? ` ${detalhe}` : ''}`,
  );
}
