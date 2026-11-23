# Changelog — FluentBridge

Registro histórico completo de versões, funcionalidades, correções de bugs, melhorias de autenticação/nuvem e builds multiplataforma do **FluentBridge Academy**.

---

## [`v2.2.0`] — 2026-11-23
### Vinculação Individual / VIP (Aluno ↔ Professor), Confirmações Obrigatórias & Fase 10
- **Sistema Completo de Alunos Individuais (VIP) & Vinculação Docente (`AuthScreen.tsx`, `TeacherLinkModal.tsx`, `VipStudentsPanel.tsx`, `AdminPanel.tsx`, `App.tsx`):**
  - **Cadastro em 3 modos para Alunos (`AuthScreen.tsx`)**: entrar por **Turma (`classId`)**, vincular-se como **Aluno VIP (`assignedTeacherId`)** usando o código individual do professor (ex.: `PROF-SILAS`), ou seguir no **Modo Autônomo (`independent`)** mediante leitura e confirmação explícita do aviso de restrição.
  - **Gestão Docente VIP (`src/components/teacher/VipStudentsPanel.tsx`)**: professores visualizam/copiam seu `teacherInviteCode`, filtram alunos (`Meus vinculados`, `Sem professor`, `Todos`), vinculam/desvinculam alunos VIP e enviam tarefas individuais (`studentId`) nos 5 idiomas (`EN/ES/FR/IT/DE`). A fila de correções (`TeacherStudio.tsx`) filtra os envios por professor responsável (enquanto o Admin Mestre visualiza tudo).
  - **Controle Global no Admin Mestre (`AdminPanel.tsx`)**: `silaswf@gmail.com` pode editar o código VIP de qualquer professor e vincular, transferir ou desvincular qualquer aluno de um professor.
  - **Desvinculação com Aviso no Próximo Login (`TeacherLinkModal.tsx`, `LearningPath.tsx`, `LessonPlayer.tsx`)**: quando um professor ou admin desvincula um aluno (`unlinkedNoticePending: true`), no próximo login o aluno é automaticamente convidado a escolher/digitar o código de um novo professor ou confirmar que deseja seguir sem professor — com aviso explícito de que envios de Speaking, Writing avaliado e tarefas VIP ficam restritos até nova vinculação.
  - **Confirmações Explícitas (`ConfirmDialog.tsx`)**: caixas de confirmação padronizadas para todas as ações sensíveis (vincular/desvincular aluno VIP, auto-desvinculação na trilha, alteração de cargo, bloqueio/liberação, exclusão de usuário, exclusão de turma e exclusão de tarefa).
- **Fase 10 Concluída (Arquitetura Relacional, Modularização & Rate-Limit Edge):**
  - **Schema & Sync Relacional (`supabase_schema.sql`, `cloudSync.ts`)**: suporte aos **5 idiomas (`en, es, fr, it, de`)**, colunas VIP (`assigned_teacher_id`, `enrollment_type`, `teacher_invite_code`, `unlinked_notice_pending`, `unlinked_by_teacher_name`), tabela `public.assignments` com RLS e `syncRelationalTablesBestEffort`.
  - **Modularização de Hooks & Componentes**: extração de `src/hooks/useCloudSyncController.ts`, `src/components/steps/Phase8StepsView.tsx` e `src/components/teacher/VipStudentsPanel.tsx`.
  - **Rate-Limit & Telemetria no Worker (`cloudflare-worker/worker.js`)**: janelas por IP (`120/min` em `/api/tts`, `30/min` em `/api/stt` e `/api/gemini-tutor`) e `/health` reportando `version: "2.2.0"` e `supportedLanguages`.
- **Qualidade Validada (`v2.2.0`):** **`19/19` testes Vitest** aprovados (`6` suítes), **`0` erros TypeScript** e **`DIST_LEAK=CLEAN`**.

---

