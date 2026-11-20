# 07 — Plano Técnico das Próximas Fases (Fases 5 a 9 · `v1.1.0` → `v2.0.0`)

Este documento detalha o plano executável, sprint a sprint, para transformar o **FluentBridge (`v1.0.3`)** em uma plataforma edtech completa de nível comercial para o **Prof. Silas** e seus alunos.

---

## Visão Geral das Sprints

| Fase / Sprint | Versão Alvo | Foco Principal | Resultado Estratégico |
| --- | --- | --- | --- |
| **Fase 5 (Sprint 5.1 & 5.2)** | `v1.1.0` | **Backend Relacional + Storage de Áudio + Edge Function Gemini** | Prof. Silas ouve áudios dos alunos no PC, zero exposição da API Key e sync por aluno com RLS |
| **Fase 6 (Sprint 6.1 & 6.2)** | `v1.2.0` | **Code-Splitting + Modularização + PWA Offline + Testes `Vitest`** | Carregamento inicial < 280 kB, funcionamento offline na Web/iOS e proteção contra regressões |
| **Fase 7 (Sprint 7.1 & 7.2)** | `v1.3.0` | **SRS Científico SM-2 + Dark Mode + Notificações + Acessibilidade** | Retenção diária superior (SM-2, *Streak Freeze*, lembretes nativos) e UX noturna confortável |
| **Fase 8 (Sprint 8.1 & 8.2)** | `v1.4.0` | **Ditado, Minimal Pairs BR, Histórias Multi-Voz & Tarefas Docentes** | Novos formatos pedagógicos de escuta/pronúncia + controle de dever de casa por turma |
| **Fase 9 (Sprint 9.1 & 9.2)** | `v2.0.0` | **60+ Unidades EN + Idiomas ES/FR Completos + Publicação Play Store** | Ecossistema multi-idiomas completo com Gerador IA de Lições e lançamento oficial nas lojas |

---

## Fase 5 (`v1.1.0`) — Segurança de Produção, Storage de Áudio & Edge Function

### Sprint 5.1 — Upload de Speaking no Supabase Storage & Sync Relacional
- **Arquivos impactados**: `src/utils/cloudSync.ts`, `src/utils/audioDb.ts`, `src/components/TeacherStudio.tsx`, `src/App.tsx`.
- **Implementação**:
  1. Ao submeter um exercício de *Speaking* (`handleSubmitSpeaking`), além de salvar no IndexedDB local para preview instantâneo, subir o `Blob` para `supabase.storage.from('speaking-audios').upload(`${authUid}/${submissionId}.webm`, blob)` e gravar `audioPath` na submissão.
  2. No `TeacherStudio.tsx`, quando `audioBlob` não existir localmente no IndexedDB do PC do professor e `selectedSub.audioPath` estiver preenchido, gerar URL assinada (`createSignedUrl(audioPath, 3600)`) e exibir o player HTML5 `<audio controls>` para o Prof. Silas ouvir diretamente a gravação do aluno.
  3. Migrar progresso (`student_progress`), submissões (`submissions`), turmas (`classes`), tópicos customizados (`custom_topics`) e certificados (`certificates`) para leituras/escritas granulares nas tabelas relacionais com RLS já definidas em `supabase_schema.sql`, eliminando sobrescrita simultânea e removendo senhas em texto do JSON compartilhado.

### Sprint 5.2 — Proxy Seguro Google Gemini (`supabase/functions/gemini-tutor`)
- **Arquivos impactados**: novo `supabase/functions/gemini-tutor/index.ts`, `src/utils/aiTutorEngine.ts`, `src/config/appConfig.ts`.
- **Implementação**:
  1. Armazenar `GEMINI_API_KEY` como secret do servidor no Supabase (`supabase secrets set GEMINI_API_KEY=...`), removendo a chave fixa do bundle público do frontend (mantendo fallback opcional para chave própria no Settings se desejado).
  2. Validar JWT do usuário autenticado via `supabase.auth.getUser(token)`, aplicar limite diário configurável por aluno e encaminhar as chamadas a `gemini-3.8-flash` / `gemini-2.5-flash`.

---

## Fase 6 (`v1.2.0`) — Performance, Arquitetura Modular, PWA Offline & Testes

