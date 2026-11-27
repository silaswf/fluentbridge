<!-- @file AGENTS.md — Constituição técnica, pedagógica e operacional do FluentBridge Academy -->

# Diretrizes Gerais e Regras Anti-Regressão — FluentBridge Academy

Este documento define as **regras obrigatórias** para qualquer alteração no **FluentBridge Academy** (frontend React/Vite, Cloudflare Worker + R2, Supabase, Electron Windows, Capacitor Android e documentação). O objetivo é garantir que novas funcionalidades **nunca quebrem** recursos existentes, testes, build ou segurança.

---

## 1. Documentação Obrigatória em Arquivos (`@file`)

- **Todo arquivo criado ou alterado** com função lógica, UI, dado estruturado, script, configuração, teste ou documentação **deve** conter cabeçalho explicativo (`@file`, `@description` e `@exports`/responsabilidades principais).
- **Segurança sintática por extensão:**
  - `.ts`, `.tsx`, `.js`, `.mjs`, `.cjs`: bloco JSDoc `/** ... */` (se houver shebang `#!/...`, manter na linha 1 e inserir logo abaixo).
  - `.html`: `<!-- ... -->` **sempre após** `<!doctype html>`.
  - `.bat`: `:: ...` **sempre após** `@echo off`.
  - `.css`: `/* ... */` no topo; `.sql`: `-- ...`; `.yml`/`.yaml`: `# ...`; `.md`: `<!-- ... -->` (após frontmatter YAML, se houver).
  - **`.json`: nunca adicionar comentários** (JSON padrão não aceita comentários).
- Consulte também [`.agents/rules/file-documentation-headers.md`](./.agents/rules/file-documentation-headers.md).

---

## 2. Paridade Multi-Idioma, Currículo & Imersão

- **Sem listas hardcoded de idiomas:** todo `<select>`, filtro ou listagem de cursos em componentes (ex.: `TeacherStudio`, `TopicCreatorTab`, `SubmissionsGradingTab`, `AdminPanel`, `Sidebar`) deve consumir `LANGUAGE_COURSES_META` de `src/data/platformDefaults.ts`.
- **Regras de Imersão (`src/utils/immersion.ts` e `src/utils/courseCohesion.ts`):**
  - Cursos padrão (base PT-BR): `A1–B1` em Português e `B2–C1` **100% no idioma-alvo** (sem boilerplate em português nos níveis B2/C1).
  - **Português PLE (`pt`)** (para falantes de Inglês): **imersão invertida** — `A1–B1` com andaime pedagógico em Inglês e `B2–C1` 100% em Português.
- **Integridade Curricular (`src/utils/__tests__/curriculum.test.ts`):**
  - Todo idioma mantém **`150` unidades** exatas (`30` por nível CEFR `A1–C1`), sendo **`147` de currículo + `3` de `idiomsSlangExpansion.ts`** — ao adicionar unidades novas, nunca ultrapassar 150 sem ajustar os testes e a distribuição `30/nível`.
  - **Zero `titlePt` duplicado** dentro do mesmo idioma; **zero `exampleEn` genérico** (`isMetaFallbackExample`); todo `exampleEn` deve conter a palavra do card (`exampleMatchesWord`).
- **Escritas Especiais & RTL:**
  - Árabe (`ar`) e Hebraico (`he`) devem manter `dir="rtl"` via `isRtlLanguage()` (`platform.ts`), toggle de *Niqqud* (`hebrewNiqqud.ts`) e etapas `script_phonics` no A1 (`unitScriptPhonics.ts`).
  - Japonês (`ja`) deve preservar o modo *100% Kana* (`japaneseKana.ts`) e *Pitch Oscilloscope*.
- **Checklist obrigatório ao adicionar um novo idioma:**
  1. `src/types/learning.ts` (`LanguageCode`), `src/data/platformDefaults.ts`, `src/data/regionalAccents.ts`, `src/utils/speech.ts`
  2. Currículo (`147` + `3` idioms = `150`), `courseLoader.ts`, `languages.ts`, `lessons.ts`, `vite.config.ts` (`manualChunks`)
  3. `grammar/<lang>GrammarGuide.ts` (`200`), `placement/placement<Lang>.ts` (`40`), `tutorScenarios<Lang>.ts` (`50`), `exams/` (`4`), `podcastEpisodes.ts` (`5`), `interactiveVideos.ts` (`3`), `grammarDrills.ts`, `gradedReaders.ts`, `inLessonLexicon.ts`
  4. `immersion.ts`, `courseCohesion.ts`, `aiTutorEngine.ts`, `communityEngine.ts`, `studyPlanEngine.ts`, `phoneticFeedback.ts`, `vocabValidation.ts`, `examScoring.ts`, `YouTubeStudyLab.tsx`, `Sidebar.tsx`
  5. `cloudflare-worker/worker.js` (`supportedLanguages` + `EXTRA_REGIONAL_TTS`), `supabase_schema.sql` (constraints `CHECK` nas 6 tabelas) e suítes `curriculum.test.ts`, `placementEngine.test.ts`, `v8Features.test.ts`, `v9Features.test.ts`.

