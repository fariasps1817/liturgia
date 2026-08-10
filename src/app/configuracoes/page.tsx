import QRCode from 'qrcode';
import { BlocoDoDesenvolvedor } from '@/componentes/BlocoDoDesenvolvedor';
import { BotaoCopiar } from '@/componentes/BotaoCopiar';
import { IconeCoracao } from '@/componentes/icones';
import { SeletorDeTema } from '@/componentes/SeletorDeTema';
import { Cabecalho, Cartao } from '@/componentes/ui';
import { chaveDeTelefone, gerarBrCode } from '@/lib/pix/brcode';

export const metadata = { title: 'Configurações' };

const DESENVOLVEDOR = {
  nome: 'Farias Sousa',
  telefone: '85988811817',
  telefoneFormatado: '(85) 98881-1817',
  cidade: 'Fortaleza',
};

export default async function PaginaDeConfiguracoes() {
  const chavePix = chaveDeTelefone(DESENVOLVEDOR.telefone);
  const brCode = gerarBrCode({
    chave: chavePix,
    nome: DESENVOLVEDOR.nome,
    cidade: DESENVOLVEDOR.cidade,
  });

  /*
   * O QR é gerado aqui no servidor: o conteúdo é fixo, então não há motivo para
   * mandar uma biblioteca de QR para dentro do celular de quem usa o app.
   */
  const qrCode = await QRCode.toDataURL(brCode, {
    errorCorrectionLevel: 'M',
    margin: 1,
    width: 512,
    color: { dark: '#1a1a18', light: '#ffffff' },
  });

  const versao = process.env.NEXT_PUBLIC_VERSAO ?? 'local';
  const versaoData = process.env.NEXT_PUBLIC_VERSAO_DATA;
  const repositorio = process.env.NEXT_PUBLIC_REPOSITORIO;

  return (
    <>
      <Cabecalho titulo="Configurações" />

      <Cartao className="mb-6 border-realce/30 bg-realce/5">
        <div className="flex gap-3">
          <IconeCoracao className="mt-0.5 h-5 w-5 shrink-0 text-realce" />
          <p className="text-sm font-medium text-tinta">
            Este aplicativo é gratuito e livre — é para a obra de Deus.
          </p>
        </div>
      </Cartao>

      <section className="mb-6">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-tinta-fraca">
          Aparência
        </h2>
        <SeletorDeTema />
        <p className="mt-2 text-xs text-tinta-fraca">
          O tema escuro é mais confortável dentro da igreja, com a luz baixa.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-tinta-fraca">
          Sobre
        </h2>

        <div className="space-y-2">
          <div className="rounded-2xl border border-borda bg-superficie px-4 py-3">
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm text-tinta-suave">Versão</span>
              {repositorio && versao !== 'local' ? (
                <a
                  href={`${repositorio}/commit/${versao}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-sm font-semibold text-realce underline underline-offset-2"
                >
                  {versao}
                </a>
              ) : (
                <span className="font-mono text-sm font-semibold text-tinta">{versao}</span>
              )}
            </div>
            {versaoData ? (
              <p className="mt-1 text-xs text-tinta-fraca">
                Publicada em {new Date(versaoData).toLocaleDateString('pt-BR')}
              </p>
            ) : null}
          </div>

          <BlocoDoDesenvolvedor
            nome={DESENVOLVEDOR.nome}
            telefoneFormatado={DESENVOLVEDOR.telefoneFormatado}
            linkWhatsApp={`https://wa.me/55${DESENVOLVEDOR.telefone}`}
          />
        </div>
      </section>

      <section className="mb-6">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-tinta-fraca">
          Contribuir com o desenvolvimento
        </h2>

        <Cartao>
          <p className="text-sm text-tinta-suave">
            O app é e continuará gratuito. Se quiser ajudar a manter o desenvolvimento, qualquer
            valor é bem-vindo — e nenhum é esperado.
          </p>

          <div className="mt-4 flex justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={qrCode}
              alt={`QR Code do PIX para a chave ${DESENVOLVEDOR.telefoneFormatado}`}
              width={200}
              height={200}
              className="rounded-xl bg-white p-2"
            />
          </div>

          <div className="mt-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-tinta-fraca">
              Chave PIX (telefone)
            </p>
            <p className="mt-1 select-all font-mono text-lg font-semibold text-tinta">
              {DESENVOLVEDOR.telefoneFormatado}
            </p>
          </div>

          <div className="mt-4 flex flex-col gap-2 sm:flex-row">
            <BotaoCopiar
              texto={DESENVOLVEDOR.telefone}
              rotulo="Copiar chave"
              rotuloAcessivel="Copiar a chave PIX"
              className="flex-1"
            />
            <BotaoCopiar
              texto={brCode}
              rotulo="Pix Copia e Cola"
              rotuloAcessivel="Copiar o código Pix Copia e Cola"
              className="flex-1"
            />
          </div>
        </Cartao>
      </section>

      <p className="pb-4 text-center text-xs leading-relaxed text-tinta-fraca">
        Os textos das leituras pertencem aos seus detentores de direitos e são exibidos com
        atribuição à fonte. As Orações Eucarísticas trazem as respostas da assembleia e as deixas
        do celebrante.
      </p>
    </>
  );
}
