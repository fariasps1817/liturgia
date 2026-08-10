import Link from 'next/link';
import { notFound } from 'next/navigation';
import { IconeSeta } from '@/componentes/icones';
import { PainelDePreces } from '@/componentes/PainelDePreces';
import { curta, eDataValida, porExtenso } from '@/lib/liturgia/datas';
import { diaLiturgico } from '@/lib/liturgia/calendario';

export async function generateMetadata({ params }: PageProps<'/liturgia/[data]/preces'>) {
  const { data } = await params;
  return { title: eDataValida(data) ? `Preces · ${curta(data)}` : 'Preces' };
}

export default async function PaginaDasPreces({ params }: PageProps<'/liturgia/[data]/preces'>) {
  const { data } = await params;
  if (!eDataValida(data)) notFound();

  // Só o calendário local: esta página não precisa dos textos das leituras — o
  // servidor os busca na hora de gerar. Assim ela abre na hora, mesmo em 3G.
  const dia = diaLiturgico(data);

  return (
    <>
      <Link
        href={`/liturgia/${data}`}
        className="mb-4 inline-flex items-center gap-1 text-sm font-medium text-tinta-suave"
      >
        <IconeSeta className="h-4 w-4" direcao="esquerda" />
        <span className="truncate">{dia.celebracao}</span>
      </Link>

      <header className="mb-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-tinta-fraca">
          {porExtenso(data)}
        </p>
        <h1 className="mt-1 text-2xl font-bold leading-tight text-tinta">Preces da Assembleia</h1>
      </header>

      <PainelDePreces data={data} dataExtenso={porExtenso(data)} />
    </>
  );
}
