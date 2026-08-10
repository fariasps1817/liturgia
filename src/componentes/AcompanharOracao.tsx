'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ehResposta,
  ROTULO_DE_QUEM,
  type OracaoEucaristica,
  type Secao,
} from '@/dados/oracoes-eucaristicas/tipos';
import { ControleDeFonte } from './ControleDeFonte';
import { IconeAviso, IconeSeta } from './icones';

/**
 * Acompanhamento ao vivo de uma Oração Eucarística.
 *
 * Pensado para quem está de pé no meio da assembleia, segurando o celular com
 * uma mão. Três decisões que vêm daí:
 *
 *  1. Nada rola sozinho. Rolagem automática é ótima em demonstração e péssima
 *     na missa: basta o padre demorar um pouco e a tela foge do lugar certo.
 *     Quem manda no ponto é o toque da pessoa.
 *  2. As respostas do povo são grandes e de alto contraste; a fala do
 *     sacerdote é menor e apagada. A hierarquia visual já diz de quem é a vez,
 *     sem precisar ler o rótulo.
 *  3. A tela não apaga enquanto a oração está aberta.
 */
export function AcompanharOracao({ oracao }: { oracao: OracaoEucaristica }) {
  const [modoRespostas, setModoRespostas] = useState(false);
  const [atual, setAtual] = useState<number | null>(null);
  const referencias = useRef<Map<number, HTMLLIElement | null>>(new Map());

  const visiveis = useMemo(() => {
    if (!modoRespostas) return oracao.secoes.map((secao, i) => ({ secao, indice: i }));
    return oracao.secoes
      .map((secao, i) => ({ secao, indice: i }))
      .filter(({ secao }) => ehResposta(secao));
  }, [oracao.secoes, modoRespostas]);

  const proximaResposta = useMemo(() => {
    if (atual === null) return oracao.secoes.findIndex(ehResposta);
    return oracao.secoes.findIndex((secao, i) => i > atual && ehResposta(secao));
  }, [atual, oracao.secoes]);

  /* Mantém a tela acesa. Sem isso o celular apaga no meio da consagração. */
  useEffect(() => {
    let travaAtiva: WakeLockSentinel | null = null;
    let cancelado = false;

    const travar = async () => {
      try {
        if (!('wakeLock' in navigator)) return;
        const trava = await navigator.wakeLock.request('screen');
        if (cancelado) {
          trava.release().catch(() => {});
          return;
        }
        travaAtiva = trava;
      } catch {
        // Bateria fraca ou navegador sem suporte: segue sem travar.
      }
    };

    // O sistema solta a trava sozinho quando a aba perde o foco — por exemplo
    // quando alguém atende uma ligação. Ao voltar, pede de novo.
    const aoVoltar = () => {
      if (document.visibilityState === 'visible') travar();
    };

    travar();
    document.addEventListener('visibilitychange', aoVoltar);

    return () => {
      cancelado = true;
      document.removeEventListener('visibilitychange', aoVoltar);
      travaAtiva?.release().catch(() => {});
    };
  }, []);

  const irPara = useCallback(
    (indice: number) => {
      const limitado = Math.max(0, Math.min(indice, oracao.secoes.length - 1));
      setAtual(limitado);
      referencias.current.get(limitado)?.scrollIntoView({ block: 'center', behavior: 'smooth' });
    },
    [oracao.secoes.length],
  );

  const anterior = useCallback(() => {
    if (atual === null) return irPara(0);
    const candidatos = visiveis.map((v) => v.indice).filter((i) => i < atual);
    irPara(candidatos.length ? candidatos[candidatos.length - 1] : atual);
  }, [atual, visiveis, irPara]);

  const proxima = useCallback(() => {
    if (atual === null) return irPara(visiveis[0]?.indice ?? 0);
    const seguinte = visiveis.map((v) => v.indice).find((i) => i > atual);
    irPara(seguinte ?? atual);
  }, [atual, visiveis, irPara]);

  const secaoAtual = atual !== null ? oracao.secoes[atual] : null;

  return (
    <>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => setModoRespostas((v) => !v)}
          aria-pressed={modoRespostas}
          className={`flex min-h-11 items-center gap-2 rounded-full border px-4 text-sm font-semibold transition-colors ${
            modoRespostas
              ? 'border-realce bg-realce text-superficie'
              : 'border-borda bg-superficie text-tinta-suave'
          }`}
        >
          <span
            aria-hidden
            className={`h-2 w-2 rounded-full ${modoRespostas ? 'bg-superficie' : 'bg-tinta-fraca'}`}
          />
          Modo Respostas
        </button>
        <ControleDeFonte />
      </div>

      {modoRespostas ? (
        <p className="mb-4 rounded-xl bg-superficie-2 px-4 py-3 text-sm text-tinta-suave">
          Mostrando só o que a assembleia responde, na ordem. Toque numa resposta para marcar onde
          a missa está.
        </p>
      ) : null}

      {oracao.avisoDeRevisao ? (
        <div
          role="status"
          className="mb-4 flex gap-3 rounded-2xl border border-realce/30 bg-realce/5 p-4 text-sm text-tinta-suave"
        >
          <IconeAviso className="mt-0.5 h-5 w-5 shrink-0 text-realce" />
          <p>{oracao.avisoDeRevisao}</p>
        </div>
      ) : null}

      {/* Barra fixa: onde estamos agora. */}
      {secaoAtual ? (
        <div className="sticky top-0 z-20 -mx-4 mb-3 border-b border-borda bg-fundo/95 px-4 py-2 backdrop-blur">
          <p className="text-xs font-semibold uppercase tracking-wider text-realce">
            Agora · {secaoAtual.titulo}
          </p>
        </div>
      ) : null}

      <ol className="space-y-3 pb-4">
        {visiveis.map(({ secao, indice }) => (
          <li
            key={secao.id}
            ref={(el) => {
              referencias.current.set(indice, el);
            }}
          >
            <BlocoDaSecao
              secao={secao}
              marcada={indice === atual}
              aoMarcar={() => irPara(indice)}
            />
          </li>
        ))}
      </ol>

      {/* Espaço para as barras fixas de baixo. */}
      <div aria-hidden className="h-32" />

      <div className="pb-segura fixed inset-x-0 bottom-[3.75rem] z-30 border-t border-borda bg-superficie/95 backdrop-blur">
        <div className="mx-auto max-w-lg px-3 py-2">
          {proximaResposta >= 0 ? (
            <p className="mb-2 truncate text-xs text-tinta-suave">
              <span className="font-semibold uppercase tracking-wide text-tinta-fraca">
                A seguir ·{' '}
              </span>
              {oracao.secoes[proximaResposta].texto?.split('\n')[0] ??
                oracao.secoes[proximaResposta].titulo}
            </p>
          ) : null}

          <div className="flex gap-2">
            <button
              type="button"
              onClick={anterior}
              className="flex min-h-12 flex-1 items-center justify-center gap-1.5 rounded-2xl border border-borda bg-superficie text-sm font-semibold text-tinta-suave active:bg-superficie-2"
            >
              <IconeSeta className="h-4 w-4" direcao="esquerda" />
              Anterior
            </button>
            <button
              type="button"
              onClick={proxima}
              className="flex min-h-12 flex-1 items-center justify-center gap-1.5 rounded-2xl bg-realce text-sm font-semibold text-superficie active:opacity-90"
            >
              Próxima
              <IconeSeta className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

function BlocoDaSecao({
  secao,
  marcada,
  aoMarcar,
}: {
  secao: Secao;
  marcada: boolean;
  aoMarcar: () => void;
}) {
  const resposta = ehResposta(secao);

  return (
    <button
      type="button"
      onClick={aoMarcar}
      aria-pressed={marcada}
      className={`w-full rounded-2xl border p-4 text-left transition-colors ${
        marcada ? 'border-realce bg-realce/5' : 'border-transparent'
      } ${resposta ? 'bg-superficie' : 'bg-transparent'} ${
        marcada ? '' : resposta ? 'border-borda' : ''
      }`}
    >
      <div className="mb-1.5 flex items-center gap-2">
        <span
          className={`text-[0.6875rem] font-bold uppercase tracking-wider ${
            resposta ? 'text-realce' : 'text-tinta-fraca'
          }`}
        >
          {ROTULO_DE_QUEM[secao.quem]}
        </span>
        <span className="truncate text-[0.6875rem] uppercase tracking-wide text-tinta-fraca">
          {secao.titulo}
        </span>
        {/*
          A marca vale para qualquer seção, não só para as da assembleia: um
          incipit não conferido é uma deixa que pode estar errada, e usar deixa
          errada na missa é pior do que não ter deixa nenhuma.
        */}
        {secao.conferir ? (
          <span className="ml-auto shrink-0 rounded-full bg-realce/15 px-2 py-0.5 text-[0.625rem] font-semibold uppercase tracking-wide text-realce">
            conferir
          </span>
        ) : null}
      </div>

      {resposta ? (
        <div className="border-l-4 border-realce pl-3">
          {secao.texto ? (
            <p className="corpo-leitura whitespace-pre-line font-semibold text-tinta">
              {secao.texto}
            </p>
          ) : (
            <p className="text-sm italic text-tinta-fraca">
              {secao.conferir
                ? 'Texto a conferir no Missal da paróquia.'
                : 'Texto não disponível.'}
            </p>
          )}
        </div>
      ) : (
        <p className="text-sm leading-relaxed text-tinta-fraca">
          {secao.texto ?? secao.incipit ?? '—'}
        </p>
      )}

      {secao.nota ? (
        <p className="mt-2 text-xs italic text-tinta-fraca">{secao.nota}</p>
      ) : null}
    </button>
  );
}
