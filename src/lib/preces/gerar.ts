import 'server-only';

import OpenAI from 'openai';
import { zodResponseFormat } from 'openai/helpers/zod';
import type { LiturgiaDoDia } from '../liturgia/tipos';
import { ErroAoGerarPreces, traduzirErroDaApi } from './erros';
import { EsquemaDasPreces } from './esquema';
import { montarPromptDoDia, SISTEMA_PRECES } from './prompt';
import { ORDEM_DAS_SERIES, RESPOSTA_PADRAO, type ConteudoDasPreces, type SerieDeIntencao } from './tipos';

export const MODELO = process.env.MODELO_IA ?? 'gpt-4o-mini';

/*
 * As preces inteiras ocupam menos de mil tokens. A folga existe para o caso de
 * o modelo alongar as intenções: apertar aqui trunca a resposta no meio da
 * quarta — que é justamente a mais importante para a comunidade.
 */
const MAX_TOKENS = 4_000;

// Reexportado porque a rota sempre importou o erro daqui, e quem gera preces
// não precisa saber que a tradução das falhas mora noutro arquivo.
export { ErroAoGerarPreces };

let clientePreguicoso: OpenAI | null = null;

function cliente(): OpenAI {
  if (!process.env.OPENAI_API_KEY) {
    throw new ErroAoGerarPreces(
      'A chave da IA não está configurada no servidor. Defina OPENAI_API_KEY para gerar preces.',
    );
  }
  clientePreguicoso ??= new OpenAI();
  return clientePreguicoso;
}

async function umaTentativa(
  liturgia: LiturgiaDoDia,
  resposta: string,
  intencaoLocal: string | undefined,
  reforco?: string,
): Promise<ConteudoDasPreces> {
  const prompt = montarPromptDoDia(liturgia, resposta, intencaoLocal);

  const resultado = await cliente()
    .chat.completions.parse({
      model: MODELO,
      max_completion_tokens: MAX_TOKENS,
      // O prompt de sistema é estável entre gerações. A OpenAI reaproveita o
      // prefixo sozinha, sem precisar marcar nada — só precisa vir primeiro.
      messages: [
        { role: 'system', content: SISTEMA_PRECES },
        { role: 'user', content: reforco ? `${prompt}\n\n${reforco}` : prompt },
      ],
      response_format: zodResponseFormat(EsquemaDasPreces, 'preces'),
    })
    .catch((causa) => traduzirErroDaApi(causa, MODELO));

  const escolha = resultado.choices[0];

  // O modelo pode recusar por classificadores de segurança. Em texto litúrgico
  // isso é remotíssimo, mas ler `parsed` sem conferir quebraria a tela.
  if (escolha?.message.refusal) {
    throw new ErroAoGerarPreces(
      'O modelo recusou este pedido. Revise a intenção da comunidade e tente de novo.',
    );
  }

  if (escolha?.finish_reason === 'length') {
    throw new ErroAoGerarPreces('A resposta veio cortada. Tente gerar de novo.');
  }

  const saida = escolha?.message.parsed;
  if (!saida) {
    throw new ErroAoGerarPreces('A resposta do modelo não veio no formato esperado.');
  }

  return {
    resposta: saida.resposta.trim() || resposta,
    intencoes: saida.intencoes.map((i) => ({
      serie: i.serie as SerieDeIntencao,
      texto: i.texto.trim(),
    })),
  };
}

/** Verdadeiro quando saíram as quatro séries, uma de cada, na ordem da IGMR. */
function seriesEstaoCorretas(preces: ConteudoDasPreces): boolean {
  if (preces.intencoes.length !== ORDEM_DAS_SERIES.length) return false;
  return preces.intencoes.every((intencao, i) => intencao.serie === ORDEM_DAS_SERIES[i]);
}

/**
 * Gera as preces do dia.
 *
 * Faz no máximo duas tentativas: a saída estruturada garante o formato, mas não
 * garante que as quatro séries vieram completas e na ordem — e a ordem é a
 * própria norma, não um detalhe de apresentação.
 */
export async function gerarPreces(
  liturgia: LiturgiaDoDia,
  opcoes: { resposta?: string; intencaoLocal?: string } = {},
): Promise<ConteudoDasPreces> {
  const resposta = opcoes.resposta?.trim() || RESPOSTA_PADRAO;
  const intencaoLocal = opcoes.intencaoLocal?.trim() || undefined;

  const primeira = await umaTentativa(liturgia, resposta, intencaoLocal);
  if (seriesEstaoCorretas(primeira)) return primeira;

  const segunda = await umaTentativa(
    liturgia,
    resposta,
    intencaoLocal,
    `Atenção: devolva exatamente quatro intenções, uma para cada série, na ordem ${ORDEM_DAS_SERIES.join(' → ')}. Nem mais, nem menos, sem repetir série.`,
  );

  if (!seriesEstaoCorretas(segunda)) {
    throw new ErroAoGerarPreces(
      'As preces não saíram nas quatro séries previstas pelo Missal. Tente gerar de novo.',
    );
  }

  return segunda;
}
