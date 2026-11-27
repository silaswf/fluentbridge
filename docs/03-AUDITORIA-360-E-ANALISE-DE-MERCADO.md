<!-- @file docs/03-AUDITORIA-360-E-ANALISE-DE-MERCADO.md — Auditoria Técnica 360° (Zero-Based) pós-v11.5.0, telemetria real do codebase, benchmark competitivo atualizado e catálogo exaustivo de 36 oportunidades de evolução (P0–P3). -->

# 03 — Auditoria 360° & Análise Competitiva de Mercado (`v11.5.0`)

**Data da Auditoria:** 27/11/2026 · **Versão Auditada:** `v11.5.0` (base) → **`v11.6.0` (todos os 6 P0 concluídos)** · **Escopo:** Auditoria zero-based pós-`v11.5.0` e entrega integral dos **6 itens P0** na **`v11.6.0`** (`17` idiomas nativos nas Trilhas Especializadas com `0` colisões, Streaming SSE no `AITutor`, split de chunks, blindagem mobile `360×800`/`390×844`, gate `@file` `376/376`, `public/_headers` CSP e CI `@v5` + job `e2e-playwright`).

> **Atualização `v11.6.0` (27/11/2026):** Todos os **6 itens marcados como `P0`** nesta auditoria (itens `#1`, `#7`, `#13`, `#23`, `#24` e `#28`) foram **implementados e validados** com `32/32` suítes Vitest (`143/143` testes), `23/23` jornadas Playwright E2E, `376/376` arquivos com `@file` e `0` chunks de dados > `400 kB`. Restam apenas os itens `P1–P3`.

---

## 1. Resumo Executivo & Scorecard 360° (`v11.5.0`)

Com a conclusão da **`v11.5.0`**, o **FluentBridge Academy** atingiu maturidade de produto completo em todas as 8 dimensões avaliadas: `17` idiomas (`2.550` unidades CEFR + `204` unidades de Trilhas Especializadas inéditas sem repetição), `364` ilustrações conceituais no R2 + `picture_choice` 2×2, `65` sotaques neurais, Replay Comparativo + Mapa de Calor fonético, `100` Simulados Oficiais Cronometrados v2 (Modo Prova Real + Redação Cronometrada + Evolução Comparativa), Multi-Tenancy Escolar com RLS + Coordenador `isSchoolAdmin` + QR/CSV/Diário de Presença, Pacotes Offline CEFR + `deltaSyncEngine.ts`, **`31/31` suítes Vitest (`130/130` testes)** e **`21/21` jornadas E2E Playwright** — tudo rodando em modo **100% gratuito (`billingEnabled: false`)** e com **`0` vulnerabilidades em dependências de produção**.

Esta nova auditoria zero-based eleva a régua: identifica gargalos emergentes de **escala arquitetural** (`App.tsx` com `2.706` LOC, `LessonPlayer.tsx` com `2.118` LOC, `5` chunks JS acima de `400 kB`), **nativização dos 11 idiomas restantes nas Trilhas Especializadas**, **IA conversacional em streaming + Writing Coach**, **CI com E2E Playwright + WCAG automatizado** e **Delta Sync como fonte primária**.