## [`v2.1.0`] — 2026-11-23
### 5 Idiomas Completos (EN/ES/FR/IT/DE), 194 Unidades CEFR, 144 Tabelas & Vozes Neurais Gemini
- **Expansão Completa de Espanhol & Francês (`36` unidades + `28` tabelas cada):**
  - Criado o construtor compartilhado `src/data/curriculum/courseBuilder.ts` com **10 passos pedagógicos** por unidade (`2` dicas sendo 1 de gramática + 1 de pronúncia/cultura BR, `listening`, `reading` com glossário automático, `matching`, `dictation`, `fill_blank`, `story` multi-vozes, `speaking` e `writing_free`).
  - Adicionadas `14` unidades extras em `src/data/curriculum/spanishExtra.ts` (`36` unidades A1–C1, `108` cards SM-2, `28` tabelas) e `16` unidades extras em `src/data/curriculum/frenchExtra.ts` (`36` unidades A1–C1, `108` cards SM-2, `28` tabelas).
- **Novos Cursos Completos de Italiano (`it`) & Alemão (`de`) (`36` unidades + `28` tabelas cada):**
  - **Italiano** (`italianCourse.ts` + `italianExtra.ts`): `36` unidades A1–C1 (Roma, Milão, Veneza, Florença & Ticino/Suíça, *Falsi Amici*, *Congiuntivo*, *Passato Remoto*, negócios e cultura), `108` cards SM-2 e `28` tabelas gramaticais.
  - **Alemão** (`germanCourse.ts` + `germanExtra.ts`): `36` unidades A1–C1 (Berlim, Munique, Viena/DACH, *Der/Die/Das*, *Akkusativ/Dativ/Genitiv*, *TeKaMoLo*, *Wechselpräpositionen*, *Konjunktiv I/II*, *Compostos* e engenharia), `108` cards SM-2 e `28` tabelas gramaticais.
- **Vozes Neurais Gemini 2.5 + Whisper STT para Italiano e Alemão (`worker.js`, `speech.ts`):**
  - Adicionados ao Worker `fluentbridge-api`: `it-IT` (`Aoede`/`Charon`), `it-CH` (`Kore`/`Puck`), `de-DE` (`Aoede`/`Charon`) e `de-AT` (`Kore`/`Puck`) via **Gemini 2.5 Neural TTS** (`200 audio/wav`) + transcrição **Whisper** para `it` e `de` em `/api/stt`.
- **Integração Total nos 5 Idiomas (`App.tsx`, `Sidebar.tsx`, `AITutor.tsx`, `aiTutorEngine.ts`, `TeacherStudio.tsx`, `AdminPanel.tsx`, `vite.config.ts`):**
  - Seletor de **5 idiomas** em grade balanceada na Sidebar, cenários de Tutor IA para **Italiano e Alemão**, emissão de **Certificados CEFR por idioma**, novos chunks (`curriculum-it`, `curriculum-de`, `grammar-guide`) mantendo `index.js` em `124,05 kB`.
- **Totais Validados (`v2.1.0`):** **`194` unidades**, **`1.834` passos**, **`372` dicas**, **`584` flashcards SM-2** e **`144` tabelas** no Guia Gramatical (`0` erros).

---

## [`v2.0.0`] — 2026-11-23
### Fases 8 & 9 Concluídas + Painel Admin Mestre + Vozes Neurais EN/ES/FR + Correções Dark Mode/UI
- **Correções de Interface, Dark Mode, Sidebar & Legibilidade (`src/index.css`, `src/components/Sidebar.tsx`, `src/components/LearningPath.tsx`, `index.html`):**
  - Corrigidos seletores Tailwind v4 compilados (`lg:bg-white`, classes com opacidade como `text-amber-950/85`, `bg-amber-50/70`, `aside`) no modo escuro (`html.dark`), garantindo legibilidade integral nas caixas *"Dicas neste tópico"* tanto no Desktop quanto no Mobile/Android.
  - Barra lateral (`Sidebar.tsx`) agora aplica corretamente o tema escuro/claro, possui botão de recolher/expandir no Desktop (`lg:w-72` ↔ `lg:w-20`), e posiciona os controles de **Sotaque** e **Tema** logo abaixo da navegação principal (no topo, sem ficar presa no rodapé).
  - Painel lateral direito da trilha (`LearningPath.tsx`) tornou-se desdobrável (`Painel Lateral`), permitindo expandir a trilha de aprendizagem para largura total, e a linha vertical da timeline foi ocultada no mobile (`hidden sm:block`) para evitar sobreposição com os cards.
  - Atualizado `index.html` com `<meta name="mobile-web-app-capable" content="yes" />` removendo aviso depreciado no DevTools.
