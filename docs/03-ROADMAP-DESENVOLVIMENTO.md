# 03 — Roadmap de Desenvolvimento até a Completude (`v1.1.0` → `v2.0.0`)

Este roadmap registra as entregas já concluídas do **FluentBridge Academy** e define o plano completo de evolução técnica, pedagógica, visual, de conteúdo e de segurança para levar o aplicativo ao seu potencial máximo (equiparando e superando plataformas comerciais como Busuu e Duolingo para o ecossistema particular do **Prof. Silas**).

---

## Fases Concluídas (`v1.0.0` → `v1.1.0`)

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

---

## Roadmap Futuro — Rumo ao Potencial Máximo (`v1.2.0` → `v2.0.0`)

Os detalhes técnicos completos de implementação de cada sprint estão em [`06 - Auditoria e Otimizações`](./06-AUDITORIA-OTIMIZACOES.md) e [`07 - Plano Técnico das Próximas Fases`](./07-PLANO-FASE-8-DIFERENCIAIS.md).

### Fase 6 — Performance, Arquitetura Modular, Offline Web & Testes (`v1.2.0`) — PLANEJADA
- [ ] **Code-Splitting real dos Níveis CEFR & Telas**: quebrar os `1.032 kB` do chunk único com `React.lazy` para módulos (`TeacherStudio`, `AITutor`, `VocabReview`, `TipsLibrary`) e carregamento sob demanda de `levelB1`, `levelB2`, `levelC1`, `grammarB1B2`, `grammarC1` — meta: chunk inicial `< 280 kB`.
- [ ] **Refatoração Modular**: dividir `TeacherStudio.tsx` (`1.887` linhas), `LessonPlayer.tsx` (`1.788` linhas) e `App.tsx` (`1.148` linhas) em hooks e subcomponentes especializados (`useCloudSyncController`, `useAuthController`, steps individuais em `src/components/steps/`).
- [ ] **PWA Service Worker Offline (`vite-plugin-pwa`) + `ErrorBoundary` Global**: garantir que `https://fluentbridge.pages.dev` abra mesmo sem internet no iPhone/navegador e proteja contra falhas inesperadas de renderização.
- [ ] **Suíte Automatizada (`Vitest` + Testing Library)**: testes de regressão cobrindo Auth (Aluno vs. Professor), merge de nuvem, SRS, pontuação de pronúncia e fluxo completo de lição.

### Fase 7 — UI/UX Premium, SRS Científico (SM-2) & Notificações Nativas (`v1.3.0`) — PLANEJADA
- [ ] **Algoritmo Real de Repetição Espaçada (`SM-2 / FSRS`)**: substituir os 3 níveis estáticos (`weak`, `medium`, `mastered`) por agendamento com datas reais (`nextReviewAt`, `intervalDays`, `easeFactor`), fila de `"Revisões de Hoje"` e card com botão **"Não lembro / Difícil / Bom / Fácil"**.
- [ ] **Tema Escuro (`Claro / Escuro / Sistema`) & Acessibilidade WCAG**: suporte completo a Dark Mode, zoom móvel liberado, fechamento de modais por `Escape`, `focus-trap` e atalhos de teclado (`1–4` para opções, `Enter` para avançar, `R` para repetir áudio).
- [ ] **Trilha Serpenteada Busuu/Duolingo + *Streak Freeze* (`🧊`)**: visual mais engajante por módulos, marcos semanais, proteção automática de sequência (1 congelamento a cada 7 dias seguidos) e notificações push/locais diárias no Android (`@capacitor/local-notifications`).
- [ ] **TTS Híbrido Neural em Nuvem (Fallback de Qualidade no Android/Web)**: opção de síntese de alta fidelidade via Edge Function (Google Cloud TTS / Gemini Audio cacheado em R2/Storage) quando o celular do aluno não tiver vozes neurais instaladas localmente.

### Fase 8 — Novos Modos Pedagógicos & Ecossistema Escolar (`v1.4.0`) — PLANEJADA
- [ ] **Tarefas de Casa & Prazos (*Teacher Assignments*)**: Prof. Silas atribui unidades, redações ou desafios de speaking específicos para uma turma com data limite e acompanhamento de entregas pendentes/atrasadas.
- [ ] **Ditado Auditivo (*Listening Dictation*) & Exercícios de Ordenação de Áudio**: ouvir frases reais em velocidades `1x` e `0.75x` e digitar/montar palavra por palavra para treinar escuta fina (*connected speech*).
- [ ] **Histórias Interativas & Mini-Podcasts por Nível CEFR**: diálogos com múltiplos personagens (voz US + voz UK alternadas) e perguntas de compreensão no meio da narrativa.
- [ ] **Laboratório de Pronúncia (*Minimal Pairs* para Brasileiros)**: treino focado de sons críticos (`/θ/` vs `/t/` em *think/tink*, `/ɪ/` vs `/iː/` em *live/leave*, `-ed` final `/t/ /d/ /ɪd/`).
- [ ] **Modo Chamada ao Vivo com Tutor IA + Analytics Docente Avançado**: fluxo contínuo mãos-livres (fala → resposta falada automática) + mapa de calor mostrando em quais tópicos gramaticais cada turma erra mais.

### Fase 9 — Expansão Massiva de Conteúdo & Multi-Idiomas Completo (`v2.0.0`) — VISÃO FINAL
- [ ] **Inglês de 34 para 60+ Unidades**: trilhas temáticas extras (*Business English & Negociações*, *Viagens & Imigração Avançada*, *IELTS / TOEFL Prep*, *Phrasal Verbs na Prática*, *Inglês de Séries & Idioms*).
- [ ] **Novos Idiomas Completos (A1–B2)**: aproveitar a arquitetura já existente de `LanguageCourse` (`es`, `fr`, `de`, `it`) para preencher **Espanhol, Francês, Alemão e Italiano** completos com dicas contrastivas para falantes de português.
- [ ] **Gerador de Unidades Assistido por IA no Estúdio**: Prof. Silas informa tema, nível CEFR e foco gramatical, a IA gera rascunho completo dos 8 passos + vocabulário SRS e o professor revisa e publica em 1 minuto.
- [ ] **Publicação Oficial nas Lojas**: submissão do `.aab` assinado (`FluentBridge-playstore.aab`) na **Google Play Store** e build iOS (Xcode / Apple App Store) ou PWA otimizado para iPhone.