| Dimensão Auditada | Nota (`v11.5.0`) | Evolução vs `v11.0` | Diagnóstico Objetivo & Próximo Salto |
| --- | :---: | :---: | --- |
| **1. Pedagogia & Conteúdo Visual** | **9.7 / 10** | ▬ +0.0 (mais escopo) | `2.550` unid. CEFR + `204` unid. em 4 Trilhas Especializadas (0 colisões), `364` SVGs no R2, `100` Simulados v2. **Próximo salto:** nativizar os 11 idiomas restantes das trilhas, expandir para `600+` ilustrações e incluir Word Bank / Spot-the-Mistake / FSRS. |
| **2. IA, Voz & Imersão** | **9.5 / 10** | ▬ Estável | `65` sotaques neurais, Replay Comparativo, Mapa de Calor, `0.75x/1.0x/1.15x`, Memória da IA. **Próximo salto:** streaming SSE no `AITutor`, análise prosódica (WPM/entonação), Writing Coach IA nos Simulados v2 e plano semanal adaptativo. |
| **3. Multi-Tenancy, B2B & Gestão Docente** | **9.4 / 10** | ▬ Estável | Isolamento RLS `school_id`, QR Code, logo/cor, CSV, `SchoolCoordinatorPanel`, Diário de Presença, troca segura de professor. **Próximo salto:** Boletim mensal automatizado da turma (PDF/CSV), banco de provas do professor, histórico de transferências e agenda `.ics`. |
| **4. UX/UI, Acessibilidade & Mobile** | **9.4 / 10** | ▲ +0.2 | `VocabReview` 100% zero-overflow em `390×844`, Revisão Express 5 min, Modo Minimalista, Dark Mode WCAG AA. **Próximo salto:** auditoria mobile em todas as 15 telas (`360×800` e `390×844`), widget "Continuar de onde parei", Badges Showcase e modal de atalhos (`?`). |
| **5. Arquitetura & Modularização** | **8.4 / 10** | ▼ -0.2 (crescimento) | `worker.js` limpo (`293` LOC) e `0` chunks > 500 kB, mas novas features fizeram `App.tsx` chegar a **`2.706` LOC**, `LessonPlayer` a **`2.118` LOC**, `MockExamHub` a **`1.401` LOC** e `5` chunks passarem de `400 kB`. Além disso, `LearningPath.tsx` ficou sem cabeçalho `@file`. |
| **6. Segurança, Privacidade & LGPD** | **9.3 / 10** | ▲ +0.1 | `0` vulnerabilidades de produção (`npm audit --omit=dev`), RLS + `admin_audit_logs`, LGPD Art. 18, `secret-scan` CI. **Próximo salto:** CSP estrita em `public/_headers`, limpeza de `devDependencies` e validação automatizada de políticas RLS. |
| **7. Qualidade, Testes & Observabilidade** | **9.4 / 10** | ▲ +0.1 | **`31/31` suítes Vitest (`130/130`)**, **`21/21` E2E Playwright**, CI atualizado para **Node 22** com `main` e `v11.5.0` verdes. **Próximo salto:** rodar Playwright + `@axe-core` no GitHub Actions, testes React (`@testing-library/react`), testes unitários do Worker e upgrade de Actions (`@v5`). |
| **8. Performance & Offline-First** | **9.0 / 10** | ▬ Estável | `124` chunks JS (`0 > 500 kB`), Pacote Offline CEFR e `deltaSyncEngine.ts` prontos. **Próximo salto:** ativar Delta Sync como caminho primário de sync, virtualização de listas grandes (`>2.000` cards), fila offline visual com retry e cache LRU de áudios no IndexedDB. |

**Nota Geral Consolidada (`v11.5.0`):** **9.26 / 10** *(produto extremamente sólido em funcionalidade; o maior retorno de engenharia agora está em modularização profunda, CI com E2E/WCAG, streaming de IA, nativização completa das Trilhas Especializadas e Delta Sync primário).*

---

## 2. Telemetria Real Medida do Codebase (`v11.5.0`)

Medição direta executada sobre o repositório em `27/11/2026`:

- **Total geral (`src/` + `cloudflare-worker/`):** **`357` arquivos** · **`330.387` linhas**
- **Código de lógica/UI (`src/` sem `src/data/` e sem `.css` + `cloudflare-worker/`):** **`171` arquivos** · **`53.533` linhas**
- **Schema SQL (`supabase_schema.sql`):** **`967` linhas** (`14` seções idempotentes com RLS multi-tenant e auditoria)
- **Trilhas Especializadas (`src/data/specializedTracks.ts`):** **`4.449` linhas** (`279.88 kB` no chunk `specialized-tracks`)
- **Testes Automatizados:** **`31` arquivos Vitest (`130/130` testes)** + **`4` suítes E2E Playwright (`21/21` jornadas)**
- **Vulnerabilidades em Produção (`npm audit --omit=dev`):** **`0` (critical/high/moderate/low)**
- **Conformidade `@file`:** `356/357` arquivos conformes — **`1` pendência encontrada:** `src/components/LearningPath.tsx` está sem cabeçalho `@file`.

### Top 15 Maiores Arquivos de Lógica/UI (Foco de Refatoração Estrutural)

