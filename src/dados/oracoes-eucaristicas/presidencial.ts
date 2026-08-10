import type { OracaoEucaristica } from './tipos';

/**
 * A chave que libera o texto integral das falas do celebrante.
 *
 * Os direitos do Missal Romano em português são da CNBB. Enquanto não houver
 * autorização escrita, o app mostra das falas do sacerdote apenas o `incipit` —
 * as primeiras palavras, que bastam de deixa para quem acompanha.
 *
 * # Por que apagar no servidor, e não esconder na tela
 *
 * Esconder com um `if` no componente deixaria o texto viajar dentro do HTML
 * e do payload da página: qualquer um o lê no "ver código-fonte", e os
 * buscadores o indexam. Para uma questão de direitos autorais isso não é
 * proteção nenhuma — é o texto publicado com um véu por cima.
 *
 * Aqui o texto é removido antes de sair do servidor. Com a chave desligada,
 * ele não chega ao navegador de forma alguma.
 */
export function aplicarTextoPresidencial(
  oracao: OracaoEucaristica,
  mostrar: boolean,
): OracaoEucaristica {
  if (mostrar) return oracao;

  return {
    ...oracao,
    secoes: oracao.secoes.map((secao) =>
      // As respostas da assembleia nunca são tocadas: são a razão de ser do app.
      secao.quem === 'presidente' && secao.texto ? { ...secao, texto: undefined } : secao,
    ),
  };
}

/** Lê a chave do ambiente. Só é verdadeira com o literal "true". */
export function mostrarTextoPresidencial(): boolean {
  return process.env.MOSTRAR_TEXTO_PRESIDENCIAL === 'true';
}
