'use client';

import { useEffect, useRef, useState } from 'react';
import { compartilhar, copiarTexto } from '@/lib/compartilhar';
import { IconeCheck, IconeCopiar, IconeWhatsApp } from './icones';

/**
 * Barra fixa com "Copiar" e "Compartilhar".
 *
 * Fica presa ao rodapé porque o texto de uma leitura é longo: se os botões
 * ficassem no fim da página, quem quer compartilhar teria que rolar tudo até o
 * fim primeiro.
 */
export function AcoesDeTexto({ texto, titulo }: { texto: string; titulo: string }) {
  const [copiado, setCopiado] = useState(false);
  const [falhou, setFalhou] = useState(false);
  const tempoRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => () => clearTimeout(tempoRef.current), []);

  const aoCopiar = async () => {
    const deuCerto = await copiarTexto(texto);
    setCopiado(deuCerto);
    setFalhou(!deuCerto);
    clearTimeout(tempoRef.current);
    tempoRef.current = setTimeout(() => {
      setCopiado(false);
      setFalhou(false);
    }, 2500);
  };

  return (
    <div className="pb-segura fixed inset-x-0 bottom-[3.75rem] z-30 border-t border-borda bg-superficie/95 backdrop-blur">
      <div className="mx-auto flex max-w-lg gap-2 p-3">
        <button
          type="button"
          onClick={aoCopiar}
          className="flex min-h-14 flex-1 items-center justify-center gap-2 rounded-2xl border border-borda bg-superficie font-semibold text-tinta active:bg-superficie-2"
        >
          {copiado ? (
            <IconeCheck className="h-5 w-5 text-lit-verde" />
          ) : (
            <IconeCopiar className="h-5 w-5" />
          )}
          {copiado ? 'Copiado!' : falhou ? 'Não deu' : 'Copiar'}
        </button>

        <button
          type="button"
          onClick={() => compartilhar(texto, titulo)}
          className="flex min-h-14 flex-1 items-center justify-center gap-2 rounded-2xl bg-realce font-semibold text-superficie active:opacity-90"
        >
          <IconeWhatsApp className="h-5 w-5" />
          Compartilhar
        </button>
      </div>

      {/* Mensagens para leitor de tela — o ícone sozinho não anuncia nada. */}
      <p aria-live="polite" className="sr-only">
        {copiado ? 'Texto copiado.' : falhou ? 'Não foi possível copiar o texto.' : ''}
      </p>
    </div>
  );
}
