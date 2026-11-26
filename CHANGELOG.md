# Changelog — FluentBridge

Registro histórico completo de versões, funcionalidades, correções de bugs, melhorias de autenticação/nuvem e builds multiplataforma do **FluentBridge Academy**.

---

## [`v9.2.0`] — 2026-11-26
### Tradutor Bidirecional por Curso (`/api/translate`) & Português como Língua Estrangeira (`pt`) com Imersão Invertida
- **Tradutor Bidirecional Adaptativo (`CourseTranslatorView.tsx`, `courseTranslator.ts`, `cloudflare-worker/routes/translate.js`):**
  - Nova aba **Tradutor** na navegação lateral (`Sidebar` + `App.tsx`) sincronizada automaticamente com o idioma ativo: traduz `PT ⇄ Idioma do Curso` nos 16 cursos padrão e **`EN ⇄ PT`** quando o curso de Português (`pt`) está selecionado.
  - Suporte a troca instantânea de direção, registro (`Natural`, `Formal`, `Informal`), transcrição fonética **IPA**, nota cultural/literal, **áudio neural TTS**, alternativas contextuais e salvamento em 1 clique do vocabulário extraído direto no deck **SM-2**.
  - Endpoint `POST /api/translate` no Cloudflare Worker com cotas R2 (`40/min`, `300/dia`), cache de histórico local (`20` entradas) e fallback offline automático via glossário do curso + `IN_LESSON_LEXICON`.
- **17º Idioma — Português como Língua Estrangeira (`pt`) com Paridade 100% e Imersão Invertida:**
  - Estruturado especificamente para falantes de **Inglês**: **A1–B1 com andaime pedagógico em Inglês** e **B2–C1 em 100% imersão em Português** (`immersion.ts`, `courseCohesion.ts`).
  - **150 unidades coesas CEFR A1–C1** (`30` por nível; `portugueseCourse.ts`, `portugueseExpansionA1B1.ts`, `portugueseExpansionB2C1.ts`, `portugueseExpansion.ts`), **`200` guias gramaticais** (`ptGrammarGuide.ts`), **`40` questões CAT** (`placementPt.ts`), **`50` cenários de Tutor IA** (`tutorScenariosPt.ts`), **`4` simulados oficiais CELPE-Bras** (`examsPortuguese.ts`, escala `0–5`), **`5` podcasts**, **`3` vídeos interativos**, drills, graded readers e **`4` sotaques neurais** (`pt-BR-SP`, `pt-BR-RJ`, `pt-BR-NE`, `pt-PT`).
  - **Totais globais `v9.2.0`:** **`17` idiomas**, **`2.550` unidades**, **`3.400` guias gramaticais**, **`680` questões CAT**, **`850` cenários IA**, **`100` simulados (`25` formatos)**, **`65` sotaques neurais**, **`85` podcasts** e **`51` vídeos interativos**.
- **Verificação:** `node --check` no Worker, `tsc --noEmit` (`0` erros), `vitest run src` (`23/23` suítes / `86/86` testes), `npm run build` (`8.83s`, `0` chunks > 500 kB), `playwright test` (`15/15` E2E incl. PT + Tradutor) e smoke-test em produção (`/api/health` e `/api/translate` `pt->en` e `en->pt`).

---

## [`v9.1.0`] — 2026-11-26
### Otimização P0/P1 da Auditoria 360°, Bundle < 500 kB, Worker Modular & Alefbet em Hebraico
- **P0 — Performance & Bundle (`vite.config.ts`, `aiTutorEngine.ts`, `speech.ts`):**
  - Fatiados os chunks `curriculum-v9-*`, `curriculum-tr/he/nb/da` (base vs. expansão) e `tutor-scenarios-*` por idioma/grupo, eliminando todos os **9 avisos de chunks > 500 kB** (maior chunk agora em `472,67 kB`).
  - Padronizadas as importações de `cloudSync.ts` em `aiTutorEngine.ts` e `speech.ts`, zerando o aviso de importação mista estática+dinâmica no Vite/Rollup.
- **P1 — Modularização (`cloudflare-worker/`, `LessonPlayer.tsx`):**
  - Extraídos `cloudflare-worker/lib/http.js` e `cloudflare-worker/routes/youtubeStudy.js` de `worker.js`, e `src/components/lesson/FillBlankStepView.tsx` de `LessonPlayer.tsx`.
- **P1 — Pedagogia & Testes (`unitScriptPhonics.ts`, `v9Features.test.ts`):**
  - Adicionado suporte automático ao **Alefbet RTL (`script_phonics`)** nas unidades A1 de Hebraico (`he`), igualando a paridade com `ru`, `ja`, `zh` e `ar`.
  - Novos testes unitários cobrindo `script_phonics` em Hebraico, `fetchYouTubeStudyPack` (mock online + fallback offline) e contrato do Worker `v9.1.0`.
- **Verificação:** `node --check` em `worker.js`/`routes`/`lib`, `tsc --noEmit` (`0` erros), `vitest run src` (`23/23` suítes / `84/84` testes verdes), `npm run build` (`7.99s` sem avisos), `playwright test` (`15/15` E2E verdes).

---

## [`v9.0.0`] — 2026-11-26
### 16 Idiomas (Turco, Hebraico RTL + Niqqud, Norueguês & Dinamarquês), 150 Unidades Coesas por Idioma (2.400 Totais), +10 Cenários IA/Idioma (800) & YouTube Study Lab
- **4 Novos Idiomas com Paridade 100% (`tr`, `he`, `nb`, `da`):**
  - **Turco (`tr`)**, **Hebraico (`he` com RTL nativo + toggle de diacríticos *Niqqud*)**, **Norueguês Bokmål (`nb`)** e **Dinamarquês (`da`)**, cada um com **150 unidades CEFR A1–C1** (`30` por nível), **200 guias gramaticais**, **40 questões CAT**, **50 cenários de Tutor IA**, **4 simulados oficiais cada** (`TÖMER`, `YAEL`, `Norskprøve`, `PD3` — `16` novos simulados, `96` totais), podcasts (`80` totais), vídeos interativos (`48` totais), drills, readers e *Script Trainer* (Alefbet completo + letras especiais turcas e nórdicas).
  - **+12 novos sotaques regionais** (`tr-IST`, `tr-ANK`, `tr-IZM`, `he-TLV`, `he-JRS`, `he-HFA`, `nb-OSL`, `nb-BGO`, `nb-TRD`, `da-CPH`, `da-AAR`, `da-ODE`), totalizando **61 sotaques neurais** no Worker `v9.0.0` e cliente.
- **Expansão Espiralada para 150 Unidades em Todos os 16 Idiomas (`2.400` Unidades Totais):**
  - Todos os **12 idiomas anteriores** (`en`, `es`, `fr`, `it`, `de`, `ru`, `ja`, `zh`, `ar`, `nl`, `af`, `sv`) expandidos de `103 → 150` unidades (`+47` unidades inéditas por idioma em `src/data/curriculum/expansionV9/`), totalizando **`2.400` unidades** (`30` por nível CEFR) com `conceptKey` e `prerequisiteConcepts` sem repetição de títulos.
  - **`+10` novos cenários de conversação IA por idioma** em `src/data/tutorScenariosV9/` (`800` cenários totais nos 16 idiomas).
- **YouTube Study Lab (`POST /api/youtube-study` + `YouTubeStudyLab.tsx`):**
  - Nova aba dentro de **Imersão → Vídeos** onde o aluno cola qualquer URL do YouTube (ou transcrição SRT/VTT/texto), gera legendas bilíngues clicáveis palavra a palavra com salvamento direto no deck SM-2, analisa **"Gramática & Uso Real"** (explicando *por que* o falante usou cada estrutura) e responde a checkpoints interativos (cota persistente de `100/dia` no R2 + modo offline).
