import { z } from 'zod';
import { ORDEM_DAS_SERIES } from './tipos';

/**
 * Formato da resposta do modelo.
 *
 * Vai como saída estruturada (`output_config.format`), então o JSON chega válido
 * e já tipado — sem regex, sem tentar reparar texto quebrado.
 *
 * A API não aceita restrições de tamanho de lista no JSON Schema; o SDK remove
 * essas restrições do schema enviado e as valida aqui no cliente. É por isso que
 * `.length(4)` funciona mesmo assim — e por que `gerar.ts` ainda faz uma segunda
 * tentativa quando a validação reprova.
 */
export const EsquemaDasPreces = z.object({
  resposta: z
    .string()
    .describe('A aclamação que a assembleia repete depois de cada intenção.'),
  introducao: z
    .string()
    .describe('Monição breve do sacerdote, dirigida à assembleia, que abre a oração universal.'),
  intencoes: z
    .array(
      z.object({
        serie: z
          .enum(ORDEM_DAS_SERIES as [string, ...string[]])
          .describe('A série da IGMR 70 a que esta intenção pertence.'),
        texto: z
          .string()
          .describe('A intenção proclamada pelo leitor, sem a resposta da assembleia.'),
      }),
    )
    .length(4)
    .describe('Exatamente quatro intenções, uma por série, na ordem da IGMR 70.'),
  conclusao: z
    .string()
    .describe(
      'Oração conclusiva do sacerdote, dirigida a Deus, terminando com a fórmula habitual.',
    ),
});

export type SaidaDasPreces = z.infer<typeof EsquemaDasPreces>;
