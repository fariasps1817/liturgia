/*
 * Service worker escrito à mão.
 *
 * Preferi isto a um plugin de build: as necessidades aqui são simples e
 * previsíveis, e um service worker que a gente entende inteiro é mais fácil de
 * depurar do que um gerado — ainda mais quando o sintoma é "não abriu na
 * missa" e não dá para reproduzir.
 *
 * Estratégias:
 *   navegação      → rede primeiro, cache como rede de segurança
 *   /api/liturgia  → cache primeiro e revalida atrás (a liturgia de um dia não muda)
 *   estáticos      → cache primeiro
 *   /api/preces    → nunca cacheia (é conteúdo que muda e é compartilhado)
 */

const VERSAO = 'v1';
const CACHE_APP = `liturgia-app-${VERSAO}`;
const CACHE_DADOS = `liturgia-dados-${VERSAO}`;
const CACHE_ESTATICO = `liturgia-estatico-${VERSAO}`;

const PAGINA_OFFLINE = '/offline';

self.addEventListener('install', (evento) => {
  evento.waitUntil(
    caches
      .open(CACHE_APP)
      .then((cache) => cache.addAll([PAGINA_OFFLINE, '/oracoes-eucaristicas']))
      .then(() => self.skipWaiting())
      .catch(() => self.skipWaiting()),
  );
});

self.addEventListener('activate', (evento) => {
  evento.waitUntil(
    caches
      .keys()
      .then((chaves) =>
        Promise.all(
          chaves
            .filter((chave) => chave.startsWith('liturgia-') && !chave.endsWith(VERSAO))
            .map((chave) => caches.delete(chave)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

function ehLiturgia(url) {
  return url.pathname.startsWith('/api/liturgia/');
}

function ehPreces(url) {
  return url.pathname.startsWith('/api/preces');
}

function ehEstatico(url) {
  return (
    url.pathname.startsWith('/_next/static/') ||
    url.pathname.startsWith('/icones/') ||
    /\.(?:png|jpg|jpeg|svg|webp|woff2?|ico)$/.test(url.pathname)
  );
}

/** Cache primeiro, revalidando em segundo plano. */
async function cacheERevalida(requisicao, nomeDoCache) {
  const cache = await caches.open(nomeDoCache);
  const guardado = await cache.match(requisicao);

  const daRede = fetch(requisicao)
    .then((resposta) => {
      if (resposta && resposta.ok) cache.put(requisicao, resposta.clone());
      return resposta;
    })
    .catch(() => undefined);

  return guardado || (await daRede) || Response.error();
}

/** Rede primeiro, caindo no cache quando não há sinal. */
async function redePrimeiro(requisicao, nomeDoCache) {
  const cache = await caches.open(nomeDoCache);
  try {
    const resposta = await fetch(requisicao);
    if (resposta && resposta.ok) cache.put(requisicao, resposta.clone());
    return resposta;
  } catch {
    const guardado = await cache.match(requisicao);
    if (guardado) return guardado;
    if (requisicao.mode === 'navigate') {
      const offline = await cache.match(PAGINA_OFFLINE);
      if (offline) return offline;
    }
    return Response.error();
  }
}

self.addEventListener('fetch', (evento) => {
  const { request } = evento;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // As preces são compartilhadas entre a equipe: servir uma versão velha faria
  // alguém ler na missa uma prece que já foi refeita.
  if (ehPreces(url)) return;

  if (ehLiturgia(url)) {
    evento.respondWith(cacheERevalida(request, CACHE_DADOS));
    return;
  }

  if (ehEstatico(url)) {
    evento.respondWith(cacheERevalida(request, CACHE_ESTATICO));
    return;
  }

  if (request.mode === 'navigate') {
    evento.respondWith(redePrimeiro(request, CACHE_APP));
  }
});

/** A página pede o pré-carregamento dos próximos dias ao abrir o calendário. */
self.addEventListener('message', (evento) => {
  const dados = evento.data;
  if (!dados || dados.tipo !== 'pre-carregar' || !Array.isArray(dados.urls)) return;

  evento.waitUntil(
    caches.open(CACHE_DADOS).then(async (cache) => {
      for (const url of dados.urls.slice(0, 14)) {
        try {
          if (await cache.match(url)) continue;
          const resposta = await fetch(url);
          if (resposta && resposta.ok) await cache.put(url, resposta.clone());
        } catch {
          // Sem sinal: tenta de novo na próxima vez que abrir o calendário.
        }
      }
    }),
  );
});
