'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { diaLiturgico, gradeDoMes, NOME_DO_TEMPO } from '@/lib/liturgia/calendario';
import { ano as anoDe, mes as mesDe, nomeDoMes, porExtenso, somarDias } from '@/lib/liturgia/datas';
import { useHoje } from '@/lib/hoje-no-cliente';
import { preCarregarDias } from './RegistrarServiceWorker';
import { IconeSeta } from './icones';
import { FUNDO_DA_COR, LinhaDoCiclo } from './ui';

const CABECALHO_SEMANA = [
  { curto: 'D', longo: 'domingo' },
  { curto: 'S', longo: 'segunda-feira' },
  { curto: 'T', longo: 'terça-feira' },
  { curto: 'Q', longo: 'quarta-feira' },
  { curto: 'Q', longo: 'quinta-feira' },
  { curto: 'S', longo: 'sexta-feira' },
  { curto: 'S', longo: 'sábado' },
];

export function Calendario({ hoje: hojeDoServidor }: { hoje: string }) {
  const hoje = useHoje(hojeDoServidor);

  /*
   * `null` significa "acompanhe o dia de hoje". Assim, quando a data vira — ou
   * quando o valor do servidor vinha do cache e estava velho — a seleção
   * acompanha sozinha; e, assim que alguém escolhe um dia, a escolha manda.
   */
  const [escolhida, setEscolhida] = useState<string | null>(null);
  const [mesEscolhido, setMesEscolhido] = useState<string | null>(null);

  const selecionada = escolhida ?? hoje;
  const mesVisivel = mesEscolhido ?? selecionada.slice(0, 7);
  const setSelecionada = setEscolhida;

  const [anoVisivel, numeroDoMes] = useMemo(() => {
    const [a, m] = mesVisivel.split('-');
    return [Number(a), Number(m)] as const;
  }, [mesVisivel]);

  const dias = useMemo(() => gradeDoMes(anoVisivel, numeroDoMes), [anoVisivel, numeroDoMes]);
  const detalhe = useMemo(() => diaLiturgico(selecionada), [selecionada]);

  /*
   * Baixa a liturgia da próxima semana assim que o calendário abre.
   *
   * A equipe monta a missa em casa, com wi-fi, e usa o app na igreja, onde
   * quase sempre o sinal é ruim. Adiantar os próximos sete dias faz o domingo
   * já estar no aparelho antes de alguém precisar dele.
   */
  useEffect(() => {
    preCarregarDias(Array.from({ length: 8 }, (_, i) => somarDias(hoje, i)));
  }, [hoje]);

  const mudarMes = (passo: number) => {
    const d = new Date(Date.UTC(anoVisivel, numeroDoMes - 1 + passo, 1));
    setMesEscolhido(`${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}`);
  };

  return (
    <>
      <div className="mb-3 flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => mudarMes(-1)}
          aria-label="Mês anterior"
          className="flex h-11 w-11 items-center justify-center rounded-full border border-borda bg-superficie text-tinta-suave active:bg-superficie-2"
        >
          <IconeSeta className="h-5 w-5" direcao="esquerda" />
        </button>

        <h2 aria-live="polite" className="text-center text-lg font-bold capitalize text-tinta">
          {nomeDoMes(numeroDoMes)} <span className="font-normal text-tinta-suave">{anoVisivel}</span>
        </h2>

        <button
          type="button"
          onClick={() => mudarMes(1)}
          aria-label="Próximo mês"
          className="flex h-11 w-11 items-center justify-center rounded-full border border-borda bg-superficie text-tinta-suave active:bg-superficie-2"
        >
          <IconeSeta className="h-5 w-5" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1" role="grid" aria-label="Calendário litúrgico">
        {CABECALHO_SEMANA.map(({ curto, longo }, i) => (
          <div
            key={i}
            role="columnheader"
            aria-label={longo}
            className="pb-1 text-center text-xs font-semibold uppercase text-tinta-fraca"
          >
            <span aria-hidden>{curto}</span>
          </div>
        ))}

        {dias.map((data) => {
          const dl = diaLiturgico(data);
          const doMes = mesDe(data) === numeroDoMes && anoDe(data) === anoVisivel;
          const eHoje = data === hoje;
          const eSelecionada = data === selecionada;

          return (
            <button
              key={data}
              type="button"
              role="gridcell"
              onClick={() => setSelecionada(data)}
              aria-label={`${porExtenso(data)}. ${dl.celebracao}`}
              aria-selected={eSelecionada}
              className={`relative flex aspect-square flex-col items-center justify-center gap-1 rounded-xl text-sm transition-colors ${
                eSelecionada
                  ? 'bg-realce font-bold text-superficie'
                  : doMes
                    ? 'text-tinta active:bg-superficie-2'
                    : 'text-tinta-fraca/50'
              } ${eHoje && !eSelecionada ? 'ring-2 ring-inset ring-realce/60 font-bold' : ''}`}
            >
              <span>{Number(data.slice(8, 10))}</span>
              <span
                aria-hidden
                className={`h-1.5 w-1.5 rounded-full ${
                  eSelecionada ? 'bg-superficie/80' : FUNDO_DA_COR[dl.cor]
                } ${doMes ? '' : 'opacity-40'}`}
              />
            </button>
          );
        })}
      </div>

      {/* Detalhe do dia escolhido, logo abaixo da grade. */}
      <section aria-live="polite" className="mt-5 rounded-2xl border border-borda bg-superficie p-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-tinta-fraca">
          {porExtenso(selecionada)}
        </p>
        <h3 className="mt-1 text-lg font-bold leading-snug text-tinta">{detalhe.celebracao}</h3>
        <p className="mt-1 text-sm text-tinta-suave">{NOME_DO_TEMPO[detalhe.tempo]}</p>
        <div className="mt-2">
          <LinhaDoCiclo
            anoLiturgico={detalhe.anoLiturgico}
            cicloFerial={detalhe.cicloFerial}
            cor={detalhe.cor}
          />
        </div>

        <Link
          href={`/liturgia/${selecionada}`}
          className="mt-4 flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-realce px-4 font-semibold text-superficie active:opacity-90"
        >
          Ver liturgia do dia
          <IconeSeta className="h-5 w-5" />
        </Link>
      </section>
    </>
  );
}
