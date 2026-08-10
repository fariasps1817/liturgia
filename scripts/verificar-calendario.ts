/**
 * Confere o calendário litúrgico calculado contra datas conhecidas.
 *
 * O calendário é a base de tudo — se ele erra, o app mostra a liturgia do dia
 * errado. Rode depois de qualquer mexida em `calendario.ts`:
 *
 *   npm run verificar
 */
import {
  cicloDominical,
  cicloFerial,
  diaLiturgico,
  domingoDePascoa,
  primeiroDomingoDoAdvento,
} from '../src/lib/liturgia/calendario';

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

console.log('\n— Domingo de Páscoa —');
conferir('Páscoa 2024', domingoDePascoa(2024), '2024-03-31');
conferir('Páscoa 2025', domingoDePascoa(2025), '2025-04-20');
conferir('Páscoa 2026', domingoDePascoa(2026), '2026-04-05');
conferir('Páscoa 2027', domingoDePascoa(2027), '2027-03-28');
conferir('Páscoa 2030', domingoDePascoa(2030), '2030-04-21');
conferir('Páscoa 2038', domingoDePascoa(2038), '2038-04-25');

console.log('\n— 1º Domingo do Advento —');
conferir('Advento 2024', primeiroDomingoDoAdvento(2024), '2024-12-01');
conferir('Advento 2025', primeiroDomingoDoAdvento(2025), '2025-11-30');
conferir('Advento 2026', primeiroDomingoDoAdvento(2026), '2026-11-29');
conferir('Advento 2027', primeiroDomingoDoAdvento(2027), '2027-11-28');

console.log('\n— Quarta-feira de Cinzas —');
conferir('Cinzas 2025', diaLiturgico('2025-03-05').celebracao, 'Quarta-feira de Cinzas');
conferir('Cinzas 2026', diaLiturgico('2026-02-18').celebracao, 'Quarta-feira de Cinzas');

console.log('\n— Ciclos de leitura (viram no 1º Domingo do Advento) —');
conferir('2024-06-01 dominical', cicloDominical('2024-06-01'), 'B');
conferir('2025-06-01 dominical', cicloDominical('2025-06-01'), 'C');
conferir('2025-06-01 ferial', cicloFerial('2025-06-01'), 'I');
conferir('2026-08-10 dominical', cicloDominical('2026-08-10'), 'A');
conferir('2026-08-10 ferial', cicloFerial('2026-08-10'), 'II');
conferir('2025-11-29 véspera do Advento', cicloDominical('2025-11-29'), 'C');
conferir('2025-11-30 1º Dom. Advento', cicloDominical('2025-11-30'), 'A');
conferir('2025-11-30 ferial', cicloFerial('2025-11-30'), 'II');

console.log('\n— Solenidades móveis de 2026 (Páscoa em 05/04) —');
conferir('Ramos', diaLiturgico('2026-03-29').celebracaoCurta, 'Ramos');
conferir('Quinta-feira Santa', diaLiturgico('2026-04-02').celebracaoCurta, 'Quinta-feira Santa');
conferir('Sexta-feira Santa', diaLiturgico('2026-04-03').celebracaoCurta, 'Sexta-feira Santa');
conferir('Sábado Santo', diaLiturgico('2026-04-04').celebracaoCurta, 'Sábado Santo');
conferir('Páscoa', diaLiturgico('2026-04-05').celebracaoCurta, 'Páscoa');
conferir('Divina Misericórdia', diaLiturgico('2026-04-12').celebracaoCurta, 'Divina Misericórdia');
conferir('Ascensão (domingo, Brasil)', diaLiturgico('2026-05-17').celebracaoCurta, 'Ascensão');
conferir('Pentecostes', diaLiturgico('2026-05-24').celebracaoCurta, 'Pentecostes');
conferir('Santíssima Trindade', diaLiturgico('2026-05-31').celebracaoCurta, 'Santíssima Trindade');
conferir('Corpus Christi (quinta, Brasil)', diaLiturgico('2026-06-04').celebracaoCurta, 'Corpus Christi');
conferir('Sagrado Coração', diaLiturgico('2026-06-12').celebracaoCurta, 'Sagrado Coração');
conferir('Cristo Rei', diaLiturgico('2026-11-22').celebracaoCurta, 'Cristo Rei');