### Sprint 6.1 — Code-Splitting Real & Refatoração de Monolitos
- **Arquivos impactados**: `src/App.tsx`, `src/data/languages.ts`, `src/components/LessonPlayer.tsx`, `src/components/TeacherStudio.tsx`, `vite.config.ts`.
- **Implementação**:
  1. Carregar sob demanda (`React.lazy` + `<Suspense>`) os módulos `TeacherStudio`, `AITutor`, `VocabReview`, `TipsLibrary` e `CertificatesView`.
  2. Transformar `getCourseTopics` / carregamento de `levelB1`, `levelB2`, `levelC1`, `grammarB1B2` e `grammarC1` em carregadores assíncronos por demanda (`Promise<Topic[]>`), reduzindo o chunk principal de `1.032 kB` para `< 280 kB`.
  3. Fatiar `LessonPlayer.tsx` (`1.788` linhas) em componentes dedicados (`src/components/steps/TipStepView.tsx`, `ListeningStepView.tsx`, `ReadingStepView.tsx`, `SpeakingStepView.tsx`, `WritingStepView.tsx`) e extrair `useCloudSyncController` e `useAuthController` de `App.tsx`.

### Sprint 6.2 — `ErrorBoundary`, PWA Service Worker & Suíte `Vitest`
- **Arquivos impactados**: novo `src/components/ErrorBoundary.tsx`, `vite.config.ts` (`vite-plugin-pwa`), novos arquivos `src/**/*.test.ts(x)`.
- **Implementação**:
  1. Adicionar `ErrorBoundary` global com opção de recuperação segura e exportação de diagnóstico.
  2. Configurar `vite-plugin-pwa` com Workbox caching automático para a versão Web (`https://fluentbridge.pages.dev`) funcionar offline inclusive no iPhone (iOS Safari).
  3. Criar testes `Vitest` cobrindo autenticação/cadastro separado, cálculo SRS, scoring de pronúncia, normalização/merge de nuvem e renderização dos fluxos principais, integrados ao workflow do GitHub Actions.

---

## Fase 7 (`v1.3.0`) — UI/UX Premium, SRS Científico (SM-2) & Recursos Nativos

- **SRS Científico SM-2 (`src/utils/srsEngine.ts` + `VocabReview.tsx`)**: adicionar campos `nextReviewAt`, `intervalDays`, `easeFactor` e `lapses` em `VocabCard`; 4 botões de avaliação (*Errei · <10min*, *Difícil · 1d*, *Bom · 3–6d*, *Fácil · 7–15d*) e badge real de cards vencidos hoje.
- **Tema Escuro & Acessibilidade**: variáveis de tema (`Claro`, `Escuro`, `Sistema`) persistidas por usuário; fechamento por `Escape`, foco gerenciado em modais e atalhos de teclado no `LessonPlayer` (`1–4`, `Enter`, `R`).
- **Engajamento & Notificações**: *Streak Freeze* (`🧊`, 1 proteção automática a cada 7 dias de sequência) e plugin `@capacitor/local-notifications` no Android para lembrar o aluno na hora da sua meta diária.

---

## Fase 8 (`v1.4.0`) — Novos Formatos Pedagógicos & Gestão Docente Avançada

- **Ditado Auditivo (`dictation`)**: novo tipo de passo em `LessonStep` onde o aluno digita ou ordena exatamente a frase falada pelo áudio US/UK.
- **Laboratório de Pronúncia BR (*Minimal Pairs*)**: exercícios curtos de contraste fonético (`/θ/` vs `/t/`, `-ed` final, vogais tensas/relaxadas) com análise palavra a palavra.
- **Histórias & Mini-Podcasts Multi-Vozes**: diálogos longos alternando voz americana e britânica por personagem.
- **Tarefas de Casa com Prazo (*Assignments*)**: Prof. Silas cria tarefas atribuídas a uma turma (`TURMA-A1`, `TURMA-B1`, etc.) e acompanha percentual de entrega em tempo real no `TeacherStudio`.
- **Modo Chamada ao Vivo no Tutor IA**: alternância contínua microfone ↔ voz neural automática simulando ligação telefônica em inglês.

---

## Fase 9 (`v2.0.0`) — Expansão de Conteúdo & Lançamento Oficial nas Lojas

- **Inglês 60+ Unidades**: adição de trilhas especializadas (*Business English*, *Entrevistas Tech*, *Viagem & Imigração*, *IELTS/TOEFL Prep*, *Phrasal Verbs* e *Expressões Idiomáticas*).
- **Espanhol e Francês Completos (A1–B2)**: preenchimento completo usando a arquitetura multi-idiomas existente (com exibição transparente de *"Em breve"* para idiomas ainda sem trilha completa).
- **Gerador de Unidades com IA no Estúdio**: Prof. Silas gera um esqueleto completo de lição a partir de tema + nível CEFR + tópico gramatical e publica direto na trilha.
- **Submissão Google Play Console**: envio de `release/FluentBridge-v*-playstore.aab`, preenchimento de política de privacidade, capturas e revisão fechada/produção.
