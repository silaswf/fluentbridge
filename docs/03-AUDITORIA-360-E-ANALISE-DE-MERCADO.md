<!-- @file docs/03-AUDITORIA-360-E-ANALISE-DE-MERCADO.md — Auditoria Técnica 360° (Zero-Based) pós-v10.0.0, telemetria real do codebase, benchmark competitivo de mercado e catálogo exaustivo de oportunidades de evolução. -->

# 03 — Auditoria 360° & Análise Competitiva de Mercado (`v10.0.0`)

**Data da Auditoria:** 26/11/2026 · **Versão Auditada:** `v10.0.0` · **Escopo:** Frontend React/PWA, Edge API Cloudflare Worker + R2, Banco Supabase + RLS Multi-Tenant, Cobertura de Testes, UX/Acessibilidade e Posicionamento Competitivo.

---

## 1. Resumo Executivo & Scorecard 360°

Com a entrega da **`v10.0.0`** (Multi-Tenancy Escolar com isolamento estrito por `schoolId`, troca segura de professor dentro da mesma escola, coordenação global do Master Admin, motor de planos pronto em modo 100% gratuito, observabilidade de cotas R2, Tradutor Bidirecional e 17 idiomas com 2.550 unidades), o ciclo original `v1.0 → v10.0` foi **100% concluído**.

Esta auditoria parte do **zero** sobre o estado real atual da plataforma para identificar o que já é nível mercado, onde estão as novas dívidas técnicas e quais oportunidades geram maior impacto no próximo ciclo (`v10.1 → v12.0`).

| Dimensão Auditada | Nota (`v10.0.0`) | Evolução vs `v9.0` | Diagnóstico Objetivo |
| --- | :---: | :---: | --- |
| **1. Pedagogia & Amplitude Curricular** | **9.4 / 10** | ▲ +0.4 | `17` idiomas (`2.550` unidades A1–C1), Português PLE com imersão invertida, `100` simulados (`25` formatos), `850` cenários IA, `3.400` guias gramaticais, SM-2 + CAT + Caderno de Erros. **Gap principal:** unidades ainda dependem quase 100% de texto/áudio (faltam imagens/ilustrações temáticas estilo Duolingo). |
| **2. IA, Voz & Imersão** | **9.0 / 10** | ▲ +0.3 | `65` sotaques neurais (Gemini 2.5 + Aura-2 + cache R2 SHA-256), Whisper STT, YouTube Study Lab, Tradutor Bidirecional (`/api/translate`), Hands-Free e Phoneme Breakdown. **Gap principal:** falta replay comparativo lado a lado (nativo vs aluno), mapa de calor por palavra na pronúncia e memória persistente de erros no Tutor IA. |
| **3. Multi-Tenancy, B2B & Gestão Docente** | **8.8 / 10** | ▲ +1.8 | Isolamento estrito por `schoolId` no frontend (`scopePlatformStateForUser`) e no Postgres RLS (`Seção 13`), criação/suspensão de escolas pelo Master Admin, alocação em 1 clique, troca de professor na mesma escola sem perda de XP/progresso, `?escola=<slug>`. **Gap principal:** falta papel dedicado `isSchoolAdmin` (painel do coordenador local sem acesso Master), logo/paleta por escola no R2 e diário de presença. |
| **4. UX/UI, Acessibilidade & Mobile** | **8.7 / 10** | ▲ +0.3 | Light + Dark Mode validados WCAG AA em Playwright, i18n (`PT/EN/ES`) no Login/Gateway/Player, RTL nativo (`ar`, `he` + toggle *Niqqud*), viewport `390x844` sem overflow. **Gap principal:** faltam atalhos de revisão rápida "5 min", onboarding guiado por objetivo em vídeo/visual e auditoria automatizada `axe-core`. |
| **5. Arquitetura & Modularização** | **7.6 / 10** | ▲ +0.4 | `worker.js` já foi fatiado (`routes/media.js`, `routes/translate.js`, `routes/adminQuotas.js`, `routes/billing.js`, `lib/quotas.js`) e `LessonPlayer`/`TeacherStudio` começaram a ser quebrados. **Gap crítico:** `src/App.tsx` (`2.536` linhas), `LessonPlayer.tsx` (`2.018` linhas), `AdminPanel.tsx` (`1.416` linhas), `LearningPath.tsx` (`1.323` linhas) e `cloudSync.ts` (`1.304` linhas) seguem grandes demais. |
| **6. Segurança, Privacidade & LGPD** | **8.9 / 10** | ▲ +0.5 | RLS estrito por `school_id` + `teaches_student()` anti-vazamento entre escolas, zero segredos no bundle cliente, `hidden` sourcemaps, exclusão/exportação LGPD, `ConfirmDialog` em ações sensíveis. **Gap principal:** rate limit e log de auditoria imutável para ações administrativas multi-escola no backend. |
| **7. Qualidade, Testes & Observabilidade** | **8.6 / 10** | ▲ +0.4 | `24/24` suítes Vitest (`93` testes), `15/15` E2E Playwright (Desktop + Mobile), `0` erros TS, painel R2 `/api/admin/quotas` + telemetria de erros. **Gap principal:** ausência de testes unitários de componentes React (Testing Library), cobertura E2E específica para isolamento entre duas escolas simultâneas e métricas de latência p95 por endpoint. |
| **8. Performance & Offline-First** | **8.3 / 10** | ▬ 0.0 | Build Vite em `8.32s`, `0` chunks > 500 kB (`tutor-scenarios-core` 472.73 kB, `index` 459.99 kB), PWA precache `1.82 MiB` + `offlineOutbox`. **Gap principal:** sincronização ainda envia snapshot JSONB inteiro (falta Delta Sync) e não há pacote offline baixável por nível CEFR com áudios cacheados. |

