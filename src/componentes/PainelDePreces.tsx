'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { compartilhar, copiarTexto } from '@/lib/compartilhar';
import { RESPOSTA_PADRAO, ROTULO_DA_SERIE, type Preces } from '@/lib/preces/tipos';
import { IconeAviso, IconeCheck, IconeCopiar, IconeFaisca, IconeWhatsApp } from './icones';
import { Aviso, Cartao } from './ui';

type Estado = 'carregando' | 'formulario' | 'gerando' | 'pronto';

/**
 * Gerar leva perto de meio minuto — o modelo raciocina antes de escrever.
 * Sem sinais de vida a pessoa toca de novo, ou fecha achando que travou.
 */
const PASSOS = [
  'Lendo as leituras do dia…',
  'Buscando o tema da Palavra…',
  'Escrevendo as intenções, série por série…',
  'Revisando para caber num fôlego…',
];

export function PainelDePreces({ data, dataExtenso }: { data: string; dataExtenso: string }) {
  const [estado, setEstado] = useState<Estado>('carregando');
  const [preces, setPreces] = useState<Preces | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [passo, setPasso] = useState(0);

  const [resposta, setResposta] = useState('');
  const [intencaoLocal, setIntencaoLocal] = useState('');

  const [copiado, setCopiado] = useState(false);
  const tempoRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    let ativo = true;
    fetch(`/api/preces?data=${data}`)
      .then((r) => r.json())
      .then((json: { preces: Preces | null }) => {
        if (!ativo) return;
        if (json.preces) {
          setPreces(json.preces);
          setResposta(json.preces.resposta);
          setIntencaoLocal(json.preces.intencaoLocal ?? '');
          setEstado('pronto');
        } else {
          setEstado('formulario');
        }
      })
      .catch(() => ativo && setEstado('formulario'));
    return () => {
      ativo = false;
    };
  }, [data]);

  // Anda pelos passos enquanto gera, para a tela não parecer parada.
  // O passo é zerado em `gerar()`, não aqui: reiniciá-lo dentro do efeito
  // dispararia uma renderização em cascata a cada vez que o estado muda.
  useEffect(() => {
    if (estado !== 'gerando') return;
    const intervalo = setInterval(() => setPasso((p) => Math.min(p + 1, PASSOS.length - 1)), 7000);
    return () => clearInterval(intervalo);
  }, [estado]);

  useEffect(() => () => clearTimeout(tempoRef.current), []);

  const gerar = useCallback(async () => {
    setPasso(0);
    setEstado('gerando');
    setErro(null);
    try {
      const r = await fetch('/api/preces', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data, resposta, intencaoLocal }),
      });
      const json = await r.json();
      if (!r.ok) throw new Error(json.erro ?? 'Não foi possível gerar as preces.');
      setPreces(json.preces);
      setEstado('pronto');
    } catch (causa) {
      setErro(causa instanceof Error ? causa.message : 'Não foi possível gerar as preces.');
      setEstado(preces ? 'pronto' : 'formulario');
    }
  }, [data, resposta, intencaoLocal, preces]);

  const redefinir = useCallback(async () => {
    await fetch(`/api/preces?data=${data}`, { method: 'DELETE' }).catch(() => {});
    setPreces(null);
    setErro(null);
    setEstado('formulario');
  }, [data]);

  const textoParaCompartilhar = preces ? formatarPreces(preces, dataExtenso) : '';

  const aoCopiar = async () => {
    const deuCerto = await copiarTexto(textoParaCompartilhar);
    setCopiado(deuCerto);
    clearTimeout(tempoRef.current);
    tempoRef.current = setTimeout(() => setCopiado(false), 2500);
  };

  if (estado === 'carregando') {
    return (
      <Cartao>
        <p className="text-sm text-tinta-suave">Verificando se as preces já foram geradas…</p>
      </Cartao>
    );
  }

  if (estado === 'gerando') {
    return (
      <Cartao>
        <div className="flex items-center gap-3">
          <span
            aria-hidden
            className="h-5 w-5 shrink-0 animate-spin rounded-full border-2 border-borda border-t-realce"
          />
          <div>
            <p className="font-semibold text-tinta">Gerando as preces…</p>
            <p aria-live="polite" className="mt-0.5 text-sm text-tinta-suave">
              {PASSOS[passo]}
            </p>
          </div>
        </div>
        <p className="mt-3 text-xs text-tinta-fraca">
          Costuma levar de vinte a quarenta segundos. Pode deixar a tela aberta.
        </p>
      </Cartao>
    );
  }

  return (
    <>
      {erro ? (
        <Aviso icone={<IconeAviso className="h-5 w-5" />}>
          <p className="font-semibold text-tinta">Não deu para gerar.</p>
          <p className="mt-1">{erro}</p>
        </Aviso>
      ) : null}

      {estado === 'formulario' ? (
        <>
          <Cartao className="mb-3">
            <p className="text-sm text-tinta-suave">
              As preces seguem as quatro séries que o Missal define (IGMR 70): pela Igreja, pelos
              governantes e pelo mundo, pelos que sofrem e pela comunidade — nesta ordem, enraizadas
              nas leituras do dia.
            </p>
          </Cartao>

          <div className="space-y-4">
            <div>
              <label htmlFor="resposta" className="mb-1.5 block text-sm font-semibold text-tinta">
                Resposta da assembleia
              </label>
              <input
                id="resposta"
                type="text"
                value={resposta}
                onChange={(e) => setResposta(e.target.value)}
                maxLength={120}
                placeholder={RESPOSTA_PADRAO}
                className="min-h-14 w-full rounded-2xl border border-borda bg-superficie px-4 text-tinta placeholder:text-tinta-fraca"
              />
              <p className="mt-1.5 text-xs text-tinta-fraca">
                Se deixar em branco, usamos “{RESPOSTA_PADRAO}”.
              </p>
            </div>

            <div>
              <label htmlFor="intencao" className="mb-1.5 block text-sm font-semibold text-tinta">
                Intenção da comunidade{' '}
                <span className="font-normal text-tinta-fraca">(opcional)</span>
              </label>
              <textarea
                id="intencao"
                value={intencaoLocal}
                onChange={(e) => setIntencaoLocal(e.target.value)}
                maxLength={500}
                rows={4}
                placeholder="Ex.: pelos batizados de hoje; pela comunidade Bessanlândia, que celebra São Tarcísio; pelo aniversário do pároco."
                className="w-full rounded-2xl border border-borda bg-superficie p-4 text-tinta placeholder:text-tinta-fraca"
              />
              <p className="mt-1.5 text-xs text-tinta-fraca">
                Entra na quarta série, redigida como prece.
              </p>
            </div>

            <button
              type="button"
              onClick={gerar}
              className="flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl bg-realce font-semibold text-superficie active:opacity-90"
            >
              <IconeFaisca className="h-5 w-5" />
              Gerar Preces
            </button>
          </div>
        </>
      ) : null}

      {estado === 'pronto' && preces ? (
        <>
          <article className="corpo-leitura space-y-5">
            <section>
              <h2 className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-tinta-fraca not-italic">
                Monição do celebrante
              </h2>
              <p>{preces.introducao}</p>
            </section>

            <section>
              <h2 className="mb-2 text-xs font-semibold uppercase tracking-wider text-tinta-fraca not-italic">
                Intenções
              </h2>
              <ol className="space-y-4">
                {preces.intencoes.map((intencao, i) => (
                  <li key={i}>
                    <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-realce not-italic">
                      {i + 1}. {ROTULO_DA_SERIE[intencao.serie] ?? intencao.serie}
                    </p>
                    <p>{intencao.texto}</p>
                    <p className="mt-1.5 font-semibold text-tinta-suave">
                      <span className="mr-1.5 text-realce">R.</span>
                      {preces.resposta}
                    </p>
                  </li>
                ))}
              </ol>
            </section>

            <section>
              <h2 className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-tinta-fraca not-italic">
                Oração conclusiva
              </h2>
              <p>{preces.conclusao}</p>
            </section>
          </article>

          <p className="mt-6 text-xs text-tinta-fraca">
            Geradas em {new Date(preces.criadoEm).toLocaleString('pt-BR')} · confira antes de
            proclamar.
          </p>

          <div className="mt-4 space-y-2">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={aoCopiar}
                className="flex min-h-14 flex-1 items-center justify-center gap-2 rounded-2xl border border-borda bg-superficie font-semibold text-tinta active:bg-superficie-2"
              >
                {copiado ? (
                  <IconeCheck className="h-5 w-5 text-lit-verde" />
                ) : (
                  <IconeCopiar className="h-5 w-5" />
                )}
                {copiado ? 'Copiado!' : 'Copiar'}
              </button>
              <button
                type="button"
                onClick={() => compartilhar(textoParaCompartilhar, 'Preces da Assembleia')}
                className="flex min-h-14 flex-1 items-center justify-center gap-2 rounded-2xl bg-realce font-semibold text-superficie active:opacity-90"
              >
                <IconeWhatsApp className="h-5 w-5" />
                Compartilhar
              </button>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={gerar}
                className="min-h-12 flex-1 rounded-2xl border border-borda bg-superficie text-sm font-medium text-tinta-suave active:bg-superficie-2"
              >
                Refazer preces
              </button>
              <button
                type="button"
                onClick={redefinir}
                className="min-h-12 flex-1 rounded-2xl border border-borda bg-superficie text-sm font-medium text-tinta-suave active:bg-superficie-2"
              >
                Redefinir
              </button>
            </div>
          </div>
        </>
      ) : null}
    </>
  );
}

/** Texto das preces para a área de transferência e o WhatsApp. */
function formatarPreces(preces: Preces, dataExtenso: string): string {
  const linhas = ['*PRECES DA ASSEMBLEIA*', dataExtenso, '', preces.introducao, ''];

  preces.intencoes.forEach((intencao, i) => {
    linhas.push(`${i + 1}. ${intencao.texto}`, `_R. ${preces.resposta}_`, '');
  });

  linhas.push(preces.conclusao);
  return linhas.join('\n');
}
