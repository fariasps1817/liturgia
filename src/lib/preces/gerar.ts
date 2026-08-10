import 'server-only';

import Anthropic from '@anthropic-ai/sdk';
import { zodOutputFormat } from '@anthropic-ai/sdk/helpers/zod';
import type { LiturgiaDoDia } from '../liturgia/tipos';
import { ErroAoGerarPreces, traduzirErroDaApi } from './erros';
import { EsquemaDasPreces } from './esquema';
import { montarPromptDoDia, SISTEMA_PRECES } from './prompt';
import { ORDEM_DAS_SERIES, RESPOSTA_PADRAO, type ConteudoDasPreces, type SerieDeIntencao } from './tipos';

export const MODELO = process.env.MODELO_IA ?? 'claude-opus-5';

/*
 * No Claude Opus 5 o raciocínio vem ligado por padrão e consome o mesmo
 * `max_tokens` do texto final. As preces em si ocupam menos de mil tokens, mas
 * apertar aqui trunca a resposta no meio da quarta intenção — que é justamente
 * a mais importante para a comunidade.
 */
const MAX_TOKENS = 16_000;

// Reexportado porque a rota sempre importou o erro daqui, e quem gera preces
// não precisa saber que a tradução das falhas mora noutro arquivo.
export { ErroAoGerarPreces };

let clientePreguicoso: Anthropic | null = null;

function cliente(): Anthropic {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new ErroAoGerarPreces(
      'A chave da IA não está configurada no servidor. Defina ANTHROPIC_API_KEY para gerar preces.',
    );
  }
  clientePreguicoso ??= new Anthropic();
  return clientePreguicoso;
}

async function umaTentativa(
  liturgia: LiturgiaDoDia,
  resposta: string,
  intencaoLocal: string | undefined,
  reforco?: string,
): Promise<ConteudoDasPreces> {
  const prompt = montarPromptDoDia(liturgia, resposta, intencaoLocal);

  const mensagem = await cliente()
    .messages.parse({
      model: MODELO,
      max_tokens: MAX_TOKENS,
      // O prompt de sistema é estável entre gerações; marcá-lo faz o cache do
      // prefixo valer a partir da segunda missa do dia.
      system: [
        { type: 'text', text: SISTEMA_PRECES, cache_control: { type: 'ephemeral' } },
      ],
      output_config: {
        effort: 'medium',
        format: zodOutputFormat(EsquemaDasPreces),
      },
      messages: [{ role: 'user', content: reforco ? `${prompt}\n\n${reforco}` : prompt }],
    })
    .catch((causa) => traduzirErroDaApi(causa, MODELO));

  // O Opus 5 pode recusar por classificadores de segurança. Em texto litúrgico
  // isso é remotíssimo, mas ler `content` sem conferir quebraria a tela.
  if (mensagem.stop_reason === 'refusal') {
    throw new ErroAoGerarPreces(
      'O modelo recusou este pedido. Revise a intenção da comunidade e tente de novo.',
    );
  }

  if (mensagem.stop_reason === 'max_tokens') {
    throw new ErroAoGerarPreces('A resposta veio cortada. Tente gerar de novo.');
  }

  const saida = mensagem.parsed_output;
  if (!saida) {
    throw new ErroAoGerarPreces('A resposta do modelo não veio no formato esperado.');
  }

  return {
    resposta: saida.resposta.trim() || resposta,
    introducao: saida.introducao.trim(),
    conclusao: saida.conclusao.trim(),
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
