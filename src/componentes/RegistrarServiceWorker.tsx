'use client';

import { useEffect } from 'react';

export function RegistrarServiceWorker() {
  useEffect(() => {
    if (!('serviceWorker' in navigator)) return;
    if (process.env.NODE_ENV !== 'production') return;

    const registrar = () => {
      navigator.serviceWorker.register('/sw.js', { scope: '/' }).catch(() => {
        // Sem service worker o app continua funcionando, só perde o modo offline.
      });
    };

    // Espera a página assentar: registrar durante o carregamento disputa banda
    // com o conteúdo que a pessoa está esperando ver.
    if (document.readyState === 'complete') registrar();
    else {
      window.addEventListener('load', registrar);
      return () => window.removeEventListener('load', registrar);
    }
  }, []);

  return null;
}

/** Pede ao service worker que baixe a liturgia dos próximos dias. */
export function preCarregarDias(datas: string[]) {
  if (typeof navigator === 'undefined' || !('serviceWorker' in navigator)) return;
  navigator.serviceWorker.ready
    .then((registro) => {
      registro.active?.postMessage({
        tipo: 'pre-carregar',
        urls: datas.map((data) => `/api/liturgia/${data}`),
      });
    })
    .catch(() => {});
}
