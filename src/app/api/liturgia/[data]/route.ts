import { eDataValida } from '@/lib/liturgia/datas';
import { buscarLiturgia } from '@/lib/liturgia/fonte-remota';

/**
 * A liturgia de um dia, já normalizada.
 *
 * O celular nunca fala com a fonte externa direto — passa por aqui. Isso nos
 * dá três coisas que importam: cache do lado do servidor, liberdade de trocar
 * de fonte sem atualizar o app instalado, e uma resposta com formato estável
 * mesmo quando a fonte muda o dela.
 *
 * Sempre responde 200 com um corpo utilizável: quando a fonte falha, vem a
 * liturgia montada só com o calendário calculado localmente e o campo `erro`
 * preenchido. Devolver 5xx aqui só faria a tela ficar vazia justamente quando
 * a rede está ruim.
 */
export async function GET(_requisicao: Request, ctx: RouteContext<'/api/liturgia/[data]'>) {
  const { data } = await ctx.params;

  if (!eDataValida(data)) {
    return Response.json({ erro: 'Data inválida. Use o formato AAAA-MM-DD.' }, { status: 400 });
  }

  const { liturgia, erro } = await buscarLiturgia(data);

  return Response.json(
    { liturgia, erro },
    {
      headers: {
        // A liturgia de um dia não muda depois de publicada. O `stale-while-revalidate`
        // longo faz o app continuar respondendo instantaneamente mesmo se a fonte cair.
        'Cache-Control': erro
          ? 'public, max-age=0, s-maxage=60'
          : 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800',
      },
    },
  );
}
