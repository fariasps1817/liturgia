import Link from 'next/link';
import { notFound } from 'next/navigation';
import { IconeAviso, IconeFaisca, IconeSeta } from '@/componentes/icones';
import { Aviso, BotaoDeLinha, Cabecalho, Etiqueta, LinhaDoCiclo } from '@/componentes/ui';
import { NOME_DO_TEMPO } from '@/lib/liturgia/calendario';
import { curta, eDataValida, somarDias } from '@/lib/liturgia/datas';
import { buscarLiturgia } from '@/lib/liturgia/fonte-remota';
import { precesExistem } from '@/lib/preces/repositorio';

export async function generateMetadata({ params }: PageProps<'/liturgia/[data]'>) {
  const { data } = await params;
  if (!eDataValida(data)) return { title: 'Liturgia' };
  const { liturgia } = await buscarLiturgia(data);
  return { title: `${liturgia.celebracao} · ${curta(data)}` };
}

export default async function PaginaDoDia({ params }: PageProps<'/liturgia/[data]'>) {
  const { data } = await params;
  if (!eDataValida(data)) notFound();

  const { liturgia, erro } = await buscarLiturgia(data);

  /*
   * O estado das preces é consultado à parte e nunca derruba a página: se o
   * banco estiver fora, a lista de leituras continua aparecendo e o botão de
   * preces só deixa de mostrar a etiqueta "gerado".
   */
  let jaTemPreces = false;
  try {
    jaTemPreces = await precesExistem(data);
  } catch {
    jaTemPreces = false;
  }

  const ontem = somarDias(data, -1);
  const amanha = somarDias(data, 1);

  return (
    <>
      <Cabecalho
        titulo={liturgia.celebracao}
        acima={liturgia.dataExtenso}
        abaixo={
          <>
            <p>{NOME_DO_TEMPO[liturgia.tempo]}</p>
            <div className="mt-1">
              <LinhaDoCiclo
                anoLiturgico={liturgia.anoLiturgico}
                cicloFerial={liturgia.cicloFerial}
                cor={liturgia.cor}
              />
            </div>
          </>
        }
      />

      {erro ? (
        <Aviso icone={<IconeAviso className="h-5 w-5" />}>
          <p className="font-semibold text-tinta">Os textos das leituras não carregaram.</p>
          <p className="mt-1">
            {erro} A celebração, a cor e os ciclos acima são calculados no próprio aparelho e
            continuam corretos.
          </p>
        </Aviso>
      ) : null}

      {liturgia.leiturasSuspeitas ? (
        <Aviso icone={<IconeAviso className="h-5 w-5" />}>
          <p className="font-semibold text-tinta">Confira estas leituras no Lecionário.</p>
          <p className="mt-1">
            Hoje é solenidade, mas a fonte devolveu as leituras do tempo corrente. A celebração e a
            cor acima estão certas — as leituras abaixo provavelmente não são as próprias do dia.
          </p>
        </Aviso>
      ) : null}

      <div className="space-y-2">
        {liturgia.leituras.map((leitura) => (
          <BotaoDeLinha
            key={leitura.tipo}
            href={`/liturgia/${data}/${leitura.tipo}`}
            titulo={leitura.titulo}
            descricao={leitura.refResumida || leitura.referencia}
            corDaBarra={liturgia.cor}
          />
        ))}

        <BotaoDeLinha
          href={`/liturgia/${data}/preces`}
          titulo="Preces da Assembleia"
          descricao={
            jaTemPreces ? 'Prontas para a missa' : 'Gerar seguindo as quatro séries do Missal'
          }
          destaque
          etiqueta={
            jaTemPreces ? (
              <Etiqueta tom="sucesso">gerado</Etiqueta>
            ) : (
              <Etiqueta tom="realce">
                <span className="inline-flex items-center gap-1">
                  <IconeFaisca className="h-3 w-3" />a gerar
                </span>
              </Etiqueta>
            )
          }
        />
      </div>

      <nav aria-label="Outros dias" className="mt-6 flex gap-2">
        <Link
          href={`/liturgia/${ontem}`}
          className="flex min-h-12 flex-1 items-center justify-center gap-1.5 rounded-2xl border border-borda bg-superficie text-sm font-medium text-tinta-suave active:bg-superficie-2"
        >
          <IconeSeta className="h-4 w-4" direcao="esquerda" />
          {curta(ontem)}
        </Link>
        <Link
          href={`/liturgia/${amanha}`}
          className="flex min-h-12 flex-1 items-center justify-center gap-1.5 rounded-2xl border border-borda bg-superficie text-sm font-medium text-tinta-suave active:bg-superficie-2"
        >
          {curta(amanha)}
          <IconeSeta className="h-4 w-4" />
        </Link>
      </nav>

      {liturgia.fonte ? (
        <p className="mt-6 text-center text-xs text-tinta-fraca">
          Textos litúrgicos obtidos de{' '}
          <a
            href={liturgia.fonte.url}
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2"
          >
            {liturgia.fonte.nome}
          </a>
          .
        </p>
      ) : null}
    </>
  );
}