| Posição | Arquivo | Linhas (LOC) | Diagnóstico & Plano de Decomposição |
| :---: | --- | :---: | --- |
| 1 | `src/App.tsx` | **`2.706`** | Concentra estado global, auth, sync, handlers de lição/professor/admin/escola e roteamento. **Meta:** `< 750` LOC extraindo `PlatformContext` + hooks (`useAuthSession`, `useLearningActions`, `useTeacherHandlers`, `useAdminHandlers`). |
| 2 | `src/components/LessonPlayer.tsx` | **`2.118`** | Já extraiu `Speaking`, `Reading`, `Writing`, `Dictation` e `PictureChoice`, mas ainda concentra `Matching`, `Cloze`, `MinimalPairs`, `Story`, `VocabIntro` e barra de progresso. **Meta:** `< 650` LOC. |
| 3 | `src/components/LearningPath.tsx` | **`1.427`** | Trilha modular + accordions + filtros + cards de metas/missões + pendência de cabeçalho `@file`. **Meta:** `< 550` LOC via `src/components/path/`. |
| 4 | `src/components/MockExamHub.tsx` | **`1.401`** | Cresceu com Simulados v2 (Modo Prova Real, cronômetro Writing, Speaking 3 partes, resultado). **Meta:** `< 550` LOC extraindo `ExamRunnerView`, `ExamWritingSection` e `ExamCatalogView` em `src/components/exams/`. |
| 5 | `src/components/AITutor.tsx` | **`1.183`** | Chat + Modo Chamada + VAD + cenários + Memória da IA. **Meta:** `< 500` LOC extraindo `VoiceCallOverlay`, `ScenarioPicker` e `TutorMemoryDrawer`. |
| 6 | `src/components/AdminPanel.tsx` | **`1.182`** | Já extraiu 3 painéis, mas ainda concentra gestão de usuários, código docente e vozes neurais. **Meta:** `< 500` LOC em `src/components/admin/`. |
| 7 | `src/utils/japaneseKana.ts` | **`1.109`** | Dicionário Kanji→Kana (já isolado em chunk lazy `42.41 kB` — baixo risco, manter isolado). |
| 8 | `src/components/TeacherStudio.tsx` | **`1.029`** | Falta extrair `ClassesManagementTab.tsx` e `AssignmentsTab.tsx` para `src/components/teacher/`. |
| 9 | `src/utils/speech.ts` | **`1.001`** | Mistura cliente TTS neural, fallback Web Speech, cache de áudio e controles de velocidade. Separar `audioCache.ts` e `webSpeechFallback.ts`. |
| 10 | `src/components/VocabReview.tsx` | **`994`** | Concentra Flashcards, Cloze SM-2, Lista/Catálogo, Caderno de Erros e Treino de Pronúncia. Separar abas em `src/components/review/`. |
| 11 | `src/utils/cloudSync.ts` | **`976`** | Separar `supabaseAuth.ts`, `relationalSync.ts` e `audioStorage.ts` (já extraiu `stateMerge.ts`). |
| 12 | `src/utils/aiTutorEngine.ts` | **`945`** | Separar construtores de prompt (`tutorPrompts.ts`) da avaliação heurística offline (`offlineGrader.ts`). |
| 13 | `src/components/Sidebar.tsx` | **`937`** | Concentra menu desktop, barra mobile inferior, modal de troca de idioma e perfil. Extrair `MobileBottomNav.tsx` e `LanguageSwitcherModal.tsx`. |
| 14 | `cloudflare-worker/routes/tts.js` | **`862`** | Concentra mapa dos `65` sotaques + Gemini TTS + Deepgram Aura-2 + Google fallback. Extrair tabela de vozes para `cloudflare-worker/lib/ttsVoices.js`. |
| 15 | `src/components/CommunityHub.tsx` | **`818`** | Separar `LeaguesTab.tsx`, `ForumFeedTab.tsx` e `StudyGroupsTab.tsx` em `src/components/community/`. |

### Top 10 Maiores Chunks JS em `dist/assets/` (`124` chunks · `0 > 500 kB` · `5 > 400 kB`)