- **Painel de Administrador Mestre Exclusivo (`src/components/AdminPanel.tsx`, `src/App.tsx`, `src/components/AuthScreen.tsx`, `src/utils/storage.ts`, `src/utils/cloudSync.ts`):**
  - Nova aba exclusiva **`Painel Admin`** visível apenas para o Admin Mestre (`silaswf@gmail.com`).
  - Exibição explícita do **Código de Cadastro de Professor** (padrão `SILAS-PROF-2026`) com botão de cópia rápida e edição dinâmica (`state.teacherAccessCode`).
  - Controle total de usuários: **Bloquear / Liberar acesso** com motivo opcional (bloqueia login local, e-mail Supabase e retorno Google OAuth), promoção/rebaixamento `Aluno ↔ Professor`, troca de turma, redefinição de senha local, exclusão de contas e painel de saúde da nuvem e vozes.
- **Fase 8 — Novos Formatos Pedagógicos, Chamada IA & Tarefas (`LessonPlayer.tsx`, `AITutor.tsx`, `TeacherStudio.tsx`, `SkillBadge.tsx`):**
  - **3 novos tipos de passo interativo** no `LessonPlayer.tsx` (totalizando **11 tipos**): **`dictation`** (ditado auditivo com comparação normalizada e dicas), **`minimal_pairs`** (contraste fonético para brasileiros com IPA e áudio lento) e **`story`** (histórias multi-vozes alternando falantes feminino/masculino e sotaques).
  - **Modo Chamada ao Vivo (Mãos-Livres)** no `AITutor.tsx` com detecção automática de fala contínua e cenários dedicados em **Inglês, Espanhol e Francês**.
  - **Tarefas de Casa com Prazo (`TeacherAssignment`)**: criação no `TeacherStudio.tsx`, exibição na trilha do aluno (`LearningPath.tsx`), tombstones (`deletedAssignmentIds`) e **Analytics Médio da Escola**.
  - **Gerador de Unidades com IA** integrado ao `TeacherStudio.tsx` (`/api/gemini-tutor`).
- **Fase 9 — 92 Unidades Multi-Idiomas (EN/ES/FR), 56 Tabelas Gramaticais & Vozes Neurais Gemini/Aura-2:**
  - **Inglês (`50` unidades A1–C1)**: `34` unidades nucleares + `16` trilhas especializadas em `src/data/curriculum/enSpecialTracks.ts` (*Minimal Pairs*, *Business*, *Tech*, *Viagens*, *IELTS/TOEFL*, *Phrasal Verbs* e *Idioms*).
  - **Espanhol (`22` unidades A1–C1)** em `src/data/curriculum/spanishCourse.ts` + **`12` tabelas gramaticais**.
  - **Francês (`20` unidades A1–C1)** em `src/data/curriculum/frenchCourse.ts` + **`12` tabelas gramaticais**.
  - **Guia Gramatical expandido para `56` tabelas** (`32` EN + `12` ES + `12` FR) em `src/data/grammarGuide.ts`, **`278` cards SRS** e **`730` passos interativos** com `0` erros na validação curricular.
  - **Vozes Neurais de Alta Naturalidade para Todos os Idiomas (`cloudflare-worker/worker.js`, `src/utils/speech.ts`)**: adicionado suporte masculino/feminino no Deepgram Aura-2 (`en-US`, `en-GB`, `es-ES`, `es-MX`) e integrado **Gemini 2.5 Neural TTS (`gemini-2.5-flash-preview-tts`, PCM16 → WAV)** para **`fr-FR` (`Aoede`/`Charon`)** e **`fr-CA` (`Kore`/`Puck`)** com cache Edge `/v3/` + IndexedDB `tts-v3:*`.

