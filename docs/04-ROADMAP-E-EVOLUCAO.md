<!-- @file docs/04-ROADMAP-E-EVOLUCAO.md — Histórico consolidado das entregas v1.0→v11.0 e Próxima Onda v11.5→v12.0. -->

# 04 — Roadmap & Evolução (`v1.0 → v12.0`)

Este documento registra o **ciclo concluído (`v1.0.0 → v11.0.0`)** e a próxima onda opcional (`v11.5 → v12.0`), derivada diretamente da Auditoria 360°.

> **Diretrizes Permanentes do Projeto:**
> - **Modo 100% Gratuito por padrão** (`billingEnabled: false`) até decisão expressa do proprietário.
> - **Sem publicação na Apple App Store** (iPhone/iPad continuam atendidos gratuitamente via **iOS Safari PWA `$0/ano`**).
> - **Qualidade obrigatória por entrega:** `tsc --noEmit` (`0` erros), Vitest 100% verde, Playwright 100% verde, `0` chunks > 500 kB e cabeçalho `@file` em todo arquivo novo/alterado.

---

## Parte 1 — Ciclo Concluído (`v1.0.0 → v11.0.0` · 100% Entregue)

| Versão | Marco Entregue | Status |
| --- | --- | :---: |
| **`v1.0 – v5.0`** | Fundação React/Vite, Trilha CEFR A1–C1, SM-2, Tutor IA, Estúdio do Professor, Supabase Auth/Sync e Certificados PDF | ✅ Concluído |
| **`v6.0 – v7.2`** | Cloze SM-2, Drills Gramaticais, Graded Readers, Live Classroom, Windows `.exe` (Electron) + Android `.apk` (Capacitor) + Auto-Updater | ✅ Concluído |
| **`v8.0 – v8.4`** | 12 idiomas × 150 unidades (`1.800` unid.), Comunidade 2.0, Imersão Podcast/Vídeo (`206 Range`), Hands-Free, Dark Mode WCAG AA | ✅ Concluído |
| **`v9.0 – v9.1`** | 16 idiomas (`2.400` unid.), `61` sotaques neurais, YouTube Study Lab, RTL (`ar`/`he` + Niqqud), Login Dark Sober, `0` chunks > 500 kB | ✅ Concluído |
| **`v9.2 – v9.3`** | **Tradutor Bidirecional (`/api/translate`)**, **17º idioma Português PLE (`pt`)** com imersão invertida, `2.550` unidades, `65` sotaques, **Painel R2 Cotas**, i18n no Login/Gateway, modularização inicial | ✅ Concluído |
| **`v9.4.0`** | **Motor de Planos & Assinaturas** estruturado (`subscriptionEngine`, `/api/billing/*`, `subscriptions` Supabase) em modo 100% gratuito | ✅ Concluído |
| **`v10.0.0`** | **Multi-Tenancy Escolar Completo**: isolamento estrito por `schoolId` + PostgreSQL RLS (`Seção 13`), coordenação global Master Admin, alocação fácil de alunos, troca de professor dentro da mesma escola e portal `?escola=<slug>` | ✅ Concluído |
| **`v11.0.0`** | **Eixos A–G (P0, P1 e P2) Completos**: `364` imagens estilo Duolingo no R2 (3 ondas + `picture_choice`), Replay Comparativo + Mapa de Calor fonético + velocidade `0.75x/1.0x/1.15x`, Revisão Express 5 min + Streak Freeze por mérito + Grupos de Estudo, QR Code + Logo/Cor + CSV + Coordenador `isSchoolAdmin` + Diário de Presença, `worker.js` modular (`293` LOC) + `deltaSyncEngine` + Pacote Offline CEFR | ✅ **Concluído (Atual)** |

---

## Parte 2 — Eixos A–G Entregues na `v11.0.0`

### Fase 1 — `v10.1`: Aprendizado Visual & Multimídia (Estilo Duolingo) — ✅ Concluído na `v11.0.0`
- [x] **Pipeline de Imagens no Cloudflare R2 (`/api/media/images/concepts/*.svg`):** `364` conceitos visuais publicados no R2 + fallback vetorial determinístico offline.
- [x] **Campo `visualConceptId` / `imageUrl` no `VocabCard` e `LessonStep`:** mapeamento automático em `courseCohesion.ts` nos `17` idiomas.
- [x] **Novo Exercício `picture_choice` (`PictureChoiceStepView.tsx`):** grade `2×2` com atalhos `1–4` e áudio injetada em unidades A1/A2.
- [x] **Flashcards Visuais no `VocabReview` (SM-2) e `VocabIntroStep`:** com toggle **"Modo Minimalista Texto"**.
- [x] **Upload de Capa em Tópicos Customizados (`TopicCreatorTab`):** via `POST /api/media/upload?key=images/topics/...`.

