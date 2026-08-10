import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Liturgia Diária',
    short_name: 'Liturgia',
    description:
      'Leituras da missa, preces da assembleia e Orações Eucarísticas para equipes de liturgia.',
    lang: 'pt-BR',
    dir: 'ltr',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#faf8f5',
    theme_color: '#7f1d1d',
    categories: ['books', 'lifestyle'],
    icons: [
      { src: '/icones/icone-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/icones/icone-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/icones/mascaravel-192.png', sizes: '192x192', type: 'image/png', purpose: 'maskable' },
      { src: '/icones/mascaravel-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
    shortcuts: [
      { name: 'Liturgia de hoje', url: '/liturgia' },
      { name: 'Orações Eucarísticas', url: '/oracoes-eucaristicas' },
    ],
  };
}
