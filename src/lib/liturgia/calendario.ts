/**
 * Calendário litúrgico do Rito Romano, calculado localmente.
 *
 * Isto NÃO traz textos de leitura — traz o que dá para deduzir por conta
 * própria: tempo litúrgico, cor, ano do ciclo dominical (A/B/C), ciclo ferial
 * (I/II) e as principais celebrações. Serve para dois fins:
 *
 *  1. pintar a grade do calendário sem depender de rede;
 *  2. ainda mostrar algo de útil quando a fonte de leituras estiver fora do ar.
 *
 * Segue o calendário próprio do Brasil, que difere do romano geral em três
 * pontos que importam aqui: Epifania e Ascensão são transferidas para o
 * domingo, e Nossa Senhora Aparecida é solenidade.
 */

import {
  ano as anoDe,
  criar,
  deISO,
  dia as diaDe,
  diaDaSemana,
  diferencaEmDias,
  mes as mesDe,
  somarDias,
} from './datas';

export type CorLiturgica = 'verde' | 'branco' | 'vermelho' | 'roxo' | 'rosa';

export type TempoLiturgico =
  | 'advento'
  | 'natal'
  | 'quaresma'
  | 'triduo'
  | 'pascoa'
  | 'comum';

export type GrauCelebracao = 'solenidade' | 'festa' | 'memoria' | 'feria';

export type DiaLiturgico = {
  data: string;
  celebracao: string;
  /** Nome curto para caber na grade do calendário. */
  celebracaoCurta?: string;
  tempo: TempoLiturgico;
  cor: CorLiturgica;
  grau: GrauCelebracao;
  /** Ciclo dominical das leituras. */
  anoLiturgico: 'A' | 'B' | 'C';
  /** Ciclo das leituras ferais (dias de semana). */
  cicloFerial: 'I' | 'II';
  /** Semana do Tempo Comum, quando aplicável. */
  semanaDoTempoComum?: number;
};

/**
 * Domingo de Páscoa (algoritmo de Meeus/Jones/Butcher para o calendário
 * gregoriano). É daqui que sai quase todo o calendário móvel.
 */
export function domingoDePascoa(ano: number): string {
  const a = ano % 19;
  const b = Math.floor(ano / 100);
  const c = ano % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const mes = Math.floor((h + l - 7 * m + 114) / 31);
  const dia = ((h + l - 7 * m + 114) % 31) + 1;
  return criar(ano, mes, dia);
}

/**
 * Primeiro Domingo do Advento: o quarto domingo antes do Natal. É o dia em que
 * vira o ano litúrgico — não 1º de janeiro.
 */
export function primeiroDomingoDoAdvento(anoCivil: number): string {
  const natal = criar(anoCivil, 12, 25);
  const diaSemanaNatal = diaDaSemana(natal);
  // O 4º Domingo do Advento é o último domingo antes do Natal.
  const quartoDomingo = somarDias(natal, -(diaSemanaNatal === 0 ? 7 : diaSemanaNatal));
  return somarDias(quartoDomingo, -21);
}

/** No Brasil a Epifania é transferida para o domingo entre 2 e 8 de janeiro. */
function epifania(anoCivil: number): string {
  const doisDeJaneiro = criar(anoCivil, 1, 2);
  const diaSemana = diaDaSemana(doisDeJaneiro);
  return somarDias(doisDeJaneiro, diaSemana === 0 ? 0 : 7 - diaSemana);
}

/**
 * Batismo do Senhor: encerra o Tempo do Natal. Normalmente é o domingo depois
 * da Epifania; quando a Epifania cai em 7 ou 8 de janeiro, é a segunda-feira
 * seguinte, para não haver dois domingos seguidos com a mesma celebração.
 */
function batismoDoSenhor(anoCivil: number): string {
  const dataEpifania = epifania(anoCivil);
  const diaDoMes = diaDe(dataEpifania);
  if (diaDoMes >= 7) return somarDias(dataEpifania, 1);
  return somarDias(dataEpifania, 7);
}

/** Domingo dentro da oitava do Natal; se não houver domingo, 30 de dezembro. */
function sagradaFamilia(anoCivil: number): string {
  const natal = criar(anoCivil, 12, 25);
  const diaSemanaNatal = diaDaSemana(natal);
  if (diaSemanaNatal === 0) return criar(anoCivil, 12, 30);
  return somarDias(natal, 7 - diaSemanaNatal);
}

