<!-- @file docs/04-ROADMAP-E-EVOLUCAO.md — Histórico consolidado de versões (v1.0 a v9.4.0) e roadmap estratégico das próximas ondas. -->

# 04 — Roadmap & Evolução (`v1.0.0 → v10.0.0`)

Histórico consolidado de todas as fases entregues até a **`v9.4.0`** e plano de evolução técnica para as próximas versões.

---

## 1. Fases Concluídas (`v1.0.0 → v9.4.0`)

| Versão | Marco Principal | Entregas-Chave Verificadas |
| --- | --- | --- |
| **`v1.0.0 → v1.3.0`** | Fundação Busuu + Multiplataforma + Edge | Player multi-etapas, Gemini Proxy + Deepgram Aura-2 no Cloudflare Worker, Supabase OAuth/Sync granular com tombstones, Electron `.exe`, Capacitor `.apk`/`.aab`, PWA offline e Vitest inicial. |
| **`v2.0.0 → v7.0.0`** | Expansão Poliglota, Exames & Comunidade | Expansão de `3 → 12` idiomas, alfabetos completos (Japonês, Chinês, Russo, Árabe RTL), Cloze SM-2, Grammar Drills, Graded Readers, Live Classroom, Mistake Notebook, Certificados PDF, Relatórios Pedagógicos e Comunidade. |
| **`v8.0.0 → v8.2.1`** | Coesão, DET & Correção de Trilha | `courseCohesion.ts` (`>=10` flashcards coesos por unidade), 100% Kana toggle em Japonês, DET (10–160), módulos desdobráveis sequenciais sem repetição (`v8.2.1`), timeout dinâmico para áudios longos e `49` sotaques preservados até o Worker. |
| **`v8.3.0`** | Vozes Neurais Globais & Plano P0–P2 | Gemini 2.5 Native TTS em todos os 49 sotaques (`tts/v6/`), `SettingsModal` unificado, barra CEFR única sticky, guarda de contraste Dark Mode, `i18n` `PT/EN/ES` 100%, `deleteMyCloudAccount()` LGPD, `secret-scan` no CI e Playwright mobile/desktop. |
| **`v8.4.0`** | Dark Híbrido, Imersão, Hands-Free & Comunidade 2.0 | `@custom-variant dark` + `:where`, `EmptyStateCard`, pulso `+XP`, aba dedicada **Imersão**, **Modo Hands-Free**, `phonemeBreakdown` nos 12 idiomas, Comunidade 2.0 (Desafio do Mês `+80 XP`, moderação, reações, *diff* `+10 XP`), iOS Safari PWA `$0/ano`, cotas R2, HTTP `206 Range`, `sourcemap: 'hidden'` e correção de `teacherDisplayName`. |
| **`v9.0.0`** | 16 Idiomas, 2.400 Unidades, YouTube Study Lab & UI Sober | 4 novos idiomas (`tr`, `he` RTL + *Niqqud*, `nb`, `da`), expansão espiralada para 150 unidades/idioma (`2.400` totais), `61` sotaques, `800` cenários IA, `96` simulados (`24` formatos), `3.200` guias gramaticais, `640` questões CAT, **YouTube Study Lab**, Login/Gateway Dark Sober, Hero compacto e documentação consolidada. |
| **`v9.1.0`** | **Execução P0 + P1 da Auditoria 360°** | **Zero chunks > 500 kB** (`vite.config.ts` fatiado por idioma e `tutor-scenarios-*`), **zero avisos de import misto** (`cloudSync.ts` estático), **Worker modularizado** (`lib/http.js` + `routes/youtubeStudy.js`), **`FillBlankStepView.tsx`** extraído do `LessonPlayer`, **`script_phonics` automático em Hebraico (Alefbet RTL)** e **84/84 testes Vitest + 15/15 Playwright**. |
| **`v9.2.0`** | **Tradutor Bidirecional & Português PLE (`pt`)** | **Tradutor Bidirecional Adaptativo** (`CourseTranslatorView.tsx` + `POST /api/translate` com IPA, TTS neural, registro, SM-2 e fallback offline; `PT ⇄ Idioma` e `EN ⇄ PT` no curso `pt`) e **17º idioma: Português para falantes de Inglês** com **imersão invertida** (`A1–B1` em Inglês, `B2–C1` em Português), `150` unidades (`2.550` totais), `200` guias, `40` CAT, `50` cenários IA, `4` simulados **CELPE-Bras** (`100` totais), `4` sotaques (`65` totais), `86/86` Vitest + `15/15` Playwright. |
| **`v9.3.0`** | **i18n Entrada/PT, Cotas R2, Modularização & Admin/Professor** | Seletor `PT\|EN\|ES` no Login/Gateway + banner automático EN no curso `pt`, painel **Consumo Diário de Cotas IA (R2)** (`GET /api/admin/quotas`), extração de `SpeakingStepView.tsx`, `SubmissionsGradingTab.tsx`, `TopicCreatorTab.tsx`, `routes/media.js` e `lib/quotas.js`, filtros/17 idiomas/CSV/segurança no Admin & Professor (`87/87` Vitest + `15/15` Playwright). |
| **`v9.4.0` (Atual)** | **Motor de Planos & Assinaturas (Modo 100% Gratuito)** | Estrutura completa pronta para ativação futura (`subscriptionEngine.ts`, `routes/billing.js` `/api/billing/plans|checkout|webhook`, tabelas `subscriptions` e `billing_events` no Supabase com RLS + LGPD, e painel no `AdminPanel`), operando com `billingEnabled: false` (acesso livre e gratuito para todos os usuários por tempo indeterminado). |

---

## 2. Próximas Ondas Planejadas

### Onda `v9.5.0` — Experiência Visual & Imagens Conceituais (R2)
- [ ] **Imagens nas Unidades (Estilo Duolingo):** taxonomia conceitual compartilhada (`visualConceptId`) com ~350–500 ilustrações WebP servidas pelo Cloudflare R2 (`/api/media/images/concepts/*`), `VocabIntroStep`, `VocabReview` e exercício `picture_choice` sem aumentar o peso do `.exe`/`.apk`.

### Onda `v10.0.0` — Escala & Multi-tenancy Escolar
- [ ] **Multi-tenancy Escolar (White-Label):** isolamento completo por `school_id` no Supabase para permitir que outras escolas/professores tenham seu próprio espaço, turmas e identidade visual dentro da plataforma. *(Publicação paga na Apple App Store removida do roadmap por ora; iOS segue atendido gratuitamente via Safari PWA.)*