- **Correções de Interface, Redesign Dark Sober & Qualidade:**
  - **Login & Gateway (`AuthScreen.tsx`, `AppDownloadGateway.tsx`):** redesign moderno e sóbrio em Dark Mode padrão (`#090D16`), com 4 blocos curtos de destaque e remoção de textos extensos.
  - **Trilha (`LearningPath.tsx`):** Hero Banner compacto (sem parágrafo descritivo longo e card de meta diária enxuto) para priorizar filtros CEFR e módulos logo acima da dobra.
  - **Admin, Vínculo & Resiliência:** correção do endpoint `/api/health` e contagem `/16 idiomas ativos` em `AdminPanel.tsx`, remoção de referências antigas (`194 unidades`) em `TeacherLinkModal.tsx`/`AuthScreen.tsx`, timeout `AbortController` (`12s`) em `youtubeStudy.ts` e contraste Dark Mode + trava anti-overflow mobile em `Sidebar.tsx`.
- **Documentação Consolidada:** reescrita integral do zero unificando 11 arquivos fragmentados em **5 documentos mestre** (`docs/README.md`, `01-MANUAL-COMPLETO-FUNCIONALIDADES.md`, `02-ARQUITETURA-NUVEM-E-PLATAFORMAS.md`, `03-AUDITORIA-360-E-ANALISE-DE-MERCADO.md`, `04-ROADMAP-E-EVOLUCAO.md`).
- **Verificação:** `node --check cloudflare-worker/worker.js`, `tsc --noEmit` (`0` erros), `vitest run src` (`23/23` suítes / `81/81` testes verdes), `npm run build` (`7.35s`), `playwright test` (`15/15` E2E verdes incl. Jornada 5), deploy live Worker `v9.0.0` + Pages + pré-aquecimento R2 (`24` itens).

---

## [`v8.4.0`] — 2026-11-26
### Dark Mode Híbrido, Imersão Dedicada, Hands-Free, Comunidade 2.0, Cotas R2, Vídeo Range & Correção do Nome do Professor
- **Correção de Bug (Nome do Professor):** Adicionado `teacherDisplayName` em `UserProfile` e helper `getTeacherDisplayName()` (`src/utils/teacherDisplay.ts`). Agora o nome definido em *Estúdio do Professor → Nuvem, IA & Escola* (ex.: `Silas Wagner`) é exibido corretamente no dropdown de atribuição do `AdminPanel` e em `TeacherLinkModal`, usando o nome de cadastro apenas como fallback.
- **UI/UX, Acessibilidade & iOS PWA (`Q-01`, `Q-02`, `Q-03`):**
  - `src/index.css`: `@custom-variant dark` + regras `:where(html.dark)` sem `!important` nos fundos principais (`.bg-white`, `.bg-slate-50*`, `.bg-[#F7F9FC]`) e classes semânticas `.fb-card-primary` / `.fb-card-secondary`.
  - Novo componente `EmptyStateCard.tsx` (aplicado em `LiveClassroomView` e `CommunityHub`) e pulso visual `+XP` em tempo real no topo de `LessonPlayer.tsx`.
  - Aba dedicada **Imersão (Áudio & Vídeo)** na `Sidebar` (`PT/EN/ES`), separando Imersão de **Guias & Gramática**.
  - Suporte **iOS Safari PWA ($0/ano)**: `apple-mobile-web-app-title`, `public/apple-touch-icon.svg` e card explicativo de instalação no iPhone/iPad em `AppDownloadGateway.tsx`.
- **Arquitetura & Edge Security (`Q-04`, `Q-05`, `Q-07`, `Q-13`):**
  - Extraído `src/components/teacher/SchoolSettingsTab.tsx` de `TeacherStudio.tsx` (`2.253 → 1.834` LOC).
  - `vite.config.ts` com `build.sourcemap: 'hidden'` e `'**/*.map'` em `globIgnores`; `telemetry.ts` com encaminhamento opcional para `VITE_SENTRY_DSN`.
  - `cloudflare-worker/worker.js` (`v8.4.0`): cotas diárias persistentes no R2 (`quotas/YYYY-MM-DD/...` para STT 200/dia e Gemini 250/dia), leitura `/api/telemetry` protegida em modo estrito e `scripts/prewarm-r2-tts.mjs` com suporte a `--exams` e `--limit`.
- **Pedagogia, Voz & Comunidade (`Q-08`, `Q-09`, `Q-11`):**
  - Descoberta automática de vídeos R2 (`GET /api/media/list`), streaming com HTTP `Range` (`206 Partial Content` para Safari/iOS) e sincronismo de `playbackRate` em `InteractiveVideoView.tsx`.
  - Chips de `phonemeBreakdown` nos 12 idiomas (`phoneticFeedback.ts` + `LessonPlayer.tsx`) e novo **Modo Hands-Free** em loop (`HandsFreeAudioModal.tsx` em `VocabReview.tsx`).
  - `CommunityHub.tsx`: filtro anti-spam/links/palavrões (`moderateCommunityText`), **Desafio do Mês (+80 XP)**, reações rápidas (`👏🔥💡🎯`), áudio em snippets (`DualAudioButtons`), *diff* visual e aceite de correção (`+10 XP`) e categoria *Parceiro de Estudo*.
- **Verificação:** `node --check cloudflare-worker/worker.js`, `tsc --noEmit` (0 erros), `vitest` (`22` suítes / `77` testes verdes), `playwright` (`14/14` fluxos E2E incluindo auditoria de contraste WCAG AA Light/Dark), deploy live Worker `v8.4.0` + Pages e pré-aquecimento de 18 frases no R2.

---

## [`v8.3.0`] — 2026-11-26
### Vozes Neurais Naturais em Tudo + Execução Integral do Plano 09 (P0, P1 e P2)
- **Vozes Neurais Naturais (`cloudflare-worker/worker.js` `8.3.0`, `src/utils/speech.ts`, `DualAudioButtons.tsx`, `MockExamHub.tsx`, `GradedReadersView.tsx`):**
  - Todos os **49 sotaques** (incluindo `en-US`, `en-GB`, `es-ES`, `es-MX`) elevados para **Gemini 2.5 Native Neural TTS** como Tier 1, com **Deepgram Aura-2** como Tier 2 fallback neural para EN/ES; Tier 3 (`google-tts-fallback`) nunca é salvo em R2/Edge Cache (`Cache-Control: no-store`, `X-TTS-Fallback: true`). Cache invalidado para `tts/v6/` (R2 e Edge) e `tts-v6:` (IndexedDB).
  - Desbloqueio síncrono de `Audio` (WAV silencioso) preservando gesto do usuário mesmo quando a síntese neural demora; estado de carregamento `Loader2` em `DualAudioButtons`; `speakTextAsync` corrigindo leitura contínua em `GradedReadersView`; **CELPIP** usando `en-CA` por padrão quando aplicável.