---

## 3. Áudio Neural, Sotaques, Mídia R2 & Retenção

- **Preservar sotaques regionais:** o cliente deve enviar o código regional completo ao Worker (ex.: `pt-BR-RJ`, `it-IT-NAP`, `ar-MA`, `ja-FUK`) e o `worker.js` deve manter entrada própria em `EXTRA_REGIONAL_TTS` para todo sotaque não-padrão (atualmente **65 sotaques**).
- **Cache TTS no R2 (`tts/v6/`):** nunca gravar respostas do fallback Google TTS (`X-TTS-Fallback: true`, `Cache-Control: no-store`) no bucket R2.
- **Streaming de Vídeo & Safari/iOS:** toda entrega de mídia em `/api/media/*` (`cloudflare-worker/routes/media.js`) deve preservar suporte a **`HTTP 206 Partial Content` (`Range`)** e `Accept-Ranges: bytes`.
- **Retenção de Áudios (`audioRetention.ts`):** áudios Speaking expiram após **60 dias** no bucket `fb-audio` e `IndexedDB`, mas **transcrições, notas, rubricas e feedbacks escritos nunca podem ser apagados** na limpeza.

---

## 4. Performance, Bundle `< 500 kB` & Orçamento de Peso

- **Teto de Chunk Vite:** nenhum chunk JS em `dist/assets/` pode ultrapassar **500 kB**. Ao adicionar conteúdo ou idiomas grandes, criar regras dedicadas em `vite.config.ts` (`manualChunks`).
- **Zero avisos Rollup:** manter importações consistentes para `cloudSync.ts` e módulos compartilhados (nunca misturar `import ...` estático com `await import(...)` no mesmo alvo se gerar aviso de chunking).
- **Zero Mídia Pesada no Bundle:** nunca colocar vídeos, áudios MP3/WAV ou grandes pacotes de imagens dentro de `src/` ou `public/` — toda mídia pesada deve ficar no **Cloudflare R2** (`fluentbridge-media`) e ser carregada sob demanda.
- **Source Maps:** manter `build.sourcemap: 'hidden'` em `vite.config.ts` para não expor código-fonte publicamente nos assets servidos.

---

## 5. Modularidade & Arquitetura Limpa

- **Code-Splitting de Views:** toda view secundária em `src/App.tsx` deve usar `React.lazy()` dentro de `<Suspense fallback={<ViewSkeleton />}>`.
- **Evitar arquivos monolíticos:** ao expandir um componente ou rota existente, extrair subcomponentes focados (`src/components/lesson/`, `src/components/steps/`, `src/components/teacher/`, `cloudflare-worker/routes/`, `cloudflare-worker/lib/`) em vez de acumular > 600 linhas em um único bloco.

---

## 6. Resiliência, Offline-First & Proteção de Cotas

- **Timeouts e Fallback Offline:** toda chamada de rede para IA/STT/Tradutor/YouTube deve usar `AbortController` (ex.: `10s–15s`) e degradar com elegância para glossário/heurística local ou fila `offlineOutbox.ts` sem travar a tela.
- **Cotas Persistentes no R2 (`cloudflare-worker/lib/quotas.js`):** todo novo endpoint no Worker que consuma API paga/limitada (Gemini, Workers AI, Deepgram) deve ter **rate limit por minuto** + **cota diária no R2** e ser refletido em `/api/admin/quotas` e no `AdminPanel`.

---

## 7. UI, Acessibilidade (WCAG AA), Mobile & Segurança de Ações

- **Dark Mode & Contraste:** usar `@custom-variant dark` (`src/index.css`), evitar `text-slate-400`/`bg-white` sem variante dark e validar contraste WCAG AA no Playwright.
- **Zero Overflow Mobile (`390×844`):** todo cabeçalho, seletor de idioma e card deve usar `min-w-0` / `truncate` / `flex-wrap` para manter `scrollWidth <= innerWidth`.
- **Internacionalização (`src/utils/i18n.ts`):** `loadStoredUiLocale()` deve manter `'pt'` como fallback padrão (para não quebrar usuários BR nem testes E2E em navegadores `en-US`); todas as chaves devem existir em `pt`, `en` e `es`.
- **Confirmação Obrigatória:** qualquer exclusão (usuário, turma, tópico, tarefa), desvinculação de aluno, bloqueio ou limpeza de áudio deve exigir `ConfirmDialog`.
- **Nome de Professor & `data-testid`:** sempre usar `getTeacherDisplayName(teacher, state.teacherName)` ao exibir nomes docentes; nunca remover `data-testid` existentes usados na suíte Playwright.

