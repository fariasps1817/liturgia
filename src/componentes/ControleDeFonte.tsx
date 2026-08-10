'use client';

import { useSyncExternalStore } from 'react';
import { CHAVE_ESCALA as CHAVE, ESCALA_PADRAO as PADRAO, ESCALAS } from '@/lib/escala-leitura';
import { IconeMais, IconeMenos } from './icones';

/*
 * A escala fica no localStorage — uma fonte externa ao React, que existe só no
 * navegador e cujo valor difere do que o servidor renderizou. `useSyncExternalStore`
 * é feito exatamente para isso: cuida do instantâneo do servidor sem quebrar a
 * hidratação e sem precisar de um `useEffect` que dispara re-render em cascata.
 */
const ouvintes = new Set<() => void>();

function inscrever(aoMudar: () => void): () => void {
  ouvintes.add(aoMudar);
  // `storage` avisa quando a escala muda em outra aba do mesmo app.
  const deOutraAba = (evento: StorageEvent) => {
    if (evento.key === CHAVE) aoMudar();
  };
  window.addEventListener('storage', deOutraAba);
  return () => {
    ouvintes.delete(aoMudar);
    window.removeEventListener('storage', deOutraAba);
  };
}

function lerEscala(): number {
  try {
    const guardada = Number(window.localStorage.getItem(CHAVE));
    return ESCALAS.includes(guardada) ? guardada : PADRAO;
  } catch {
    return PADRAO;
  }
}

function lerEscalaNoServidor(): number {
  return PADRAO;
}

function definirEscala(escala: number) {
  try {
    window.localStorage.setItem(CHAVE, String(escala));
  } catch {
    // Navegação anônima com armazenamento bloqueado: aplica sem guardar.
  }
  document.documentElement.style.setProperty('--escala-leitura', String(escala));
  for (const aviso of ouvintes) aviso();
}

/**
 * Aumenta e diminui o corpo do texto das leituras.
 *
 * Não é enfeite: boa parte de quem proclama a leitura na missa tem mais de 60
 * anos e lê sem óculos de perto. O ajuste fica guardado no aparelho para não
 * precisar refazer a cada leitura.
 */
export function ControleDeFonte() {
  const escala = useSyncExternalStore(inscrever, lerEscala, lerEscalaNoServidor);
  const indice = Math.max(0, ESCALAS.indexOf(escala));

  return (
    <div className="flex items-center gap-1 rounded-full border border-borda bg-superficie p-1">
      <button
        type="button"
        onClick={() => definirEscala(ESCALAS[Math.max(0, indice - 1)])}
        disabled={indice === 0}
        aria-label="Diminuir o tamanho do texto"
        className="flex h-9 w-9 items-center justify-center rounded-full text-tinta-suave disabled:opacity-30 active:bg-superficie-2"
      >
        <IconeMenos className="h-4 w-4" />
      </button>

      <span
        aria-live="polite"
        className="w-11 text-center text-xs font-semibold tabular-nums text-tinta-suave"
      >
        {Math.round(escala * 100)}%
      </span>

      <button
        type="button"
        onClick={() => definirEscala(ESCALAS[Math.min(ESCALAS.length - 1, indice + 1)])}
        disabled={indice === ESCALAS.length - 1}
        aria-label="Aumentar o tamanho do texto"
        className="flex h-9 w-9 items-center justify-center rounded-full text-tinta-suave disabled:opacity-30 active:bg-superficie-2"
      >
        <IconeMais className="h-4 w-4" />
      </button>
    </div>
  );
}
