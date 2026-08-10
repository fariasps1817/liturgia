'use client';

import { useState } from 'react';
import { IconeSeta, IconeWhatsApp } from './icones';

/**
 * Os dados do desenvolvedor ficam escondidos até alguém tocar.
 *
 * Não é segredo — é hierarquia: quem abre as Configurações na sacristia está
 * atrás do tema ou da versão, não do telefone de quem fez o app. Quem quer
 * falar com ele acha em um toque.
 */
export function BlocoDoDesenvolvedor({
  nome,
  telefoneFormatado,
  linkWhatsApp,
}: {
  nome: string;
  telefoneFormatado: string;
  linkWhatsApp: string;
}) {
  const [aberto, setAberto] = useState(false);

  return (
    <div className="overflow-hidden rounded-2xl border border-borda bg-superficie">
      <button
        type="button"
        onClick={() => setAberto((v) => !v)}
        aria-expanded={aberto}
        className="flex min-h-14 w-full items-center justify-between px-4 text-left active:bg-superficie-2"
      >
        <span className="font-semibold text-tinta">Desenvolvedor</span>
        <IconeSeta
          className={`h-5 w-5 text-tinta-fraca transition-transform ${aberto ? 'rotate-90' : ''}`}
        />
      </button>

      {aberto ? (
        <div className="border-t border-borda px-4 py-4">
          <p className="text-lg font-semibold text-tinta">{nome}</p>
          <a
            href={linkWhatsApp}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-lit-verde/15 font-semibold text-lit-verde active:opacity-80"
          >
            <IconeWhatsApp className="h-5 w-5" />
            {telefoneFormatado}
          </a>
          <p className="mt-2 text-center text-xs text-tinta-fraca">Abre uma conversa no WhatsApp.</p>
        </div>
      ) : null}
    </div>
  );
}
