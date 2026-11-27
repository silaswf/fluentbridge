<!-- @file docs/README.md — Índice mestre e resumo executivo da documentação consolidada do FluentBridge Academy. -->

# Documentação Oficial — FluentBridge Academy (`v9.4.0`)

Documentação técnica, funcional, arquitetural e estratégica consolidada do **FluentBridge Academy** — plataforma poliglota em **17 idiomas** (`en`, `es`, `fr`, `it`, `de`, `ru`, `ja`, `zh`, `ar`, `nl`, `af`, `sv`, `tr`, `he`, `nb`, `da`, `pt`) de **A1 a C1**, com **`2.550` unidades (`150` por idioma)**, **Tradutor Bidirecional por Curso (`POST /api/translate`)**, **Português PLE para falantes de Inglês (imersão invertida `EN → PT`)**, **`65` sotaques regionais com vozes neurais**, **`100` simulados oficiais (`25` formatos incl. CELPE-Bras)**, **`850` cenários de Tutor IA**, **`3.400` guias gramaticais**, **`680` questões CAT**, **YouTube Study Lab** e **Estúdio do Professor + Admin Mestre**.

---

## Estrutura Consolidada (`5` Documentos Mestre)

| Documento | Foco | Conteúdo Principal |
| --- | --- | --- |
| **[01 — Manual Completo de Funcionalidades](./01-MANUAL-COMPLETO-FUNCIONALIDADES.md)** | Produto & Uso (Passo a Passo) | Enciclopédia funcional detalhada de todas as telas, botões, algoritmos (SM-2, CAT, VAD, dificuldade adaptativa), atalhos de teclado, modos offline, Estúdio do Professor e Admin Mestre. |
| **[02 — Arquitetura, Nuvem & Plataformas](./02-ARQUITETURA-NUVEM-E-PLATAFORMAS.md)** | Engenharia & Infraestrutura | Stack Web/PWA, Electron Windows `.exe`, Capacitor Android `.apk`/`.aab`, iOS Safari PWA (`$0/ano`), Cloudflare Worker `v9.0.0` (`8` endpoints, R2 `206 Range`, cotas), Supabase RLS/Sync e CI/CD. |
| **[03 — Auditoria 360° & Análise de Mercado](./03-AUDITORIA-360-E-ANALISE-DE-MERCADO.md)** | Auditoria Zero-Based & Estratégia | Telemetria real pós-`v9.0.0` (`302` arquivos, `291.681+` linhas, chunks `dist/`), avaliação dos 6 pilares, dívidas técnicas `P0/P1/P2`, matriz competitiva (Duolingo Max, Babbel, Busuu, LingQ, Cambly, ELSA) e SWOT. |
| **[04 — Roadmap & Evolução (`v1.0 → v10.0`)](./04-ROADMAP-E-EVOLUCAO.md)** | Histórico & Próximas Ondas | Marcos entregues até a `v9.0.0` (incl. redesign Dark Sober de Login/Gateway e Hero compacto) e plano técnico para `v9.1` (modularização/chunks), `v9.5` (SaaS/pagamentos) e `v10.0` (App Store & B2B). |
| **[CHANGELOG Completo](../CHANGELOG.md)** | Histórico de Versões | Registro cronológico de commits, tags e entregas por versão. |

---

## Resumo Executivo (`v9.4.0`)

| Dimensão | Estado Verificado |
| --- | --- |
| **Idiomas & Currículo** | **17 idiomas** × **150 unidades** = **`2.550` unidades** (`30`/nível CEFR `A1–C1`), **Português PLE (`pt`)** com imersão invertida (`A1–B1` em Inglês, `B2–C1` em Português), RTL nativo (`ar`, `he`) + toggle *Niqqud* (`he`), toggle *100% Kana* (`ja`), **`3.400` guias gramaticais** e **`680` questões CAT** |
| **Voz, Áudio, Tradutor & Imersão** | **`65` sotaques neurais** (Gemini 2.5 Native TTS + Deepgram Aura-2 + cache R2 `tts/v6/`), **Tradutor Bidirecional por Curso** (`/api/translate` `PT ⇄ Idioma` e `EN ⇄ PT`), Whisper STT (`/api/stt`), ruído ambiente (3 níveis), **Modo Hands-Free**, **`85` podcasts**, **`51` vídeos** (HTTP `206 Range`) e **YouTube Study Lab** |
| **Simulados & Comunidade** | **`100` simulados cronometrados** (`25` formatos oficiais incl. **CELPE-Bras**, speaking em 3 partes, rubrica Writing + envio docente) e **Comunidade 2.0** (Ligas, Desafio do Mês `+80 XP`, moderação, áudio, *diff* de correção `+10 XP`) |
| **Interfaces & Plataformas** | Web/PWA (`https://fluentbridge.pages.dev`), Edge API (`https://fluentbridge-api.silaswf.workers.dev`), Windows `.exe`, Android `.apk`/`.aab`, iPhone/iPad Safari PWA (`$0/ano`); Login/Gateway Dark Sober e Hero compacto |
| **Qualidade & Testes** | `tsc --noEmit` (`0` erros) · `vitest` (`23` suítes / `87` testes verdes) · `playwright` (`15/15` fluxos E2E Desktop + Mobile `390x844` + WCAG AA Light/Dark) · `0` chunks > 500 kB · Worker `v9.3.0` (`/api/admin/quotas`) + Pages live |
