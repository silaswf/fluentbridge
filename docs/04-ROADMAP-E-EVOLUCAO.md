<!-- @file docs/04-ROADMAP-E-EVOLUCAO.md — Histórico completo v1.0→v11.5 e Novo Roadmap Estratégico v11.6→v13.0 derivado da Auditoria 360° pós-v11.5.0. -->

# 04 — Roadmap & Evolução (`v1.0 → v13.0`)

Este documento consolida todo o **ciclo concluído (`v1.0.0 → v11.5.0`)** e define o **novo ciclo evolutivo (`v11.6 → v13.0`)**, derivado diretamente dos **36 achados reais da Auditoria 360° (`v11.5.0`)** — estruturado em ondas pequenas e seguras para executarmos aos poucos.

> **Diretrizes Permanentes do Projeto ([`AGENTS.md`](../AGENTS.md)):**
> - **Modo 100% Gratuito por padrão** (`billingEnabled: false`) até decisão expressa do proprietário.
> - **Sem publicação na Apple App Store** (iPhone/iPad continuam atendidos gratuitamente via **iOS Safari PWA `$0/ano`**).
> - **Qualidade obrigatória em cada entrega:** `node --check`, `tsc --noEmit` (`0` erros), Vitest `100%` verde, `npm run build` (`0` avisos Rollup, `0` chunks > `500 kB`), Playwright `100%` verde, cabeçalho `@file` em `100%` dos arquivos e **acompanhamento obrigatório do deploy Cloudflare + todos os workflows do GitHub Actions até `completed / success`**.

---

## Parte 1 — Ciclo Concluído (`v1.0.0 → v11.5.0` · 100% Entregue)

| Versão | Marco Entregue | Status |
| --- | --- | :---: |
| **`v1.0 – v5.0`** | Fundação React/Vite, Trilha CEFR A1–C1, SM-2, Tutor IA, Estúdio do Professor, Supabase Auth/Sync e Certificados PDF | ✅ Concluído |
| **`v6.0 – v7.2`** | Cloze SM-2, Drills Gramaticais, Graded Readers, Live Classroom, Windows `.exe` (Electron) + Android `.apk` (Capacitor) + Auto-Updater | ✅ Concluído |
| **`v8.0 – v8.4`** | 12 idiomas × 150 unidades (`1.800` unid.), Comunidade 2.0, Imersão Podcast/Vídeo (`206 Range`), Hands-Free, Dark Mode WCAG AA | ✅ Concluído |
| **`v9.0 – v9.1`** | 16 idiomas (`2.400` unid.), `61` sotaques neurais, YouTube Study Lab, RTL (`ar`/`he` + Niqqud), Login Dark Sober, `0` chunks > `500 kB` | ✅ Concluído |
| **`v9.2 – v9.3`** | Tradutor Bidirecional (`/api/translate`), 17º idioma **Português PLE (`pt`)** com imersão invertida, `2.550` unidades, `65` sotaques, Painel R2 Cotas, i18n no Login/Gateway | ✅ Concluído |
| **`v9.4.0`** | Motor de Planos & Assinaturas estruturado (`subscriptionEngine`, `/api/billing/*`, `subscriptions` SQL) em modo 100% gratuito | ✅ Concluído |
| **`v10.0.0`** | **Multi-Tenancy Escolar Completo:** isolamento estrito por `schoolId` + PostgreSQL RLS (`Seção 13`), coordenação global Master Admin, alocação fácil de alunos, troca de professor dentro da mesma escola e portal `?escola=<slug>` | ✅ Concluído |
| **`v11.0.0`** | **Eixos A–G (P0–P2) Completos:** `364` imagens estilo Duolingo no R2 (3 ondas + `picture_choice` 2×2), Replay Comparativo + Mapa de Calor + `0.75x/1.0x/1.15x`, Revisão Express 5 min + Streak Freeze por mérito + Grupos de Estudo, QR/Logo/Cor/CSV + Coordenador `isSchoolAdmin` + Diário de Presença, `worker.js` modular (`293` LOC) + `deltaSyncEngine` + Pacote Offline CEFR | ✅ Concluído |
| **`v11.5.0`** | **Menu Revisão Mobile Zero-Overflow (`390×844`)**, **Simulados Oficiais Cronometrados v2** (Modo Prova Real, Redação Cronometrada, `ExamEvolutionPanel` + CSV), **`12` Trilhas Especializadas Inéditas/Idioma (`204` unidades sem repetição)**, CI em Node 22 + **`31/31` Vitest (`130` testes)** + **`21/21` Playwright E2E** | ✅ Concluído |
| **`v11.6.0`** | **Todos os 6 Itens P0 Entregues:** **17 idiomas nativos** nas Trilhas Especializadas (`0` colisões + chunks por idioma), **Streaming SSE no `AITutor`**, split dos chunks > `400 kB`, **blindagem mobile `360×800`/`390×844`** (`9` telas), gate `@file` (`376/376`), `public/_headers` CSP e **GitHub Actions `@v5` + job `e2e-playwright`** (`32/32` Vitest `143` testes + `23/23` E2E) | ✅ **Concluído (Atual)** |

