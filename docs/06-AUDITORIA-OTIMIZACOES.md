# 06 — Auditoria Completa do Sistema & Plano de Otimizações (`v1.0.3`)

Relatório técnico completo gerado após análise estrutural de todos os arquivos em `src/`, `electron/`, `android/`, `supabase_schema.sql` e `.github/workflows/build-android-apk.yml`, avaliando **arquitetura, segurança, desempenho, código, UI/UX, áudio/IA, conteúdo pedagógico e testabilidade**.

---

## 1. O que já está Maduro e Pronto para Uso (`v1.0.3`)

1. **Currículo Completo & Validado (`35` unidades / `274` passos / `0` erros)**:
   - Cobertura integral de `A1` a `C1` com vocabulário contextualizado, `69` dicas pensadas especificamente para brasileiros, `140` cards SRS e `24` tabelas no Guia Gramatical.
2. **Experiência Dual de Áudio Neural (`DualAudioButtons.tsx` + `speech.ts`)**:
   - Todo campo de áudio do aplicativo possui botões explícitos `🇺🇸 US` e `🇬🇧 UK` (mais `0.75x` nas áreas de escuta e tutoria), ranqueando vozes neurais/naturais e penalizando vozes robóticas antigas.
3. **Pipeline Multiplataforma Real & CI/CD Automatizado**:
   - Deploy ativo no Cloudflare Pages (`https://fluentbridge.pages.dev`), `.apk` assinado (`3,38 MB`) e `.aab` da Google Play Store (`3,19 MB`) gerados por tags `v*` com keystore PKCS12 segura via GitHub Secrets, além de `FluentBridge.exe` standalone para Windows.
4. **Autenticação Real + Cliente Supabase Singleton (`cloudSync.ts`, `AuthScreen.tsx`)**:
   - Fluxo Google OAuth funcional tanto na Web quanto em Android nativo via Chrome Custom Tabs (`@capacitor/browser` + `@capacitor/app`), separação de cadastro Aluno vs. Professor (`SILAS-PROF-2026`) e proteção automática do Admin Mestre `silaswf@gmail.com`.

---

## 2. Achados Reais no Código & Pendências Críticas