type Referencias = {
  adventoInicio: string;
  natal: string;
  sagradaFamilia: string;
  mariaMaeDeDeus: string;
  epifania: string;
  batismo: string;
  quartaDeCinzas: string;
  domingoDeRamos: string;
  quintaSanta: string;
  sextaSanta: string;
  sabadoSanto: string;
  pascoa: string;
  ascensao: string;
  pentecostes: string;
  santissimaTrindade: string;
  corpusChristi: string;
  sagradoCoracao: string;
  cristoRei: string;
  adventoProximo: string;
};

/**
 * Datas-âncora do ano litúrgico que TERMINA em `anoCivil` — ou seja, o ano que
 * começou no Advento de `anoCivil - 1`.
 */
function referencias(anoCivil: number): Referencias {
  const pascoa = domingoDePascoa(anoCivil);
  return {
    adventoInicio: primeiroDomingoDoAdvento(anoCivil - 1),
    natal: criar(anoCivil - 1, 12, 25),
    sagradaFamilia: sagradaFamilia(anoCivil - 1),
    mariaMaeDeDeus: criar(anoCivil, 1, 1),
    epifania: epifania(anoCivil),
    batismo: batismoDoSenhor(anoCivil),
    quartaDeCinzas: somarDias(pascoa, -46),
    domingoDeRamos: somarDias(pascoa, -7),
    quintaSanta: somarDias(pascoa, -3),
    sextaSanta: somarDias(pascoa, -2),
    sabadoSanto: somarDias(pascoa, -1),
    pascoa,
    // No Brasil a Ascensão é transferida da quinta-feira para o 7º Domingo da Páscoa.
    ascensao: somarDias(pascoa, 42),
    pentecostes: somarDias(pascoa, 49),
    santissimaTrindade: somarDias(pascoa, 56),
    // Corpus Christi permanece na quinta-feira no Brasil.
    corpusChristi: somarDias(pascoa, 60),
    sagradoCoracao: somarDias(pascoa, 68),
    cristoRei: somarDias(primeiroDomingoDoAdvento(anoCivil), -7),
    adventoProximo: primeiroDomingoDoAdvento(anoCivil),
  };
}

/**
 * O ano litúrgico ao qual a data pertence, identificado pelo ano civil em que
 * ele termina. Uma data de dezembro depois do 1º Domingo do Advento já pertence
 * ao ano litúrgico seguinte.
 */
function anoLiturgicoDe(data: string): number {
  const anoCivil = anoDe(data);
  return data >= primeiroDomingoDoAdvento(anoCivil) ? anoCivil + 1 : anoCivil;
}

export function cicloDominical(data: string): 'A' | 'B' | 'C' {
  const resto = anoLiturgicoDe(data) % 3;
  return resto === 1 ? 'A' : resto === 2 ? 'B' : 'C';
}

export function cicloFerial(data: string): 'I' | 'II' {
  return anoLiturgicoDe(data) % 2 === 0 ? 'II' : 'I';
}

/** Ordinais masculinos — "2º Domingo". */
const ORDINAIS = [
  '',
  '1º',
  '2º',
  '3º',
  '4º',
  '5º',
  '6º',
  '7º',
  '8º',
  '9º',
  '10º',
  '11º',
  '12º',
  '13º',
  '14º',
  '15º',
  '16º',
  '17º',
  '18º',
  '19º',
  '20º',
  '21º',
  '22º',
  '23º',
  '24º',
  '25º',
  '26º',
  '27º',
  '28º',
  '29º',
  '30º',
  '31º',
  '32º',
  '33º',
  '34º',
];

/**
 * Ordinais femininos — "2ª Semana".
 *
 * "Semana" é feminino, então "19º Semana" está errado e aparece na tela o dia
 * inteiro, em todas as ferias do Tempo Comum.
 */
const ORDINAIS_F = ORDINAIS.map((o) => o.replace('º', 'ª'));

/** Semana do Tempo Comum a que a data pertence. */
function semanaDoTempoComum(data: string, r: Referencias): number {
  if (data <= r.quartaDeCinzas) {
    // Primeiro trecho: a semana 1 começa na segunda-feira após o Batismo, e o
    // domingo seguinte já é o 2º Domingo do Tempo Comum.
    const segundaAposBatismo = somarDias(r.batismo, 1);
    return 1 + Math.floor((diferencaEmDias(data, segundaAposBatismo) + 1) / 7);
  }
  // Segundo trecho: conta-se de trás para frente, porque o Tempo Comum sempre
  // termina na 34ª semana, no sábado anterior ao Advento.
  const sabadoAntesDoAdvento = somarDias(r.adventoProximo, -1);
  return 34 - Math.floor(diferencaEmDias(sabadoAntesDoAdvento, data) / 7);
}