- **Funcional (`F-01…F-07`):** preferência global de sotaques regionais (`accentPreference.ts` + globo acessível também em `size="xs"`), `analyzeWritingHybrid` com IA semântica preservando intenção do aluno + fallback local, `adaptiveDifficulty` persistente com `autoShowHints` conectado, `flushProgressOutbox` ligado a lição/SRS/checkpoint, ruído ambiente com 3 intensidades + sincronismo ao Play, `deleteMyCloudAccount()` invocando `delete_my_account_data()` na LGPD, retenção expansível + notificações nativas, `TipsLibrary` organizado em *Guias & Treino* vs *Imersão* e `AITutor` com engrenagem *⚙️ Avançado* na chamada.
- **UI/UX (`U-01…U-07`):** `SettingsModal.tsx` consolidando preferências/LGPD/update/download/logout em 2 cliques; `Sidebar.tsx` enxuta no desktop, `Revisão` fixa na bottom bar mobile, remoção de `LogOut` acidental no topo mobile e fim do grid quebrado no menu *Mais*; `LearningPath.tsx` com Hero limpo, barra CEFR única sticky e persistência de módulos; `LessonPlayer.tsx` com `⚙️` mobile e etapas retráteis; `index.css` com tokens semânticos, sistema de cards (`fb-card-*`) e correção de `bg-orange-*` + `text-teal/sky/orange-800..950` no Dark Mode; `i18n.ts` com paridade 100% `PT/EN/ES`; `ViewSkeleton.tsx` e `EmptyStateCard.tsx`.
- **Segurança CI (`S-04`):** job `secret-scan` em `.github/workflows/build-android-apk.yml` bloqueando vazamentos antes do build.
- **Verificação:** `tsc --noEmit` (0 erros), `vitest` (21 suítes / 73 testes verdes), build PWA limpo e 13/13 testes E2E Playwright (Desktop + Mobile `390x844` + guarda Dark Mode).

---

## [`v8.2.1`] — 2026-11-26
### Correção: módulos "duplicados" na trilha, áudios dos simulados e sotaques regionais
- **Trilha (`src/utils/courseCohesion.ts`):** a `v8.2.0` agrupava cada nível em blocos de 5 unidades mas só tinha **3 títulos por nível**; do 4º bloco em diante o título voltava ao do 1º ("Módulo 1/2/3" reaparecendo antes do "Módulo 4"). Eram unidades **diferentes** (103 ids únicos por idioma), mas com título repetido — o que também gerava `key` duplicada no React e fazia blocos distintos abrirem/fecharem juntos. Agora há 6 temas por nível e a numeração é **sequencial e global** (`Módulo 1 … N`), sem repetições, nos 12 idiomas. `moduleIndex` e os ids de checkpoint foram preservados (progresso e checkpoints concluídos não se perdem).
- **Áudio dos simulados (`src/utils/speech.ts`):** a síntese neural de trechos longos (200–500 caracteres, típicos dos simulados) leva **11–20 s** na primeira geração, mas o cliente abortava a requisição aos **9 s** — o áudio nunca chegava (e o fallback do navegador falhava em vários idiomas). O limite agora escala com o tamanho do texto (15 s + 100 ms/caractere, máx. 70 s).
- **Sotaques regionais (`speech.ts` + `cloudflare-worker/worker.js` `8.2.1`):** o cliente colapsava os 49 códigos para o idioma base (`en-AU → en-US`, `es-AR → es-MX`, `it-IT-NAP → it-IT`…), então todos soavam iguais; agora o código regional chega intacto ao Worker. Além disso, 13 sotaques sem prompt próprio (`it-IT-MIL`, `it-IT-NAP`, `de-CH`, `de-DE-BY`, `ru-KZ`, `ja-FUK`, `zh-SG`, `ar-LB`, `ar-MA`, `ar-AE`, `nl-SR`, `af-CPT`, `sv-GBG`) ganharam configuração nativa no Worker.
- **Testes:** `src/utils/__tests__/v821Fixes.test.ts` (títulos únicos e numeração 1..N nos 12 idiomas; os 49 sotaques com configuração própria no Worker; código regional intacto; síntese longa não é abortada). **20 suítes / 64 testes** Vitest, `tsc` 0 erros.

---
## [Não lançado] — 2026-11-25
### Segurança (chave Gemini) & Documentação do Plano `v8.3`
- **Segurança:** a chave do Gemini exposta no histórico público (`919cfbb`, `fba45d4`, `26e1c90`) foi revogada pelo Google; nova chave gravada **somente** como segredo do Worker (`GEMINI_API_KEY`). Verificado: `/api/health` (`hasGeminiSecret: true`), `/api/gemini-tutor` e `/api/tts` (Gemini neural `fr-FR`/`it-IT`). Nenhuma alteração de código ou novo deploy foi necessária.
- **Docs:** novo [`docs/09-PLANO-v8.3-MELHORIAS-FUNCIONAIS-E-UI-UX.md`](./docs/09-PLANO-v8.3-MELHORIAS-FUNCIONAIS-E-UI-UX.md) (auditoria funcional, UI/UX, segurança e roadmap `v8.3 → v8.5`); `docs/04-GUIA-SUPABASE-AUTENTICACAO.md` corrigido (chave só no servidor + procedimento de rotação); `docs/03`, `docs/08`, `docs/README.md` e `README.md` atualizados com referências cruzadas.

---

## [`v8.2.0`] — 2026-11-24
### Módulos Desdobráveis, 49 Sotaques Regionais, Ruído Ambiente B1–C1, Diff Linha-a-Linha, Fila Offline Outbox, LGPD, Health Checks & Testes E2E Humanos
- **Ponto 3.1 (Arquitetura, UX Modular & Offline):**
  - **Módulos Desdobráveis (`ModuleAccordionHeader.tsx`, `LearningPath.tsx`):** apenas o módulo atual do aluno abre por padrão na trilha, reduzindo drasticamente a rolagem; botão **"Expandir todos" / "Só o módulo atual"** adicionado.
  - **Modularização do `LessonPlayer.tsx`:** extraídos `ListeningStepView.tsx`, `ReadingStepView.tsx`, `MatchingStepView.tsx` e `WritingFreeStepView.tsx`.
  - **Fila Offline *Outbox* & Pré-aquecimento R2 (`offlineOutbox.ts`, `scripts/prewarm-r2-tts.mjs`):** fila persistente IndexedDB/`localStorage` com sincronização automática ao reconectar (`online`) e botão de sync na `Sidebar`.
- **Ponto 3.2 (Segurança, LGPD & Observabilidade):**
  - **Worker `v8.2.0` (`cloudflare-worker/worker.js`):** suporte a **49 sotaques regionais**, cache `tts/v5/`, alias `/api/health` e telemetria diária persistida no Cloudflare R2.
  - **Privacidade & LGPD (`PrivacyLgpdModal.tsx`, `supabase_schema.sql` Seção 10):** exportação completa em JSON e exclusão self-service de conta/dados (`delete_my_account_data()`), além da tabela `user_quotas`.
  - **Health Checks Sintéticos (`telemetry.ts`, `AdminPanel.tsx`, `scripts/synthetic-health-check.mjs`):** botão **"Executar Health Check Ao Vivo"** no Painel Admin testando Manifesto Web, Worker `/api/health` e TTS.
- **Ponto 3.3 (Pedagogia & Retenção):**
  - **49 Sotaques Regionais (`regionalAccents.ts`, `DualAudioButtons.tsx`):** popover `+N sotaques` em todos os 12 idiomas (EN 8, ES 6, FR 4, IT 4, DE 4, RU 3, JA 3, ZH 3, AR 5, NL 3, AF 3, SV 3).
  - **Ruído Ambiente (`ambientNoiseEngine.ts`), Writing Diff (`writingDiffGrader.ts`), Dificuldade Adaptativa (`adaptiveDifficulty.ts`) & Alertas de Retenção (`retentionNotifications.ts`).**
