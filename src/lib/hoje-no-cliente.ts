'use client';

import { useSyncExternalStore } from 'react';
import { hoje } from './liturgia/datas';

/**
 * A data de hoje, reconferida no aparelho.
 *
 * Por que não basta o valor que o servidor mandou: esta página pode ter vindo
 * do cache do service worker, gravado dias atrás. E o app pode ficar aberto a
 * noite inteira na sacristia e virar o dia sozinho.
 *
 * `useSyncExternalStore` é a API certa para isto — o relógio do aparelho é uma
 * fonte externa ao React, e ela sabe lidar com o valor do servidor diferindo do
 * valor do cliente sem quebrar a hidratação.
 */
export function useHoje(hojeDoServidor: string): string {
  return useSyncExternalStore(
    inscrever,
    () => hoje(),
    () => hojeDoServidor,
  );
}

function inscrever(aoMudar: () => void): () => void {
  // Reconfere quando o app volta ao primeiro plano — que é quando alguém pega o
  // celular de novo e espera ver o dia certo.
  const aoVoltar = () => {
    if (document.visibilityState === 'visible') aoMudar();
  };

  document.addEventListener('visibilitychange', aoVoltar);
  const intervalo = setInterval(aoMudar, 60_000);

  return () => {
    document.removeEventListener('visibilitychange', aoVoltar);
    clearInterval(intervalo);
  };
}