| Posição | Chunk (`dist/assets/`) | Tamanho | Risco / Ação Recomendada |
| :---: | --- | :---: | --- |
| 1 | `tutor-scenarios-core` | **`472.73 kB`** | ⚠️ **Apenas `27 kB` abaixo do teto!** Dividir por idioma ou família (`tutor-scenarios-en`, `es/fr/it`, `de/ru/ja/zh`). |
| 2 | `curriculum-he-exp` | **`446.76 kB`** | ⚠️ Dividir em `curriculum-he-exp-a1b1` e `curriculum-he-exp-b2c1` (padrão já usado em `pt`). |
| 3 | `index` (bundle inicial) | **`430.31 kB`** | ⚠️ Alvo de redução para **`< 320 kB`** via lazy-load de modais secundários e decomposição de `App.tsx` / `Sidebar.tsx`. |
| 4 | `curriculum-v9-ar` | **`423.52 kB`** | ⚠️ Dividir expansão árabe em A1–B1 / B2–C1. |
| 5 | `curriculum-nb-exp` | **`416.91 kB`** | ⚠️ Dividir expansão norueguesa em A1–B1 / B2–C1. |
| 6 | `curriculum-he` | `396.64 kB` | Monitorar em futuras edições de hebraico. |
| 7 | `curriculum-de` | `348.30 kB` | Saudável. |
| 8 | `curriculum-fr` | `342.81 kB` | Saudável. |
| 9 | `curriculum-it` | `339.47 kB` | Saudável. |
| 10 | `curriculum-da-exp` | `337.14 kB` | Saudável. |
| — | `specialized-tracks` | `279.88 kB` | Ao nativizar os 11 idiomas restantes, **obrigatório** dividir em chunks por idioma (`specialized-tracks-<lang>`) para não ultrapassar 500 kB! |

---

## 3. Análise Competitiva de Mercado Atualizada (`v11.5.0`)

| Critério | **FluentBridge `v11.5.0`** | **Duolingo Max** | **Babbel** | **Busuu** | **Cambly / Preply** |
| --- | :---: | :---: | :---: | :---: | :---: |
| **Idiomas & Profundidade CEFR** | **17 idiomas (`2.550` CEFR + `204` Trilhas Especializadas) + PT PLE** | ~40 cursos (profundidade desigual fora EN/ES/FR) | 14 idiomas (A1–B2 forte) | 14 idiomas (A1–C1) | Foco em tutoria livre |
| **Aprendizado Visual** | **`364` ilustrações R2 + `picture_choice` 2×2 + SM-2 visual** | **Excelente (personagens animados + cenas)** | Bom (fotos/cartões) | Bom | Slides avulsos |
| **Simulados Oficiais Cronometrados** | **`100` Simulados v2 (Modo Prova Real, Redação Cronometrada, Evolução CSV)** | Apenas DET isolado | Ausente | Certificado interno básico | Depende do tutor |
| **Fala, Pronúncia & Tutor IA** | **65 sotaques, Replay Comparativo, Mapa de Calor, `0.75x–1.15x`, Memória IA** | Roleplay IA sem professor humano | Reconhecimento simples | Correção comunitária | Humano caro sem trilha IA |
| **Multi-Tenancy B2B (Escolas & Profs.)** | **Nativo (RLS, Coordenador, QR, CSV, White-Label, Diário, Troca de Prof.)** | Duolingo for Schools básico | Corporativo pago | B2B fechado | Não aplicável |
| **Offline-First & Plataformas** | **Web/PWA, iOS Safari (`$0`), Windows `.exe`, Android `.apk`, Pacote CEFR** | App mobile forte | App mobile forte | App mobile forte | Dependente de internet |
| **Modelo de Custo Atual** | **100% Gratuito (`$0/aluno`, sem anúncios)** | Freemium c/ anúncios ou ~$30/mês | ~$15/mês | ~$14/mês | ~$60–$180/mês |

### SWOT Atualizado (`v11.5.0`)
- **Forças:** Já iguala ou supera concorrentes pagos em **profundidade pedagógica, simulados reais, trilhas especializadas sem repetição, sotaques neurais, gestão B2B multi-escola e custo zero** — com `130` testes unitários + `21` jornadas E2E e `0` vulnerabilidades de produção.
- **Fraquezas Atuais:** (1) Arquivos centrais muito grandes (`App.tsx` `2.706` LOC, `LessonPlayer` `2.118` LOC) aumentam custo cognitivo de manutenção; (2) `5` chunks entre `416–472 kB` estão próximos do limite de `500 kB`; (3) os `11` idiomas além de `en/es/fr/de/it/pt` ainda usam adaptação estrutural nas Trilhas Especializadas; (4) `AITutor` responde em bloco (sem streaming SSE) e Playwright ainda não roda automaticamente no GitHub Actions.
- **Oportunidades:** Consolidar adoção em escolas parceiras com **Boletim Mensal Automatizado + Banco de Provas do Professor**; elevar percepção de qualidade "app top de linha" com **Word Bank interativo, Streaming no Tutor IA, Writing Coach nos Simulados v2 e ilustrações enriquecidas**; tornar o **Delta Sync** primário para suportar centenas de alunos simultâneos por escola.
- **Ameaças:** Crescimento orgânico de uso sem streaming/cache agressivo pressionando cotas gratuitas da Cloudflare/Gemini; alertas de depreciação de Actions (`@v4`) no GitHub no médio prazo; risco de regressão visual em telas mobile ainda não cobertas por E2E `360×800`/`390×844`.

