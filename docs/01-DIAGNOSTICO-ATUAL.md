# 01 — Diagnóstico Atual do FluentBridge (`v1.3.0`)

Este documento apresenta o diagnóstico técnico real do código-fonte do **FluentBridge Academy** após a entrega da **Fase 5** (sync granular sem perda de dados, hash de senhas, áudios de Speaking cross-device e proxy seguro do Tutor IA) e do motor de **Vozes Neurais Deepgram Aura-2** via Cloudflare Workers AI.

---

## 1. Visão Geral da Arquitetura Atual

- **Frontend**: `React 19.0.0` + `TypeScript 5.7.3` + `Vite 6.2.0` + `Tailwind CSS v4.0.9` + `lucide-react 0.475.0`.
- **Alvos de Execução**:
  - **Web / PWA**: hospedado em `https://fluentbridge.pages.dev` (Cloudflare Pages, com `public/_redirects` e `public/manifest.webmanifest`).
  - **Edge API (`cloudflare-worker/worker.js`)**: Cloudflare Worker **`fluentbridge-api`** (`https://fluentbridge-api.silaswf.workers.dev`) provendo síntese neural (`/api/tts` via Workers AI `@cf/deepgram/aura-2-en` e `aura-2-es` + cache Edge CDN) e proxy seguro Gemini (`/api/gemini-tutor` com secret `GEMINI_API_KEY` no servidor).
  - **Android Nativo (`android/`)**: `Capacitor 7.0.1` (`@capacitor/core`, `@capacitor/android`) com plugins `@capacitor/app` (`^7.1.2`) e `@capacitor/browser` (`^7.0.5`), permissões `INTERNET`, `RECORD_AUDIO`, `MODIFY_AUDIO_SETTINGS`, deep link `com.fluentbridge.app://auth-callback`, keystore Release PKCS12 e geração de `.apk` assinado + `.aab` da Google Play Store.
  - **Windows Desktop (`electron/main.cjs`)**: `Electron 34.2.0` empacotado com `@electron/packager 18.3.6` gerando executável standalone (`release/FluentBridge-win32-x64/FluentBridge.exe`), com auto-permissão de microfone/captura de áudio.
- **Backend & IA**:
  - **Supabase (`@supabase/supabase-js 2.49.1`)**: cliente singleton (`getSupabaseClient` em `src/utils/cloudSync.ts`) com persistência de sessão (`persistSession: true`, `autoRefreshToken: true`, `detectSessionInUrl: true`), merge granular por entidade (`mergePlatformStates` + tombstones) na tabela `fb_school_state` e upload cross-device de Speaking (`uploadSpeakingAudioToCloud` / `resolveSubmissionAudioUrl`).
  - **Google Gemini (Proxy Server-Side) + Tutor Local**: `src/utils/aiTutorEngine.ts` consulta `https://fluentbridge-api.silaswf.workers.dev/api/gemini-tutor` (`gemini-3.8-flash` / fallback `gemini-2.5-flash`) sem expor chaves no bundle JS do navegador, mantendo suporte opcional a chave própria no Estúdio e motor heurístico offline.
- **Persistência Local**:
  - Estado da plataforma salvo em `localStorage` (`fluentbridge_platform_v3` via `src/utils/storage.ts`) com senhas protegidas pelo prefixo de hash `fbh1:...`.
  - Áudios gravados (`audioRecorder.ts` a `32 kbps`) e MP3s do motor neural (`tts-v2:*`) armazenados em `IndexedDB` (`fluentbridge_audio_v1`, store `clips` via `src/utils/audioDb.ts`).

---

## 2. Principais Evoluções Recentes (`v1.0.0` → `v1.0.3`)

- **`v1.0.0` — Plataforma Base + Vozes US/UK + Windows `.exe` + GitHub Actions**:
  - Currículo completo de Inglês A1–C1 (**34 unidades** + **1 unidade inicial de Espanhol**) integrado ao motor das 4 habilidades (`LessonPlayer.tsx`).
  - Componente `DualAudioButtons.tsx` com escolha explícita `🇺🇸 US` / `🇬🇧 UK` / `0.75x` em todo o app e algoritmo de priorização de vozes neurais (`speech.ts`).
  - Auth completo (cadastro com confirmação de senha + login + Google), usuário Admin Mestre `silaswf@gmail.com`, chaves fixas configuráveis em `appConfig.ts`, empacotamento `FluentBridge.exe` e criação do repositório privado `silaswf/fluentbridge`.
