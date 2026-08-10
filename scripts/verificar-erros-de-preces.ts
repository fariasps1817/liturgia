/**
 * Confere o que a tela diz quando a geração de preces falha.
 *
 * São seis desfechos e, na prática, só um aparece por vez — o que estiver
 * quebrado na conta naquele dia. Sem esta conferência, cinco deles nunca são
 * exercitados até a hora errada: sábado à noite, preparando a missa.
 *
 * O que importa em cada um é a orientação. "Tente de novo em instantes" para
 * uma conta sem créditos faz a pessoa insistir no botão em vez de ir ao
 * console da Anthropic.
 *
 *   npm run verificar
 */
import Anthropic from '@anthropic-ai/sdk';
import { ErroAoGerarPreces, traduzirErroDaApi } from '../src/lib/preces/erros';

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

const MODELO = 'claude-opus-5';

/** Monta um erro do SDK como ele chega de verdade: status + corpo da API. */
function erroDaApi(status: number, mensagem: string, tipo = 'invalid_request_error') {
  const corpo = { type: 'error', error: { type: tipo, message: mensagem } };
  return new Anthropic.APIError(status, corpo, mensagem, new Headers());
}

/** Roda a tradução e devolve a mensagem que a equipe veria na tela. */
function mensagemDe(erro: unknown): string {
  try {
    traduzirErroDaApi(erro, MODELO);
  } catch (traduzido) {
    if (traduzido instanceof ErroAoGerarPreces) return traduzido.message;
    return `<não traduzido: ${traduzido instanceof Error ? traduzido.message : String(traduzido)}>`;
  }
  return '<não lançou nada>';
}

/** Verdadeiro quando a mensagem manda esperar e tentar de novo. */
function mandaTentarDeNovo(mensagem: string): boolean {
  return /tente de novo|gere de novo/i.test(mensagem) && !/não resolve/i.test(mensagem);
}

console.log('\n— Problemas que tentar de novo NÃO resolve —');
{
  // O caso real de 10/08/2026: a conta ficou sem créditos.
  const semCredito = mensagemDe(
    erroDaApi(400, 'Your credit balance is too low to access the Anthropic API. Please go to Plans & Billing to upgrade or purchase credits.'),
  );
  conferir('sem créditos: não manda insistir', mandaTentarDeNovo(semCredito), false);
  conferir('sem créditos: diz onde resolver', /Plans & Billing/.test(semCredito), true);

  const chaveRuim = mensagemDe(erroDaApi(401, 'invalid x-api-key', 'authentication_error'));
  conferir('chave recusada: não manda insistir', mandaTentarDeNovo(chaveRuim), false);
  conferir('chave recusada: nomeia a variável', /ANTHROPIC_API_KEY/.test(chaveRuim), true);

  const semPermissao = mensagemDe(erroDaApi(403, 'permission denied', 'permission_error'));
  conferir('403 cai no mesmo aviso da chave', /ANTHROPIC_API_KEY/.test(semPermissao), true);

  const modeloRuim = mensagemDe(erroDaApi(404, 'model: claude-inexistente-9', 'not_found_error'));
  conferir('modelo inválido: nomeia a variável', /MODELO_IA/.test(modeloRuim), true);
  conferir('modelo inválido: mostra o modelo', modeloRuim.includes(MODELO), true);
}

console.log('\n— Problemas passageiros: aí sim, tentar de novo —');
{
  const limite = mensagemDe(erroDaApi(429, 'rate limit exceeded', 'rate_limit_error'));
  conferir('429 manda tentar de novo', mandaTentarDeNovo(limite), true);

  const foraDoAr = mensagemDe(erroDaApi(529, 'overloaded', 'overloaded_error'));
  conferir('529 manda tentar de novo', mandaTentarDeNovo(foraDoAr), true);

  const erroDeles = mensagemDe(erroDaApi(500, 'internal server error', 'api_error'));
  conferir('500 manda tentar de novo', mandaTentarDeNovo(erroDeles), true);
}

console.log('\n— O que não previmos —');
{
  // Um 400 qualquer, sem relação com cobrança: repassa o que a API disse.
  const desconhecido = mensagemDe(erroDaApi(400, 'max_tokens: must be greater than 0'));
  conferir('repassa o detalhe da API', /max_tokens/.test(desconhecido), true);
  conferir('e informa o status', /400/.test(desconhecido), true);

  // Erro sem corpo aproveitável não pode virar "undefined" na tela.
  const semCorpo = mensagemDe(new Anthropic.APIError(400, undefined, 'sem corpo', new Headers()));
  conferir('erro sem corpo não vaza "undefined"', /undefined/.test(semCorpo), false);
}

console.log('\n— Erros que não são da API passam intactos —');
{
  // Uma falha de rede ou um bug nosso não pode virar mensagem litúrgica.
  const rede = new TypeError('fetch failed');
  let repassado: unknown;
  try {
    traduzirErroDaApi(rede, MODELO);
  } catch (erro) {
    repassado = erro;
  }
  conferir('erro de rede sai como veio', repassado, rede);
  conferir('e não vira ErroAoGerarPreces', repassado instanceof ErroAoGerarPreces, false);
}

console.log(
  falhas === 0
    ? `\n✓ ${total} conferências passaram.\n`
    : `\n✗ ${falhas} de ${total} conferências falharam.\n`,
);
process.exit(falhas === 0 ? 0 : 1);
