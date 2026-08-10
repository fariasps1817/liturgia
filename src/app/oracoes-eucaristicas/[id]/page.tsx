import Link from 'next/link';
import { notFound } from 'next/navigation';
import { AcompanharOracao } from '@/componentes/AcompanharOracao';
import { IconeSeta } from '@/componentes/icones';
import { acharOracao, ORACOES_EUCARISTICAS } from '@/dados/oracoes-eucaristicas';
import {
  carregarTextosDoMissal,
  comTextosDoMissal,
} from '@/dados/oracoes-eucaristicas/missal-local';
import {
  aplicarTextoPresidencial,
  mostrarTextoPresidencial,
} from '@/dados/oracoes-eucaristicas/presidencial';

/* Conteúdo fixo: pré-renderiza todas, para abrirem sem rede. */
export function generateStaticParams() {
  return ORACOES_EUCARISTICAS.map((oracao) => ({ id: oracao.id }));
}

export async function generateMetadata({ params }: PageProps<'/oracoes-eucaristicas/[id]'>) {
  const { id } = await params;
  return { title: acharOracao(id)?.nome ?? 'Oração Eucarística' };
}

export default async function PaginaDaOracao({ params }: PageProps<'/oracoes-eucaristicas/[id]'>) {
  const { id } = await params;
  const encontrada = acharOracao(id);
  if (!encontrada) notFound();

  /*
   * Primeiro encaixa o que houver em missal.local.txt, depois aplica a chave.
   * Nesta ordem: com a chave desligada, o texto do Missal é removido junto com
   * o resto e não chega sequer ao navegador.
   */
  const oracao = aplicarTextoPresidencial(
    comTextosDoMissal(encontrada, carregarTextosDoMissal()),
    mostrarTextoPresidencial(),
  );

  return (
    <>
      <Link
        href="/oracoes-eucaristicas"
        className="mb-4 inline-flex items-center gap-1 text-sm font-medium text-tinta-suave"
      >
        <IconeSeta className="h-4 w-4" direcao="esquerda" />
        Orações Eucarísticas
      </Link>

      <header className="mb-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-tinta-fraca">
          Oração Eucarística {oracao.numero}
        </p>
        <h1 className="mt-1 text-2xl font-bold leading-tight text-tinta">{oracao.nome}</h1>
        <p className="mt-1 text-sm text-tinta-suave">{oracao.quando}</p>
      </header>

      <AcompanharOracao oracao={oracao} />
    </>
  );
}