| # | Área | Achado Real Observado no Código | Impacto | Solução Recomendada |
| --- | --- | --- | --- | --- |
| **1** | **Armazenamento de Áudios do Speaking** | `audioDb.ts` grava o áudio (`Blob`) apenas no `IndexedDB` local (`fluentbridge_audio_v1`). `cloudSync.ts` ainda não faz upload dos clipes de áudio para o bucket `speaking-audios` (que já está criado no `supabase_schema.sql`). | Se o aluno gravar uma lição de Speaking pelo celular Android, o **Prof. Silas** vê no PC a transcrição e a nota automática, mas **não consegue ouvir o arquivo de áudio gravado** em outro dispositivo. | Subir o `Blob` (`audio/webm` ou `audio/mp4`) para `storage.from('speaking-audios').upload(...)` ao enviar o Speaking e gerar URL assinada (`createSignedUrl`) no `TeacherStudio`. |
| **2** | **Modelo de Sync em Snapshot Único (`fb_school_state`)** | `pushStateToCloud` grava todo o `PlatformState` (todos usuários, submissões, turmas e senhas locais) dentro de uma única linha JSONB (`school_slug = 'fluentbridge-main'`). | Dois usuários salvando quase ao mesmo tempo podem sobrescrever alterações um do outro (*last-write-wins*); além disso, todo cliente baixa o JSON com e-mails e campos `password` locais dos demais usuários. | Migrar na **Fase 5** para as 7 tabelas relacionais com **RLS** já criadas em `supabase_schema.sql` (`profiles`, `classes`, `student_progress`, `submissions`, `certificates`, `custom_topics`) e remover o campo `password` do estado compartilhado. |
| **3** | **Exposição Client-Side da `GEMINI_API_KEY`** | `src/config/appConfig.ts` armazena `DEFAULT_GEMINI_API_KEY` no bundle JS distribuído aos navegadores e ao APK. | Qualquer usuário com conhecimentos técnicos pode inspecionar o bundle Web/APK e extrair a chave Gemini para uso externo fora da escola. | Criar uma **Supabase Edge Function (`gemini-tutor`)** na Fase 5 que guarde `GEMINI_API_KEY` em secret server-side, valide JWT e imponha cota diária por aluno. |
| **4** | **Tamanho do Bundle Inicial (`1.032,37 kB` JS)** | `src/data/languages.ts` importa estaticamente todos os módulos (`levelA1..C1`, `grammarA1A2..C1`) e `src/App.tsx` importa todos os componentes pesados de forma síncrona (`TeacherStudio`, `LessonPlayer`, `AITutor`, `VocabReview`). | Aviso de chunk > 500 kB no Vite e tempo maior de boot/parse JS em smartphones Android de entrada. | Aplicar `React.lazy` + `<Suspense>` nas abas/modais e dividir os níveis B1/B2/C1 em chunks carregados sob demanda (`import('./curriculum/levelB2')`). |
| **5** | **Monolitos de Interface** | Medição real dos arquivos em `src/`: `TeacherStudio.tsx` (`1.887` linhas), `LessonPlayer.tsx` (`1.788` linhas) e `App.tsx` (`1.148` linhas). | Manutenção mais lenta, maior acoplamento entre regras de negócio e JSX e re-renderizações amplas quando estados menores mudam. | Extrair hooks (`useCloudSyncController`, `useAuthController`) e quebrar `LessonPlayer` (`src/components/steps/*`) e `TeacherStudio` (`src/components/teacher/*`) em subcomponentes coesos. |
| **6** | **Algoritmo SRS Estático (`VocabReview.tsx`)** | `VocabCard.strength` guarda apenas `'weak' \| 'medium' \| 'mastered'`, sem datas de vencimento (`nextReviewAt`) nem intervalo adaptativo. | Cards marcados como `mastered` nunca retornam em intervalos espaçados (1d → 3d → 7d → 21d) para consolidar memória de longo prazo. | Implementar algoritmo **SM-2** (ou FSRS simplificado) com `nextReviewAt`, `intervalDays`, `easeFactor` e fila diária `"Para revisar hoje"`. |
| **7** | **Ausência de `ErrorBoundary` & Testes `Vitest`** | Existe verificação estática (`tsc --noEmit`) e validação curricular (`verify_curriculum.mjs`), mas não há `ErrorBoundary` nem suíte de testes unitários/E2E (`Vitest`). | Erros de runtime inesperados em um passo de lição derrubam a tela inteira; alterações futuras em auth/sync não têm rede de regressão automatizada. | Envolver a árvore em `ErrorBoundary.tsx` e criar suíte `Vitest` cobrindo `auth`, `cloudSync`, `storage`, `speech`, `SRS` e simulação de lições. |
| **8** | **TTS Dependente das Vozes do Sistema Android** | O Android usa as vozes TTS instaladas no aparelho; em alguns celulares mais antigos ou sem pacote "Google Speech Services" atualizado, a voz `en-GB` pode soar menos natural que no Edge Desktop. | Variação na experiência sonora entre celulares diferentes dos alunos. | Oferecer na Fase 7 fallback opcional de **Áudio Neural via Nuvem** (cacheando frases das lições em Storage/R2 ou gerando via Edge Function). |
| **9** | **Cache Offline PWA & Acessibilidade** | `index.html` e `public/manifest.webmanifest` estão configurados, mas não há Service Worker (`vite-plugin-pwa`); alguns modais não respondem à tecla `Escape` nem fazem trap de foco. | Na versão Web (`fluentbridge.pages.dev`), sem Service Worker o aluno não abre lições offline no Safari/Chrome após perder sinal; navegação por teclado no Desktop fica menos fluida. | Adicionar `vite-plugin-pwa` (Workbox cache-first para assets estáticos) e atalhos de teclado/acessibilidade WCAG nos modais e player. |
| **10** | **Lacunas de Conteúdo Multi-Idioma** | `LANGUAGE_COURSES` já declara Inglês, Espanhol e Francês, mas atualmente existem `34` unidades em Inglês, `1` unidade inicial em Espanhol e `0` em Francês. | Se o aluno trocar o idioma para Francês ou avançar em Espanhol, verá trilha vazia ou com apenas 1 unidade. | Ocultar ou sinalizar idiomas com badge *"Em breve"* até terem módulo A1 completo (Fase 9), mantendo o seletor limpo para os alunos atuais de Inglês. |

