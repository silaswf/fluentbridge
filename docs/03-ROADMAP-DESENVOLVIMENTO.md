# 03 — Roadmap de Desenvolvimento até a Completude (`v2.0.0` → `v3.0.0`)

Este roadmap registra todas as entregas já concluídas do **FluentBridge Academy** (Fases 0 a 9, encerrando o marco **`v2.0.0`**) e define o próximo plano de evolução (**Fases 10 a 12 · `v2.1` → `v3.0`**) para levar a plataforma ao máximo potencial pedagógico, arquitetural e comercial.

---

## Fases Concluídas (`v1.0.0` → `v2.0.0`)

### Fase 0 — Fundação das 4 Habilidades & Experiência Busuu Base — CONCLUÍDA
- [x] Trilha visual por níveis CEFR (`A1` a `C1`) com `LearningPath.tsx` e `SkillRadar.tsx`.
- [x] Player em 8 etapas (`tip`, `listening`, `reading`, `matching`, `fill_blank`, `speaking`, `writing_builder`, `writing_free`) em `LessonPlayer.tsx`.
- [x] Glossário clicável nos textos de leitura, dicas contextuais focadas nos erros de brasileiros (*actually/currently*, *attend/assist*, *push/pull*, falsos cognatos e pronúncia BR), teste diagnóstico (`PlacementTestModal.tsx`) e certificados CEFR imprimíveis (`CertificatesView.tsx`).

### Fase 1 — Cobertura Gramatical Completa + Estrutura Multi-Idiomas — CONCLUÍDA
- [x] Expansão do currículo de Inglês para **34 unidades A1–C1** (`levelA1..C1.ts` + `grammarA1A2.ts`, `grammarB1B2.ts`, `grammarC1.ts`) baseadas integralmente no guia docente de conjugações, tempos verbais, modais, voz passiva, condicionais, *reported speech* e *question tags*.
- [x] `274` passos totais, `69` dicas contextuais, `140` flashcards de vocabulário e **Guia Gramatical SWJ (`24` tabelas)** em `TipsLibrary.tsx`.
- [x] Estrutura preparada para múltiplos idiomas (`LanguageCourse` em `languages.ts`, `languageCode` em todos os modelos e 1 unidade inicial de Espanhol A1).

### Fase 2 — Vozes Neurais `🇺🇸 US / 🇬🇧 UK` & Tutor IA Gemini — CONCLUÍDA
- [x] Motor inteligente de seleção de vozes (`pickBestNaturalVoice` em `speech.ts`) priorizando vozes `Natural / Neural / Online / Google`.
- [x] Componente `DualAudioButtons.tsx` (`🇺🇸 US`, `🇬🇧 UK` e `0.75x`) em todas as áreas de áudio do app (`LessonPlayer`, `VocabReview`, `TipsLibrary`, `AITutor` e `TeacherStudio`).
- [x] Integração Gemini (`gemini-3.8-flash` + fallback `gemini-2.5-flash`) com chave fixa embutida em `appConfig.ts`, fallback de chave própria na interface e motor conversacional offline (`aiTutorEngine.ts`).

### Fase 3 — Multiplataforma Real (Windows `.exe`, Android Assinado & Cloudflare Pages) (`v1.0.0` → `v1.0.2`) — CONCLUÍDA
- [x] Aplicativo Windows Desktop (`electron/main.cjs`, `FluentBridge.exe`).
- [x] Projeto nativo Android Capacitor 7 + keystore PKCS12 (`fluentbridge-release.jks`), build `.apk` assinado e `.aab` pronto para a Google Play Store com GitHub Actions CI/CD e Releases automáticas por tag `v*`.
- [x] Publicação oficial da versão Web em **Cloudflare Pages** (`https://fluentbridge.pages.dev`).
- [x] Google OAuth nativo no Android via `@capacitor/browser` (Chrome Custom Tabs) + `@capacitor/app` (deep link `com.fluentbridge.app://auth-callback`).

