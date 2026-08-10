import Link from 'next/link';
import { notFound } from 'next/navigation';
import { AcompanharOracao } from '@/componentes/AcompanharOracao';
import { IconeSeta } from '@/componentes/icones';
import { acharOracao, ORACOES_EUCARISTICAS } from '@/dados/oracoes-eucaristicas';

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
  const oracao = acharOracao(id);
  if (!oracao) notFound();

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
