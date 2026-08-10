/**
 * Ícones em SVG inline.
 *
 * Sem biblioteca de ícones: são poucos, e uma dependência a menos é um
 * download a menos para quem abre o app pela primeira vez na porta da igreja.
 */
type Props = { className?: string };

const comum = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.75,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  viewBox: '0 0 24 24',
  'aria-hidden': true,
};

export function IconeCalendario({ className }: Props) {
  return (
    <svg {...comum} className={className}>
      <rect x="3" y="5" width="18" height="16" rx="2.5" />
      <path d="M3 10h18M8 3v4M16 3v4" />
    </svg>
  );
}

export function IconeLivro({ className }: Props) {
  return (
    <svg {...comum} className={className}>
      <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H19v14.5H6.5A2.5 2.5 0 0 0 4 20z" />
      <path d="M4 20a2.5 2.5 0 0 1 2.5-2.5H19V21H6.5A2.5 2.5 0 0 1 4 20z" />
    </svg>
  );
}

export function IconeCalice({ className }: Props) {
  return (
    <svg {...comum} className={className}>
      <path d="M6 4h12v3a6 6 0 0 1-12 0z" />
      <path d="M12 13v5M8.5 21h7" />
    </svg>
  );
}

export function IconeAjustes({ className }: Props) {
  return (
    <svg {...comum} className={className}>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2v3M12 19v3M22 12h-3M5 12H2M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1M18.4 18.4l-2.1-2.1M7.7 7.7 5.6 5.6" />
    </svg>
  );
}

export function IconeSeta({ className, direcao = 'direita' }: Props & { direcao?: 'esquerda' | 'direita' }) {
  return (
    <svg {...comum} className={className}>
      <path d={direcao === 'direita' ? 'M9 5l7 7-7 7' : 'M15 5l-7 7 7 7'} />
    </svg>
  );
}

export function IconeCopiar({ className }: Props) {
  return (
    <svg {...comum} className={className}>
      <rect x="9" y="9" width="12" height="12" rx="2" />
      <path d="M5 15V5a2 2 0 0 1 2-2h10" />
    </svg>
  );
}

export function IconeCheck({ className }: Props) {
  return (
    <svg {...comum} className={className}>
      <path d="M4 12.5 9 17.5 20 6.5" />
    </svg>
  );
}

export function IconeWhatsApp({ className }: Props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.61-.92-2.21-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37s-1.04 1.02-1.04 2.48 1.07 2.88 1.22 3.08c.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.69.63.71.23 1.36.19 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.42-.07-.13-.27-.2-.57-.35z" />
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.87 9.87 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2m0 1.67c2.2 0 4.27.86 5.83 2.42a8.2 8.2 0 0 1 2.41 5.82c0 4.54-3.7 8.24-8.25 8.24a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.25-8.24" />
    </svg>
  );
}

export function IconeSol({ className }: Props) {
  return (
    <svg {...comum} className={className}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M22 12h-2M4 12H2M19.07 4.93l-1.41 1.41M6.34 17.66l-1.41 1.41M19.07 19.07l-1.41-1.41M6.34 6.34 4.93 4.93" />
    </svg>
  );
}

export function IconeLua({ className }: Props) {
  return (
    <svg {...comum} className={className}>
      <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8" />
    </svg>
  );
}

export function IconeCelular({ className }: Props) {
  return (
    <svg {...comum} className={className}>
      <rect x="6" y="2.5" width="12" height="19" rx="2.5" />
      <path d="M11 18.5h2" />
    </svg>
  );
}

export function IconeCoracao({ className }: Props) {
  return (
    <svg {...comum} className={className}>
      <path d="M12 20.5s-7.5-4.7-7.5-9.8A4.2 4.2 0 0 1 12 7.6a4.2 4.2 0 0 1 7.5 3.1c0 5.1-7.5 9.8-7.5 9.8" />
    </svg>
  );
}

export function IconeMais({ className }: Props) {
  return (
    <svg {...comum} className={className}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

export function IconeMenos({ className }: Props) {
  return (
    <svg {...comum} className={className}>
      <path d="M5 12h14" />
    </svg>
  );
}

export function IconeAviso({ className }: Props) {
  return (
    <svg {...comum} className={className}>
      <path d="M12 3.5 21.5 20h-19z" />
      <path d="M12 10v4M12 17.2v.1" />
    </svg>
  );
}

export function IconeFaisca({ className }: Props) {
  return (
    <svg {...comum} className={className}>
      <path d="M12 3v4M12 17v4M4.9 7.5l2.8 2.8M16.3 13.7l2.8 2.8M3 12h4M17 12h4M4.9 16.5l2.8-2.8M16.3 10.3l2.8-2.8" />
      <circle cx="12" cy="12" r="2.5" />
    </svg>
  );
}