### Fase 4 — Modo de Produção Real (`Prof. Silas`) & Correção Crítica de Auth (`v1.0.3`) — CONCLUÍDA
- [x] Remoção completa de contas fictícias (`Prof. Gabriel`, `Mariana`, `Lucas`, `Sofia`), atalhos sem senha e dados demo locais e no Supabase.
- [x] Separação explícita de **Cadastro de Aluno** vs. **Cadastro de Professor** (`Código de Autorização Docente: SILAS-PROF-2026`), preservando `silaswf@gmail.com` como Admin Mestre automático.
- [x] Unificação do cliente Supabase em singleton único (`getSupabaseClient`), eliminando `"Multiple GoTrueClient instances"` e corrigindo entrada automática após redirecionamento Google OAuth.

### Fase 5 — Backend Real, Segurança, Vozes Neurais & Sync Cross-Device (`v1.1.0`) — CONCLUÍDA
- [x] **Vozes Neurais Deepgram Aura-2 na Nuvem (`cloudflare-worker/worker.js`, `speech.ts`)**: Worker `fluentbridge-api` (`https://fluentbridge-api.silaswf.workers.dev`) sintetizando MP3 humano em tempo real via Cloudflare Workers AI (`thalia` para `en-US`, `pandora` para `en-GB` britânico, `nestor`/`estrella` para `es`) com cache em CDN Edge + IndexedDB (`tts-v2:*`) e fallback Google TTS / Web Speech offline.
- [x] **Proxy Seguro Gemini (`/api/gemini-tutor`)**: `GEMINI_API_KEY` movida do bundle JS cliente para secret server-side no Cloudflare Worker (`appConfig.ts`, `aiTutorEngine.ts`), mantendo suporte opcional a chave própria no Estúdio.
- [x] **Upload & Reprodução Cross-Device de Áudios de Speaking**: gravações compactadas (`32 kbps`) com envio automático (`uploadSpeakingAudioToCloud` para bucket `fb-audio` ou fallback `audioDataUrl`) e player remoto no `TeacherStudio.tsx` (`resolveSubmissionAudioUrl`), permitindo que o **Prof. Silas ouça no PC a pronúncia gravada pelo aluno no celular**.
- [x] **Merge Granular Entity-Level + Hash de Senhas (`cloudSync.ts`, `storage.ts`)**: implementado `mergePlatformStates` (união sem sobrescrita de usuários, turmas, tópicos customizados, submissões `reviewed` > `pending`, XP/progresso) com tombstones de exclusão (`deletedUserIds`, `deletedClassIds`, `deletedTopicIds`) e hashing de senhas com salt (`fbh1:...`). *(Nota: migração opcional completa para consultas relacionais diretas em `supabase_schema.sql` permanece como evolução natural para escolas com milhares de usuários).*

### Fase 6 — Performance, Arquitetura Modular, Offline Web & Testes (`v1.2.0` → `v1.3.0`) — CONCLUÍDA
- [x] **Code-Splitting real dos Níveis CEFR & Telas (`vite.config.ts`, `App.tsx`)**: carregamento sob demanda via `React.lazy` + `<Suspense>` (`AITutor`, `VocabReview`, `TipsLibrary`, `CertificatesView`, `TeacherStudio`, `LessonPlayer`, `PlacementTestModal`) e `manualChunks` para vendors e módulos curriculares (`curriculum-a1a2`, `curriculum-b1b2`, `curriculum-c1`).
- [x] **PWA Service Worker Offline (`vite-plugin-pwa`) + `ErrorBoundary` Global (`ErrorBoundary.tsx`)**: cache offline automático para Web/PWA e proteção global contra falhas de renderização.
- [x] **Suíte Automatizada `Vitest` (`src/utils/__tests__/`)**: testes cobrindo hashing/normalização (`storage.test.ts`), merge granular e tombstones (`cloudSync.test.ts`), pontuação de pronúncia (`speech.test.ts`), algoritmo SM-2 (`srsEngine.test.ts`) e Streak Freeze (`streakEngine.test.ts`), integrados ao GitHub Actions.

