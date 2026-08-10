import Link from 'next/link';
import type { ReactNode } from 'react';
import type { CorLiturgica } from '@/lib/liturgia/calendario';
import { IconeSeta } from './icones';

/** Classe de cor de texto para cada cor litúrgica. */
export const TEXTO_DA_COR: Record<CorLiturgica, string> = {
  verde: 'text-lit-verde',
  branco: 'text-lit-branco',
  vermelho: 'text-lit-vermelho',
  roxo: 'text-lit-roxo',
  rosa: 'text-lit-rosa',
};

export const FUNDO_DA_COR: Record<CorLiturgica, string> = {
  verde: 'bg-lit-verde',
  branco: 'bg-lit-branco',
  vermelho: 'bg-lit-vermelho',
  roxo: 'bg-lit-roxo',
  rosa: 'bg-lit-rosa',
};

export const NOME_DA_COR: Record<CorLiturgica, string> = {
  verde: 'Verde',
  branco: 'Branco',
  vermelho: 'Vermelho',
  roxo: 'Roxo',
  rosa: 'Rosa',
};

/** Cabeçalho de página. */
export function Cabecalho({
  titulo,
  acima,
  abaixo,
}: {
  titulo: string;
  acima?: ReactNode;
  abaixo?: ReactNode;
}) {
  return (
    <header className="mb-5">
      {acima ? (
        <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-tinta-fraca">{acima}</p>
      ) : null}
      <h1 className="text-2xl font-bold leading-tight text-tinta">{titulo}</h1>
      {abaixo ? <div className="mt-1.5 text-sm text-tinta-suave">{abaixo}</div> : null}
    </header>
  );
}

export function Cartao({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-2xl border border-borda bg-superficie p-4 ${className}`}>{children}</div>
  );
}

/**
 * Botão de navegação em bloco.
 *
 * Alto de propósito (mínimo 64px): o alvo precisa ser fácil de acertar em pé,
 * com uma mão só, às vezes segurando um folheto na outra.
 */
export function BotaoDeLinha({
  href,
  titulo,
  descricao,
  etiqueta,
  destaque,
  corDaBarra,
}: {
  href: string;
  titulo: string;
  descricao?: ReactNode;
  etiqueta?: ReactNode;
  destaque?: boolean;
  corDaBarra?: CorLiturgica;
}) {
  return (
    <Link
      href={href}
      className={`flex min-h-16 items-center gap-3 rounded-2xl border p-4 transition-colors active:bg-superficie-2 ${
        destaque
          ? 'border-realce/40 bg-realce/5'
          : 'border-borda bg-superficie hover:border-tinta-fraca/40'
      }`}
    >
      {corDaBarra ? (
        <span
          aria-hidden
          className={`h-10 w-1 shrink-0 rounded-full ${FUNDO_DA_COR[corDaBarra]}`}
        />
      ) : null}
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-2">
          <span className="font-semibold text-tinta">{titulo}</span>
          {etiqueta}
        </span>
        {descricao ? (
          <span className="mt-0.5 block truncate text-sm text-tinta-suave">{descricao}</span>
        ) : null}
      </span>
      <IconeSeta className="h-5 w-5 shrink-0 text-tinta-fraca" />
    </Link>
  );
}

export function Etiqueta({
  children,
  tom = 'neutro',
}: {
  children: ReactNode;
  tom?: 'neutro' | 'realce' | 'sucesso';
}) {
  const tons = {
    neutro: 'bg-superficie-2 text-tinta-suave',
    realce: 'bg-realce/15 text-realce',
    sucesso: 'bg-lit-verde/15 text-lit-verde',
  };
  return (
    <span className={`rounded-full px-2 py-0.5 text-[0.6875rem] font-semibold ${tons[tom]}`}>
      {children}
    </span>
  );
}

/** Faixa de aviso — usada quando a fonte das leituras não respondeu. */
export function Aviso({ children, icone }: { children: ReactNode; icone?: ReactNode }) {
  return (
    <div
      role="status"
      className="mb-4 flex gap-3 rounded-2xl border border-realce/30 bg-realce/5 p-4 text-sm text-tinta-suave"
    >
      {icone ? <span className="mt-0.5 shrink-0 text-realce">{icone}</span> : null}
      <div className="min-w-0">{children}</div>
    </div>
  );
}

/** Linha "Ano A · Ciclo II · Verde" que aparece sob o título do dia. */
export function LinhaDoCiclo({
  anoLiturgico,
  cicloFerial,
  cor,
}: {
  anoLiturgico: string;
  cicloFerial: string;
  cor: CorLiturgica;
}) {
  return (
    <span className="inline-flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-tinta-suave">
      <span>Ano {anoLiturgico}</span>
      <span aria-hidden className="text-tinta-fraca">
        ·
      </span>
      <span>Ciclo {cicloFerial}</span>
      <span aria-hidden className="text-tinta-fraca">
        ·
      </span>
      <span className={`inline-flex items-center gap-1.5 ${TEXTO_DA_COR[cor]}`}>
        <span aria-hidden className={`h-2.5 w-2.5 rounded-full ${FUNDO_DA_COR[cor]}`} />
        {NOME_DA_COR[cor]}
      </span>
    </span>
  );
}