- **Ponto 3.6 (#18, #19) & Testes Simulando Humanos:**
  - Secret `RELEASES_REPO_TOKEN` configurado no GitHub Actions para espelhamento automático em `silaswf/fluentbridge-releases`.
  - **19 suítes / 60 testes Vitest** + **13/13 testes E2E Playwright** (incluindo `e2e/human-journey.spec.ts` simulando jornadas humanas em Desktop e Mobile `390x844`).

---

## [`v8.1.0`] — 2026-11-24
### >= 10 Palavras Coesas em Todas as 1.236 Unidades, Extração de Vocabulário das Atividades, Glossário Unicode no Reading & Alinhamento Profundo das Etapas
- **Vocabulário Garantido (`>= 10` cards) em 100% das 1.236 Unidades (`inLessonLexicon.ts`, `courseCohesion.ts`):**
  - Criado o léxico complementar `IN_LESSON_LEXICON` para todos os 12 idiomas (`en`, `es`, `fr`, `it`, `de`, `ru`, `ja`, `zh`, `ar`, `nl`, `af`, `sv`), com `100%` das frases de exemplo validadas por `exampleMatchesWord`.
  - `enrichCourseCohesion` agora extrai palavras usadas em **Listening, Reading, Story, Dictation e Speaking** para a **Etapa 1 · Vocabulário da Unidade**, preserva revisão em espiral (`recycledLinks` + até 2 cards anteriores) e garante **no mínimo 10 cards** em todas as unidades (inclusive Unidade 0).
- **Conexão Real Entre Vocabulário e Atividades (`courseCohesion.ts`, `LessonPlayer.tsx`):**
  - **Matching** ampliado para `5` pares reais do vocabulário da unidade; inserção automática de um **Cloze coeso** (`Prática · Vocabulário da Unidade`) usando palavras recém-ensinadas; **Reading** com glossário expandido (até `12` termos); **Writing** com checklist cobrando uso do vocabulário da unidade; e faixa clicável **"Vocabulário da unidade em uso"** com áudio em `Listening`, `Reading` e `Story`.
- **Destaque Unicode no Reading (`LessonPlayer.tsx`):**
  - Substituído `\b` ASCII em `renderInteractivePassage` por delimitadores Unicode (`(?<![\p{L}\p{N}])` / correspondência direta CJK/Árabe com flags `giu`), habilitando destaque clicável em Japonês, Chinês, Árabe, Russo e idiomas acentuados.

---

## [`v8.0.1`] — 2026-11-24
### Preservação Garantida da Etapa 1 (Vocabulário da Unidade) Após Cloud Sync
- **Correção de hidratação (`storage.ts`, `useCloudSyncController.ts`, `App.tsx`):**
  - Corrigida condição de corrida onde o bootstrap da nuvem (Supabase) normalizava o estado com `masterVocab = []` antes do carregamento dinâmico do idioma concluir, removendo temporariamente os cards de `currentUser.vocab` e ocultando a **Etapa 1 · Vocabulário da Unidade** no `LessonPlayer`.
  - `syncUserVocab` agora preserva integralmente cards existentes quando `masterVocab` ainda está vazio ou parcial, `useCloudSyncController` usa `masterVocabRef.current` atualizado e `App.tsx` combina `loadedCourses[activeLanguage].vocab` diretamente no `courseVocab`.

---

## [`v8.0.0`] — 2026-11-24
### Contraste Reading Dark Mode, Coesão Curricular (8–10 Cards + Revisão Espiral), Alfabetos/Kanji Progressivos nas Unidades, Toggle 100% Kana, 4 Simulados DET & Podcasts/Vídeos Integrados com Checkpoints
- **Contraste Reading em Todas as Plataformas (`index.css`, `LessonPlayer.tsx`):**
  - Corrigido o fundo branco translúcido (`.bg-slate-50/90`) no Dark Mode e criadas as classes `.reading-passage-box` e `.reading-gloss-chip` garantindo leitura WCAG AA em Web, Windows e Android.
- **Coesão Pedagógica, Vocabulário Expandido (até 10 palavras) & Revisão Espiral (`courseCohesion.ts`, `courseLoader.ts`, `VocabIntroStep.tsx`):**
  - Cada unidade agora mantém `8–10` cards coesos (extraindo lacunas do Reading + até 2 cards de **Revisão Espiral** conectados a aulas anteriores), glossários interativos ampliados no Reading, pares de Matching alinhados e gaveta rápida **"Vocab"** no `LessonPlayer`.
- **Letras, Sons & Kanji Progressivo dentro das Unidades + Toggle 100% Kana (`unitScriptPhonics.ts`, `ScriptPhonicsStepView.tsx`, `japaneseKana.ts`):**
  - Etapas `script_phonics` dentro das unidades para Russo (33 letras), Árabe (28 letras + 4 formas RTL), Chinês (Hanzi + tons) e Japonês (Hiragana/Katakana + **introdução progressiva de todo novo Kanji** antes das atividades).
  - Toggle **`漢字 Padrão` / `あいう Kana`** no Japonês (`LessonPlayer`, `VocabIntroStep`, `PodcastImmersionView`, `InteractiveVideoView`).
- **4 Simulados Duolingo English Test (`examsDet.ts`, `examCatalog.ts`, `examScoring.ts`):**
  - Adicionados 4 simulados completos do **DET** com formatos *Read & Complete*, *Read & Select*, *Interactive Reading/Listening*, *Speaking* e *Writing* na escala oficial `10–160`.
- **Podcasts (`60` episódios, 10+ falas) & Vídeos (`36` clipes, 8+ falas) com Checagens no Meio + Trilha Modular estilo Busuu (`immersionExpander.ts`, `TrailCheckpointModal.tsx`, `LearningPath.tsx`):**
  - Diálogos completos com `3` checagens distribuídas durante o áudio e `2` durante o vídeo, além de agrupamento em **Módulos** e cartões de **Ponto de Verificação (+60 XP)** diretamente na trilha.

---

## [`v7.0.0`] — 2026-11-24
### Arquitetura Modular por Idioma, Cloudflare R2, Cloze SM-2, Memória IA, Treino Gramatical, Leitura Graduada, F0 Pitch, Aulas ao Vivo, Boletim PDF, CI/CD & i18n/A11y
- **Performance, Modularidade & Offline (`courseLoader.ts`, `platformDefaults.ts`, `offlineUnitPack.ts`, `vite.config.ts`):**
  - Carregamento dinâmico sob demanda por idioma (`loadLanguageCourseData`) com preservação integral do progresso SRS (`mergeLoadedLanguageVocab`).
  - Modo Offline por Unidade ("Baixar próximas 3 unidades offline") com cache em IndexedDB.
  - Componentização de `VocabIntroStep.tsx` e `ClassAnalyticsTab.tsx`.
- **Cloudflare R2, Segurança JWT & Observabilidade (`worker.js`, `wrangler.jsonc`, `telemetry.ts`, `AdminPanel.tsx`):**
  - Cache persistente de áudios TTS neurais e upload/streaming MP4 no bucket R2 `fluentbridge-media`.
  - Validação híbrida de JWT Supabase no Cloudflare Worker + endpoint `/api/telemetry` e painel de erros/R2 no `AdminPanel`.
- **Pedagogia, Retenção & Fluência (`VocabReview.tsx`, `tutorMemory.ts`, `GoalOnboardingModal.tsx`, `studyPlanEngine.ts`, `GrammarDrillLab.tsx`, `GradedReadersView.tsx`, `PitchOscilloscope.tsx`):**
  - Modo **Cloze · Lacuna** no deck SM-2 (`buildClozePrompt`), Memória Pedagógica contínua no Tutor IA (`buildPedagogicalMemoryContext`), Onboarding de Meta + Plano Semanal Automático (`generateWeeklyStudyPlan`).
  - **144 Grammar Drills** (`12` por idioma) e **12 Graded Readers** (`60` capítulos com áudio contínuo e envio ao SM-2).
  - Osciloscópio de **Pitch F0** em tempo real (`detectPitchHz`) para Mandarim e Japonês + feedback fonético palavra a palavra.
  - Suporte a streaming MP4 real via Cloudflare R2 no `InteractiveVideoView`.
- **Aulas ao Vivo, Boletim PDF, Realtime & i18n/A11y (`LiveClassroomView.tsx`, `pedagogicalReportPdf.ts`, `relationalSync.ts`, `i18n.ts`, `accessibility.ts`):**
  - Sala de Aula ao Vivo via Jitsi Meet com agenda VIP/Turma, notas de aula e gerador de tarefa pós-aula.
  - Exportação de **Boletim Pedagógico (PDF)** no Perfil/Certificados e no Estúdio do Professor.
  - Supabase Realtime para Comunidade e Aulas ao Vivo (`supabase_schema.sql` Seção 10).
  - Interface multi-idioma (`PT` / `EN` / `ES`) + escala tipográfica (`sm` / `md` / `lg` / `xl`), `:focus-visible` WCAG AA e skip-to-content.
- **CI/CD & Publicação Multiplataforma (`.github/workflows/build-android-apk.yml`, `scripts/sync-version-manifest.mjs`):**
  - Sincronização automatizada de `public/version.json`, build paralelo Android + Windows NSIS e espelhamento para `silaswf/fluentbridge-releases`.

---

## [`v6.2.1`] — 2026-11-24
### Canal Público de Distribuição (`silaswf/fluentbridge-releases`) para Downloads e Atualização In-App
- Criado o repositório público dedicado `silaswf/fluentbridge-releases` para distribuição dos instaladores oficiais (`.exe` e `.apk`), mantendo o código-fonte 100% privado em `silaswf/fluentbridge`.
- Atualizados `appConfig.ts`, `appUpdater.ts`, `public/version.json` e `electron/main.cjs` para apontar e autorizar downloads diretos via `silaswf/fluentbridge-releases`.

---

## [`v6.2.0`] — 2026-11-24
### >= 6 Vocabulários Ligados ao Tema em Todas as 1.236 Unidades, 100% dos Exemplos Contendo a Palavra-Alvo & Manifest de Atualização Sem 404
- **Validador Estrito de Exemplos (`src/utils/vocabValidation.ts`, `courseBuilder.ts`):**
  - Criado `exampleMatchesWord` + `isMetaFallbackExample` para garantir que 100% dos cards em todos os 12 idiomas possuam frases reais e naturais que utilizam explicitamente a palavra/estrutura ensinada (eliminando frases genéricas e exemplos desconexos como em `bottleneck`).
- **Expansão Completa de Vocabulário nos 12 Cursos (`enSpecialTracks.ts`, `src/data/curriculum/vocabExpansion/`):**
  - Expandidas as 16 unidades especiais de inglês (`en-sp-1` a `en-sp-16`) de 1 para 6 vocabulários por unidade e criadas as expansões dos 12 idiomas (`en`, `es`, `fr`, `it`, `de`, `ru`, `ja`, `zh`, `ar`, `nl`, `af`, `sv`), garantindo **pelo menos 6 vocabulários ligados ao tema** em cada uma das **1.236 unidades** (`>= 7.416` cards no catálogo).
- **Polimento & Atualizador Sem 404 (`LessonPlayer.tsx`, `storage.ts`, `public/version.json`, `appUpdater.ts`):**
  - Corrigido o rótulo singular/plural na Etapa 1 (`1 palavra` vs. `6 palavras`) e adicionados os dialetos padrão de `ar`, `nl`, `af` e `sv` em `normalizePlatformState`.
  - Adicionado `public/version.json` no Cloudflare Pages para verificação de versão sem erro `404` no console quando o repositório GitHub é privado.

---

## [`v6.1.0`] — 2026-11-24
### Atualizador In-App (Windows, Android & Web), Correção Definitiva do `React #300` ao Concluir Unidade, Exemplos Únicos em Todos os 3.886 Cards & Vozes Nativas nos 12 Idiomas
- **Atualizador In-App Multiplataforma (`AppUpdateModal.tsx`, `appUpdater.ts`, `electron/main.cjs`, `electron/preload.cjs`):**
  - Novo botão **"Atualizar App"** na barra lateral e no menu mobile (`Mais`) com verificação automática da última release no GitHub.
  - **Windows (Electron):** baixa automaticamente o `FluentBridge-Setup-X.Y.Z.exe` com barra de progresso ao vivo via IPC seguro e inicia o instalador sobre a versão atual.
  - **Android:** dispara a instalação do novo `.apk` assinado direto pelo app preservando os dados locais.
  - **Web (PWA):** força atualização do Service Worker, limpa caches antigos e recarrega a aplicação.
- **Correção Definitiva do `Minified React error #300` ao Finalizar Unidades (`LessonPlayer.tsx`):**
  - Movidos `lastLoggedPronunciationRef` e o `useEffect` de registro de pronúncia para antes dos retornos condicionais (`if (isCompletedScreen)` / `if (!currentStep)`), eliminando a divergência no número de hooks ao concluir qualquer unidade.
- **Exemplos Únicos e Pertinentes em Todos os 12 Cursos (`courseBuilder.ts`):**
  - Corrigido o gerador `buildLanguageVocab`, que repetia a mesma frase `exampleTarget` para todos os cards de uma unidade em `1.186` unidades (`2.548` duplicatas). Agora cada um dos `3.886` cards em `1.236` unidades recebe uma frase contextual única contendo a palavra/estrutura ensinada (validado por teste automatizado com `0` duplicatas).
- **Vozes Nativas nos 12 Idiomas & Painel de Saúde Completo (`worker.js` `v6.1.0`, `speech.ts`, `AdminPanel.tsx`):**
  - Prompts de direção em **idioma nativo** + `speechConfig.languageCode` (BCP-47) + guarda anti-alucinação no Worker `v6.1.0` e novo cache `tts-v4:` / `/v4/`, eliminando o sotaque americano no Russo e aprimorando a naturalidade nos 12 idiomas.
  - Painel **Saúde dos Serviços & Vozes Neurais** no `AdminPanel` atualizado para exibir todos os **12 idiomas** com versão ao vivo do Worker e botão **"Testar voz"** individual.

---

## [`v6.0.0`] — 2026-11-24
### Chamada de Voz IA Full-Duplex (VAD Contínuo + Prosódia), Vídeos Curtos Interativos com Legendas Clicáveis (`SM-2`), Simulados Completos (`CELPIP` + Categorias + Speaking IA/Professor + Rubrica Analítica 4 Critérios), Expressões Idiomáticas/Gírias/Registro `18+` nos 12 Idiomas & Correções Visuais
- **Correções Visuais Multiplataforma (`index.css`, `TipsLibrary.tsx`, `LessonPlayer.tsx`, `TeacherLinkModal.tsx`, `Sidebar.tsx`):**
  - **Contraste da Caixa de Atenção (`.tip-warning-box`)**: corrigido o bug no Modo Escuro onde `bg-rose-50/80` + `text-rose-900` gerava texto rosa claro ilegível sobre fundo cinza claro; agora garantido alto contraste no Web, Windows e Android em ambos os temas.
  - **Seletor de Idioma em Estudo Redesenhado (`Sidebar.tsx`)**: substituída a grade compacta de 4 colunas por um **menu suspenso (dropdown) expansível e harmonioso** com siglas/símbolos limpos (`EN`, `ES`, `FR`, `IT`, `DE`, `РУ`, `日本`, `中文`, `عربي`, `NL`, `AF`, `SV`), nome completo e nome nativo sem truncamentos.
- **Chamada de Voz IA Full-Duplex em Tempo Real (`voiceVadEngine.ts`, `AITutor.tsx`):**
  - Detecção contínua de atividade vocal (**Web Audio API VAD**) com equalizador de 12 bandas ao vivo, envio automático após pausa configurável (`700ms / 950ms / 1400ms`), suporte a interrupção da IA (**barge-in**) e **Análise de Prosódia/Entonação** por turno (`WPM`, ritmo, variação de entonação, fluência e detecção de hesitações).
- **Imersão por Vídeo Curto Interativo com Legendas Duplas Clicáveis (`InteractiveVideoView.tsx`, `interactiveVideos.ts`):**
  - **`36` clipes curtos (`3` por idioma × `12` idiomas)** estilo *FluentU / Lingopie*: clique em qualquer palavra da legenda para abrir tradução, IPA, classe gramatical, nota de uso, áudio nativo e botão **`+ Salvar no Deck SM-2`**.
- **Simulados Oficiais Mais Completos & Realistas (`MockExamHub.tsx`, `examsCelpip.ts`, `examEnrichment.ts`, `examAiGrader.ts`, `examScoring.ts`):**
  - Adicionados **4 Simulados Completos do CELPIP General** (`escala CELPIP 1–12 / CLB`, `19` exames oficiais = **`76` simulados**).
  - Todos os `76` simulados foram expandidos para **`12` questões objetivas (`4 Reading + 4 Listening + 4 Use of Language`) + Writing + Entrevista Oral (`Speaking` em 3 partes cronometradas)**, com **Filtro por Categoria** (*Prova Completa*, *Reading*, *Listening*, *Use of Language*, *Writing*, *Speaking*).
  - **Speaking nos Simulados**: gravação de áudio com transcrição Whisper STT, avaliação automática em 4 critérios orais e botão **"Enviar ao Professor"**.
  - **Rubrica Analítica IA de Redação (`/api/gemini-tutor`)**: nota detalhada em 4 critérios oficiais (*Task Achievement, Coherence & Cohesion, Lexical Resource, Grammatical Range & Accuracy*) + **reescrita automática em nível Banda C1/C2**.
- **Expressões Idiomáticas, Gírias Cotidianas & Registro `18+` nos 12 Idiomas (`idiomsSlangExpansion.ts`):**
  - **`36` novas unidades (`3` por idioma -> `103` unidades/idioma = `1.236` unidades totais)** cobrindo *Expressões Idiomáticas*, *Gírias do Dia a Dia* e *Palavrões & Expressões Chulas Comuns com Alternativas Educadas* (imersão B2 com selo `⚠️ 18+`).
- **Qualidade Validada (`v6.0.0`):** **`15` suítes / `41` testes Vitest aprovados** + **`8/8` testes Playwright E2E aprovados** + **`0` erros TypeScript**.

---

## [`v5.0.0`] — 2026-11-23
### Gateway de Download Web/Desktop/Android, Alfabetos 100% Completos, Fase 11 (72 Simulados Cronometrados Oficiais), 4 Novos Idiomas (`Árabe`, `Holandês`, `Africâner`, `Sueco` — 1.200 Unidades), Comunidade por Idioma & Suíte E2E Playwright
- **Gateway de Download & Redirecionamento Multiplataforma (`AppDownloadGateway.tsx`, `AuthScreen.tsx`, `Sidebar.tsx`, `platform.ts`):**
  - Tela inicial exclusiva na versão Web oferecendo download direto do **Aplicativo Windows (`FluentBridge-Setup-5.0.0.exe`)**, **APK Android (`FluentBridge-v5.0.0.apk`)** ou botão **"Continuar na Versão Web"** (com opção de lembrar escolha).
  - Botão persistente **"Baixar App (Win/Android)"** disponível dentro da tela de login e no menu lateral/mobile.
- **Treinador de Escrita & Traços com Alfabetos 100% Completos (`scriptTrainerData.ts`, `ScriptStrokeTrainer.tsx`):**
  - **Japonês**: todos os **46 Hiragana** (Gojūon completo), todos os **46 Katakana** e **30 Kanji** essenciais.
  - **Russo**: todas as **33 letras** do alfabeto cirílico (`А`–`Я`).
  - **Árabe**: todas as **28 letras** (`ا`–`ي`) com as **4 formas contextuais** (*Isolada, Inicial, Medial, Final*) e direção **RTL (direita para esquerda)**.
  - **Chinês Mandarim**: **40 Hanzi/radicais** + Guia Visual dos **4 Tons**.
- **Fase 11 Completa — 72 Simulados Cronometrados Oficiais (`MockExamHub.tsx`, `examCatalog.ts`, `examScoring.ts`, `exams/*.ts`):**
  - **4 simulados completos por tipo de exame** nos **12 idiomas** (`18` exames oficiais = `72` simulados): **IELTS Academic, TOEFL iBT, Cambridge First/Advanced, DELE, SIELE, DELF/DALF, TCF, CILS, CELI, Goethe-Zertifikat, TestDaF, TORFL/ТРКИ, JLPT, HSK, ALPT, NT2/CNaVT, Taaltoets Afrikaans e Swedex/TISUS**.
  - Cronômetro regressivo ao vivo, limite de 2 reproduções no Listening, Writing com rubrica e cálculo na **escala oficial real** com **Tabela Oficial de Referência CEFR** explicando cada faixa.
  - **Histórico de Pronúncia** (aba `Pronúncia` em `VocabReview.tsx`) e **Resumo Semanal da Escola** (`TeacherStudio.tsx`).
- **4 Novos Idiomas Completos com Paridade Total (`Árabe · ar` RTL, `Holandês · nl`, `Africâner · af`, `Sueco · sv`):**
  - Total da plataforma agora em **12 idiomas**: **`1.200` unidades (`100`/idioma)**, **`2.400` tabelas gramaticais (`200`/idioma)**, **`480` cenários IA (`40`/idioma)**, **`480` questões CAT (`40`/idioma)**, **`60` podcasts curtos (`5`/idioma)** e suporte nativo de voz/STT no Cloudflare Worker `v5.0.0`.
- **Comunidade por Idioma (`CommunityHub.tsx`, `communityEngine.ts`, `supabase_schema.sql` Seção 10):**
  - **Ligas Semanais** (Bronze → Diamante) ranqueadas por XP semanal no idioma ativo + **Fórum por Idioma** com categorias, pedidos de correção de frases pelos colegas (`+5 XP` por ajuda), curtidas e moderação docente.
- **Suíte E2E Automatizada (`Playwright` em `e2e/fluentbridge.spec.ts`):**
  - `7` testes E2E reais no Chromium validando Gateway de Download, login + modal in-app, troca de idioma (`ar` RTL, `nl`, `af`, `sv`), alfabetos completos, abertura de lição, simulado cronometrado e comunidade/fórum.
  - A própria suíte E2E detectou e levou à correção preventiva de um bug de ordem de hooks (`React #310`) em `App.tsx`.
- **Qualidade Validada (`v5.0.0`):** **`14` suítes / `38` testes Vitest aprovados** + **`7/7` testes Playwright E2E aprovados** + **`0` erros TypeScript**.

---

## [`v4.0.0`] — 2026-11-23
### 800 Unidades CEFR (`100`/Idioma), 1.600 Tabelas Gramaticais, 320 Cenários IA, Treinador de Escrita & Traços, Feedback Fonético, Shadowing, Caderno de Erros, Podcasts Curtos & Migração RLS Definitiva
- **Expansão Curricular Massiva para `800` Unidades (`100` por idioma × `8` idiomas, `20` por nível A1–C1 em todos os idiomas):**
  - Expansão profunda nos níveis iniciais (`A1`, `A2`, `B1`) e avançados (`B2`, `C1`) com vocabulário essencial de sobrevivência, viagens, aeroporto, hotel, farmácia/médico, supermercado, banco, moradia e carreira (`enExpansionV4.ts`, `spanishExpansionV4.ts`, `frenchExpansionV4.ts`, `italianExpansionV4.ts`, `germanExpansionV4.ts`, `russianExpansionV4.ts`, `japaneseExpansionV4.ts`, `chineseExpansionV4.ts`).
  - **`1.600` Tabelas no Guia Gramatical** (`200` por idioma) e **`320` Cenários Base no Tutor IA** (`40` por idioma + `8.000` combinações dinâmicas por unidade).
- **Treinador de Escrita & Ordem de Traços (`src/components/ScriptStrokeTrainer.tsx`, `src/data/scriptTrainerData.ts`):**
  - Canvas interativo (mouse e touch) com grade guia, marca d'água alternável, contagem de traços, dicas passo a passo e áudio nativo para **Japonês** (Hiragana, Katakana, Kanji), **Chinês Mandarim** (Hanzi + Guia Visual dos **4 Tons**) e **Russo** (Cirílico + falsos amigos visuais).
  - Integrado **duplamente**: de forma progressiva dentro da etapa `Vocabulário da Unidade` no `LessonPlayer` (`✍️ Traços`) e como aba dedicada **`Escrita & Traços`** em `TipsLibrary.tsx`.
- **Botão "Traduzir PT" em Imersão B2/C1 (`LessonPlayer.tsx`, `TipsLibrary.tsx`):**
  - Unidades, dicas e guias gramaticais B2/C1 continuam em **imersão 100% no idioma estudado** por padrão, agora com botão discreto **`🌐 Traduzir PT`** para revelar apoio em Português quando o aluno sentir dificuldade.
- **Feedback Fonético & Silábico (`src/utils/phoneticFeedback.ts`, `LessonPlayer.tsx`):**
  - Análise palavra-a-palavra e **por blocos silábicos** na etapa de Speaking, com detecção automática de armadilhas fonéticas para brasileiros nos 8 idiomas (`TH`, `-ed`, `RR`, nasais francesas, duplas italianas, `CH/Umlaut`, `Ь/Ы/Аканье`, `っ/vogais longas`, `4 tons`).
- **Modo Shadowing (`src/components/steps/ShadowingPanel.tsx`):**
  - Integrado ao Speaking no `LessonPlayer.tsx` com seletor de velocidade (`0.75x / 0.9x / 1.0x / 1.15x`), contagem regressiva `3-2-1`, gravação simultânea, comparação nativa vs. gravação do aluno e transcrição Whisper.
- **Caderno Inteligente de Erros (`src/utils/mistakeBank.ts`, `src/components/MistakeNotebookView.tsx`, `VocabReview.tsx`):**
  - Captura automática de erros em lições, ditados e montagem de frases, acessível na aba **`Caderno de Erros`** dentro de `Revisão` (sem poluir o menu lateral), com prática de reescrita, áudio e recompensa de `+10 XP` ao marcar como dominado.
- **Podcasts Curtos & Imersão Multi-Voz (`src/data/podcastEpisodes.ts`, `src/components/PodcastImmersionView.tsx`):**
  - `40` episódios curtos (`5` por idioma, A1–C1) com duas vozes neurais sincronizadas, controle de velocidade, tradução alternável, compreensão auditiva e indicação de vídeos para imersão dentro da aba **`Podcasts`** em `Central & Guia`.
- **Migração Definitiva de Segurança (RLS Relacional) & Compactação Esparsa (`supabase_schema.sql`, `src/utils/relationalSync.ts`, `src/utils/storage.ts`, `AdminPanel.tsx`):**
  - Compactação esparsa (`compactPlatformStateForStorage`) reduz o payload de vocabulário salvo no `localStorage` e Supabase JSONB em **~95%**, mantendo reidratação completa dos `2.900+` cards em memória.
  - Seção 9 de `supabase_schema.sql` adiciona `is_master_admin()`, `teaches_student()`, colunas relacionais em `student_progress` (`topic_step_progress`, `learned_vocab_ids`, `mistake_bank`) e `syncRelationalFullState`.
- **Proteção de Cota Gratuita (Ponto 4):** pacotes de download em massa offline por nível **não foram ativados** para evitar estouro das cotas gratuitas de Cloudflare Workers AI / Gemini TTS (mantendo cache `IndexedDB` sob demanda).
- **Qualidade Validada (`v4.0.0`):** **`12` suítes / `33` testes Vitest aprovados**, **`0` erros TypeScript**, **`vite build` limpo** com chunks modulares.

---

## [`v3.0.0`] — 2026-11-23
### Correção Crítica (`React #300`), Subunidades estilo Busuu, Vocabulário Progressivo, Limpeza Automática de Áudios (60d) & 3 Novos Idiomas (`Russo`, `Japonês`, `Chinês Mandarim`)
- **Correção Crítica do Crash ao Finalizar Unidade (`Minified React error #300` em `src/components/LessonPlayer.tsx`):**
  - Identificada e corrigida a violação da regra de hooks do React: o `useEffect` de atalhos de teclado estava declarado **após** os retornos condicionais `if (isCompletedScreen)` e `if (!currentStep)`, quebrando a tela de conclusão (especialmente reportado em Alemão) e impedindo o registro na trilha em alguns fluxos.
- **Unidades em Subunidades / Etapas + Progresso Salvo Dentro da Unidade (`LessonPlayer.tsx`, `LearningPath.tsx`, `App.tsx`):**
  - Toda unidade passa a exibir uma barra superior interativa de **etapas/subunidades** (`Vocabulário`, `Dicas`, `Listening`, `Reading`, `Prática`, `Speaking`, `Writing`), permitindo navegar pelas etapas já alcançadas.
  - O progresso parcial (`topicStepProgress`: `stepIdx`, `completedSteps`, `totalSteps`, `updatedAt`) é salvo continuamente e sincronizado com a nuvem — ao sair no meio da unidade, o card exibe barra de progresso e botão **"Continuar (X/Y)"**.
- **Revisão Inteligente Progressiva estilo Duolingo/Busuu (`src/utils/vocabUnlock.ts`, `VocabReview.tsx`, `LessonPlayer.tsx`):**
  - Substituído o comportamento anterior que exibia todo o vocabulário do curso desde o primeiro acesso.
  - Cada unidade agora inicia com a etapa interativa **Vocabulário da Unidade** (palavra, IPA/romanização/pinyin, tradução, frase de exemplo e áudio separado para palavra e frase), desbloqueando essas palavras na aba **Revisão (SRS)** apenas conforme o aluno as estuda (`learnedVocabIds` / `completedTopicIds`). Mantido modo opcional **"Catálogo"** para consulta.
- **Autolimpeza de Áudios a Cada 60 Dias (`src/utils/audioRetention.ts`, `useCloudSyncController.ts`, `AdminPanel.tsx`, `supabase_schema.sql`):**
  - Documentado e implementado controle automático de retenção (`60` dias) que remove apenas arquivos de áudio expirados no bucket `fb-audio` (Supabase Storage) e `IndexedDB` local, preservando **100% dos feedbacks escritos, transcrições, notas, rubricas e selos** (`audioArchived: true`). Inclui painel de métricas e limpeza manual no `AdminPanel` + função SQL `cleanup_expired_speaking_audios(60)`.
- **3 Novos Idiomas Completos (`Russo · ru`, `Japonês · ja`, `Chinês Mandarim · zh` — Total `8` Idiomas):**
  - **`50` unidades CEFR (A1–C1)** por idioma (com **imersão total B2/C1** em Russo, Japonês e Chinês), **`150` cards de vocabulário** com transliteração/Romaji/Pinyin, **`100` guias gramaticais** por idioma (`ruGrammarGuide.ts`, `jaGrammarGuide.ts`, `zhGrammarGuide.ts`), **`20` cenários de Tutor IA** por idioma e **`40` questões adaptativas CAT** no idioma-alvo (`placementRu.ts`, `placementJa.ts`, `placementZh.ts`).
  - Vozes neurais **Gemini 2.5 Neural TTS** (`ru-RU`, `ru-SPB`, `ja-JP`, `ja-KANSAI`, `zh-CN`, `zh-TW`) + **Whisper STT** no Worker `v3.0.0`, suporte Unicode/CJK em `evaluatePronunciation` (`speech.ts`) e seletor compacto de 8 idiomas em `Sidebar.tsx`.
- **Auditoria 360° & Comparativo de Mercado (`docs/08-ANALISE-COMPETITIVA-MERCADO.md`):**
  - Relatório completo de auditoria técnica e comparação competitiva frente a **Duolingo, Busuu, Babbel, Speak, Cambly, Preply e Rosetta Stone**.
- **Qualidade Validada (`v3.0.0`):** **`9` suítes / `29` testes Vitest aprovados** (`410` unidades, `800` tabelas gramaticais, `160` cenários IA, `320` questões CAT, `audioRetention`, `vocabUnlock`), **`0` erros TypeScript**, **`DIST_LEAK=CLEAN`**.

---

## [`v2.4.0`] — 2026-11-23
### Nivelamento Adaptativo (CAT) nos 5 Idiomas, Banco de 200 Questões no Idioma-Alvo (`40`/idioma) & Diagnóstico em 15 Etapas
- **Motor Adaptativo de Nivelamento (`src/utils/placementEngine.ts`, `src/components/PlacementTestModal.tsx`):**
  - Substituído o antigo questionário fixo de 10 questões em inglês por um motor de **Teste Adaptativo Computadorizado (CAT)** disponível nos **5 idiomas (`EN / ES / FR / IT / DE`)**.
  - O teste inicia no nível intermediário (`B1`) e **aumenta ou diminui o nível da próxima questão a cada acerto ou erro**, encerrando após **15 questões respondidas** para calcular o índice de competência ponderado (`1.0` a `5.0`) e recomendar com precisão o nível CEFR (`A1` a `C1`).
  - Persistência do nível recomendado por idioma (`recommendedLevelByLanguage`) no perfil do aluno e exibição na Trilha (`LearningPath.tsx`) para todos os 5 idiomas.
- **Banco de 200 Questões 100% no Idioma Estudado (`src/data/placement/*`):**
  - **`40` questões por idioma** (`8` por nível CEFR `A1, A2, B1, B2, C1` em [`placementEn.ts`](./src/data/placement/placementEn.ts), [`placementEs.ts`](./src/data/placement/placementEs.ts), [`placementFr.ts`](./src/data/placement/placementFr.ts), [`placementIt.ts`](./src/data/placement/placementIt.ts) e [`placementDe.ts`](./src/data/placement/placementDe.ts)), com enunciados, alternativas, explicações gramaticais e interface do modal escritos **100% no idioma que o aluno está estudando**.
  - Separado em chunk dedicado `placement-bank` no `vite.config.ts`, carregado sob demanda apenas ao abrir o nivelamento.
- **Instalador Windows Setup (NSIS) (`package.json`, `scripts/make-icons.mjs`):**
  - Configurado `electron-builder` (`npm run installer:build`) com geração automática do ícone 512×512 (`build/icon.png`), gerando o instalador oficial **`release/FluentBridge-Setup-2.4.0.exe`** (`91,9 MB`, com assistente de instalação, escolha de pasta, atalhos na Área de Trabalho / Menu Iniciar e desinstalador no Painel de Controle do Windows).
- **Qualidade Validada (`v2.4.0`):** **`7` suítes / `24` testes Vitest aprovados** (incluindo `placementEngine.test.ts`), **`0` erros TypeScript**, **`DIST_LEAK=CLEAN`**.

---

## [`v2.3.0`] — 2026-11-23
### 260 Unidades CEFR, Imersão Total B2/C1, 500 Guias Gramaticais & Tutor IA Dinâmico
- **Expansão Curricular para 260 Unidades (`60` EN + `50` ES + `50` FR + `50` IT + `50` DE):**
  - **Inglês (`60` unidades, `110+` dicas)**: criadas `10` novas unidades (`src/data/curriculum/enExpansion.ts`) + segunda dica de pronúncia/uso real adicionada às `16` trilhas de `enSpecialTracks.ts`.
  - **Espanhol, Francês, Italiano e Alemão (`50` unidades e `100` dicas cada)**: `14` novas unidades por idioma (`spanishExpansion.ts`, `frenchExpansion.ts`, `italianExpansion.ts`, `germanExpansion.ts`), totalizando **`10` unidades por nível CEFR (A1–C1)** em cada um dos 4 idiomas.
- **Imersão Total no Idioma Estudado a partir do Nível B2 (`src/utils/immersion.ts` + `courseBuilder.ts` + UI):**
  - Todas as unidades, dicas, perguntas, explicações, botões do player (`LessonPlayer.tsx`, `Phase8StepsView.tsx`, `LearningPath.tsx`), entradas B2/C1 do Guia Gramatical e feedbacks do Tutor IA passam a ser exibidos **100% no idioma estudado** nos níveis **B2 e C1** (`EN` em Inglês, `ES` em Espanhol, `FR` em Francês, `IT` em Italiano, `DE` em Alemão).
- **Central de Dicas & Guia Gramatical (`100+` Dicas + `100` Tabelas por Idioma = `500` Tabelas Totais):**
  - Criados `enGrammarExtra.ts`, `esGrammarExtra.ts`, `frGrammarExtra.ts`, `itGrammarExtra.ts` e `deGrammarExtra.ts` em `src/data/grammar/`, com entradas B2/C1 em imersão e separação em chunks por idioma no `vite.config.ts`.
- **Tutor de Conversação IA Dinâmico (`src/data/tutorScenarios.ts`, `aiTutorEngine.ts`, `AITutor.tsx`):**
  - **100 situações reais** (`20` por idioma, 4 por nível A1–C1) com botão **"Variação IA"** para gerar aberturas e reviravoltas inéditas ao vivo.
  - **10 Modos Dinâmicos por Unidade (`UNIT_ROLEPLAY_ANGLES`)**: qualquer uma das `260` unidades pode ser praticada em `10` ângulos distintos (`2.600` combinações) gerados ao vivo via Gemini (`generateDynamicUnitScenario`).
  - **Cenário Livre / "Surpreenda-me com IA"** (`generateCustomAIScenario`) + fallback offline multilíngue (`EN/ES/FR/IT/DE`).
- **Qualidade Validada (`v2.3.0`):** **`6` suítes / `21` testes Vitest aprovados**, **`0` erros TypeScript**, **`DIST_LEAK=CLEAN`**.

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
