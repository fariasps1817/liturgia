import { Calendario } from '@/componentes/Calendario';
import { Cabecalho } from '@/componentes/ui';
import { hoje } from '@/lib/liturgia/datas';

export const metadata = { title: 'Calendário' };

/*
 * Renderiza a cada acesso porque "hoje" muda todo dia: numa página estática, a
 * data ficaria congelada no momento do build e o app abriria sempre no mesmo
 * dia. O componente ainda reconfere a data no aparelho ao montar, para o caso
 * de a página ter vindo do cache offline.
 */
export const dynamic = 'force-dynamic';

/*
 * O calendário em si é calculado no aparelho — nenhuma chamada de rede para
 * desenhar a grade.
 */
export default function PaginaCalendario() {
  return (
    <>
      <Cabecalho titulo="Calendário" abaixo="Escolha um dia para ver as leituras da missa." />
      <Calendario hoje={hoje()} />
    </>
  );
}
