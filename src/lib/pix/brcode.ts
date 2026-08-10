/**
 * Gera o "Pix Copia e Cola" (BR Code) — padrão EMV MPM do Banco Central.
 *
 * O formato é uma sequência de campos `IITTVVV…`: dois dígitos de ID, dois de
 * tamanho e o valor. Alguns campos contêm outros campos dentro. O último é o
 * CRC16 calculado sobre tudo o que veio antes, inclusive sobre o próprio
 * cabeçalho `6304` — é aí que quase toda implementação erra, e o sintoma é o
 * app do banco dizer apenas "QR Code inválido".
 */

type Campo = { id: string; valor: string };

/** Monta um campo no formato ID + tamanho (2 dígitos) + valor. */
function campo(id: string, valor: string): string {
  const tamanho = String(valor.length).padStart(2, '0');
  return `${id}${tamanho}${valor}`;
}

function montar(campos: Campo[]): string {
  return campos.map(({ id, valor }) => campo(id, valor)).join('');
}

/**
 * CRC16/CCITT-FALSE: polinômio 0x1021, valor inicial 0xFFFF, sem XOR final.
 */
export function crc16(texto: string): string {
  let crc = 0xffff;
  for (let i = 0; i < texto.length; i++) {
    crc ^= texto.charCodeAt(i) << 8;
    for (let bit = 0; bit < 8; bit++) {
      crc = crc & 0x8000 ? ((crc << 1) ^ 0x1021) & 0xffff : (crc << 1) & 0xffff;
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, '0');
}

/**
 * Remove acentos e caracteres que o padrão não aceita em nome e cidade, e
 * limita o tamanho. Nome e cidade acentuados fazem alguns bancos recusarem.
 */
function limpar(texto: string, limite: number): string {
  return texto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^A-Za-z0-9 ]/g, '')
    .trim()
    .slice(0, limite)
    .toUpperCase();
}

export type DadosDoPix = {
  /** A chave PIX já no formato que o BR Code exige. */
  chave: string;
  nome: string;
  cidade: string;
  /** Identificador da transação. "***" quando não há. */
  identificador?: string;
  /** Valor em reais. Omitido deixa quem paga escolher — o certo para doação. */
  valor?: number;
};

export function gerarBrCode({
  chave,
  nome,
  cidade,
  identificador = '***',
  valor,
}: DadosDoPix): string {
  const contaDoRecebedor = montar([
    { id: '00', valor: 'br.gov.bcb.pix' },
    { id: '01', valor: chave },
  ]);

  const dadosAdicionais = montar([{ id: '05', valor: identificador }]);

  const campos: Campo[] = [
    { id: '00', valor: '01' }, // indicador de formato do payload
    { id: '26', valor: contaDoRecebedor },
    { id: '52', valor: '0000' }, // categoria do comerciante: não informada
    { id: '53', valor: '986' }, // moeda: real
  ];

  if (typeof valor === 'number' && valor > 0) {
    campos.push({ id: '54', valor: valor.toFixed(2) });
  }

  campos.push(
    { id: '58', valor: 'BR' },
    { id: '59', valor: limpar(nome, 25) },
    { id: '60', valor: limpar(cidade, 15) },
    { id: '62', valor: dadosAdicionais },
  );

  const semCrc = `${montar(campos)}6304`;
  return `${semCrc}${crc16(semCrc)}`;
}

/**
 * Formata um telefone brasileiro como chave PIX.
 *
 * O padrão exige o formato internacional com "+55". Passar só "85988811817"
 * gera um código que o banco aceita ler e depois recusa por chave inexistente —
 * um erro silencioso e chato de achar.
 */
export function chaveDeTelefone(telefone: string): string {
  const digitos = telefone.replace(/\D/g, '');
  const semPais = digitos.startsWith('55') && digitos.length > 11 ? digitos.slice(2) : digitos;
  return `+55${semPais}`;
}
