# Liturgia Diária

App para equipes de liturgia paroquial: as leituras da missa, as preces da assembleia e as Orações Eucarísticas, num celular, dentro da igreja.

É um **PWA** — abre no navegador, vira ícone na tela inicial e funciona sem internet no que dá para funcionar.

---

## O que tem

| Aba | O que faz |
|---|---|
| **Calendário** | Grade do mês com a cor litúrgica de cada dia. Tudo calculado no próprio aparelho — abre sem rede. |
| **Liturgia** | Leituras do dia com botões de Copiar e Compartilhar no WhatsApp, e as Preces da Assembleia. |
| **Orações** | Orações Eucarísticas com as respostas do povo em letras grandes, para acompanhar o celebrante ao vivo. |
| **Ajustes** | Tema claro/escuro, versão publicada, contato do desenvolvedor e PIX. |

---

## Rodando

```bash
npm install
cp .env.example .env.local     # preencha o que for usar
npm run dev
```

Abre em <http://localhost:3000>. Para testar no celular, use o IP da máquina na rede local.

Sem `OPENAI_API_KEY` tudo funciona, menos gerar preces — que avisa em vez de quebrar.

---

## Comandos

| Comando | Para quê |
|---|---|
| `npm run dev` | Desenvolvimento |
| `npm run build` | Build de produção |
| `npm run verificar` | Confere o calendário litúrgico, o normalizador da API e o gerador de PIX |
| `npm run missal` | Cria e confere `missal.local.txt`, com os textos do celebrante |
| `npm run sondar` | Mostra o que a API de liturgia devolve de verdade e salva amostras |
| `npm run icones` | Regera os PNGs do PWA a partir de `public/icone.svg` |
| `npm run lint` | ESLint |

Rode `npm run verificar` depois de qualquer mexida em `src/lib/liturgia/` — o calendário é a base de tudo, e um erro ali faz o app mostrar a liturgia do dia errado.

---

## Como está montado

```
src/
  lib/liturgia/
    datas.ts        Datas em UTC — dia de calendário, não instante
    calendario.ts   Calendário litúrgico calculado localmente
    normalizar.ts   Camada anticorrupção da API externa
    fonte-remota.ts Cliente da fonte de leituras (só no servidor)
  lib/preces/
    prompt.ts       Prompt ancorado na IGMR 69-71
    esquema.ts      Formato da saída estruturada
    gerar.ts        Chamada à OpenAI
    erros.ts        Traduz as falhas da API para o que a equipe faz a respeito
    repositorio.ts  Banco (Turso em produção, SQLite local em dev)
  lib/pix/brcode.ts BR Code EMV MPM + CRC16
  dados/oracoes-eucaristicas/
  app/              Rotas (App Router)
  componentes/
scripts/            Verificações e utilitários
```

Três decisões que explicam o resto:

**O calendário é calculado, não baixado.** Páscoa, Advento, ciclos A/B/C e as particularidades brasileiras (Epifania e Ascensão no domingo, Aparecida como solenidade) saem de aritmética determinística em `calendario.ts`. Por isso a grade abre offline, e por isso, quando a fonte de leituras cai, a tela ainda mostra celebração, cor e ciclo corretos em vez de ficar em branco.

**Só um arquivo conhece a API externa.** `normalizar.ts` traduz o que a fonte devolve para `LiturgiaDoDia`; o resto do app nunca vê um nome de campo de terceiro. Trocar de fonte mexe em um arquivo.

**A chave da IA nunca sai do servidor.** As preces são geradas em `/api/preces`, nunca no aparelho.

---

## Publicando na Vercel

1. Importe o repositório na Vercel.
2. Configure as variáveis de `.env.example` (mínimo: `OPENAI_API_KEY`, `TURSO_DATABASE_URL`, `TURSO_AUTH_TOKEN`).
3. Faça o deploy. A versão em **Ajustes** vem do commit automaticamente.

---

## Pendências conhecidas

**A fonte ignora as solenidades.** Sondada de verdade (amostras em `docs/amostras/`), a API responde e o normalizador entende o formato. Mas em 15/08/2026 — Assunção — ela devolveu "Sábado da 19ª Semana do Tempo Comum", em verde, **com as leituras feriais**. O calendário local corrige a celebração e a cor, e a tela avisa para conferir no Lecionário, mas **as leituras próprias das solenidades continuam vindo erradas da fonte**. Enquanto não houver um lecionário local para esses dias, confira no Lecionário impresso em toda solenidade.

**Orações Eucarísticas: conferidas.** As cinco foram cotejadas com o texto da 3ª edição típica (2023) trazido pelo diácono da paróquia, uma oração por arquivo. Nada mais é de memória. A conferência corrigiu bastante coisa: incipits da edição anterior ("é justo e necessário" por "é digno e justo", "a memória" por "o memorial"), as **aclamações próprias da assembleia**, que faltavam nas cinco — de cinco a sete por oração —, e o **Mistério da Fé da OE V**, que é próprio dela e estava com as três fórmulas comuns.

**Texto do Missal.** O app traz as respostas da assembleia na íntegra e, das falas do celebrante, só as primeiras palavras, como deixa. **O texto do Missal não vem no app** — nenhuma fala do celebrante tem o texto integral guardado.

Para tê-lo:

```bash
npm run missal        # cria missal.local.txt com as 43 seções, na ordem
```

Abra o arquivo e escreva o texto abaixo de cada `#`, a partir do Missal impresso. Depois ponha `MOSTRAR_TEXTO_PRESIDENCIAL=true` no `.env.local` e reinicie. Rodar `npm run missal` de novo mostra o que falta e acusa id digitado errado.

O arquivo fica **fora do repositório** — o `.gitignore` o barra. É de propósito: os direitos da tradução são da CNBB, e num arquivo de código o texto iria para o GitHub junto com o resto. Assim ele fica na máquina de quem preencheu e no servidor da paróquia, que é uso interno da equipe; publicar na internet é que exigiria autorização escrita.

Com a chave desligada, o texto é removido **no servidor**: não chega ao navegador nem no código-fonte da página.

**Chave PIX.** O código gerado passa nas verificações, mas **cole o "Copia e Cola" num app de banco de verdade antes de publicar**. Erro de CRC16 é o defeito mais comum nessa implementação e só aparece aí.

---

## Licença e créditos

Os textos litúrgicos pertencem aos seus detentores de direitos e são exibidos com atribuição à fonte. As leituras vêm de [liturgia-diaria](https://github.com/Dancrf/liturgia-diaria).

Desenvolvido por Farias Sousa. Gratuito e livre — é para a obra de Deus.
