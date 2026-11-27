<!-- @file README.md — Visão geral oficial do FluentBridge Academy, métricas atuais, links de plataformas/releases e comandos de desenvolvimento. -->

# FluentBridge Academy (`v11.0.0`)

Plataforma completa de ensino em **17 idiomas (Inglês, Espanhol, Francês, Italiano, Alemão, Russo, Japonês, Chinês Mandarim, Árabe, Holandês, Africâner, Sueco, Turco, Hebraico, Norueguês, Dinamarquês e Português PLE para falantes de Inglês)** de **A1 a C1** (**`2.550` unidades**, **`364` ilustrações conceituais estilo Duolingo no R2 + `picture_choice` 2×2**, **`65` sotaques regionais com vozes neurais**, **Replay Comparativo & Mapa de Calor Fonético**, **Revisão Express 5 min**, **`100` Simulados Cronometrados Oficiais**, **`850` cenários de Tutor IA**, **Tradutor Bidirecional por Curso com IPA e SM-2**, **YouTube Study Lab com análise gramatical por IA**, **Comunidade 2.0 com Grupos de Estudo**, **Arquitetura Multi-Tenancy Escolar (RLS `school_id`, QR Code, CSV, Coordenador `isSchoolAdmin` e Diário de Presença)**, **Pacotes Offline CEFR + Delta Sync**, **Gateway Web / Windows / Android / iOS Safari PWA ($0/ano)**, **Suíte Vitest (`115` testes) + E2E Playwright (`18` jornadas)** e **Estúdio do Professor + Admin Mestre**), desenvolvida para o **Prof. Silas Wagner**.

---

## Plataformas & Links Ativos

- **Versão Web / PWA (Cloudflare Pages)**: https://fluentbridge.pages.dev
- **Edge API (Cloudflare Workers AI + STT + Gemini + Translate + YouTube Study + Media R2)**: https://fluentbridge-api.silaswf.workers.dev
- **Repositório & Releases (GitHub)**: https://github.com/silaswf/fluentbridge
- **Windows Instalador Setup (NSIS)**: [`FluentBridge-Setup-11.0.0.exe`](https://github.com/silaswf/fluentbridge-releases/releases/download/v11.0.0/FluentBridge-Setup-11.0.0.exe)
- **Android APK Assinado**: [`FluentBridge-v11.0.0.apk`](https://github.com/silaswf/fluentbridge-releases/releases/download/v11.0.0/FluentBridge-v11.0.0.apk)

---

## Números Atuais (`v11.0.0`)

- **2.550 Unidades CEFR (A1–C1) em 17 Idiomas (`150` por idioma) + `364` Ilustrações Estilo Duolingo**: associação visual em `VocabIntroStep`, `VocabReview` (com Modo Minimalista), desafio `picture_choice` 2×2 e `364` SVGs servidos via R2 CDN (`/api/media/images/concepts/*.svg`)
- **Fala & IA Pedagógica 2.0**: **Replay Comparativo Lado a Lado** (modelo nativo vs gravação do aluno), **Mapa de Calor Palavra-por-Palavra**, seletor de velocidade **`0.75x | 1.0x | 1.15x`**, **Ditado com diff visual** e **Memória Pedagógica da IA** no `AITutor`
- **Multi-Tenancy Escolar & B2B Avançado (`tenantEngine.ts` + RLS `Seções 13–14`)**: isolamento total entre escolas (`schoolId`), portais `?escola=<slug>` com **QR Code SVG**, upload de **logo + cor primária**, **importação CSV em lote**, painel do **Coordenador Escolar (`isSchoolAdmin`)**, **Diário de Presença** e troca de professor na mesma escola
- **Engajamento & Offline-First Real**: **Revisão Express 5 Minutos**, **Streak Freeze por Mérito**, **Grupos de Estudo** e **Pacote Offline por Nível CEFR** (`fb-offline-packs-v1`) + **Delta Sync** (`deltaSyncEngine.ts`)
- **Qualidade Garantida**: `115/115` testes **Vitest** (`29` suítes) + **`18/18` testes E2E Playwright** · `0` erros TypeScript · `0` chunks > 500 kB · Edge API `v11.0.0` modularizada (`worker.js` `293` linhas + latência `avgMs`/`p95Ms`) + Pages live

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
