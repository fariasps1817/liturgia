/**
 * Confere as duas pontas da geração de preces que não dá para testar à mão:
 * o pedido que a OpenAI aceita, e o que a tela diz quando a coisa falha.
 *
 * São seis desfechos de erro e, na prática, só um aparece por vez — o que
 * estiver quebrado na conta naquele dia. Sem esta conferência, cinco deles
 * nunca são exercitados até a hora errada: sábado à noite, preparando a missa.
 *
 * O que importa em cada um é a orientação. "Tente de novo em instantes" para
 * uma conta sem créditos faz a pessoa insistir no botão em vez de ir à fatura.
 *
 *   npm run verificar
 */
import { APIError } from 'openai';
import { zodResponseFormat } from 'openai/helpers/zod';
import { ErroAoGerarPreces, traduzirErroDaApi } from '../src/lib/preces/erros';
import { EsquemaDasPreces } from '../src/lib/preces/esquema';

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

const MODELO = 'gpt-4o-mini';

/** Monta um erro do SDK como ele chega de verdade: status + corpo da API. */
function erroDaApi(status: number, mensagem: string, codigo?: string, tipo?: string) {
  const corpo = { message: mensagem, type: tipo, code: codigo };
  return new APIError(status, corpo, mensagem, new Headers());
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

console.log('\n— O esquema que a OpenAI aceita no modo estrito —');
{
  /*
   * O modo estrito recusa o schema inteiro, com 400, se encontrar palavra-chave
   * que ele não suporta — e aí nenhuma prece é gerada, para nenhum dia. É um
   * tropeço fácil: `.length(4)` ou `.min(1)` no zod viram `minItems`/`maxItems`
   * sem aviso nenhum, e a falha só aparece na primeira geração de verdade.
   */
  const formato = zodResponseFormat(EsquemaDasPreces, 'preces');
  const schema = JSON.stringify(formato.json_schema.schema);

  const proibidas = ['minItems', 'maxItems', 'uniqueItems', 'minLength', 'maxLength', 'pattern', 'format', 'minimum', 'maximum', 'default'];
  const encontradas = proibidas.filter((palavra) => schema.includes(`"${palavra}"`));
  conferir(`sem palavras-chave recusadas${encontradas.length ? ` (achou ${encontradas.join(', ')})` : ''}`, encontradas.length, 0);

  conferir('modo estrito ligado', formato.json_schema.strict, true);

  // O estrito exige que todo campo seja obrigatório e que objetos fechem.
  conferir('objetos fechados', schema.includes('"additionalProperties":false'), true);
  for (const campo of ['resposta', 'chamado', 'intencoes', 'serie', 'texto']) {
    conferir(`campo "${campo}" presente`, schema.includes(`"${campo}"`), true);
  }

  // As falas do sacerdote saíram: ele as lê do Missal, e gerá-las era escrever
  // para ninguém. Se voltarem ao esquema sem voltar à tela, é desperdício mudo.
  for (const campo of ['introducao', 'conclusao']) {
    conferir(`campo "${campo}" fora do esquema`, schema.includes(`"${campo}"`), false);
  }

  // A contagem saiu do schema, então precisa estar dita em palavras.
  const descricoes = schema.match(/"description":"[^"]*"/g)?.join(' ') ?? '';
  conferir('as quatro séries são exigidas na descrição', /quatro/i.test(descricoes), true);
}

console.log('\n— Os dois 429 da OpenAI, que pedem coisas opostas —');
{
  /*
   * Esta é a distinção que mais importa aqui. Sem saldo e excesso de pedidos
   * chegam ambos como 429; se o saldo cair no ramo do limite de uso, a tela
   * manda esperar um minuto e tentar de novo — para sempre, sem nunca dizer
   * que o problema é a fatura.
   */
  const semCredito = mensagemDe(
    erroDaApi(429, 'You exceeded your current quota, please check your plan and billing details.', 'insufficient_quota'),
  );
  conferir('sem créditos: não manda insistir', mandaTentarDeNovo(semCredito), false);
  conferir('sem créditos: diz onde resolver', /Billing/.test(semCredito), true);

  const limite = mensagemDe(
    erroDaApi(429, 'Rate limit reached for gpt-4o-mini', 'rate_limit_exceeded'),
  );
  conferir('limite de uso: manda tentar de novo', mandaTentarDeNovo(limite), true);
  conferir('limite de uso: não fala em fatura', /Billing|créditos/.test(limite), false);
}

console.log('\n— Problemas que tentar de novo NÃO resolve —');
{
  const chaveRuim = mensagemDe(erroDaApi(401, 'Incorrect API key provided', 'invalid_api_key'));
  conferir('chave recusada: não manda insistir', mandaTentarDeNovo(chaveRuim), false);
  conferir('chave recusada: nomeia a variável', /OPENAI_API_KEY/.test(chaveRuim), true);

  const semPermissao = mensagemDe(erroDaApi(403, 'Project does not have access', 'permission_denied'));
  conferir('403 cai no mesmo aviso da chave', /OPENAI_API_KEY/.test(semPermissao), true);

  const modeloRuim = mensagemDe(erroDaApi(404, 'The model does not exist', 'model_not_found'));
  conferir('modelo inválido: nomeia a variável', /MODELO_IA/.test(modeloRuim), true);
  conferir('modelo inválido: mostra o modelo', modeloRuim.includes(MODELO), true);
}

console.log('\n— Problemas passageiros: aí sim, tentar de novo —');
{
  const foraDoAr = mensagemDe(erroDaApi(503, 'The engine is currently overloaded'));
  conferir('503 manda tentar de novo', mandaTentarDeNovo(foraDoAr), true);

  const erroDeles = mensagemDe(erroDaApi(500, 'internal server error', undefined, 'server_error'));
  conferir('500 manda tentar de novo', mandaTentarDeNovo(erroDeles), true);
}

console.log('\n— O que não previmos —');
{
  // Um 400 qualquer, sem relação com cobrança: repassa o que a API disse.
  const desconhecido = mensagemDe(
    erroDaApi(400, 'Invalid schema for response_format', 'invalid_request_error'),
  );
  conferir('repassa o detalhe da API', /response_format/.test(desconhecido), true);
  conferir('e informa o status', /400/.test(desconhecido), true);

  // Erro sem corpo aproveitável não pode virar "undefined" na tela.
  const semCorpo = mensagemDe(new APIError(400, undefined, 'sem corpo', new Headers()));
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