---

## [`v1.3.0`] — 2026-11-23
### Correções Mobile (Safe Area + Whisper STT) + Fases 6 & 7 (SM-2, Dark Mode, PWA, Streak Freeze & Vitest)
- **Correção Crítica de Safe Area / Barra Superior e Navegação (`MainActivity.java`, `index.css`, `Sidebar.tsx`, `LessonPlayer.tsx`, `AuthScreen.tsx`, `PlacementTestModal.tsx`, `App.tsx`):**
  - Configurado `WindowInsetsCompat.Type.systemBars() | displayCutout() | ime()` diretamente no `MainActivity.java` (Android nativo) com contraste claro na status bar e barra de navegação, além de classes `env(safe-area-inset-*)` (`.safe-top`, `.safe-bottom`, `.safe-pt-3`, `.safe-pb-4`, `.safe-pb-nav`, `.safe-main-pb`) para iOS/PWA — impedindo invasão de botões e títulos em qualquer tamanho de tela.
- **Correção Definitiva do Erro `network` no Microfone (`worker.js`, `speech.ts`, `LessonPlayer.tsx`, `AITutor.tsx`, `App.tsx`, `cloudSync.ts`):**
  - Adicionado endpoint **`POST /api/stt`** no Cloudflare Worker `fluentbridge-api` usando **Cloudflare Workers AI (`@cf/openai/whisper-large-v3-turbo` + fallback `@cf/openai/whisper`)**.
  - Em dispositivos Android WebView, Electron ou navegadores em que a API nativa `SpeechRecognition` falha com `network`, o app agora grava e transcreve automaticamente via Whisper Cloud (`transcribeAudioBlob`), mantendo a checagem de pronúncia e o ditado do Tutor IA funcionando sem erros.
  - Hardening de envios de Speaking (`audioBlob` direto em `handleSubmitSpeaking`, fallback inline até `600 KB` em `uploadSpeakingAudioToCloud`, transcrição automática caso o aluno envie áudio direto ao professor, e timestamps reais `DD/MM HH:MM` nas submissões).
- **Fase 6 — Performance, Offline Web & Testes (`vite.config.ts`, `App.tsx`, `ErrorBoundary.tsx`, `src/utils/__tests__/`):**
  - Lazy loading (`React.lazy` + `<Suspense>`) de `AITutor`, `VocabReview`, `TipsLibrary`, `CertificatesView`, `TeacherStudio`, `LessonPlayer` e `PlacementTestModal`, mais `manualChunks` separando vendors e níveis curriculares (`curriculum-a1a2`, `curriculum-b1b2`, `curriculum-c1`).
  - Adicionado `ErrorBoundary` global e Service Worker offline (`vite-plugin-pwa` / Workbox).
  - Suíte automatizada `Vitest` (`npm test`) cobrindo `storage`, `cloudSync`, `speech`, `srsEngine` e `streakEngine`, executada também no CI do GitHub Actions.
- **Fase 7 — SRS Científico SM-2, Tema Escuro, Streak Freeze, Lembretes & Atalhos (`srsEngine.ts`, `VocabReview.tsx`, `streakEngine.ts`, `theme.ts`, `notifications.ts`, `index.css`):**
  - Algoritmo **SM-2** real (`nextReviewAt`, `intervalDays`, `easeFactor`, `repetitions`, `lapses`) com filtro *"Para hoje (SM-2)"* e 4 botões (*Errei*, *Difícil*, *Bom*, *Fácil*).
  - Alternador de tema **Claro / Escuro / Automático** (`html.dark`), **Proteção de Ofensiva (`🧊 Streak Freeze`)**, agendamento de lembretes diários (`@capacitor/local-notifications` + Web fallback) e atalhos de teclado (`1–4`, `Enter`, `R`, `Espaço`, `Escape`).

