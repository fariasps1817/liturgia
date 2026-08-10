/**
 * Confere o normalizador contra os formatos de resposta que ele precisa aceitar.
 *
 * Estas amostras são sintéticas: escritas à mão a partir dos formatos que a
 * fonte usa (v2 e v3) e das variações plausíveis. Quando `npm run sondar`
 * salvar respostas reais em `docs/amostras/`, este script as testa também.
 *
 *   npm run verificar
 */
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { abreviarReferencia, normalizar } from '../src/lib/liturgia/normalizar';

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

console.log('\n— Abreviação de referências —');
conferir('livro do profeta', abreviarReferencia('Livro do Profeta Isaías 55,10-11'), 'Is 55,10-11');
conferir('evangelho', abreviarReferencia('Mateus 13,1-9'), 'Mt 13,1-9');
conferir('carta numerada', abreviarReferencia('1 Coríntios 12,12-14'), '1Cor 12,12-14');
conferir('salmo', abreviarReferencia('Salmo 22(23)'), 'Sl 22(23)');
conferir('atos', abreviarReferencia('Atos dos Apóstolos 2,1-11'), 'At 2,1-11');
conferir('já abreviado passa direto', abreviarReferencia('Rm 8,28-30'), 'Rm 8,28-30');
conferir('livro desconhecido volta igual', abreviarReferencia('Livro Inventado 3,4'), 'Livro Inventado 3,4');

// ── Formato v2: leituras agrupadas, cada tipo é uma lista ──
const v2 = {
  data: '16/08/2026',
  liturgia: '20º Domingo do Tempo Comum',
  cor: 'Verde',
  leituras: {
    primeiraLeitura: [
      {
        referencia: 'Isaías 56,1.6-7',
        titulo: 'Leitura do Livro do Profeta Isaías',
        texto: 'Assim diz o Senhor: <br>"Observai o direito e praticai a justiça".',
      },
    ],
    salmo: [{ referencia: 'Salmo 66(67)', refrao: 'Que os povos vos louvem, ó Deus.', texto: 'Que Deus tenha piedade e nos abençoe.' }],
    segundaLeitura: [{ referencia: 'Romanos 11,13-15.29-32', titulo: 'Leitura da Carta de São Paulo aos Romanos', texto: 'Irmãos: Eu vos digo, a vós que sois de origem pagã.' }],
    evangelho: [{ referencia: 'Mateus 15,21-28', titulo: 'Proclamação do Evangelho de Jesus Cristo segundo São Mateus', texto: 'Naquele tempo, Jesus partiu dali.' }],
  },
};

console.log('\n— Formato v2 (domingo, 4 leituras) —');
{
  const l = normalizar('2026-08-16', v2);
  conferir('quantidade de leituras', l.leituras.length, 4);
  conferir('celebração', l.celebracao, '20º Domingo do Tempo Comum');
  conferir('cor da fonte', l.cor, 'verde');
  conferir('ano litúrgico', l.anoLiturgico, 'A');
  conferir('1ª leitura abreviada', l.leituras[0].refResumida, 'Is 56,1.6-7');
  conferir('HTML removido', l.leituras[0].texto.includes('<br>'), false);
  conferir('quebra de linha preservada', l.leituras[0].texto.includes('\n'), true);
  conferir('refrão do salmo', l.leituras[1].refrao, 'Que os povos vos louvem, ó Deus.');
  conferir('2ª leitura presente', l.leituras[2].titulo, 'Segunda Leitura');
  conferir('evangelho por último', l.leituras[3].tipo, 'evangelho');
  conferir('tem textos', l.semTextos, false);
}

console.log('\n— Dia de semana (sem 2ª leitura) —');
{
  const semSegunda = {
    ...v2,
    liturgia: '19ª Semana do Tempo Comum',
    leituras: { ...v2.leituras, segundaLeitura: [] },
  };
  const l = normalizar('2026-08-10', semSegunda);
  conferir('quantidade de leituras', l.leituras.length, 3);
  conferir('nenhuma é segunda', l.leituras.some((x) => x.tipo === 'segunda'), false);
  conferir('ciclo ferial', l.cicloFerial, 'II');
}

console.log('\n— Variações de nomenclatura —');
{
  // snake_case, objeto solto em vez de lista, campo "text" em inglês.
  const variante = {
    cor: 'VERDE',
    celebracao: 'Feria',
    leituras: {
      primeira_leitura: { referencia: 'Ezequiel 1,2-5', text: 'Corpo da primeira.' },
      salmo: { referencia: 'Salmo 148', texto: 'Louvai o Senhor.' },
      evangelho: { reference: 'Mateus 17,22-27', texto: 'Corpo do evangelho.' },
    },
  };
  const l = normalizar('2026-08-10', variante);
  conferir('snake_case reconhecido', l.leituras[0]?.refResumida, 'Ez 1,2-5');
  conferir('objeto solto vira lista', l.leituras.length, 3);
  conferir('campo "text" em inglês', l.leituras[0]?.texto, 'Corpo da primeira.');
  conferir('campo "reference" em inglês', l.leituras[2]?.refResumida, 'Mt 17,22-27');
}