---

## 3. Plano Detalhado de Otimizações & Evolução por Pilar

### A. Arquitetura & Segurança (Prioridade Alta — Fase 5)
1. **Sync Relacional Real (`supabase_schema.sql`)**: autenticado via JWT do usuário logado, separando leituras/escritas em `student_progress` (por `user_id`), `submissions` (somente aluno dono + professores), `classes` e `certificates`.
2. **Storage Real para Voz dos Alunos**: envio assíncrono do áudio gravado para `speaking-audios/${authUid}/${submissionId}.webm` com fallback local em IndexedDB quando offline.
3. **Proxy IA no Backend (`gemini-tutor`)**: protege a API key Gemini do Prof. Silas no servidor Supabase, aplica rate-limit por aluno e reduz payload enviado pelo celular.
4. **Remoção Completa de `password` do Estado JSON**: contas locais legadas migram para Supabase Auth ou usam apenas sessão autenticada.

### B. Performance & Código (Prioridade Alta — Fase 6)
1. **Divisão do Bundle Vite (`manualChunks` + `React.lazy`)**: separar `CurriculumA1`, `CurriculumA2`, `CurriculumB1B2`, `CurriculumC1` e lazy-load de `TeacherStudio` (`83 KB`), `LessonPlayer` (`73 KB`), `AITutor` e `VocabReview`, cortando o carregamento inicial em >65%.
2. **Modularização Limpa**: fatiar `App.tsx`, `LessonPlayer.tsx` e `TeacherStudio.tsx` em hooks/componentes menores sem alterar comportamento.
3. **Resiliência e Testes**: `ErrorBoundary.tsx` + `Vitest` rodando no CI do GitHub Actions antes do deploy Android/Cloudflare.

### C. UI/UX & Engajamento (Prioridade Média — Fase 7)
1. **Tema Escuro (`Claro / Escuro / Automático`)**: indispensável para alunos que estudam à noite no celular.
2. **Trilha Visual Estilo Busuu/Duolingo**: nós conectados por caminho visual, badges de conquista (`7 dias seguidos`, `Mestre da Pronúncia`, `Zero Falsos Cognatos`), *Streak Freeze* (`🧊`) automático e micro-animações de feedback.
3. **Atalhos de Teclado no Windows & Web**: `1–4` para marcar alternativa, `Enter` para avançar, `U` para áudio US, `K` para áudio UK e `Esc` para fechar modais.
4. **Notificações Locais Inteligentes (`@capacitor/local-notifications`)**: lembrete diário no horário configurado pelo aluno + aviso quando o Prof. Silas publicar correção ou tarefa.

### D. Funcionalidades Pedagógicas & Conteúdo (Diferenciais Máximos — Fases 8 & 9)
1. **Ditado Auditivo (*Listening Dictation*)**: o aluno ouve a frase (US/UK) e digita ou ordena exatamente o que escutou, treinando *linking sounds*, contrações (`gonna`, `wanna`) e reduções nativas.
2. **Laboratório de Pronúncia BR (*Minimal Pairs*)**: treinos curtos focados em `/θ/ vs /t/`, `/ð/ vs /d/`, `/ɪ/ vs /iː/`, `/æ/ vs /ɛ/` e terminações `-ed` e `-s`.
3. **Histórias Interativas & Podcasts Graduados (A1–C1)**: minisséries em episódios com diálogo multi-vozes (alternando falante US e falante UK).
4. **Tarefas & Prazos do Prof. Silas (*Assignments*)**: atribuir unidade + tarefa para uma turma específica com prazo de entrega e painel de inadimplência/conclusão.
5. **Expansão de Conteúdo**: levar Inglês de `34` para **`60+` unidades** (incluindo *Business English*, *Entrevistas em TI/Negócios*, *IELTS/TOEFL*, *Phrasal Verbs Avançados* e *Cultura & Expressões*) + trilhas completas A1–B2 para Espanhol e Francês + Gerador Assistido por IA dentro do Estúdio do Professor.
