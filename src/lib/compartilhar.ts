/**
 * Copiar e compartilhar textos.
 *
 * Roda no navegador. As duas funções são deliberadamente tolerantes: em
 * celular antigo, em WebView e em navegador sem HTTPS, metade dessas APIs não
 * existe — e o botão precisa funcionar mesmo assim, porque a alternativa é a
 * pessoa copiar o texto da leitura à mão no meio da preparação da missa.
 */

/** Copia para a área de transferência. Devolve se conseguiu. */
export async function copiarTexto(texto: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(texto);
      return true;
    }
  } catch {
    // Cai no método antigo abaixo.
  }

  // `execCommand` é obsoleto, mas ainda é o único caminho em contexto não
  // seguro e em WebViews antigas — que é exatamente onde o app roda quando
  // alguém abre o link pelo navegador interno do WhatsApp.
  try {
    const area = document.createElement('textarea');
    area.value = texto;
    area.setAttribute('readonly', '');
    area.style.position = 'fixed';
    area.style.opacity = '0';
    document.body.appendChild(area);
    area.select();
    const deuCerto = document.execCommand('copy');
    document.body.removeChild(area);
    return deuCerto;
  } catch {
    return false;
  }
}

export type ResultadoCompartilhar = 'compartilhado' | 'whatsapp' | 'cancelado' | 'falhou';

/**
 * Compartilha usando a folha nativa do sistema quando existe, caindo no
 * WhatsApp quando não existe.
 *
 * A folha nativa é melhor porque deixa escolher o destino (grupo da liturgia,
 * anotações, e-mail). O link `wa.me` é o plano B por ser o destino real da
 * maioria das vezes.
 */
export async function compartilhar(texto: string, titulo?: string): Promise<ResultadoCompartilhar> {
  if (typeof navigator !== 'undefined' && navigator.share) {
    try {
      await navigator.share({ title: titulo, text: texto });
      return 'compartilhado';
    } catch (erro) {
      // O usuário fechar a folha de compartilhamento não é erro.
      if (erro instanceof DOMException && erro.name === 'AbortError') return 'cancelado';
    }
  }

  try {
    window.open(`https://wa.me/?text=${encodeURIComponent(texto)}`, '_blank', 'noopener,noreferrer');
    return 'whatsapp';
  } catch {
    return 'falhou';
  }
}