/**
 * Solenidades e festas de data fixa observadas no Brasil.
 * Chave: `MM-DD`.
 */
const FIXAS: Record<
  string,
  { nome: string; curto?: string; cor: CorLiturgica; grau: GrauCelebracao }
> = {
  '01-01': { nome: 'Santa Maria, Mãe de Deus', curto: 'Mãe de Deus', cor: 'branco', grau: 'solenidade' },
  '02-02': { nome: 'Apresentação do Senhor', curto: 'Apresentação', cor: 'branco', grau: 'festa' },
  '03-19': { nome: 'São José, Esposo de Maria', curto: 'São José', cor: 'branco', grau: 'solenidade' },
  '03-25': { nome: 'Anunciação do Senhor', curto: 'Anunciação', cor: 'branco', grau: 'solenidade' },
  '06-24': { nome: 'Natividade de São João Batista', curto: 'São João Batista', cor: 'branco', grau: 'solenidade' },
  '06-29': { nome: 'São Pedro e São Paulo', curto: 'Pedro e Paulo', cor: 'vermelho', grau: 'solenidade' },
  '08-06': { nome: 'Transfiguração do Senhor', curto: 'Transfiguração', cor: 'branco', grau: 'festa' },
  '08-15': { nome: 'Assunção de Nossa Senhora', curto: 'Assunção', cor: 'branco', grau: 'solenidade' },
  '09-14': { nome: 'Exaltação da Santa Cruz', curto: 'Santa Cruz', cor: 'vermelho', grau: 'festa' },
  '10-12': {
    nome: 'Nossa Senhora Aparecida, Padroeira do Brasil',
    curto: 'N. S. Aparecida',
    cor: 'branco',
    grau: 'solenidade',
  },
  '11-01': { nome: 'Todos os Santos', curto: 'Todos os Santos', cor: 'branco', grau: 'solenidade' },
  '11-02': { nome: 'Comemoração de Todos os Fiéis Defuntos', curto: 'Finados', cor: 'roxo', grau: 'solenidade' },
  '11-09': { nome: 'Dedicação da Basílica de Latrão', curto: 'Basílica de Latrão', cor: 'branco', grau: 'festa' },
  '12-08': { nome: 'Imaculada Conceição de Nossa Senhora', curto: 'Imaculada Conceição', cor: 'branco', grau: 'solenidade' },
  '12-25': { nome: 'Natal do Senhor', curto: 'Natal', cor: 'branco', grau: 'solenidade' },
};