console.log('\n— Leituras na raiz, sem o bloco "leituras" —');
{
  const raiz = {
    primeiraLeitura: [{ referencia: 'Jeremias 1,1', texto: 'Corpo.' }],
    evangelho: [{ referencia: 'Marcos 1,1', texto: 'Corpo.' }],
  };
  const l = normalizar('2026-08-10', raiz);
  conferir('achou na raiz', l.leituras.length, 2);
}

console.log('\n— Degradação quando a fonte falha —');
{
  const l = normalizar('2026-08-16', null);
  conferir('marca que não tem textos', l.semTextos, true);
  conferir('mas ainda tem a celebração', l.celebracao, '20º Domingo do Tempo Comum');
  conferir('e a cor', l.cor, 'verde');
  conferir('e o ciclo', l.anoLiturgico, 'A');
  conferir('e a data por extenso', l.dataExtenso, 'Domingo, 16 de agosto de 2026');
}

console.log('\n— Solenidade: o calendário local manda na celebração E na cor —');
{
  // Caso real: em 15/08/2026 a fonte devolve "Sábado da 19ª Semana do Tempo
  // Comum" / Verde e ignora a Assunção. Se a cor viesse da fonte, a tela diria
  // "Assunção de Nossa Senhora" em verde e a equipe prepararia a alfaia errada.
  const raiz = {
    liturgia: 'Sábado da 19ª Semana do Tempo Comum',
    cor: 'Verde',
    leituras: { evangelho: [{ referencia: 'Lucas 1,39', texto: 'Corpo.' }] },
  };
  const l = normalizar('2026-08-15', raiz);
  conferir('celebração vem do cálculo local', l.celebracao, 'Assunção de Nossa Senhora');
  conferir('e a cor acompanha, não fica verde', l.cor, 'branco');
  conferir('e as leituras ficam marcadas como suspeitas', l.leiturasSuspeitas, true);
}

console.log('\n— Leituras suspeitas: só quando a fonte realmente errou o dia —');
{
  const comLeituras = { leituras: { evangelho: [{ referencia: 'Lucas 1,39', texto: 'Corpo.' }] } };

  // A fonte nomeia a solenidade → as leituras são as próprias, não avisa.
  const acertou = normalizar('2026-08-15', { ...comLeituras, liturgia: 'Assunção de Nossa Senhora' });
  conferir('fonte nomeia a solenidade', acertou.leiturasSuspeitas, false);

  // Nome diferente, mesma celebração ("Natal" ≠ "Natividade", mas "Senhor" une).
  const outroNome = normalizar('2026-12-25', { ...comLeituras, liturgia: 'Natividade do Senhor' });
  conferir('nome diferente da mesma solenidade', outroNome.leiturasSuspeitas, false);

  // A fonte só rotula como "Solenidade" — sabe do dia, não avisa.
  const soRotulo = normalizar('2026-06-04', { ...comLeituras, liturgia: 'Solenidade de Corpus Christi' });
  conferir('fonte diz "Solenidade"', soRotulo.leiturasSuspeitas, false);

  // Dia comum: nunca avisa, mesmo com nomes distintos.
  const feria = normalizar('2026-08-10', { ...comLeituras, liturgia: 'São Lourenço, diácono e mártir' });
  conferir('dia que não é solenidade', feria.leiturasSuspeitas, false);

  // Sem leituras nenhuma não há o que suspeitar — o aviso de erro já cobre.
  const vazio = normalizar('2026-08-15', { liturgia: 'Sábado da 19ª Semana do Tempo Comum' });
  conferir('sem leituras não marca', vazio.leiturasSuspeitas, false);
}

console.log('\n— Lixo na entrada não derruba —');
for (const lixo of [undefined, 0, '', 'texto solto', [], [1, 2, 3], { leituras: 'nada' }, { leituras: { evangelho: 42 } }]) {
  total++;
  try {
    const l = normalizar('2026-08-10', lixo);
    if (l.celebracao) {
      console.log(`  ok   ${JSON.stringify(lixo)} → degradou para o calendário local`);
    } else {
      falhas++;
      console.log(`  FALHA ${JSON.stringify(lixo)} → celebração vazia`);
    }
  } catch (erro) {
    falhas++;
    console.log(`  FALHA ${JSON.stringify(lixo)} → lançou ${erro instanceof Error ? erro.message : erro}`);
  }
}

// ── Amostras reais, quando existirem ──
if (existsSync('docs/amostras')) {
  const arquivos = readdirSync('docs/amostras').filter((f) => f.endsWith('.json'));
  if (arquivos.length > 0) {
    console.log('\n— Amostras reais salvas por `npm run sondar` —');
    for (const arquivo of arquivos) {
      const data = arquivo.replace('.json', '');
      const bruto = JSON.parse(readFileSync(`docs/amostras/${arquivo}`, 'utf8'));
      const l = normalizar(data, bruto);
      conferir(`${data}: extraiu leituras`, l.leituras.length > 0, true);
    }
  }
} else {
  console.log('\n  (sem amostras reais ainda — rode `npm run sondar` com rede para gerá-las)');
}

console.log(
  falhas === 0
    ? `\n✓ ${total} conferências passaram.\n`
    : `\n✗ ${falhas} de ${total} conferências falharam.\n`,
);
process.exit(falhas === 0 ? 0 : 1);
