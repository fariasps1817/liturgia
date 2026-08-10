'use client';

import { useEffect, useRef, useState } from 'react';
import { copiarTexto } from '@/lib/compartilhar';
import { IconeCheck, IconeCopiar } from './icones';

export function BotaoCopiar({
  texto,
  rotulo = 'Copiar',
  rotuloAcessivel,
  className = '',
}: {
  texto: string;
  rotulo?: string;
  rotuloAcessivel?: string;
  className?: string;
}) {
  const [copiado, setCopiado] = useState(false);
  const tempoRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => () => clearTimeout(tempoRef.current), []);

  const aoClicar = async () => {
    const deuCerto = await copiarTexto(texto);
    setCopiado(deuCerto);
    clearTimeout(tempoRef.current);
    tempoRef.current = setTimeout(() => setCopiado(false), 2500);
  };

  return (
    <button
      type="button"
      onClick={aoClicar}
      aria-label={rotuloAcessivel}
      className={`flex min-h-12 items-center justify-center gap-2 rounded-xl border border-borda bg-superficie px-4 text-sm font-semibold text-tinta active:bg-superficie-2 ${className}`}
    >
      {copiado ? (
        <IconeCheck className="h-4 w-4 text-lit-verde" />
      ) : (
        <IconeCopiar className="h-4 w-4" />
      )}
      {copiado ? 'Copiado!' : rotulo}
    </button>
  );
}
