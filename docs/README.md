<!-- @file docs/README.md — Índice mestre e resumo executivo da documentação consolidada do FluentBridge Academy. -->

# Documentação Oficial — FluentBridge Academy (`v11.6.0`)

Documentação técnica, funcional, arquitetural e estratégica consolidada do **FluentBridge Academy** — plataforma poliglota em **17 idiomas** (`en`, `es`, `fr`, `it`, `de`, `ru`, `ja`, `zh`, `ar`, `nl`, `af`, `sv`, `tr`, `he`, `nb`, `da`, `pt`) de **A1 a C1**, com **`2.550` unidades base + `204` unidades de Trilhas Especializadas inéditas (`12` por idioma)**, **Tradutor Bidirecional por Curso (`POST /api/translate`)**, **Português PLE para falantes de Inglês (imersão invertida `EN → PT`)**, **`65` sotaques regionais com vozes neurais**, **`100` simulados oficiais v2 (Modo Prova Real + Redação Cronometrada + Evolução Comparativa)**, **`850` cenários de Tutor IA**, **`3.400` guias gramaticais**, **`680` questões CAT**, **YouTube Study Lab** e **Estúdio do Professor + Admin Mestre**.

---

## Estrutura Consolidada (`5` Documentos Mestre)

| Documento | Foco | Conteúdo Principal |
| --- | --- | --- |
| **[01 — Manual Completo de Funcionalidades](./01-MANUAL-COMPLETO-FUNCIONALIDADES.md)** | Produto & Uso (Passo a Passo) | Enciclopédia funcional detalhada de todas as telas, botões, algoritmos (SM-2, CAT, VAD, dificuldade adaptativa), atalhos de teclado, modos offline, Estúdio do Professor e Admin Mestre. |
| **[02 — Arquitetura, Nuvem & Plataformas](./02-ARQUITETURA-NUVEM-E-PLATAFORMAS.md)** | Engenharia & Infraestrutura | Stack Web/PWA, Electron Windows `.exe`, Capacitor Android `.apk`/`.aab`, iOS Safari PWA (`$0/ano`), Cloudflare Worker `v9.0.0` (`8` endpoints, R2 `206 Range`, cotas), Supabase RLS/Sync e CI/CD. |
| **[03 — Auditoria 360° & Análise de Mercado](./03-AUDITORIA-360-E-ANALISE-DE-MERCADO.md)** | Auditoria Zero-Based & Estratégia | Telemetria real pós-`v11.5.0` (`357` arquivos, `330.387` linhas, Top 15 LOC, Top 10 chunks `dist/`), scorecard `9.26/10`, SWOT competitivo e catálogo de `36` oportunidades `P0–P3`. |
| **[04 — Roadmap & Evolução (`v1.0 → v13.0`)](./04-ROADMAP-E-EVOLUCAO.md)** | Histórico & Novo Ciclo | Ciclo `v1.0 → v11.5` 100% concluído e novo roadmap de `7` fases (`v11.6 → v13.0`: CI/chunks/mobile total, nativização das trilhas nos 17 idiomas, IA 3.0 streaming, FSRS, B2B 3.0, refatoração e Delta Sync primário). |
| **[CHANGELOG Completo](../CHANGELOG.md)** | Histórico de Versões | Registro cronológico de commits, tags e entregas por versão. |

---

## Resumo Executivo (`v11.6.0`)

| Dimensão | Estado Verificado |
| --- | --- |
| **Idiomas & Currículo** | **17 idiomas** × **150 unidades** = **`2.550` unidades** (`30`/nível CEFR `A1–C1`) + **`204` unidades em 4 Trilhas Especializadas 100% nativas nos 17 idiomas** (`0` colisões), **Português PLE (`pt`)** com imersão invertida, RTL nativo (`ar`, `he`) + *Niqqud*, *100% Kana* (`ja`), **`3.400` guias gramaticais** e **`680` questões CAT** |
| **Voz, Áudio, Tradutor & Imersão** | **`65` sotaques neurais**, **Tutor IA com Streaming SSE (`/api/gemini-tutor?stream=1`)**, **Tradutor Bidirecional por Curso**, Whisper STT, ruído ambiente, **Modo Hands-Free**, **`85` podcasts**, **`51` vídeos** (HTTP `206 Range`) e **YouTube Study Lab** |
| **Simulados v2 & Comunidade** | **`100` simulados cronometrados v2** (`25` formatos oficiais incl. **CELPE-Bras**, **Modo Prova Real**, **Redação Cronometrada**, **Painel de Evolução Comparativa** + CSV) e **Comunidade 2.0** (Ligas, Grupos de Estudo, Desafio do Mês `+80 XP`, moderação, áudio, *diff* `+10 XP`) |
| **Interfaces & Plataformas** | Web/PWA (`https://fluentbridge.pages.dev` com `public/_headers` CSP), Edge API (`https://fluentbridge-api.silaswf.workers.dev`), Windows `.exe`, Android `.apk`/`.aab`, iPhone/iPad Safari PWA (`$0/ano`); blindagem mobile zero-overflow em `360×800` e `390×844` |
| **Qualidade & Testes** | `tsc --noEmit` (`0` erros) · `lint:headers` (`376/376` `@file`) · `vitest` (**`32` suítes / `143` testes verdes**) · `playwright` (**`23/23` fluxos E2E**) · `0` chunks > 500 kB (`todos < 407 kB`) · CI `@v5` + Worker `v11.6.0` + Pages live |