---

## 4. Catálogo Exaustivo de Oportunidades de Melhoria (`v11.6 → v13.0` · 36 Itens P0–P3)

### Eixo A — Pedagogia, Conteúdo & Aprendizado Visual 2.0
1. **`P0` Nativização Completa das Trilhas Especializadas nos 11 Idiomas Restantes (`ru, ja, zh, ar, nl, af, sv, tr, he, nb, da`):** Substituir adaptações estruturais por vocabulário, textos de leitura, dicas gramaticais e áudios 100% nativos e inéditos (com validação de `0` colisões estendida para todos os `17` idiomas) e **code-splitting por idioma** (`src/data/tracks/<lang>.ts`).
2. **`P1` Novos Tipos de Exercício Interativos no `LessonPlayer`:**
   - **`word_bank` (Montagem de Frases por Blocos / Tap-to-Order):** essencial para sintaxe em alemão, japonês, árabe, russo e inglês.
   - **`spot_error` (Encontre e Corrija o Erro na Frase):** alto ganho de retenção gramatical em B1–C1.
3. **`P1` Evolução do Catálogo Visual (`364 → 600+` Conceitos) & Cenas Contextuais:** Expandir ilustrações R2 para cobrir vocabulário B1–B2 e os 4 domínios das Trilhas Especializadas (`Negócios`, `Tech`, `Saúde`, `Viagens`), com cenas ilustradas leves (WebP/SVG estilizado).
4. **`P1` Algoritmo FSRS (Free Spaced Repetition Scheduler) Opcional no `VocabReview`:** Evoluir ou oferecer opção FSRS além do SM-2 clássico, calibrando retenção alvo (ex.: `90%`) com menos revisões redundantes e maior memória de longo prazo.
5. **`P2` Expansão das Trilhas Especializadas (`3 → 6` Unidades/Trilha = `24`/Idioma):** Adicionar módulos de *Entrevista de Emprego*, *Negociação Internacional*, *Arquitetura/DevOps*, *Emergências Clínicas* e *Imigração/Alfândega*.
6. **`P2` Legendas Sincronizadas Estilo Karaokê em Podcasts & Vídeos Curtos:** Destacar frase/palavra ativa durante a reprodução em `ImmersionHub` com clique direto para salvar no SM-2 + ver IPA.

### Eixo B — IA Conversacional, Voz & Pronúncia 3.0
7. **`P0` Streaming de Respostas no `AITutor` (SSE / ReadableStream):** Transmitir tokens do Gemini em tempo real pelo Cloudflare Worker (`/api/gemini-tutor?stream=1`), derrubando o tempo até o primeiro texto de ~3s para `< 400ms` e permitindo iniciar TTS por frase.
8. **`P1` Writing Coach IA nos Simulados v2:** Avaliação analítica assistida por IA para redações de IELTS (Band 0–9), CELPIP (1–12), TOEFL, DELE, DELF e CELPE-Bras, destacando no texto do aluno erros de gramática, coesão, registro e versão reescrita nível C1.
9. **`P1` Análise Prosódica & Fluência (WPM, Pausas e Ritmo):** Complementar o Mapa de Calor palavra-por-palavra em `SpeakingStepView` e `MockExamHub` com velocidade de fala (palavras/minuto), detecção de hesitações longas e score de fluência.
10. **`P1` Plano de Estudos Semanal Adaptativo Gerado por IA:** Gerar automaticamente toda segunda-feira uma agenda de 7 dias cruzando: (a) menor pontuação nos Simulados v2, (b) top 5 categorias de erro no `MistakeNotebook` e (c) cards SM-2 críticos.
11. **`P2` Roleplay Ramificado (Conversação com Decisões):** Cenários no `AITutor` com objetivos concretos (ex.: "Conseguir reembolso no hotel", "Defender prazo na daily") que exibem checklist de missões cumpridas durante o diálogo.
12. **`P2` Comparador de Sotaques Lado a Lado:** No `VocabReview` e `CourseTranslatorView`, botão rápido para ouvir a mesma frase em 2 sotaques regionais (ex.: `en-US` vs `en-GB` vs `en-AU`, `es-MX` vs `es-ES` vs `es-AR`) treinando compreensão auditiva real.