### Fase 7 — UI/UX Premium, SRS Científico (SM-2), Safe Area, Whisper STT & Notificações (`v1.3.0`) — CONCLUÍDA
- [x] **Algoritmo Real de Repetição Espaçada (`SM-2` em `srsEngine.ts` + `VocabReview.tsx`)**: agendamento real com `nextReviewAt`, `intervalDays`, `easeFactor`, `repetitions` e `lapses`, fila *"Para hoje (SM-2)"* e 4 botões (*Errei · 10 min*, *Difícil*, *Bom*, *Fácil*).
- [x] **Tema Escuro (`Claro / Escuro / Automático` em `theme.ts` + `index.css`) & Atalhos de Teclado**: alternância persistida por usuário e atalhos (`1–4`, `Enter`, `R`, `Espaço`, `Escape`).
- [x] **Proteção de Ofensiva (`🧊 Streak Freeze` em `streakEngine.ts`) & Lembretes Diários (`notifications.ts`)**: 1 proteção automática a cada 7 dias seguidos (máx. 3) e agendamento nativo com `@capacitor/local-notifications` + fallback Web.
- [x] **Safe Area Android/Web + Cloud Whisper STT (`/api/stt`)**: correção de invasão da barra de status/navegação em `MainActivity.java` + `env(safe-area-inset-*)` e transcrição automática em nuvem com `@cf/openai/whisper-large-v3-turbo` eliminando o erro `network` do microfone.

---

## Fases 8 & 9 Concluídas (`v2.0.0`)

### Fase 8 — Novos Modos Pedagógicos, Admin Mestre & Chamada IA (`v2.0.0`) — CONCLUÍDA
- [x] **3 Novos Formatos no `LessonPlayer.tsx` (`11` formatos totais)**: **Ditado Auditivo (`dictation`)**, **Minimal Pairs (`minimal_pairs`)** para brasileiros com IPA e áudio lento, e **Histórias Multi-Vozes (`story`)** alternando falantes feminino/masculino e sotaques.
- [x] **Modo Chamada ao Vivo (Mãos-Livres)** no `AITutor.tsx` com detecção contínua de fala e cenários em **Inglês, Espanhol e Francês**.
- [x] **Tarefas de Casa com Prazo (`TeacherAssignment`) + Analytics da Escola**: criação no `TeacherStudio.tsx`, exibição na trilha do aluno (`LearningPath.tsx`), tombstones (`deletedAssignmentIds`) e indicadores médios por turma.
- [x] **Painel de Administrador Mestre Exclusivo (`AdminPanel.tsx`)**: controle exclusivo de `silaswf@gmail.com` com exibição/edição do **Código de Cadastro de Professor**, bloqueio/liberação de acesso com motivo, promoção de papéis, troca de turma, redefinição de senha local e exclusão de usuários.
- [x] **Correções de Dark Mode, Sidebar Recolhível & Legibilidade**: ajustes de seletores Tailwind v4 (`lg:bg-white`, `text-amber-950/85`, `.topic-tips-box`), posicionamento de Sotaque/Tema no topo da sidebar, painel direito recolhível e correção da timeline mobile.