/** Descreve um dia do calendário litúrgico. */
export function diaLiturgico(data: string): DiaLiturgico {
  const r = referencias(anoLiturgicoDe(data));
  const base = {
    data,
    anoLiturgico: cicloDominical(data),
    cicloFerial: cicloFerial(data),
  } as const;

  const domingo = diaDaSemana(data) === 0;
  const chaveFixa = `${String(mesDe(data)).padStart(2, '0')}-${String(diaDe(data)).padStart(2, '0')}`;

  const monta = (
    celebracao: string,
    tempo: TempoLiturgico,
    cor: CorLiturgica,
    grau: GrauCelebracao,
    extras: Partial<DiaLiturgico> = {},
  ): DiaLiturgico => ({ ...base, celebracao, tempo, cor, grau, ...extras });

  // --- Tríduo Pascal e Semana Santa: têm precedência sobre tudo ---
  if (data === r.pascoa) return monta('Domingo de Páscoa da Ressurreição do Senhor', 'pascoa', 'branco', 'solenidade', { celebracaoCurta: 'Páscoa' });
  if (data === r.sabadoSanto) return monta('Sábado Santo — Vigília Pascal', 'triduo', 'branco', 'solenidade', { celebracaoCurta: 'Sábado Santo' });
  if (data === r.sextaSanta) return monta('Sexta-feira Santa da Paixão do Senhor', 'triduo', 'vermelho', 'solenidade', { celebracaoCurta: 'Sexta-feira Santa' });
  if (data === r.quintaSanta) return monta('Quinta-feira Santa — Ceia do Senhor', 'triduo', 'branco', 'solenidade', { celebracaoCurta: 'Quinta-feira Santa' });
  if (data === r.domingoDeRamos) return monta('Domingo de Ramos da Paixão do Senhor', 'quaresma', 'vermelho', 'solenidade', { celebracaoCurta: 'Ramos' });
  if (data > r.domingoDeRamos && data < r.quintaSanta) {
    const nomes = ['', 'Segunda-feira', 'Terça-feira', 'Quarta-feira'];
    return monta(`${nomes[diaDaSemana(data)]} da Semana Santa`, 'quaresma', 'roxo', 'feria');
  }

  // --- Solenidades móveis do Tempo Pascal e do Tempo Comum ---
  if (data === r.pentecostes) return monta('Domingo de Pentecostes', 'pascoa', 'vermelho', 'solenidade', { celebracaoCurta: 'Pentecostes' });
  if (data === r.ascensao) return monta('Ascensão do Senhor', 'pascoa', 'branco', 'solenidade', { celebracaoCurta: 'Ascensão' });
  if (data === r.santissimaTrindade) return monta('Santíssima Trindade', 'comum', 'branco', 'solenidade', { celebracaoCurta: 'Santíssima Trindade' });
  if (data === r.corpusChristi) return monta('Santíssimo Corpo e Sangue de Cristo', 'comum', 'branco', 'solenidade', { celebracaoCurta: 'Corpus Christi' });
  if (data === r.sagradoCoracao) return monta('Sagrado Coração de Jesus', 'comum', 'branco', 'solenidade', { celebracaoCurta: 'Sagrado Coração' });
  if (data === r.cristoRei) return monta('Nosso Senhor Jesus Cristo, Rei do Universo', 'comum', 'branco', 'solenidade', { celebracaoCurta: 'Cristo Rei' });

  // --- Tempo do Natal ---
  if (data === r.sagradaFamilia) return monta('Sagrada Família de Jesus, Maria e José', 'natal', 'branco', 'festa', { celebracaoCurta: 'Sagrada Família' });
  if (data === r.epifania) return monta('Epifania do Senhor', 'natal', 'branco', 'solenidade', { celebracaoCurta: 'Epifania' });
  if (data === r.batismo) return monta('Batismo do Senhor', 'natal', 'branco', 'festa', { celebracaoCurta: 'Batismo do Senhor' });

  // --- Celebrações de data fixa ---
  const fixa = FIXAS[chaveFixa];
  if (fixa) {
    const tempo = tempoDe(data, r);
    // Uma solenidade fixa que caia na Quaresma ou no Advento mantém a própria
    // cor; um domingo desses tempos, porém, tem precedência sobre a festa.
    if (fixa.grau === 'solenidade' || !domingo) {
      return monta(fixa.nome, tempo, fixa.cor, fixa.grau, { celebracaoCurta: fixa.curto });
    }
  }

  // --- Advento ---
  if (data >= r.adventoInicio && data < r.natal) {
    const semana = 1 + Math.floor(diferencaEmDias(data, r.adventoInicio) / 7);
    const gaudete = domingo && semana === 3;
    if (domingo) {
      return monta(`${ORDINAIS[semana]} Domingo do Advento`, 'advento', gaudete ? 'rosa' : 'roxo', 'feria', {
        celebracaoCurta: `${semana}º Dom. Advento`,
      });
    }
    return monta(`${diaDaSemanaNome(data)} da ${ORDINAIS_F[semana]} Semana do Advento`, 'advento', 'roxo', 'feria');
  }

  // --- Tempo do Natal ---
  if (data >= r.natal && data <= r.batismo) {
    if (domingo) return monta('Domingo do Tempo do Natal', 'natal', 'branco', 'feria');
    return monta(`${diaDaSemanaNome(data)} do Tempo do Natal`, 'natal', 'branco', 'feria');
  }

  // --- Quaresma ---
  if (data >= r.quartaDeCinzas && data < r.quintaSanta) {
    if (data === r.quartaDeCinzas) {
      return monta('Quarta-feira de Cinzas', 'quaresma', 'roxo', 'feria', { celebracaoCurta: 'Cinzas' });
    }
    const primeiroDomingo = somarDias(r.quartaDeCinzas, 4);
    if (data < primeiroDomingo) {
      return monta(`${diaDaSemanaNome(data)} depois das Cinzas`, 'quaresma', 'roxo', 'feria');
    }
    const semana = 1 + Math.floor(diferencaEmDias(data, primeiroDomingo) / 7);
    const laetare = domingo && semana === 4;
    if (domingo) {
      return monta(`${ORDINAIS[semana]} Domingo da Quaresma`, 'quaresma', laetare ? 'rosa' : 'roxo', 'feria', {
        celebracaoCurta: `${semana}º Dom. Quaresma`,
      });
    }
    return monta(`${diaDaSemanaNome(data)} da ${ORDINAIS_F[semana]} Semana da Quaresma`, 'quaresma', 'roxo', 'feria');
  }

  // --- Tempo Pascal ---
  if (data > r.pascoa && data < r.pentecostes) {
    const semana = 1 + Math.floor(diferencaEmDias(data, r.pascoa) / 7);
    if (data <= somarDias(r.pascoa, 7)) {
      if (data === somarDias(r.pascoa, 7)) {
        return monta('2º Domingo da Páscoa, ou da Divina Misericórdia', 'pascoa', 'branco', 'solenidade', {
          celebracaoCurta: 'Divina Misericórdia',
        });
      }
      return monta(`${diaDaSemanaNome(data)} da Oitava da Páscoa`, 'pascoa', 'branco', 'solenidade');
    }
    if (domingo) {
      return monta(`${ORDINAIS[semana]} Domingo da Páscoa`, 'pascoa', 'branco', 'feria', {
        celebracaoCurta: `${semana}º Dom. Páscoa`,
      });
    }
    return monta(`${diaDaSemanaNome(data)} da ${ORDINAIS_F[semana]} Semana da Páscoa`, 'pascoa', 'branco', 'feria');
  }

  // --- Tempo Comum ---
  const semana = semanaDoTempoComum(data, r);
  if (domingo) {
    return monta(`${ORDINAIS[semana]} Domingo do Tempo Comum`, 'comum', 'verde', 'feria', {
      celebracaoCurta: `${semana}º Dom. T. Comum`,
      semanaDoTempoComum: semana,
    });
  }
  return monta(
    `${diaDaSemanaNome(data)} da ${ORDINAIS_F[semana]} Semana do Tempo Comum`,
    'comum',
    'verde',
    'feria',
    { semanaDoTempoComum: semana },
  );
}