- **`v1.0.1` — Assinatura Android de Produção & Bundle Play Store (`.aab`)**:
  - Geração da keystore privada (`keystore/fluentbridge-release.jks`), fingerprints SHA-1/SHA-256 documentados e upload dos 4 secrets no GitHub.
  - Workflow `.github/workflows/build-android-apk.yml` atualizado para compilar `assembleRelease` (`.apk` assinado) + `bundleRelease` (`.aab` da Play Store), além de atualização do `supabase_schema.sql` com trigger `handle_new_user()` e `GRANT` para `anon`/`authenticated`.
- **`v1.0.2` — Google OAuth Nativo Android + Cloudflare Pages**:
  - Instalação de `@capacitor/app` e `@capacitor/browser`, filtro de intent `com.fluentbridge.app://auth-callback` no `AndroidManifest.xml`, fluxo Chrome Custom Tabs (`signInWithSupabaseGoogle`, `handleNativeOAuthCallbackUrl`, `registerNativeOAuthListener`) e criação do projeto `fluentbridge` no Cloudflare Pages (`https://fluentbridge.pages.dev`).
- **`v1.0.3` — Modo de Produção Real (`Prof. Silas`), Separação de Papéis & Correção do OAuth**:
  - Remoção de todos os usuários/dados fictícios de demonstração (`Prof. Gabriel`, `Mariana Costa`, `Lucas Oliveira`, `Sofia Almeida`), atalhos 1-clique sem senha e modal fake do Google.
  - Separação clara entre **Cadastro de Aluno** (código de turma opcional) e **Cadastro de Professor** (mediante `Código de Autorização Docente: SILAS-PROF-2026`, exceto Admin Mestre).
  - Correção definitiva do erro `"Multiple GoTrueClient instances detected"` e da condição de corrida entre `pullStateFromCloud` e retorno do Google OAuth em `cloudSync.ts` e `App.tsx`.
- **`v1.1.0` — Fase 5 (Sync Granular, Segurança & Speaking Cross-Device) + Deepgram Aura-2 TTS**:
  - Publicação do Cloudflare Worker `fluentbridge-api` (`https://fluentbridge-api.silaswf.workers.dev`) com síntese neural **Deepgram Aura-2** (`thalia` US, `pandora` UK, `nestor`/`estrella` ES) cacheada em CDN Edge + IndexedDB e playback suave em `HTMLAudioElement`.
  - Remoção da chave Gemini do bundle frontend (movida para `/api/gemini-tutor`), hash de senhas (`fbh1:...`), gravações `32 kbps` com upload cross-device (`uploadSpeakingAudioToCloud` / `resolveSubmissionAudioUrl`) e merge granular `mergePlatformStates` com tombstones de exclusão.

---

## 3. Inventário Completo de Funcionalidades Implementadas

1. **Autenticação & Controle de Acesso (`AuthScreen.tsx`, `cloudSync.ts`, `appConfig.ts`)**:
   - Login por E-mail + Senha (local + Supabase Auth), cadastro separado de Aluno vs. Professor e botão **Entrar com Google** (Web redirect e Android Chrome Custom Tabs).
   - Elevação automática do e-mail `silaswf@gmail.com` como **Admin Mestre** com privilégios totais de gestão.
2. **Trilha de Aprendizagem & Gamificação (`LearningPath.tsx`, `PlacementTestModal.tsx`)**:
   - **34 unidades de Inglês** distribuídas pelos 5 níveis CEFR (`7 A1`, `7 A2`, `7 B1`, `7 B2`, `6 C1`) + **1 unidade de Espanhol A1** (`getCourseTopics` / `LANGUAGE_COURSES`).
   - Teste de nivelamento diagnóstico A1–C1 (+40 XP), barra de meta diária (`10–30 min`), XP, ofensiva diária (*streak*), 3 missões diárias resgatáveis, gráfico **Radar das 4 Habilidades** (`SkillRadar.tsx`) e ranking da turma.
