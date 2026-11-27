<!-- @file README.md — Visão geral oficial do FluentBridge Academy, métricas atuais, links de plataformas/releases e comandos de desenvolvimento. -->

# FluentBridge Academy (`v11.5.0`)

Plataforma completa de ensino em **17 idiomas (Inglês, Espanhol, Francês, Italiano, Alemão, Russo, Japonês, Chinês Mandarim, Árabe, Holandês, Africâner, Sueco, Turco, Hebraico, Norueguês, Dinamarquês e Português PLE para falantes de Inglês)** de **A1 a C1** (**`2.550` unidades + `204` unidades de Trilhas Especializadas inéditas (`12`/idioma)**, **`364` ilustrações conceituais estilo Duolingo no R2 + `picture_choice` 2×2**, **`65` sotaques regionais com vozes neurais**, **Replay Comparativo & Mapa de Calor Fonético**, **Revisão Express 5 min**, **`100` Simulados Cronometrados Oficiais v2 (Modo Prova Real + Redação Cronometrada + Evolução Comparativa)**, **`850` cenários de Tutor IA**, **Tradutor Bidirecional por Curso com IPA e SM-2**, **YouTube Study Lab com análise gramatical por IA**, **Comunidade 2.0 com Grupos de Estudo**, **Arquitetura Multi-Tenancy Escolar (RLS `school_id`, QR Code, CSV, Coordenador `isSchoolAdmin` e Diário de Presença)**, **Pacotes Offline CEFR + Delta Sync**, **Gateway Web / Windows / Android / iOS Safari PWA ($0/ano)**, **Suíte Vitest (`130` testes) + E2E Playwright (`21` jornadas)** e **Estúdio do Professor + Admin Mestre**), desenvolvida para o **Prof. Silas Wagner**.

---

## Plataformas & Links Ativos

- **Versão Web / PWA (Cloudflare Pages)**: https://fluentbridge.pages.dev
- **Edge API (Cloudflare Workers AI + STT + Gemini + Translate + YouTube Study + Media R2)**: https://fluentbridge-api.silaswf.workers.dev
- **Repositório & Releases (GitHub)**: https://github.com/silaswf/fluentbridge
- **Windows Instalador Setup (NSIS)**: [`FluentBridge-Setup-11.5.0.exe`](https://github.com/silaswf/fluentbridge-releases/releases/download/v11.5.0/FluentBridge-Setup-11.5.0.exe)
- **Android APK Assinado**: [`FluentBridge-v11.5.0.apk`](https://github.com/silaswf/fluentbridge-releases/releases/download/v11.5.0/FluentBridge-v11.5.0.apk)

---

## Números Atuais (`v11.5.0`)

- **2.550 Unidades CEFR (A1–C1) + 204 Unidades de Trilhas Especializadas Inéditas (Negócios, Tecnologia, Saúde & Viagens)** em 17 Idiomas (`150` base + `12` especializadas por idioma sem repetição) + **`364` Ilustrações Estilo Duolingo**
- **Simulados Oficiais Cronometrados v2**: **Modo Prova Real** (sem dicas, limite de 2 áudios no Listening), **Redação Cronometrada** com contagem de palavras/parágrafos e **Painel de Evolução Comparativa** com CSV
- **Fala & IA Pedagógica 2.0**: **Replay Comparativo Lado a Lado** (modelo nativo vs gravação do aluno), **Mapa de Calor Palavra-por-Palavra**, seletor de velocidade **`0.75x | 1.0x | 1.15x`**, **Ditado com diff visual** e **Memória Pedagógica da IA** no `AITutor`
- **Multi-Tenancy Escolar & B2B Avançado (`tenantEngine.ts` + RLS `Seções 13–14`)**: isolamento total entre escolas (`schoolId`), portais `?escola=<slug>` com **QR Code SVG**, upload de **logo + cor primária**, **importação CSV em lote**, painel do **Coordenador Escolar (`isSchoolAdmin`)**, **Diário de Presença** e troca de professor na mesma escola
- **Engajamento, Mobile Zero-Overflow & Offline-First Real**: **Revisão Express 5 Minutos**, **Menu de Revisão 100% responsivo em `390×844`**, **Streak Freeze por Mérito**, **Grupos de Estudo** e **Pacote Offline por Nível CEFR** (`fb-offline-packs-v1`) + **Delta Sync** (`deltaSyncEngine.ts`)
- **Qualidade Garantida**: `130/130` testes **Vitest** (`31` suítes) + **`21/21` testes E2E Playwright** · `0` erros TypeScript · `0` chunks > 500 kB · Edge API `v11.5.0` modularizada + Pages live

---

## Documentação Consolidada (`docs/`)

Toda a documentação foi unificada em **5 documentos mestre** na pasta **[`docs/`](./docs/README.md)**:

- [Índice da Documentação](./docs/README.md)
- [01 — Manual Completo de Funcionalidades (Detalhado)](./docs/01-MANUAL-COMPLETO-FUNCIONALIDADES.md)
- [02 — Arquitetura, Nuvem & Plataformas](./docs/02-ARQUITETURA-NUVEM-E-PLATAFORMAS.md)
- [03 — Auditoria 360° (Zero-Based) & Análise Competitiva de Mercado](./docs/03-AUDITORIA-360-E-ANALISE-DE-MERCADO.md)
- [04 — Roadmap & Evolução (`v1.0 → v12.0`)](./docs/04-ROADMAP-E-EVOLUCAO.md)
- [CHANGELOG.md](./CHANGELOG.md)

---

## Comandos Principais

```bash
npm install              # Instala dependências
npm run dev              # Servidor de desenvolvimento Vite (http://localhost:5173)
npx tsc --noEmit         # Verificação estrita TypeScript
npm test                 # Suíte Vitest (23 arquivos / 81 testes)
npm run build            # Build de produção Web/PWA (dist/)
npm run test:e2e         # Suíte E2E Playwright (15 fluxos Desktop + Mobile)
```
