import { execSync } from 'node:child_process';
import type { NextConfig } from 'next';

/**
 * Descobre a versão para mostrar em Configurações.
 *
 * Na Vercel o commit vem por variável de ambiente. Em build local, cai no git.
 * Se nem isso houver (um zip do código, por exemplo), fica "local" — mostrar
 * "local" é melhor do que quebrar o build por causa de um rótulo.
 */
function commitAtual(): { sha: string; data: string } {
  const shaDaVercel = process.env.VERCEL_GIT_COMMIT_SHA;
  if (shaDaVercel) {
    return { sha: shaDaVercel.slice(0, 7), data: '' };
  }
  try {
    // `stdio` silencioso: num repositório recém-criado o git escreve
    // "fatal: Needed a single revision" no log do build, o que assusta à toa.
    const git = (comando: string) =>
      execSync(comando, {
        encoding: 'utf8',
        stdio: ['ignore', 'pipe', 'ignore'],
      }).trim();

    return { sha: git('git rev-parse --short HEAD'), data: git('git log -1 --format=%cI') };
  } catch {
    return { sha: 'local', data: '' };
  }
}

const commit = commitAtual();

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_VERSAO: commit.sha,
    NEXT_PUBLIC_VERSAO_DATA: commit.data,
    NEXT_PUBLIC_REPOSITORIO: 'https://github.com/fariasps1817/liturgia',
  },

  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
      {
        // O service worker nunca pode vir do cache: senão uma versão antiga do
        // app fica presa no aparelho de quem já instalou.
        source: '/sw.js',
        headers: [
          { key: 'Content-Type', value: 'application/javascript; charset=utf-8' },
          { key: 'Cache-Control', value: 'no-cache, no-store, must-revalidate' },
        ],
      },
    ];
  },
};

export default nextConfig;