### Fase 9 — Expansão Massiva de Conteúdo (92 Unidades) & Vozes Neurais Multi-Idiomas (`v2.0.0`) — CONCLUÍDA
- [x] **Inglês (`50` unidades A1–C1)**: `34` unidades nucleares + `16` trilhas especializadas (`enSpecialTracks.ts`: *Minimal Pairs*, *Business*, *Tech*, *Viagens*, *IELTS/TOEFL*, *Phrasal Verbs* e *Idioms*).
- [x] **Espanhol (`22` unidades A1–C1)** (`spanishCourse.ts`) e **Francês (`20` unidades A1–C1)** (`frenchCourse.ts`), totalizando **`92` unidades**, **`730` passos**, **`278` cards SM-2** e **`56` tabelas gramaticais** (`32` EN, `12` ES, `12` FR).
- [x] **Vozes Neurais para Todos os Idiomas (`cloudflare-worker/worker.js`)**: Deepgram Aura-2 masculino/feminino para EN/ES + **Gemini 2.5 Neural TTS (`gemini-2.5-flash-preview-tts`, PCM16 → WAV)** para **Francês (`fr-FR` `Aoede`/`Charon` e `fr-CA` `Kore`/`Puck`)** + Whisper Large v3 Turbo STT.
- [x] **Gerador de Unidades com IA no Estúdio**: criação assistida via `/api/gemini-tutor` direto no `TeacherStudio.tsx`.

---

## Próximo Roadmap (`v2.2.0` → `v3.0.0`)

### Fase 10 — Arquitetura Relacional, Alunos VIP, Modularização & Rate-Limit (`v2.2.0`) — CONCLUÍDA
- [x] **Schema & Sync Relacional Supabase (`supabase_schema.sql`, `cloudSync.ts`)**: suporte aos **5 idiomas (`en, es, fr, it, de`)**, colunas VIP/desvinculação em `public.profiles`, tabela `public.assignments` com políticas RLS e `syncRelationalTablesBestEffort`.
- [x] **Sistema Completo de Alunos VIP & Confirmações (`TeacherLinkModal.tsx`, `VipStudentsPanel.tsx`, `ConfirmDialog.tsx`)**: vinculação por `teacherInviteCode` (`PROF-SILAS`), tarefas individuais (`studentId`), fila de correções filtrada por professor, controle global pelo Admin Mestre e prompt obrigatório no próximo login caso o aluno seja desvinculado.
- [x] **Modularização de Hooks & Componentes**: extração de `useCloudSyncController.ts`, `Phase8StepsView.tsx` e `VipStudentsPanel.tsx`.
- [x] **Rate-Limit & Telemetria Multi-Idioma no Cloudflare Worker (`worker.js`)**: cotas por IP (`120/min` `/api/tts`, `30/min` `/api/stt` e `/api/gemini-tutor`) e `/health` reportando `version: "2.2.0"` + `supportedLanguages`.

### Fase 11 — Inteligência Pedagógica, Lazy Curricular Real & Engajamento Social (`v2.5.0`)
- [ ] **Importação Dinâmica Real dos Cursos por Idioma**: carregar `spanishCourse.ts` e `frenchCourse.ts` via `import()` apenas quando o aluno selecionar ES/FR, zerando o download de outros idiomas no boot inicial.
- [ ] **Diagnóstico de Fonemas & Histórico de Pronúncia**: salvar evolução temporal da nota de Speaking e palavras com maior taxa de erro por aluno.
- [ ] **Simulados Cronometrados (IELTS / TOEFL / DELE / DELF)** e **Ligas Semanais / Desafios entre Turmas** com notificações push e resumo semanal para o Prof. Silas.

### Fase 12 — Ecossistema Mobile/iOS & Lojas Oficiais (`v3.0.0`)
- [ ] **Publicação Oficial Google Play Store (`.aab`) + Build Nativo iOS (Xcode / TestFlight)** com Apple Sign-In e notificações push FCM/APNs.
- [ ] **Pacotes Offline Seletivos de Áudio**: botão *"Baixar áudios do nível A1/A2"* pré-populando `IndexedDB` (`tts-v3:*`) para estudo em viagens sem internet.
- [ ] **Suíte E2E Automatizada (`Playwright`)**: testes visuais automatizados de Light/Dark Mode, responsividade mobile/desktop, login e fluxo completo de lição no CI.