**Nota Geral Consolidada (`v10.0.0`):** **8.66 / 10** *(pronta para operação real gratuita com múltiplas escolas e professores; próximo salto exige multimídia visual, fala avançada e refatoração modular).*

---

## 2. Telemetria Real do Codebase (Medida em `v10.0.0`)

- **Total geral (`src/` + `cloudflare-worker/`):** **`327` arquivos** · **`313.814` linhas** (inclui bancos curriculares dos 17 idiomas em `src/data/`).
- **Código de aplicação (`src/` sem `src/data/` + `cloudflare-worker/`):** **`143` arquivos** · **`44.208` linhas**.
- **Build de Produção (`vite build`):** `8.32s` · `1.930` módulos transformados · **`0` chunks > 500 kB** · **`0` warnings Rollup**.
  - Maiores chunks JS gerados: `tutor-scenarios-core` (`472.73 kB`), `index` (`459.99 kB`), `curriculum-he-exp` (`446.76 kB`), `curriculum-v9-ar` (`423.52 kB`), `curriculum-nb-exp` (`416.91 kB`).
  - PWA Workbox: `31` entradas em precache (`1.820,51 KiB`).
- **Suíte de Testes:**
  - **Vitest:** `24` suítes · **`93/93` testes passando** (`39.46s`, sendo ~37s em testes de coesão integral dos currículos).
  - **Playwright E2E:** **`15/15` jornadas passando** (`1.6m` em Chromium Desktop + Mobile `390x844`).

### Top 12 Maiores Arquivos de Lógica/UI (Candidatos à Modularização)