### Fase 2 — `v10.2`: Fala, Pronúncia & IA Pedagógica 2.0 — ✅ Concluído na `v11.0.0`
- [x] **Replay Comparativo Lado a Lado (`SpeakingStepView`):** modelo nativo vs gravação do aluno + comparação em sequência.
- [x] **Mapa de Calor Palavra-por-Palavra:** chips clicáveis com áudio individual.
- [x] **Seletor de Velocidade de Áudio (`0.75x`, `1.0x`, `1.15x`):** em `DualAudioButtons`, `SpeakingStepView` e `DictationStepView`.
- [x] **Ditado com Diff Visual & Shadowing Guiado (`DictationStepView`).**
- [x] **Painel "Memória Pedagógica da IA" no `AITutor`.**

### Fase 3 — `v10.3`: Engajamento, Hábito & Comunidade 2.0 — ✅ Concluído na `v11.0.0`
- [x] **Revisão Express "5 Minutos" (`ExpressReviewModal`)** + **`TrailQuickActionsBar`** com filtros por trilha (`Viagem`, `Negócios`, `Exames`, `Carreira`).
- [x] **Lembretes Web Push / PWA (`notifications.ts`)** e **Streak Freeze por Mérito (`awardMeritStreakFreeze`)**.
- [x] **Grupos de Estudo & Desafio Semanal da Escola (`CommunityHub`).**

### Fase 4 — `v10.4`: Operação B2B Multi-Escola Avançada — ✅ Concluído na `v11.0.0`
- [x] **Painel do Coordenador da Escola (`SchoolCoordinatorPanel` / `isSchoolAdmin`).**
- [x] **White-Label por Escola (Logo no R2 + `--school-primary`), Importação CSV & QR Code (`qrCodeSvg.ts`).**
- [x] **Diário de Classe & Lista de Presença (`LiveClassroomView` + exportação CSV).**

### Fase 5 — `v10.5`: Engenharia, Modularização & QA Profundo — ✅ Concluído na `v11.0.0`
- [x] **Modularização:** `worker.js` (`293` linhas; `tts/stt/gemini/youtube.js`), `ReadingStepView`, `WritingStepView`, `DictationStepView`, `SchoolsManagementPanel`, `QuotasAndBillingPanel`, `AuditAndLatencyPanel`, `useTenantSchoolActions`, `stateMerge.ts`, chunks `japanese-kana` (`42.41 kB`) e `visual-concepts` (`42.47 kB`).
- [x] **Suíte E2E Multi-Tenant & Visual (`e2e/v11-axes-ag.spec.ts`):** `18/18` jornadas Playwright + `115/115` testes Vitest.
- [x] **Log de Auditoria Administrativa (`Seção 14` SQL) & Latência `avgMs`/`p95Ms` (`/api/admin/quotas`).**

### Fase 6 — `v11.0`: Offline-First Real & Sincronização Delta — ✅ Concluído na `v11.0.0`
- [x] **Pacote Offline por Nível CEFR (`downloadCefrLevelOfflinePack`, Cache API `fb-offline-packs-v1`).**
- [x] **Delta Sync (`deltaSyncEngine.ts`) com resolução determinística de conflitos por `updatedAt`.**

---

## Parte 3 — Próxima Onda Opcional (`v11.5 → v12.0`)
- [x] **Simulados Oficiais Cronometrados v2 (`v11.5.0`):** modo prova real (`real-exam-mode-toggle`) com bloqueio de dicas/rubrica e limite de 2 reproduções de áudio, redação cronometrada dedicada com contagem de palavras/caracteres/parágrafos (`writing-timer-badge`) e relatório comparativo de evolução por tentativa (`ExamEvolutionPanel.tsx` + exportação CSV).
- [x] **Trilhas Especializadas (`v11.5.0` — Negócios, Tecnologia, Saúde & Viagens):** `12` unidades transversais inéditas por idioma (`3` por trilha nos `17` idiomas, total de `204` unidades temáticas sem nenhuma repetição de título, vocabulário ou dica gramatical do currículo principal) em `SpecializedTracksHub.tsx`.
- [ ] **Ativação Opcional de Planos & Checkout (Somente sob Decisão Futura):** ligar `BILLING_ENABLED = true` com chaves Stripe / Mercado Pago / Asaas para B2C ou licenciamento B2B de escolas parceiras.
- [ ] **Publicação em Lojas (Opcional/Futuro):** Google Play Store (`.aab`) e Microsoft Store (`.msix`/`.exe`) quando houver interesse estratégico — *Apple App Store permanece fora do roadmap até decisão explícita*.