### Eixo C — Engajamento, Hábito & Experiência Mobile 2.0
13. **`P0` Auditoria & Blindagem Mobile (`360×800` e `390×844`) em Todas as 15 Telas:** Estender a garantia de zero rolagem horizontal (já validada em `LearningPath` e `VocabReview`) com testes Playwright dedicados para `MockExamHub`, `AITutor`, `SpecializedTracksHub`, `CommunityHub`, `TeacherStudio`, `AdminPanel`, `CourseTranslatorView`, `YouTubeStudyLab` e `SchoolCoordinatorPanel`.
14. **`P1` Card Inteligente "Continuar de Onde Parei" & Meta em Minutos:** No topo da Trilha, retomar exatamente o último passo de uma unidade/trilha/simulado em andamento com barra de meta diária em minutos reais estudados.
15. **`P1` Galeria de Conquistas (Badges Progressivos) & Cartão Compartilhável:** Medalhas por marcos reais (ex.: *Poliglota 3 Idiomas*, *Simulado Real 80%+*, *100% Trilha de Negócios*, *30 Dias de Ofensiva*) com exportação de card PNG white-label da escola.
16. **`P2` Modo Foco / Pomodoro Integrado & Guia de Atalhos (`?`):** Timer discreto (15/25 min) sem distrações na barra superior + modal universal de atalhos de teclado (`Space`, `1–4`, `R`, `Enter`, `?`).
17. **`P2` Resumo Semanal de Progresso ("Retrospectiva da Semana"):** Modal/painel todo domingo com XP ganho, palavras dominadas, minutos falados, evolução nos simulados e sugestão de foco para a semana seguinte.

### Eixo D — Operação B2B Multi-Escola & Estúdio Docente 3.0
18. **`P1` Boletim Mensal Automatizado por Turma & Escola (PDF + CSV):** No `SchoolCoordinatorPanel` e `TeacherStudio`, gerar relatório consolidado de presença, unidades concluídas, média de simulados e alunos em risco de evasão (> 7 dias inativos).
19. **`P1` Banco de Provas & Atividades Avaliativas do Professor:** Permitir ao professor montar quizzes/mini-simulados personalizados (reaproveitando questões ou criando novas), agendar prazo para uma turma e receber notas corrigidas automaticamente.
20. **`P1` Histórico de Alocação & Transferência em Lote na Escola:** Registro visual de mudanças de professor/turma por aluno dentro da escola + seleção múltipla para remanejar vários alunos de professor/turma de uma vez.
21. **`P2` Agenda de Aulas ao Vivo com Exportação `.ics` / Google Calendar:** Botão "Adicionar à Agenda" nas sessões da `LiveClassroomView` com fuso horário automático e alerta pré-aula.
22. **`P2` Mural de Avisos da Escola (Isolado por `schoolId`):** Canal oficial de comunicados do Coordenador/Professor fixado no topo da Trilha dos alunos daquela escola (ex.: datas de simulados, feriados, recados da turma).

