import { z } from 'zod';
import { ORDEM_DAS_SERIES } from './tipos';

/**
 * Formato da resposta do modelo.
 *
 * Vai como saída estruturada (`response_format`), então o JSON chega válido e já
 * tipado — sem regex, sem tentar reparar texto quebrado.
 *
 * O modo estrito da OpenAI não aceita `minItems`/`maxItems`: mandar `.length(4)`
 * aqui faria a API recusar o schema inteiro com 400. Por isso a quantidade de
 * intenções é exigida em palavras, na descrição, e conferida em `gerar.ts` —
 * que tenta de novo quando as quatro séries não vêm completas e na ordem.
 */
export const EsquemaDasPreces = z.object({
  resposta: z
    .string()
    .describe('A aclamação que a assembleia repete depois de cada intenção.'),
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
    .describe(
      'Exatamente quatro intenções: uma para cada série da IGMR 70, na ordem ' +
        `${ORDEM_DAS_SERIES.join(', ')}. Nem mais, nem menos, sem repetir série.`,
    ),
});

export type SaidaDasPreces = z.infer<typeof EsquemaDasPreces>;