---

## [`v1.1.0`] — 2026-11-20
### Fase 5 (Sync Granular, Áudios Cross-Device & Proxy Seguro) + Vozes Neurais Deepgram Aura-2
- **Motor de Vozes Neurais em Nuvem (`cloudflare-worker/worker.js`, `src/utils/speech.ts`, `src/utils/audioDb.ts`):**
  - Criado e publicado o Cloudflare Worker **`fluentbridge-api`** (`https://fluentbridge-api.silaswf.workers.dev`) com binding **Workers AI** (`env.AI`) para geração de áudio natural MP3 em tempo real.
  - Mapeamento dedicado por idioma/sotaque: **`@cf/deepgram/aura-2-en`** voz **`thalia`** para `🇺🇸 en-US`, **`pandora`** para `🇬🇧 en-GB` (sotaque britânico autêntico) e **`@cf/deepgram/aura-2-es`** (`nestor` / `estrella`) para Espanhol, com fallback automático para Google Translate TTS (`fr` / emergencial) e Web Speech API offline.
  - Cache em duas camadas: Edge CDN no Cloudflare (`caches.default`, `max-age=604800`) + cache local permanente em IndexedDB (`tts-v2:*`) com reprodução em `HTMLAudioElement` (`preservesPitch` ativo na velocidade `0.75x`).
- **Segurança & Proxy Server-Side do Tutor IA (`src/config/appConfig.ts`, `src/utils/aiTutorEngine.ts`, `cloudflare-worker/worker.js`):**
  - Removida a chave fixa `GEMINI_API_KEY` do bundle JS do frontend e movida para `secret_text` server-side no Cloudflare Worker (`/api/gemini-tutor`), mantendo o campo de chave própria opcional no Estúdio como fallback.
  - Adicionado hashing determinístico com salt (`hashPassword` com prefixo `fbh1:...` e `verifyPassword` em `src/utils/storage.ts`, `AuthScreen.tsx` e `App.tsx`) eliminando senhas em texto plano no `localStorage` e nos snapshots da nuvem.
- **Sync Granular & Áudios de Speaking Cross-Device (`src/utils/cloudSync.ts`, `src/utils/audioRecorder.ts`, `src/types/learning.ts`, `src/components/TeacherStudio.tsx`, `src/App.tsx`):**
  - Implementado **`mergePlatformStates`** (união por entidade de `users`, `classes`, `customTopics`, `submissions`, progresso/XP/certificados máximos e prioridade para correções `reviewed` sobre `pending`) com suporte a tombstones de exclusão (`deletedUserIds`, `deletedClassIds`, `deletedTopicIds`) no bootstrap, no pull manual e antes de cada upsert em `pushStateToCloud`.
  - Gravações de Speaking otimizadas a `32 kbps` (`audioBitsPerSecond: 32000`) com envio automático em nuvem (`uploadSpeakingAudioToCloud` para bucket `fb-audio` ou fallback compacto `audioDataUrl`) e reprodução direta no Estúdio do Professor em outro dispositivo via `resolveSubmissionAudioUrl`.

---

## [`v1.0.3`] — 2026-11-19
### Modo de Produção Real (`Prof. Silas`), Separação Aluno vs. Professor & Correção Definitiva do Google OAuth
- **Correção Crítica do Login com Google (`src/utils/cloudSync.ts`, `src/App.tsx`):**
  - Substituído `buildClient` por uma única instância singleton `getSupabaseClient` (`persistSession: true`, `autoRefreshToken: true`, `detectSessionInUrl: true`), eliminando o aviso `"Multiple GoTrueClient instances detected in the same browser context"` visto no DevTools.
  - Adicionado `subscribeSupabaseAuthChanges` (`onAuthStateChange` + `getSession`) e `applySupabaseAuthUser` com controle por `ref` (`lastSupabaseAuthEmailRef`), corrigindo o bug em que o retorno do Google OAuth permanecia parado na tela de login.
  - Corrigida condição de corrida no `pullStateFromCloud` inicial para mesclar usuários remotos e locais (`mergedUsers`) sem apagar o usuário recém-autenticado pelo Google.