| Posição | Arquivo | Linhas (LOC) | Diagnóstico |
| :---: | --- | :---: | --- |
| 1 | `src/App.tsx` | `2.536` | Concentra autenticação, sync, handlers de lição/professor/admin/multi-tenant e roteamento de views; extrair hooks (`useAuthHandlers`, `useSchoolAdminActions`, `useLessonActions`). |
| 2 | `src/components/LessonPlayer.tsx` | `2.018` | Já extraiu `SpeakingStepView`, mas ainda concentra renderizadores de Writing, Reading, Matching, Cloze, Dictation, MinimalPairs e Story. |
| 3 | `src/components/AdminPanel.tsx` | `1.416` | Concentra 7 painéis (Escolas, Código Docente, Vozes, Usuários, Cotas R2, Billing, Telemetria); dividir em subcomponentes em `src/components/admin/`. |
| 4 | `src/components/LearningPath.tsx` | `1.323` | Trilha modular + filtros + missões + metas + avisos de tarefas; extrair cards e barras em `src/components/path/`. |
| 5 | `src/utils/cloudSync.ts` | `1.304` | Mistura cliente Supabase, OAuth nativo/web, merge de estado e upload de áudio; separar `supabaseAuth.ts`, `stateMerge.ts` e `audioUpload.ts`. |
| 6 | `cloudflare-worker/worker.js` | `1.294` | Já extraiu 4 módulos de rotas, mas ainda mantém `/api/tts`, `/api/stt`, `/api/gemini-tutor` e `/api/youtube-study` inline. |
| 7 | `src/utils/japaneseKana.ts` | `1.099` | Dicionário extenso de mapeamento Kanji→Kana (candidato a lazy-load sob demanda apenas quando `activeLanguage === 'ja'`). |
| 8 | `src/components/MockExamHub.tsx` | `1.072` | Orquestração de timer, questões, speaking em 3 partes e rubrica writing. |
| 9 | `src/components/AITutor.tsx` | `992` | Chat + Modo Chamada + VAD + cenários + histórico. |
| 10 | `src/components/TeacherStudio.tsx` | `989` | Já extraiu `SubmissionsGradingTab`, `TopicCreatorTab`, `VipStudentsPanel`, `SchoolSettingsTab`; falta extrair `ClassesManagementTab` e `AssignmentsTab`. |
| 11 | `src/utils/speech.ts` | `909` | Engine híbrida TTS (Neural API + Web Speech fallback + áudio cache). |
| 12 | `src/utils/aiTutorEngine.ts` | `901` | Construção de prompts, correção gramatical e avaliação de fala. |

---

## 3. Análise Competitiva de Mercado (`v10.0.0`)

| Critério | **FluentBridge `v10.0.0`** | **Duolingo Max** | **Babbel** | **Busuu** | **Cambly / Open English** |
| --- | :---: | :---: | :---: | :---: | :---: |
| **Idiomas & Profundidade CEFR** | **17 idiomas (A1–C1, 2.550 unid.) + PT PLE** | ~40 cursos (desiguais fora EN/ES/FR) | 14 idiomas (A1–B2 forte) | 14 idiomas (A1–C1) | Foco quase exclusivo em Inglês |
| **Multi-Tenancy B2B (Escolas & Troca de Prof.)** | **Nativo (RLS + Portal `?escola=` + Troca de Prof.)** | Apenas Duolingo for Schools básico | Corporativo pago | B2B fechado | Não aplicável |
| **Tutor IA + Simulados Oficiais + Professor Real** | **Híbrido Completo (IA + 100 Simulados + Prof. VIP)** | IA cara (sem professor humano) | Sem professor real | Correção comunitária | Professor humano caro (sem trilha IA robusta) |
| **Tradutor Bidirecional + YouTube Study Lab** | **Integrados com IPA & SM-2** | Ausente | Ausente | Ausente | Ausente |
| **Aprendizado Visual (Imagens por Unidade)** | **Pendente (`v10.1`)** | **Excelente (ilustrações/personagens)** | Bom | Bom | Slides básicos |
| **Modelo de Custo Atual** | **100% Gratuito (`$0/aluno`, sem anúncios)** | Freemium c/ anúncios ou ~$30/mês | ~$15/mês | ~$14/mês | ~$60–$150/mês |