---

## Parte 2 — Novo Ciclo de Evolução (`v11.6 → v13.0`)

Organizado por prioridade real da Auditoria 360° (`P0 → P2`), permitindo entregas incrementais sem risco de regressão.

### Fase 1 — `v11.6`: Blindagem de CI/CD, Chunks `< 400 kB`, Higiene `@file`, Streaming SSE & Mobile Total (`P0`) — ✅ Concluído na `v11.6.0`
- [x] **Cabeçalho `@file` 100% + Gate no CI:** restaurado `@file` em `src/components/LearningPath.tsx`, criado `scripts/check-file-headers.mjs` (`lint:headers`, `376/376` OK) e verificação automática no GitHub Actions.
- [x] **Split Preventivo dos 5 Chunks > `400 kB`:** divididos `tutor-scenarios-core`, `curriculum-he-exp`, `curriculum-v9-ar`, `curriculum-nb-exp` e aplicados `React.lazy()` nos modais secundários (`0` chunks de dados > `400 kB`, `index` em `406.40 kB`).
- [x] **GitHub Actions Modernizado (`@v5`) + Job `e2e-playwright` no CI:** migrados `actions/checkout`, `setup-node` e `setup-java` para `@v5` e adicionado job automático de **Playwright E2E** na branch `main`.
- [x] **Auditoria Mobile Zero-Overflow (`360×800` e `390×844`) nas Telas Centrais (`e2e/mobile-all-views.spec.ts`):** corrigido cabeçalho mobile da `Sidebar.tsx` em `360px` e validadas `9` telas com `<= 1px` de overflow.
- [x] **Hardening HTTP (`public/_headers`):** headers CSP, `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy` e `Permissions-Policy` aplicados no Cloudflare Pages.
- [x] **Nativização das Trilhas Especializadas nos 11 Idiomas Restantes (`ru, ja, zh, ar, nl, af, sv, tr, he, nb, da`):** `11` arquivos nativos inéditos + split por idioma + `19/19` testes sem colisão nos **17 idiomas** (P0 #1).
- [x] **Streaming SSE no `AITutor` (`/api/gemini-tutor?stream=1`):** streaming progressivo no Worker + `aiTutorEngine.ts` + bolha em tempo real no `AITutor.tsx` + `aiTutorStreaming.test.ts` (P0 #7).

### Fase 2 — `v11.8`: Novos Exercícios, Expansão Visual & Expansão das Trilhas (`P1`)
*Objetivo: elevar ainda mais a profundidade pedagógica e a variedade dentro das lições.*
- [ ] **Novos Passos no `LessonPlayer`:** `word_bank` (montagem de frases por blocos clicáveis) e `spot_error` (identificar e corrigir erro gramatical no contexto).
- [ ] **Expansão Visual (`364 → 600+` Ilustrações no R2):** cobertura de vocabulário B1–B2 e dos 4 domínios das Trilhas Especializadas com artes contextuais leves.
- [ ] **Expansão das Trilhas Especializadas (`3 → 6` Unidades/Trilha = `24`/Idioma):** entrevistas técnicas/executivas, negociações, emergências clínicas e imigração/aeroportos.

### Fase 3 — `v12.0`: IA Conversacional 3.0 (Streaming SSE, Writing Coach & Prosódia) (`P0/P1`)
*Objetivo: tornar a experiência de IA e fala instantânea e com feedback de nível examinador oficial.*
- [ ] **Streaming SSE no `AITutor` (`/api/gemini-tutor?stream=1`):** primeiro token em `< 400ms` e síntese de voz progressiva por frase no Modo Chamada.
- [ ] **Writing Coach IA nos Simulados v2:** correção inline com nota oficial estimada (IELTS Band, CELPIP, DELE/DELF/CELPE-Bras), marcação de coesão/gramática/registro e sugestão de reescrita C1.
- [ ] **Análise Prosódica (WPM, Pausas & Ritmo):** métricas de fluência oral lado a lado com o Mapa de Calor palavra-por-palavra em `SpeakingStepView` e `MockExamHub`.
- [ ] **Plano de Estudos Semanal Adaptativo (IA):** agenda automática de 7 dias cruzando erros do `MistakeNotebook`, menor nota nos Simulados v2 e palavras fracas no SM-2.
- [ ] **Comparador de Sotaques Lado a Lado & Roleplay Ramificado:** ouvir a mesma frase em 2 sotaques regionais e diálogos com checklist de objetivos cumpridos.

### Fase 4 — `v12.2`: Retenção Científica (FSRS), Hábito & Engajamento 2.0 (`P1/P2`)
*Objetivo: aumentar constância diária e eficiência de memorização.*
- [ ] **Algoritmo FSRS Opcional no `VocabReview`:** seletor `SM-2 Clássico | FSRS Adaptativo` com retenção alvo configurável (`85%–95%`).
- [ ] **Widget "Continuar de Onde Parei" + Meta Diária em Minutos:** retomada instantânea do último passo incompleto com barra de progresso diário real.
- [ ] **Badges Progressivos & Cartão Compartilhável White-Label:** galeria de conquistas no perfil + exportação PNG com marca da escola.
- [ ] **Modo Foco (Pomodoro 15/25 min), Modal de Atalhos (`?`), Retrospectiva Semanal & Legendas Karaokê** em Podcasts/Vídeos Curtos.

### Fase 5 — `v12.4`: Operação B2B & Estúdio Docente 3.0 (`P1/P2`)
*Objetivo: dar autonomia completa a coordenadores escolares e professores com muitas turmas.*
- [ ] **Boletim Mensal Automatizado por Turma/Escola (PDF + CSV):** frequência, progresso CEFR, média de simulados e alerta de alunos em risco de evasão (> 7 dias inativos).
- [ ] **Banco de Provas & Quizzes Customizados do Professor:** criação de avaliações próprias com correção automática e aplicação por turma/escola.
- [ ] **Transferência em Lote & Histórico de Alocação:** remanejamento múltiplo de alunos entre professores/turmas na mesma escola com linha do tempo auditável.
- [ ] **Mural de Avisos por Escola (`schoolId`) & Agenda `.ics` / Google Calendar** integrada à `LiveClassroomView`.

### Fase 6 — `v12.6`: Refatoração Estrutural & Testes de Componentes + Worker (`P1/P2`)
*Objetivo: manter velocidade de evolução alta e código enxuto abaixo de 700 LOC nos arquivos centrais.*
- [ ] **Decompor `src/App.tsx` (`2.706` → `< 750` LOC):** `PlatformContext` + hooks (`useAuthSession`, `useLearningFlow`, `useTeacherHandlers`, `useAdminHandlers`).
- [ ] **Decompor `LessonPlayer.tsx` (`2.118` → `< 650` LOC) e `MockExamHub.tsx` (`1.401` → `< 550` LOC):** subcomponentes focados em `steps/` e `exams/`.
- [ ] **Decompor Módulos > `800` LOC:** `LearningPath`, `AITutor`, `AdminPanel`, `TeacherStudio`, `VocabReview`, `Sidebar`, `CommunityHub`, `speech.ts`, `cloudSync.ts` e `cloudflare-worker/routes/tts.js` (extrair `ttsVoices.js`).
- [ ] **Testes Unitários do Worker + `@testing-library/react` + Error Telemetry R2:** cobertura unitária das rotas da Edge API, testes de componentes React críticos e captura LGPD-safe de erros em produção no `AuditAndLatencyPanel`.

### Fase 7 — `v13.0`: Delta Sync Primário, Fila Offline Visual & Virtualização (`P1/P2`)
*Objetivo: escalar confortavelmente para dezenas de escolas e milhares de alunos simultâneos.*
- [ ] **Delta Sync como Fonte Primária em Produção:** promover `deltaSyncEngine.ts` + tabelas relacionais evitando conflitos concorrentes de escrita entre múltiplos professores/dispositivos.
- [ ] **Indicador Visual da Fila Offline (`offlineOutbox`) + Background Sync:** contador de ações pendentes, retry exponencial e botão "Sincronizar Agora".
- [ ] **Virtualização de Listas Grandes & Cache LRU de Áudio no IndexedDB:** fluidez constante em listas de `2.000+` cards (`VocabReview`), `3.400` guias (`TipsLibrary`) e grandes painéis B2B, com teto seguro de armazenamento em celulares.

---

## Parte 3 — Escala Comercial & Lojas (Opcional / Sob Decisão Futura · `P3`)
- [ ] **Ativação Opcional de Planos & Checkout:** ligar `BILLING_ENABLED = true` com chaves Stripe / Mercado Pago / Asaas somente quando/se houver decisão de monetização B2C ou licenciamento B2B.
- [ ] **Publicação Opcional em Lojas:** Google Play Store (`.aab`) e Microsoft Store (`.msix`/`.exe`) quando houver interesse estratégico — **Apple App Store permanece fora do roadmap até decisão explícita**.
