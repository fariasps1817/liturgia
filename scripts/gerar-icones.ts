/**
 * Gera os PNGs do PWA a partir de `public/icone.svg`.
 *
 *   npm run icones
 *
 * Roda sozinho antes de cada `npm run build` (script `prebuild`), então os PNGs
 * não ficam versionados: assim eles nunca divergem do SVG, que é a única fonte
 * da verdade do ícone.
 */
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import sharp from 'sharp';

async function main() {
  const svg = readFileSync('public/icone.svg');
  mkdirSync('public/icones', { recursive: true });

  /**
   * O ícone "maskable" precisa de margem: o Android recorta em círculo, losango
   * ou squircle conforme o launcher, e sem folga o cálice sai com a base cortada.
   */
  const MARGEM_MASCARAVEL = 0.1;

  const tarefas: { arquivo: string; tamanho: number; mascaravel?: boolean }[] = [
    { arquivo: 'public/icones/icone-192.png', tamanho: 192 },
    { arquivo: 'public/icones/icone-512.png', tamanho: 512 },
    { arquivo: 'public/icones/mascaravel-192.png', tamanho: 192, mascaravel: true },
    { arquivo: 'public/icones/mascaravel-512.png', tamanho: 512, mascaravel: true },
    { arquivo: 'public/apple-touch-icon.png', tamanho: 180 },
  ];

  for (const { arquivo, tamanho, mascaravel } of tarefas) {
    const interno = mascaravel ? Math.round(tamanho * (1 - MARGEM_MASCARAVEL * 2)) : tamanho;
    const desenho = await sharp(svg, { density: 400 }).resize(interno, interno).png().toBuffer();

    const saida = mascaravel
      ? await sharp({
          create: {
            width: tamanho,
            height: tamanho,
            channels: 4,
            background: '#5f1616',
          },
        })
          .composite([{ input: desenho, gravity: 'center' }])
          .png()
          .toBuffer()
      : desenho;

    writeFileSync(arquivo, saida);
    console.log(`  ${arquivo}  ${tamanho}×${tamanho}${mascaravel ? ' (mascarável)' : ''}`);
  }

  // Favicon: 32px é o que o navegador mostra na aba.
  writeFileSync(
    'src/app/icon.png',
    await sharp(svg, { density: 400 }).resize(32, 32).png().toBuffer(),
  );
  console.log('  src/app/icon.png  32×32');
  console.log('\n✓ ícones gerados\n');
}

main();