### Posicionamento Estratégico (SWOT Atualizado)
- **Forças:** Único ecossistema gratuito/white-label que une trilha CEFR profunda (`2.550` unidades), `65` sotaques neurais, `100` simulados oficiais, Tutor IA + YouTube Lab + Tradutor e gestão completa multi-escola/multi-professor com isolamento RLS.
- **Fraquezas:** Experiência visual das lições ainda textual (sem imagens/ilustrações estilo Duolingo); falta replay comparativo de pronúncia; arquivos centrais (`App.tsx`, `LessonPlayer.tsx`, `AdminPanel.tsx`) com alta concentração de linhas.
- **Oportunidades:** Adoção por escolas parceiras e professores autônomos usando `?escola=<slug>`; uso do curso de **Português PLE (`pt`)** para atrair alunos estrangeiros falantes de inglês; ativação futura opcional de planos B2B/VIP sem custo fixo até lá.
- **Ameaças:** Dependência de cotas gratuitas da Cloudflare/Gemini caso haja crescimento súbito sem cache agressivo; concorrentes com alto apelo visual infantil/casual (Duolingo).

---

## 4. Catálogo Completo de Oportunidades de Melhoria (P0 a P3)

### Eixo A — Pedagogia Visual & Multimídia (Maior Impacto no Aluno)
1. **`P0` Imagens nas Unidades & Vocabulário (Estilo Duolingo):** Associar ilustrações WebP leves (hospedadas no Cloudflare R2 `/api/media/img/*` com cache longo) aos cards de vocabulário e criar o tipo de passo `VisualMatchStep` (associar áudio/palavra à imagem correta) — zero aumento no bundle JS.
2. **`P1` Flashcards Ilustrados no SM-2:** Exibir miniatura visual opcional no `VocabReview` para reforçar memória visual + auditiva + IPA.
3. **`P1` Vídeos/Áudios Curtos de Cultura por Nível:** Mini-diálogos situacionais com transcrição sincronizada (estilo karaokê).
4. **`P2` Trilha de Viagens & Negócios (Micro-cursos):** Filtros rápidos na trilha por objetivo (`Viagem`, `Entrevista`, `Exame`, `Trabalho`) usando tags nos tópicos.

### Eixo B — Fala, Pronúncia & IA Pedagógica 2.0
5. **`P0` Replay Comparativo Lado a Lado:** No `SpeakingStepView`, permitir ouvir a **voz neural nativa** e imediatamente **a própria gravação do aluno** para autoavaliação antes de enviar ao professor.
6. **`P1` Mapa de Calor Palavra-por-Palavra:** Destacar em verde/âmbar/vermelho cada palavra da frase-alvo conforme o retorno do Whisper STT + `phoneticFeedback.ts`.
7. **`P1` Controle de Velocidade de Áudio (`0.75x`, `1.0x`, `1.15x`):** Essencial para iniciantes A1 em idiomas rápidos (espanhol, francês, japonês) e treino de escuta avançada B2–C1.
8. **`P1` Memória Pedagógica Ativa no Tutor IA:** Injetar automaticamente os últimos 5 erros do `MistakeNotebook` e palavras fracas de pronúncia nas sessões do `AITutor` (em progresso com `tutorMemory.ts`, faltando painel visual de "O que a IA sabe que preciso treinar").
9. **`P2` Modo Ditado Adaptativo & Shadowing Guiado:** Exercícios em cadeia onde o aluno ouve, repete simultaneamente e recebe pontuação de ritmo/fluência.

### Eixo C — Engajamento, Hábito & Comunidade 2.0
10. **`P1` Revisão Express "5 Minutos":** Botão de ação rápida no topo da Trilha que monta uma micro-sessão com `5` cards vencidos do SM-2 + `2` erros do caderno + `1` frase de fala.
11. **`P1` Web Push / Lembretes de Ofensiva PWA:** Notificação local/push no horário escolhido para proteger a ofensiva diária.
12. **`P1` Streak Freeze Ganho por Mérito:** Permitir desbloquear congelamentos de ofensiva ao completar checkpoints CEFR ou 7 dias seguidos.
13. **`P2` Desafios Semanais por Escola & Grupos de Estudo:** Competições saudáveis 100% isoladas dentro de cada escola (`schoolId`), com placar semanal entre colegas da mesma instituição.