console.log('\n— Cores litúrgicas —');
conferir('Gaudete 2025 (3º Dom. Advento)', diaLiturgico('2025-12-14').cor, 'rosa');
conferir('Laetare 2026 (4º Dom. Quaresma)', diaLiturgico('2026-03-15').cor, 'rosa');
conferir('Sexta-feira Santa 2026', diaLiturgico('2026-04-03').cor, 'vermelho');
conferir('Pentecostes 2026', diaLiturgico('2026-05-24').cor, 'vermelho');
conferir('Dia comum de agosto', diaLiturgico('2026-08-10').cor, 'verde');
conferir('Finados', diaLiturgico('2026-11-02').cor, 'roxo');
conferir('Advento é roxo', diaLiturgico('2025-12-08').cor, 'branco'); // Imaculada tem precedência
conferir('Feria do Advento', diaLiturgico('2025-12-09').cor, 'roxo');

console.log('\n— Tempo Comum: numeração das semanas —');
conferir('2026-08-16 domingo', diaLiturgico('2026-08-16').celebracao, '20º Domingo do Tempo Comum');
conferir('2026-08-16 número da semana', diaLiturgico('2026-08-16').semanaDoTempoComum, 20);
conferir('2026-08-10 segunda-feira', diaLiturgico('2026-08-10').semanaDoTempoComum, 19);
conferir('Sábado antes do Advento 2026 é a 34ª', diaLiturgico('2026-11-28').semanaDoTempoComum, 34);
conferir('Cristo Rei 2026', diaLiturgico('2026-11-22').celebracaoCurta, 'Cristo Rei');
conferir('Segunda depois do Batismo 2026 é semana 1', diaLiturgico('2026-01-12').semanaDoTempoComum, 1);
conferir('2º Domingo do T. Comum 2026', diaLiturgico('2026-01-18').celebracao, '2º Domingo do Tempo Comum');
conferir('Terça depois da Trindade 2026', diaLiturgico('2026-06-02').semanaDoTempoComum, 9);

console.log('\n— Celebrações de data fixa —');
conferir('Aparecida', diaLiturgico('2026-10-12').celebracaoCurta, 'N. S. Aparecida');
conferir('Assunção', diaLiturgico('2026-08-15').celebracaoCurta, 'Assunção');
conferir('Natal', diaLiturgico('2026-12-25').celebracaoCurta, 'Natal');
conferir('Imaculada Conceição', diaLiturgico('2026-12-08').celebracaoCurta, 'Imaculada Conceição');
conferir('Pedro e Paulo é vermelho', diaLiturgico('2026-06-29').cor, 'vermelho');

console.log('\n— Continuidade: todo dia de 2024 a 2030 recebe uma celebração —');
{
  let vazios = 0;
  const d = new Date(Date.UTC(2024, 0, 1));
  const fim = new Date(Date.UTC(2030, 11, 31));
  while (d <= fim) {
    const iso = d.toISOString().slice(0, 10);
    const dl = diaLiturgico(iso);
    if (!dl.celebracao || dl.celebracao.includes('undefined') || dl.celebracao.includes('NaN')) {
      if (vazios < 5) console.log(`  FALHA ${iso} → "${dl.celebracao}"`);
      vazios++;
    }
    d.setUTCDate(d.getUTCDate() + 1);
  }
  conferir('dias sem celebração válida', vazios, 0);
}

console.log(
  falhas === 0
    ? `\n✓ ${total} conferências passaram.\n`
    : `\n✗ ${falhas} de ${total} conferências falharam.\n`,
);
process.exit(falhas === 0 ? 0 : 1);