function tempoDe(data: string, r: Referencias): TempoLiturgico {
  if (data >= r.adventoInicio && data < r.natal) return 'advento';
  if (data >= r.natal && data <= r.batismo) return 'natal';
  if (data >= r.quintaSanta && data <= r.sabadoSanto) return 'triduo';
  if (data >= r.quartaDeCinzas && data < r.quintaSanta) return 'quaresma';
  if (data >= r.pascoa && data <= r.pentecostes) return 'pascoa';
  return 'comum';
}

const NOMES_DIA = [
  'Domingo',
  'Segunda-feira',
  'Terça-feira',
  'Quarta-feira',
  'Quinta-feira',
  'Sexta-feira',
  'Sábado',
];

function diaDaSemanaNome(data: string): string {
  return NOMES_DIA[diaDaSemana(data)];
}

/** Nome do tempo litúrgico, para exibir. */
export const NOME_DO_TEMPO: Record<TempoLiturgico, string> = {
  advento: 'Advento',
  natal: 'Tempo do Natal',
  quaresma: 'Quaresma',
  triduo: 'Tríduo Pascal',
  pascoa: 'Tempo Pascal',
  comum: 'Tempo Comum',
};

/** Todos os dias de um mês, para montar a grade do calendário. */
export function mesLiturgico(anoCivil: number, mesCivil: number): DiaLiturgico[] {
  const dias: DiaLiturgico[] = [];
  const ultimo = new Date(Date.UTC(anoCivil, mesCivil, 0)).getUTCDate();
  for (let d = 1; d <= ultimo; d++) {
    dias.push(diaLiturgico(criar(anoCivil, mesCivil, d)));
  }
  return dias;
}

/**
 * A grade do calendário sempre começa no domingo e tem 6 linhas, para o layout
 * não pular de altura quando o usuário troca de mês.
 */
export function gradeDoMes(anoCivil: number, mesCivil: number): string[] {
  const primeiro = criar(anoCivil, mesCivil, 1);
  const inicio = somarDias(primeiro, -diaDaSemana(primeiro));
  return Array.from({ length: 42 }, (_, i) => somarDias(inicio, i));
}

export { deISO };