### Eixo E — Arquitetura, Bundle `< 350 kB` & Refatoração Estrutural
23. **`P0` Restaurar `@file` em `src/components/LearningPath.tsx` + Lint Automático de `@file` no CI:** Corrigir o único arquivo sem cabeçalho `@file` e adicionar script de verificação no CI para garantir `100%` de conformidade permanente.
24. **`P0` Split Preventivo dos 5 Chunks > `400 kB`:** Dividir `tutor-scenarios-core` (`472.73 kB`), `curriculum-he-exp` (`446.76 kB`), `curriculum-v9-ar` (`423.52 kB`), `curriculum-nb-exp` (`416.91 kB`) e enxugar o chunk inicial `index` (`430.31 kB` → `< 320 kB`).
25. **`P1` Decomposição de `src/App.tsx` (`2.706` LOC → `< 750` LOC):** Criar `PlatformContext` + hooks dedicados (`useAuthSession`, `useLearningFlow`, `useTeacherHandlers`, `useAdminHandlers`, `useCloudSyncLifecycle`).
26. **`P1` Decomposição de `LessonPlayer.tsx` (`2.118` LOC → `< 650` LOC) e `MockExamHub.tsx` (`1.401` LOC → `< 550` LOC):** Extrair `MatchingStepView`, `ClozeStepView`, `MinimalPairsStepView`, `StoryStepView`, `ExamCatalogView`, `ExamRunnerView` e `ExamWritingSection`.
27. **`P2` Decomposição dos Demais Módulos > `800` LOC:** Modularizar `LearningPath.tsx` (`1.427`), `AITutor.tsx` (`1.183`), `AdminPanel.tsx` (`1.182`), `TeacherStudio.tsx` (`1.029`), `speech.ts` (`1.001`), `VocabReview.tsx` (`994`), `cloudSync.ts` (`976`), `Sidebar.tsx` (`937`), `cloudflare-worker/routes/tts.js` (`862` → extrair `ttsVoices.js`) e `CommunityHub.tsx` (`818`).

### Eixo F — Qualidade, Testes, CI/CD & Segurança
28. **`P0` Atualizar GitHub Actions (`@v4 → @v5`) & Adicionar Job Playwright E2E + `@axe-core` no CI:** Eliminar avisos de depreciação (`actions/checkout`, `setup-node`, `setup-java@v5`) e rodar a suíte E2E Playwright (desktop + mobile + WCAG AA) automaticamente em todo push na `main`.
29. **`P1` Testes Unitários das Rotas do Cloudflare Worker:** Criar suíte Vitest dedicada validando `/api/health`, `/api/tts` (cache R2 + não-cachear fallback), `/api/media/*` (`HTTP 206 Range` + validação de prefixo), `/api/translate`, `/api/admin/quotas` (`avgMs`/`p95Ms`) e rate limits.
30. **`P1` Testes de Componentes React (`@testing-library/react`):** Cobrir fluxos interativos de `AuthScreen`, `VocabReview`, `MockExamHub`, `SpecializedTracksHub`, `SchoolCoordinatorPanel` e `TeacherStudio` sem depender apenas do E2E completo.
31. **`P1` Hardening HTTP (`public/_headers`) & Limpeza de `devDependencies`:** Configurar Content-Security-Policy (CSP), `X-Frame-Options`, `Referrer-Policy` e `Permissions-Policy` no Cloudflare Pages + atualizar `devDependencies` com alertas no `npm audit`.
32. **`P2` Monitoramento de Erros em Produção (Error Boundary + Telemetria R2):** Enviar stack traces sanitizados (sem PII/LGPD-safe) de falhas inesperadas de React/Worker para o painel `AuditAndLatencyPanel` do Admin Mestre.

### Eixo G — Performance, Offline-First & Escalabilidade Real
33. **`P1` Delta Sync como Caminho Primário de Sincronização:** Promover `deltaSyncEngine.ts` + tabelas relacionais (`syncRelationalTablesBestEffort`) para sincronização principal com resolução de conflitos por entidade, mantendo snapshot JSONB apenas como backup/compatibilidade.
34. **`P1` Indicador Visual de Fila Offline (`offlineOutbox`) + Background Sync:** Exibir badge discreto no cabeçalho quando houver ações pendentes offline (lições concluídas, notas, áudios) com botão "Sincronizar Agora" e retry exponencial automático.
35. **`P2` Virtualização de Listas Extensas & Cache LRU de Áudio no IndexedDB:** Aplicar virtualização (`@tanstack/react-virtual` ou janela leve) no catálogo de `2.000+` cards do `VocabReview`, nos `3.400` guias do `TipsLibrary` e em tabelas grandes do `AdminPanel`, além de política LRU (ex.: teto de `150 MB`) no cache offline de áudio.

### Eixo H — Escala Comercial & Distribuição Opcional (Sob Decisão Futura)
36. **`P3` Ativação Opcional de Planos/Checkout & Lojas (Google Play / Microsoft Store):** Manter `billingEnabled: false` (`100%` gratuito) e **Apple App Store fora do roadmap** indefinidamente até decisão expressa; quando/se decidido no futuro, ativar Stripe/Mercado Pago/Asaas e publicar `.aab` (Google Play) e `.msix`/`.exe` (Microsoft Store).