---

## 8. Segurança, Segredos, Supabase & LGPD

- **Zero Segredos no Cliente:** chaves (`GEMINI_API_KEY`, `DEEPGRAM_API_KEY`, `SUPABASE_JWT_SECRET`, keystores, senhas) jamais podem aparecer em `src/` ou `public/`. O job `secret-scan` do CI deve permanecer ativo.
- **Privacidade Admin/Docente:** códigos de acesso docente (`teacherAccessCode`) e controles globais (`AdminPanel`) devem permanecer restritos ao Admin Mestre (`isMasterAdminEmail`).
- **Supabase SQL Idempotente & RLS (`supabase_schema.sql`):**
  - Toda alteração de banco deve usar `if not exists`, `drop policy if exists`, `drop constraint if exists` e ser 100% idempotente.
  - Toda tabela com dados de usuário deve ter **RLS habilitado** e ser contemplada na RPC `delete_my_account_data()` (LGPD Art. 18 — atenção ao nome exato da coluna de dono, ex.: `student_id` em `certificates`/`submissions` vs `user_id` em `student_progress`).
- **Sync Não-Destrutivo:** `mergePlatformStates` (`cloudSync.ts`) deve preservar submissões `reviewed` sobre `pending` e respeitar tombstones (`deletedUserIds`, `deletedClassIds`, `deletedTopicIds`).

---

## 9. Multiplataforma & Ambiente de Execução (Windows / PowerShell 5.1)

- **Multiplataforma:** preservar compatibilidade com Web/PWA, iOS Safari (`$0/ano`), Electron Windows (`.exe` NSIS) e Capacitor Android (`.apk`/`.aab` com `com.fluentbridge.app://auth-callback`).
- **PowerShell 5.1:** ao encadear comandos no terminal Windows, usar `; if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE };` em vez de `&&`.
- **Workspace Limpo:** nunca deixar scripts temporários de migração/automação dentro do repositório; usar a pasta de `scratch` fora do repo para scripts descartáveis.

---

## 10. Gate Obrigatório de Verificação & Checklist de Release (`vX.Y.Z`)

Antes de finalizar qualquer entrega de código:
1. `node --check` em todos os arquivos `.js`, `.mjs`, `.cjs` modificados (Worker, Electron, scripts).
2. `npx tsc --noEmit` (**0 erros**).
3. `npx vitest run src` (**100% verde**, sem pular ou relaxar asserções).
4. `npm run build` (**0 erros**, **0 avisos Rollup**, **0 chunks > 500 kB**).
5. `npx playwright test` (quando houver mudança de UI, rotas, auth, fluxos E2E ou release).

Para publicar uma nova versão (`vX.Y.Z`):
- Sincronizar versão em `package.json`, `src/config/appConfig.ts`, `public/version.json`, `cloudflare-worker/worker.js` (`/api/health`), `e2e/fluentbridge.spec.ts` (links de download), `CHANGELOG.md`, `README.md` e `docs/*`.
- Deploy do Worker (`Push-Location cloudflare-worker; npx wrangler deploy; Pop-Location`) + deploy do Pages (`npx wrangler pages deploy dist --project-name fluentbridge --branch main --commit-dirty=true`).
- Smoke-test ao vivo em `GET /api/health` e nos novos endpoints.
- Commit em `main` e criação/push da tag `vX.Y.Z`.
- **Acompanhamento Obrigatório até o Final (Deploy & GitHub Actions):**
  - **Nunca encerrar uma tarefa ou entrega** enquanto houver deploy em andamento ou workflows do GitHub Actions em `queued` / `in_progress`.
  - Acompanhar ativamente **todos** os workflows disparados (tanto o push na branch `main` quanto o push da tag `vX.Y.Z`) usando `gh run watch <run-id> --exit-status` e `gh run list --limit 5` até que **100% dos jobs concluam com `completed / success`**.
  - Caso qualquer job falhe (em `main` ou na tag), inspecionar os logs com `gh run view <run-id> --log-failed`, corrigir a causa raiz, revalidar localmente, fazer novo push e acompanhar novamente até **tudo ficar verde de ponta a ponta**.
  - Só reportar conclusão ao usuário depois de confirmar simultaneamente: (1) Worker + Pages respondendo ao vivo (`/api/health`), e (2) todos os runs do GitHub Actions concluídos com `success`.
