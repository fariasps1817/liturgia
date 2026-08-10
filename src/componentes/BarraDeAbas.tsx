'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { IconeAjustes, IconeCalendario, IconeCalice, IconeLivro } from './icones';

const ABAS = [
  { href: '/calendario', rotulo: 'Calendário', Icone: IconeCalendario },
  { href: '/liturgia', rotulo: 'Liturgia', Icone: IconeLivro },
  { href: '/oracoes-eucaristicas', rotulo: 'Orações', Icone: IconeCalice },
  { href: '/configuracoes', rotulo: 'Ajustes', Icone: IconeAjustes },
] as const;

export function BarraDeAbas() {
  const caminho = usePathname();

  return (
    <nav
      aria-label="Navegação principal"
      className="pb-segura fixed inset-x-0 bottom-0 z-40 border-t border-borda bg-superficie/95 backdrop-blur"
    >
      <ul className="mx-auto flex max-w-lg">
        {ABAS.map(({ href, rotulo, Icone }) => {
          const ativa = caminho === href || caminho.startsWith(`${href}/`);
          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                aria-current={ativa ? 'page' : undefined}
                className={`flex min-h-[3.75rem] flex-col items-center justify-center gap-1 px-1 py-2 text-[0.6875rem] font-medium transition-colors ${
                  ativa ? 'text-realce' : 'text-tinta-fraca'
                }`}
              >
                <Icone className={ativa ? 'h-6 w-6' : 'h-6 w-6'} />
                {rotulo}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
