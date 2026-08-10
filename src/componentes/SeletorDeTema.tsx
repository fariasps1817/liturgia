'use client';

import { useTheme } from 'next-themes';
import { IconeCelular, IconeLua, IconeSol } from './icones';

const OPCOES = [
  { valor: 'light', rotulo: 'Claro', Icone: IconeSol },
  { valor: 'dark', rotulo: 'Escuro', Icone: IconeLua },
  { valor: 'system', rotulo: 'Sistema', Icone: IconeCelular },
] as const;

export function SeletorDeTema() {
  // `theme` vem indefinido no servidor e na primeira renderização do cliente —
  // o next-themes só sabe a escolha depois de ler o armazenamento local. Usar
  // isso direto dispensa a bandeira "montado" e o efeito que a acompanhava.
  const { theme, setTheme } = useTheme();

  return (
    <div role="radiogroup" aria-label="Tema do aplicativo" className="flex gap-2">
      {OPCOES.map(({ valor, rotulo, Icone }) => {
        const ativo = theme === valor;
        return (
          <button
            key={valor}
            type="button"
            role="radio"
            aria-checked={ativo}
            onClick={() => setTheme(valor)}
            className={`flex min-h-20 flex-1 flex-col items-center justify-center gap-1.5 rounded-2xl border text-xs font-semibold transition-colors ${
              ativo
                ? 'border-realce bg-realce/10 text-realce'
                : 'border-borda bg-superficie text-tinta-suave active:bg-superficie-2'
            }`}
          >
            <Icone className="h-5 w-5" />
            {rotulo}
          </button>
        );
      })}
    </div>
  );
}
