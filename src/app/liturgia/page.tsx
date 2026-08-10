import { redirect } from 'next/navigation';
import { hoje } from '@/lib/liturgia/datas';

/*
 * A aba "Liturgia" abre sempre no dia de hoje. Precisa renderizar a cada
 * acesso: numa página estática a data ficaria congelada no build.
 */
export const dynamic = 'force-dynamic';

export default function LiturgiaDeHoje() {
  redirect(`/liturgia/${hoje()}`);
}
