/**
 * Utilitários de data.
 *
 * Regra da casa: toda data litúrgica trafega como string `YYYY-MM-DD` e toda
 * conta é feita em UTC. Datas litúrgicas são dias do calendário, não instantes;
 * usar horário local aqui faz o app pular ou repetir um dia quando o horário de
 * verão muda ou quando o servidor roda em outro fuso.
 */

const FUSO_BRASIL = 'America/Sao_Paulo';

const DIAS_SEMANA = [
  'Domingo',
  'Segunda-feira',
  'Terça-feira',
  'Quarta-feira',
  'Quinta-feira',
  'Sexta-feira',
  'Sábado',
] as const;

const MESES = [
  'janeiro',
  'fevereiro',
  'março',
  'abril',
  'maio',
  'junho',
  'julho',
  'agosto',
  'setembro',
  'outubro',
  'novembro',
  'dezembro',
] as const;

/** Verdadeiro para strings no formato `YYYY-MM-DD` que existem no calendário. */
export function eDataValida(iso: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return false;
  const d = new Date(`${iso}T00:00:00Z`);
  return !Number.isNaN(d.getTime()) && paraISO(d) === iso;
}

export function paraISO(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export function deISO(iso: string): Date {
  return new Date(`${iso}T00:00:00Z`);
}

export function criar(ano: number, mes: number, dia: number): string {
  return paraISO(new Date(Date.UTC(ano, mes - 1, dia)));
}

export function somarDias(iso: string, dias: number): string {
  const d = deISO(iso);
  d.setUTCDate(d.getUTCDate() + dias);
  return paraISO(d);
}

/** 0 = domingo … 6 = sábado. */
export function diaDaSemana(iso: string): number {
  return deISO(iso).getUTCDay();
}

export function ano(iso: string): number {
  return Number(iso.slice(0, 4));
}

export function mes(iso: string): number {
  return Number(iso.slice(5, 7));
}

export function dia(iso: string): number {
  return Number(iso.slice(8, 10));
}

/** Diferença em dias inteiros entre duas datas (a - b). */
export function diferencaEmDias(a: string, b: string): number {
  return Math.round((deISO(a).getTime() - deISO(b).getTime()) / 86_400_000);
}

/** O domingo na mesma semana litúrgica (domingo a sábado) ou anterior. */
export function domingoAnterior(iso: string): string {
  return somarDias(iso, -diaDaSemana(iso));
}

/**
 * A data de hoje no fuso de Brasília.
 *
 * Precisa ser o fuso do Brasil e não o do servidor: na Vercel o servidor roda em
 * UTC, e entre 21h e 24h de Brasília o `new Date()` do servidor já está no dia
 * seguinte — o app abriria na liturgia de amanhã justamente no fim da tarde,
 * que é quando a equipe prepara a missa.
 */
export function hoje(): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: FUSO_BRASIL,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());
}

/** "Segunda-feira, 10 de agosto de 2026" */
export function porExtenso(iso: string): string {
  return `${DIAS_SEMANA[diaDaSemana(iso)]}, ${dia(iso)} de ${MESES[mes(iso) - 1]} de ${ano(iso)}`;
}

/** "10 de agosto de 2026" */
export function porExtensoSemDiaDaSemana(iso: string): string {
  return `${dia(iso)} de ${MESES[mes(iso) - 1]} de ${ano(iso)}`;
}

/** "10/08/2026" */
export function curta(iso: string): string {
  return `${String(dia(iso)).padStart(2, '0')}/${String(mes(iso)).padStart(2, '0')}/${ano(iso)}`;
}

export function nomeDoMes(numeroDoMes: number): string {
  return MESES[numeroDoMes - 1];
}

export { DIAS_SEMANA, MESES };
