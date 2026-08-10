/**
 * Confere o gerador de BR Code (Pix Copia e Cola).
 *
 * O teste que importa é o CRC16 contra o exemplo do manual do Banco Central:
 * um CRC errado gera um código que o app do banco lê e recusa, sem dizer por
 * quê. Rode com `npm run verificar`.
 *
 * Isto NÃO substitui o teste final: cole o código gerado num app de banco de
 * verdade antes de publicar.
 */
import { chaveDeTelefone, crc16, gerarBrCode } from '../src/lib/pix/brcode';

let falhas = 0;
let total = 0;

function conferir(descricao: string, obtido: unknown, esperado: unknown) {
  total++;
  const ok = obtido === esperado;
  if (ok) {
    console.log(`  ok   ${descricao} → ${String(obtido)}`);
  } else {
    falhas++;
    console.log(`  FALHA ${descricao}\n          obtido: ${String(obtido)}\n        esperado: ${String(esperado)}`);
  }
}

console.log('\n— CRC16/CCITT-FALSE: vetores canônicos —');
/*
 * "123456789" → 0x29B1 é o valor de conferência oficial do CRC-16/CCITT-FALSE.
 * É ele que prova que polinômio, valor inicial e ausência de XOR final estão
 * certos — mais confiável do que comparar com um exemplo de manual transcrito
 * de memória.
 */
conferir('CRC de "123456789"', crc16('123456789'), '29B1');
conferir('CRC de string vazia', crc16(''), 'FFFF');
conferir('CRC de "A"', crc16('A'), 'B915');

console.log('\n— Chave de telefone —');
conferir('telefone cru', chaveDeTelefone('85988811817'), '+5585988811817');
conferir('telefone formatado', chaveDeTelefone('(85) 98881-1817'), '+5585988811817');
conferir('telefone já com 55', chaveDeTelefone('5585988811817'), '+5585988811817');
conferir('telefone já com +55', chaveDeTelefone('+55 85 98881-1817'), '+5585988811817');

console.log('\n— Estrutura do BR Code gerado —');
{
  const codigo = gerarBrCode({
    chave: '+5585988811817',
    nome: 'Farias Sousa',
    cidade: 'Fortaleza',
  });

  console.log(`\n  ${codigo}\n`);

  conferir('começa com o indicador de formato', codigo.startsWith('000201'), true);
  conferir('traz o GUI do PIX', codigo.includes('0014br.gov.bcb.pix'), true);
  conferir('traz a chave com +55', codigo.includes('+5585988811817'), true);
  conferir('moeda é 986 (real)', codigo.includes('5303986'), true);
  conferir('país é BR', codigo.includes('5802BR'), true);
  conferir('nome sem acento e em maiúsculas', codigo.includes('FARIAS SOUSA'), true);
  // Sem campo 54 a doação fica de valor livre, que é o que queremos.
  conferir('não fixa valor', /54\d{2}\d+\.\d{2}/.test(codigo), false);
  conferir('termina com CRC de 4 dígitos', /6304[0-9A-F]{4}$/.test(codigo), true);

  // O CRC precisa fechar quando recalculado sobre o próprio código.
  const semCrc = codigo.slice(0, -4);
  conferir('CRC fecha sobre o próprio código', crc16(semCrc), codigo.slice(-4));
}

console.log('\n— Acentos e limites —');
{
  const codigo = gerarBrCode({
    chave: '+5585988811817',
    nome: 'José da Conceição Ávila Nascimento Júnior',
    cidade: 'São João do Tauá',
  });
  conferir('nome limitado a 25 caracteres', /5925[A-Z0-9 ]{25}/.test(codigo), true);
  conferir('acentos removidos do nome', codigo.includes('JOSE DA CONCEICAO'), true);
  // Cidade é limitada a 15 caracteres pelo padrão, então "SAO JOAO DO TAUA" corta.
  conferir('cidade sem acento e cortada em 15', codigo.includes('6015SAO JOAO DO TAU'), true);
  conferir('CRC fecha mesmo assim', crc16(codigo.slice(0, -4)), codigo.slice(-4));
}

console.log('\n— Com valor definido —');
{
  const codigo = gerarBrCode({
    chave: '+5585988811817',
    nome: 'Farias Sousa',
    cidade: 'Fortaleza',
    valor: 25,
  });
  conferir('valor com duas casas', codigo.includes('540525.00'), true);
  conferir('CRC fecha com valor', crc16(codigo.slice(0, -4)), codigo.slice(-4));
}

console.log(
  falhas === 0
    ? `\n✓ ${total} conferências passaram.\n  Lembre-se: cole o código num app de banco de verdade antes de publicar.\n`
    : `\n✗ ${falhas} de ${total} conferências falharam.\n`,
);
process.exit(falhas === 0 ? 0 : 1);
