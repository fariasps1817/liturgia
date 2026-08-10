/**
 * Tamanho do texto das leituras.
 *
 * Fica num módulo neutro (sem `'use client'`) porque o layout do servidor
 * precisa do script inicial e o controle no cliente precisa das mesmas
 * constantes — e a chave do armazenamento não pode divergir entre os dois.
 */

export const CHAVE_ESCALA = 'liturgia:escala-leitura';
export const ESCALAS = [0.9, 1, 1.15, 1.3, 1.5, 1.75];
export const ESCALA_PADRAO = 1;

/**
 * Roda antes da primeira pintura e aplica a escala guardada.
 *
 * Sem isto, quem escolheu texto grande vê a página aparecer no tamanho padrão e
 * saltar logo em seguida — desconfortável justamente para quem aumentou a fonte
 * porque enxerga pouco.
 */
export const SCRIPT_ESCALA_INICIAL = `try{var e=localStorage.getItem(${JSON.stringify(
  CHAVE_ESCALA,
)});if(e)document.documentElement.style.setProperty('--escala-leitura',e)}catch(_){}`;