- **Limpeza de Dados Demo & Identidade Real (`Prof. Silas`):**
  - Removidos usuários fictícios (`Prof. Gabriel`, `Mariana Costa`, `Lucas Oliveira`, `Sofia Almeida`) e submissões demonstrativas em `src/data/lessons.ts`, `src/utils/storage.ts` (`PLATFORM_STORAGE_KEY = 'fluentbridge_platform_v3'`) e atualizado o snapshot na tabela `fb_school_state` no Supabase (`200 OK`).
  - Atualizados textos de apresentação da plataforma para **Prof. Silas** e **34 Unidades**.
- **Autenticação Estrita & Separação de Cadastros (`AuthScreen.tsx`, `Sidebar.tsx`, `appConfig.ts`, `TeacherStudio.tsx`):**
  - Removidos todos os cards de *"Acesso rápido com 1 clique"*, modal local sem senha do Google e botão *"Acessar Modo Professor (Demo)"* da barra lateral.
  - Exigida autenticação real por **E-mail + Senha** ou **Google OAuth** (bloqueando login com senha vazia para contas OAuth).
  - Separado **Cadastro de Aluno** (com código da turma) vs. **Cadastro de Professor** mediante **Código de Autorização Docente** (`DEFAULT_TEACHER_ACCESS_CODE = 'SILAS-PROF-2026'`), exibido para consulta do Admin Mestre no `TeacherStudio.tsx`.
- **Builds & Publicações Atualizadas (`v1.0.3`):**
  - Re-publicada a versão Web no **Cloudflare Pages** (`https://fluentbridge.pages.dev`, deploy `b5cbb01b-38e4-454b-a673-30754c6bf733`).
  - Recompilado `FluentBridge.exe` (Windows) e gerados no GitHub Actions (`#44662884256`) o `.apk` assinado e o `.aab` da Play Store para a Release `v1.0.3`.
- **Documentação Completa (`docs/`, `README.md`, `CHANGELOG.md`):**
  - Criada documentação estruturada completa (`01` a `07` + `README.md` + `CHANGELOG.md`) com diagnóstico, arquitetura, guias Supabase, manual, auditoria de otimizações e roadmap até `v2.0.0`.

---

## [`v1.0.2`] — 2026-11-19
### Google OAuth Nativo Android (Chrome Custom Tabs) & Publicação no Cloudflare Pages
- **Google OAuth Nativo no Android (`@capacitor/app`, `@capacitor/browser`, `AndroidManifest.xml`, `cloudSync.ts`, `App.tsx`):**
  - Instalados plugins oficiais `@capacitor/app` (`^7.1.2`) e `@capacitor/browser` (`^7.0.5`) e configurado `<intent-filter>` para `com.fluentbridge.app://auth-callback`.
  - Fluxo nativo abre Google OAuth no Chrome Custom Tabs (evitando bloqueio `disallowed_useragent` em WebView) e captura retorno via `appUrlOpen` / `getLaunchUrl` trocando `code` ou `access_token` pela sessão Supabase.
- **Publicação Oficial Web no Cloudflare Pages:**
  - Adicionados `public/_redirects` (`/* /index.html 200`), `publicar-cloudflare.bat` e scripts `cf:login` / `cf:deploy` em `package.json`.
  - Criado projeto `fluentbridge` na conta Cloudflare e publicado deploy de produção inicial (`https://fluentbridge.pages.dev`).
  - Banco Supabase inicializado (`fb_school_state` -> `201 Created`) após aplicação das permissões `GRANT`.