3. **Player Interativo em Multi-Etapas (`LessonPlayer.tsx` — 8 tipos de passo)**:
   - `tip`: explicação didática em português + fórmula afirmativa/negativa/interrogativa + exemplos com áudio US/UK.
   - `listening`: áudio contextual com controle US/UK e `0.75x`, pergunta e explicação.
   - `reading`: textos em formatos reais (`chat`, `menu`, `email`, `boarding_pass`, `article`) com glossário clicável interativo (com IPA e áudio).
   - `matching`: pares interativos idioma ↔ português com som de acerto e áudio por item.
   - `fill_blank`: conjugação e gramática em contexto com dica de verbo e feedback.
   - `speaking`: modelo com áudio US/UK + gravação real pelo microfone (`audioRecorder.ts` / `IndexedDB`) + reconhecimento de fala (`speech.ts`) e score automático + envio ao professor.
   - `writing_builder` & `writing_free`: montagem guiada de frases com distratores + escrita livre com contagem mínima de palavras, checklist dinâmico e envio para correção do professor.
4. **Vocabulário SRS & Biblioteca/Guia Gramatical (`VocabReview.tsx`, `TipsLibrary.tsx`)**:
   - **140 cards** de vocabulário (`VocabCard`) com modos Flashcard e Lista, filtros por nível CEFR / domínio (`weak`, `medium`, `mastered`) e busca instantânea.
   - **69 dicas** extraídas das lições + **Guia Completo SWJ (`24` tabelas)** em `grammarGuide.ts` cobrindo tempos verbais, modais, voz passiva, discurso indireto e question tags.
5. **Tutor de Conversação IA (`AITutor.tsx`, `aiTutorEngine.ts`)**:
   - Cenários de roleplay guiado (A1–C1) com suporte a microfone, tradução opcional por balão, correção instantânea de gramática e falsos cognatos de brasileiros, áudio US/UK/0.75x e alternância automática entre **Google Gemini** (`gemini-3.8-flash` / `gemini-2.5-flash`) e tutor offline.
6. **Certificados CEFR (`CertificatesView.tsx`, `certificatePdf.ts`)**:
   - Emissão automática por nível para alunos elegíveis ou emissão manual pelo professor, com código verificável (`FB-{NIVEL}-{XXXX}`), carga horária e impressão/PDF estilizado.
7. **Estúdio do Professor (`TeacherStudio.tsx`)**:
   - Correção de envios de Writing (editor de texto corrigido + feedback + selos) e Speaking (rubrica de clareza, entonação e ritmo + áudio modelo US/UK).
   - Criação/exclusão de turmas com códigos de convite, gestão global de usuários pelo Admin Mestre, criador de tópicos customizados multi-etapas, diagnóstico de vozes neurais do aparelho e controle de sincronização Supabase + backup JSON.

---

## 4. Métricas de Qualidade & Estado Atual do Código

- **Verificação de Tipos**: `npx tsc --noEmit` — **0 erros** (`noUnusedLocals` e `noUnusedParameters` ativos em `tsconfig.json`).
- **Integridade Curricular (`verify_curriculum.mjs`)**: **`34` unidades EN / `35` totais**, **`274` passos**, **`69` dicas**, **`15` matching**, **`15` fill_blank**, **`140` cards**, **`24` entradas no guia gramatical**, **0 erros estruturais**.
- **Distribuição Atual (`v1.0.3`)**: Web ativo em `https://fluentbridge.pages.dev`, `.apk` (`3.541.878` bytes) e `.aab` (`3.349.601` bytes) publicados no GitHub Release `v1.0.3`, e `FluentBridge.exe` (`190.557.184` bytes) compilado em `release/`.
- **Pontos de Evolução Identificados**: detalhados integralmente em [`06 - Auditoria Completa & Plano de Otimizações`](./06-AUDITORIA-OTIMIZACOES.md) e [`03 - Roadmap até a Completude`](./03-ROADMAP-DESENVOLVIMENTO.md).
