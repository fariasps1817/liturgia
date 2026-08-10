import type { Metadata, Viewport } from 'next';
import { BarraDeAbas } from '@/componentes/BarraDeAbas';
import { ProvedorDeTema } from '@/componentes/ProvedorDeTema';
import { RegistrarServiceWorker } from '@/componentes/RegistrarServiceWorker';
import { SCRIPT_ESCALA_INICIAL } from '@/lib/escala-leitura';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'Liturgia Diária',
    template: '%s · Liturgia Diária',
  },
  description:
    'Leituras da missa, preces da assembleia e Orações Eucarísticas para equipes de liturgia.',
  applicationName: 'Liturgia',
  appleWebApp: {
    capable: true,
    title: 'Liturgia',
    statusBarStyle: 'default',
  },
  formatDetection: { telephone: false },
  icons: {
    icon: [{ url: '/icone.svg', type: 'image/svg+xml' }],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180' }],
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#faf8f5' },
    { media: '(prefers-color-scheme: dark)', color: '#0b0b0d' },
  ],
  width: 'device-width',
  initialScale: 1,
  // Sem `maximumScale`: bloquear o zoom quebra a leitura de quem enxerga pouco,
  // e este app é usado por gente que precisa aumentar o texto.
  viewportFit: 'cover',
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning className="h-full">
      <head>
        {/* Aplica o tamanho de texto guardado antes da primeira pintura. */}
        <script dangerouslySetInnerHTML={{ __html: SCRIPT_ESCALA_INICIAL }} />
      </head>
      <body className="min-h-full">
        <ProvedorDeTema>
          <a
            href="#conteudo"
            className="sr-only focus:not-sr-only focus:absolute focus:left-3 focus:top-3 focus:z-50 focus:rounded-lg focus:bg-superficie focus:px-4 focus:py-2 focus:text-tinta focus:shadow-lg"
          >
            Pular para o conteúdo
          </a>
          {/* A barra de abas é fixa; o espaço abaixo evita que ela cubra o fim da página. */}
          <main id="conteudo" className="mx-auto max-w-lg px-4 pb-28 pt-4">
            {children}
          </main>
          <BarraDeAbas />
          <RegistrarServiceWorker />
        </ProvedorDeTema>
      </body>
    </html>
  );
}