- **Release GitHub (`v1.0.2`):** build `#44658127346` concluído com geração do `.apk` e `.aab` atualizados.

---

## [`v1.0.1`] — 2026-11-19
### Assinatura Android de Produção, Bundle Play Store (`.aab`) & Trigger `profiles` Supabase
- **Assinatura Release Android (`keystore/`, `android/app/build.gradle`, `.github/workflows/build-android-apk.yml`):**
  - Gerada keystore PKCS12 (`keystore/fluentbridge-release.jks`, alias `fluentbridge`, RSA 2048-bit, validade `10.000` dias, protegida fora do Git no `.gitignore`), salvo backup de credenciais e hashes SHA-1/SHA-256 e configurados os 4 secrets no GitHub (`ANDROID_KEYSTORE_BASE64`, `ANDROID_KEYSTORE_PASSWORD`, `ANDROID_KEYSTORE_ALIAS`, `ANDROID_KEY_PASSWORD`).
  - Configurado `build.gradle` + workflow CI/CD para gerar `assembleRelease` (`FluentBridge-v*.apk`) e `bundleRelease` (`FluentBridge-v*-playstore.aab`), verificados criptograficamente com `jarsigner`.
  - Corrigido mapeamento de variável do secret `ANDROID_KEYSTORE_ALIAS` e limpeza de quebras de linha no decode Base64 no workflow (`#44655707040` concluído com sucesso).
- **Supabase SQL Schema (`supabase_schema.sql`, `cloudSync.ts`):**
  - Adicionado trigger automático `public.handle_new_user()` na tabela `auth.users` para criar perfis na tabela `public.profiles` e atribuir `role = 'teacher'` para `silaswf@gmail.com`.

---

## [`v1.0.0`] — 2026-11-19
### Lançamento Inicial Multiplataforma, Vozes Neurais US/UK, Gemini 3.8 Flash & GitHub Releases
- **Currículo Completo & 4 Habilidades:**
  - `34` unidades completas de Inglês A1–C1 (`levelA1..C1.ts` + módulos gramaticais `grammarA1A2.ts`, `grammarB1B2.ts`, `grammarC1.ts`) + `1` unidade inicial de Espanhol A1 (`274` passos, `69` dicas contextuais, `140` cards SRS, `24` tabelas no Guia Gramatical).
- **Vozes Neurais & Botões Duplos `🇺🇸 US` / `🇬🇧 UK`:**
  - Criado `src/components/DualAudioButtons.tsx` e motor de ranqueamento de vozes `pickBestNaturalVoice` em `src/utils/speech.ts`; atualizado todo o app (`LessonPlayer`, `VocabReview`, `TipsLibrary`, `AITutor`, `TeacherStudio`).
- **Tutor IA Gemini & Credenciais Embutidas:**
  - Atualizado modelo de IA em `src/utils/aiTutorEngine.ts` para `gemini-3.8-flash` com fallback `gemini-2.5-flash` (substituindo `gemini-2.0-flash` descontinuado) e embutidas credenciais em `src/config/appConfig.ts` mantendo campo de fallback no Estúdio.
- **Admin Mestre, Empacotamento Windows (`.exe`) & Repositório GitHub:**
  - Adicionada conta Admin Mestre (`silaswf@gmail.com`, `isMasterAdmin: true`) com painel de gestão global de usuários no `TeacherStudio.tsx`.
  - Configurado Electron (`electron/main.cjs`) + `@electron/packager` (`FluentBridge.exe`), Capacitor Android (`android/`), `gerar-apk.bat`, `publicar-versao.bat` e repositório privado `silaswf/fluentbridge` com primeira Release `v1.0.0` publicada via GitHub Actions.
- **Permissões Postgres Supabase (`supabase_schema.sql`, `cloudSync.ts`):**
  - Adicionados comandos `GRANT USAGE ON SCHEMA public` e `GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated` e tratamento amigável do erro `42501`.
