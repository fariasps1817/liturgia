import Link from 'next/link';
import { notFound } from 'next/navigation';
import { AcoesDeTexto } from '@/componentes/AcoesDeTexto';
import { ControleDeFonte } from '@/componentes/ControleDeFonte';
import { IconeAviso, IconeSeta } from '@/componentes/icones';
import { Aviso } from '@/componentes/ui';
import { curta, eDataValida, porExtenso } from '@/lib/liturgia/datas';
import { buscarLiturgia } from '@/lib/liturgia/fonte-remota';
import { ORDEM_LEITURAS, ROTULO_LEITURA, type Leitura, type TipoLeitura } from '@/lib/liturgia/tipos';

function ehTipoDeLeitura(valor: string): valor is TipoLeitura {
  return (ORDEM_LEITURAS as string[]).includes(valor);
}

export async function generateMetadata({ params }: PageProps<'/liturgia/[data]/[leitura]'>) {
  const { data, leitura } = await params;
  if (!eDataValida(data) || !ehTipoDeLeitura(leitura)) return { title: 'Leitura' };
  return { title: `${ROTULO_LEITURA[leitura]} · ${curta(data)}` };
}

/** Formata o texto que vai para a área de transferência e para o WhatsApp. */
function paraCompartilhar(leitura: Leitura, dataExtenso: string): string {
  const linhas = [`*${leitura.titulo}*`];
  if (leitura.refResumida || leitura.referencia) {
    linhas.push(leitura.refResumida || leitura.referencia);
  }
  linhas.push('');
  if (leitura.introducao) linhas.push(leitura.introducao, '');
  if (leitura.refrao) linhas.push(`_R. ${leitura.refrao}_`, '');
  linhas.push(leitura.texto, '', `_${dataExtenso}_`);
  return linhas.join('\n');
}

export default async function PaginaDaLeitura({ params }: PageProps<'/liturgia/[data]/[leitura]'>) {
  const { data, leitura: tipo } = await params;
  if (!eDataValida(data) || !ehTipoDeLeitura(tipo)) notFound();

  const { liturgia, erro } = await buscarLiturgia(data);
  const leitura = liturgia.leituras.find((l) => l.tipo === tipo);

  if (!leitura) {
    return (
      <>
        <Link
          href={`/liturgia/${data}`}
          className="mb-4 inline-flex items-center gap-1 text-sm font-medium text-tinta-suave"
        >
          <IconeSeta className="h-4 w-4" direcao="esquerda" />
          {liturgia.celebracao}
        </Link>
        <h1 className="mb-4 text-2xl font-bold text-tinta">{ROTULO_LEITURA[tipo]}</h1>
        <Aviso icone={<IconeAviso className="h-5 w-5" />}>
          <p className="font-semibold text-tinta">Esta leitura não está disponível.</p>
          <p className="mt-1">
            {erro ??
              'A liturgia deste dia não traz esta leitura — em dias de semana, por exemplo, não há segunda leitura.'}
          </p>
        </Aviso>
      </>
    );
  }

  const textoCompleto = paraCompartilhar(leitura, liturgia.dataExtenso);
  const paragrafos = leitura.texto.split(/\n{2,}/).filter(Boolean);

  return (
    <>
      <Link
        href={`/liturgia/${data}`}
        className="mb-4 inline-flex items-center gap-1 text-sm font-medium text-tinta-suave"
      >
        <IconeSeta className="h-4 w-4" direcao="esquerda" />
        <span className="truncate">{liturgia.celebracao}</span>
      </Link>

      <header className="mb-5 border-b border-borda pb-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-tinta-fraca">
          {porExtenso(data)}
        </p>
        <h1 className="mt-1 text-2xl font-bold leading-tight text-tinta">{leitura.titulo}</h1>
        {leitura.refResumida || leitura.referencia ? (
          <p className="mt-1 text-lg font-medium text-realce">
            {leitura.refResumida || leitura.referencia}
          </p>
        ) : null}

        <div className="mt-3 flex justify-end">
          <ControleDeFonte />
        </div>
      </header>

      <article className="corpo-leitura pb-4">
        {leitura.introducao ? (
          <p className="mb-5 font-semibold not-italic text-tinta-suave">{leitura.introducao}</p>
        ) : null}

        {leitura.refrao ? (
          <p className="mb-5 rounded-xl border-l-4 border-realce bg-superficie-2 px-4 py-3 font-semibold text-tinta">
            <span className="mr-1.5 text-realce">R.</span>
            {leitura.refrao}
          </p>
        ) : null}

        {paragrafos.map((paragrafo, i) => (
          <p key={i}>{paragrafo}</p>
        ))}

        <p className="mt-6 text-sm font-semibold uppercase tracking-wide text-tinta-fraca not-italic">
          {tipo === 'evangelho' ? 'Palavra da Salvação.' : tipo === 'salmo' ? '' : 'Palavra do Senhor.'}
        </p>
      </article>

      {/* Espaço para a barra fixa de ações não cobrir o fim do texto. */}
      <div aria-hidden className="h-20" />

      <AcoesDeTexto texto={textoCompleto} titulo={`${leitura.titulo} — ${liturgia.dataExtenso}`} />
    </>
  );
}