### Eixo D — Operação B2B Multi-Escola (`v10.x`)
14. **`P0` Painel Dedicado para Coordenador da Escola (`isSchoolAdmin`):** Permitir que o dono/coordenador de uma escola parceira gerencie professores, turmas, alunos e relatórios **apenas da própria escola** sem precisar acessar o painel Master Global.
15. **`P1` White-Label Visual por Escola (Logo & Cor no R2):** Upload de logotipo da escola para R2 e aplicação dinâmica de `primaryColor` na `Sidebar`, `AuthScreen` (`?escola=`) e cabeçalho dos **Certificados CEFR / Boletins PDF**.
16. **`P1` Importação em Lote de Alunos via CSV & QR Code de Convite:** Cadastrar 30–100 alunos de uma escola de uma só vez e gerar QR Code imprimível para sala de aula (`/?escola=slug`).
17. **`P2` Diário de Classe & Lista de Presença (Aulas ao Vivo):** Registro de presença, nota de participação e resumo mensal automático por turma/escola.

### Eixo E — Arquitetura & Modularização
18. **`P1` Decompor `src/App.tsx` (`2.536` LOC):** Extrair hooks dedicados (`useAuthAndTenant`, `useLearningActions`, `useTeacherActions`, `useAdminActions`) reduzindo `App.tsx` para `< 700` linhas.
19. **`P1` Decompor `AdminPanel.tsx` (`1.416` LOC) & `LearningPath.tsx` (`1.323` LOC):** Criar subdiretórios `src/components/admin/` e `src/components/path/` seguindo o mesmo padrão aplicado com sucesso em `src/components/teacher/`.
20. **`P1` Decompor `LessonPlayer.tsx` (`2.018` LOC) & `cloudSync.ts` (`1.304` LOC):** Extrair renderizadores de cada tipo de exercício e separar módulos de Auth/Merge/Upload em `cloudSync/`.
21. **`P2` Lazy-load de `japaneseKana.ts` (`1.099` LOC) & `worker.js` (`1.294` LOC):** Carregar dicionário Kana sob demanda apenas no curso `ja` e extrair `routes/tts.js`, `routes/stt.js`, `routes/gemini.js` e `routes/youtube.js` no Worker.

### Eixo F — Qualidade, Testes, Segurança & Observabilidade
22. **`P1` Testes E2E Multi-Tenant Isolados:** Adicionar jornada Playwright criando Escola A e Escola B, validando que o professor/aluno da Escola A não enxerga nada da Escola B e que a troca de professor na mesma escola preserva XP.
23. **`P1` Testes de Componentes React (`@testing-library/react`):** Cobrir `AuthScreen`, `AdminPanel`, `VipStudentsPanel`, `LessonPlayer` e `CourseTranslatorView`.
24. **`P1` Auditoria Automatizada WCAG 2.1 AA (`@axe-core/playwright`):** Garantir zero regressões de contraste e ARIA em novas telas.
25. **`P2` Log de Auditoria Administrativa & Latência p95 no Admin:** Registrar quem moveu aluno de escola/professor ou alterou status de escola, além de exibir latência média/p95 das rotas de IA no painel Master.

### Eixo G — Performance & Offline-First Real
26. **`P1` Sincronização Incremental (Delta Sync):** Substituir o envio integral do JSONB `fb_school_state` por deltas por tabela/entidade (`syncRelationalTablesBestEffort` como fonte primária), reduzindo tráfego e risco de conflito simultâneo entre múltiplos professores.
27. **`P2` Pacote Offline por Nível CEFR:** Permitir baixar um nível inteiro (`A1`, `A2` etc.) com áudios TTS + imagens WebP em Cache API/IndexedDB para estudo 100% sem internet (viagens, escolas rurais).

### Eixo H — Escala Comercial Opcional (Sem Pressa)
28. **`P3` Ativação Opcional de Checkout Real (Stripe / Mercado Pago / Asaas):** Já com estrutura pronta (`v9.4.0` — `billingEnabled: false`), ativar somente quando/se houver decisão de comercialização B2C ou licenciamento B2B por escola.
