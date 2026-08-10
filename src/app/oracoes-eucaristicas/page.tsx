import { BotaoDeLinha, Cabecalho, Cartao } from '@/componentes/ui';
import { ORACOES_EUCARISTICAS } from '@/dados/oracoes-eucaristicas';

export const metadata = { title: 'Orações Eucarísticas' };

export default function PaginaDasOracoes() {
  return (
    <>
      <Cabecalho
        titulo="Orações Eucarísticas"
        abaixo="Para acompanhar o celebrante e responder na hora certa."
      />

      <div className="space-y-2">
        {ORACOES_EUCARISTICAS.map((oracao) => (
          <BotaoDeLinha
            key={oracao.id}
            href={`/oracoes-eucaristicas/${oracao.id}`}
            titulo={oracao.nome}
            descricao={oracao.quando}
          />
        ))}
      </div>

      <Cartao className="mt-5">
        <p className="text-sm text-tinta-suave">
          As respostas da assembleia são as mesmas em todas as Orações Eucarísticas — o que muda é
          a fala do celebrante. Por isso cada oração aqui mostra as deixas dele em letra menor, e
          as respostas do povo em destaque.
        </p>
      </Cartao>

      <p className="mt-4 text-center text-xs text-tinta-fraca">
        Funciona sem internet.
      </p>
    </>
  );
}
