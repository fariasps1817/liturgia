import Link from 'next/link';
import { IconeAviso } from '@/componentes/icones';
import { Cabecalho, Cartao } from '@/componentes/ui';

export const metadata = { title: 'Sem conexão' };

export default function Offline() {
  return (
    <>
      <Cabecalho titulo="Sem conexão" acima="Liturgia" />
      <Cartao>
        <div className="flex gap-3">
          <IconeAviso className="mt-0.5 h-5 w-5 shrink-0 text-realce" />
          <div className="space-y-3 text-sm text-tinta-suave">
            <p>
              Não deu para alcançar a internet agora. O que já foi aberto antes continua
              disponível.
            </p>
            <p>
              As <strong className="text-tinta">Orações Eucarísticas</strong> funcionam sempre,
              mesmo sem sinal.
            </p>
          </div>
        </div>
      </Cartao>
      <div className="mt-4 space-y-2">
        <Link
          href="/oracoes-eucaristicas"
          className="flex min-h-14 items-center justify-center rounded-2xl bg-realce px-4 font-semibold text-superficie"
        >
          Abrir as Orações Eucarísticas
        </Link>
        <Link
          href="/calendario"
          className="flex min-h-14 items-center justify-center rounded-2xl border border-borda bg-superficie px-4 font-semibold text-tinta"
        >
          Voltar ao calendário
        </Link>
      </div>
    </>
  );
}
