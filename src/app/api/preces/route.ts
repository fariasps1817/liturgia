import { diferencaEmDias, eDataValida, hoje } from '@/lib/liturgia/datas';
import { buscarLiturgia } from '@/lib/liturgia/fonte-remota';
import { ErroAoGerarPreces, gerarPreces, MODELO } from '@/lib/preces/gerar';
import { apagarPreces, buscarPreces, salvarPreces } from '@/lib/preces/repositorio';
import { COMUNIDADE_PADRAO } from '@/lib/preces/tipos';

/*
 * Cada geração custa centavos na conta da Anthropic de quem hospeda o app, e a
 * rota é pública. Limitar a janela de datas não é segurança de verdade, mas
 * transforma "alguém pode gerar infinitas preces" em "alguém pode gerar no
 * máximo umas centenas" — o suficiente para uma paróquia enquanto não houver
 * autenticação.
 */
const DIAS_PARA_TRAS = 60;
const DIAS_PARA_FRENTE = 90;

const LIMITE_INTENCAO = 500;
const LIMITE_RESPOSTA = 120;

function dentroDaJanela(data: string): boolean {
  const distancia = diferencaEmDias(data, hoje());
  return distancia >= -DIAS_PARA_TRAS && distancia <= DIAS_PARA_FRENTE;
}

export async function GET(requisicao: Request) {
  const url = new URL(requisicao.url);
  const data = url.searchParams.get('data');
  const comunidade = url.searchParams.get('comunidade') ?? COMUNIDADE_PADRAO;

  if (!data || !eDataValida(data)) {
    return Response.json({ erro: 'Informe a data no formato AAAA-MM-DD.' }, { status: 400 });
  }

  try {
    const preces = await buscarPreces(data, comunidade);
    return Response.json({ preces }, { headers: { 'Cache-Control': 'no-store' } });
  } catch {
    // Banco indisponível não pode derrubar a tela da liturgia inteira: a página
    // simplesmente mostra "a gerar" e o erro real aparece ao tentar gerar.
    return Response.json({ preces: null }, { headers: { 'Cache-Control': 'no-store' } });
  }
}

export async function POST(requisicao: Request) {
  let corpo: unknown;
  try {
    corpo = await requisicao.json();
  } catch {
    return Response.json({ erro: 'Corpo da requisição inválido.' }, { status: 400 });
  }

  const { data, resposta, intencaoLocal, comunidade } = (corpo ?? {}) as {
    data?: string;
    resposta?: string;
    intencaoLocal?: string;
    comunidade?: string;
  };

  if (!data || !eDataValida(data)) {
    return Response.json({ erro: 'Informe a data no formato AAAA-MM-DD.' }, { status: 400 });
  }

  if (!dentroDaJanela(data)) {
    return Response.json(
      { erro: 'Só dá para gerar preces para datas próximas — entre dois meses atrás e três meses à frente.' },
      { status: 400 },
    );
  }

  if ((intencaoLocal?.length ?? 0) > LIMITE_INTENCAO) {
    return Response.json(
      { erro: `A intenção da comunidade passa de ${LIMITE_INTENCAO} caracteres.` },
      { status: 400 },
    );
  }

  if ((resposta?.length ?? 0) > LIMITE_RESPOSTA) {
    return Response.json(
      { erro: `A resposta da assembleia passa de ${LIMITE_RESPOSTA} caracteres.` },
      { status: 400 },
    );
  }

  try {
    const { liturgia } = await buscarLiturgia(data);
    const conteudo = await gerarPreces(liturgia, { resposta, intencaoLocal });

    const preces = {
      ...conteudo,
      data,
      comunidade: comunidade ?? COMUNIDADE_PADRAO,
      intencaoLocal: intencaoLocal?.trim() || undefined,
      modelo: MODELO,
      criadoEm: new Date().toISOString(),
    };

    await salvarPreces(preces);

    return Response.json({ preces }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (erro) {
    if (erro instanceof ErroAoGerarPreces) {
      return Response.json({ erro: erro.message }, { status: 502 });
    }
    console.error('Falha ao gerar preces', erro);
    return Response.json(
      { erro: 'Não foi possível gerar as preces agora. Tente de novo em instantes.' },
      { status: 500 },
    );
  }
}

export async function DELETE(requisicao: Request) {
  const url = new URL(requisicao.url);
  const data = url.searchParams.get('data');
  const comunidade = url.searchParams.get('comunidade') ?? COMUNIDADE_PADRAO;

  if (!data || !eDataValida(data)) {
    return Response.json({ erro: 'Informe a data no formato AAAA-MM-DD.' }, { status: 400 });
  }

  try {
    await apagarPreces(data, comunidade);
    return Response.json({ ok: true }, { headers: { 'Cache-Control': 'no-store' } });
  } catch {
    return Response.json({ erro: 'Não foi possível redefinir as preces.' }, { status: 500 });
  }
}
