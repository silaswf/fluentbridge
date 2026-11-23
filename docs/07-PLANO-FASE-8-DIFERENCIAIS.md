# 07 — Plano Técnico das Próximas Fases (Fases 10 a 12 · `v2.1.0` → `v3.0.0`)

Com a conclusão integral das **Fases 5 a 9** na release **`v2.0.0`** (incluindo `AdminPanel.tsx`, `92` unidades EN/ES/FR, `56` tabelas gramaticais, vozes neurais Deepgram Aura-2 + Gemini 2.5 Neural TTS e Whisper STT), este documento define os **blueprints técnicos para as próximas fases (`v2.1.0` → `v3.0.0`)**.

---

## Visão Geral das Próximas Sprints (`v2.1` → `v3.0`)

| Fase / Sprint | Versão Alvo | Foco Principal | Resultado Estratégico |
| --- | --- | --- | --- |
| **Fase 10 (Sprints 10.1 & 10.2)** | `v2.1.0` | **Sync Relacional JWT/RLS + Modularização de UI + Rate-Limit Worker** | Escalabilidade para centenas de alunos simultâneos e arquivos `< 400` linhas |
| **Fase 11 (Sprints 11.1 & 11.2)** | `v2.5.0` | **Lazy Loading Dinâmico por Idioma + Simulados + Diagnóstico Fonético** | Boot ainda mais leve, simulados IELTS/DELE/DELF e mapa de erros por turma |
| **Fase 12 (Sprints 12.1 & 12.2)** | `v3.0.0` | **Play Store / App Store + Pacote Offline de Áudio + E2E Playwright** | Distribuição oficial nas lojas móveis, estudo offline com áudio neural e QA visual |

---

## Fase 10 (`v2.1.0`) — Sync Relacional Puro, Modularização & Cotas

### Sprint 10.1 — Persistência Relacional com RLS no Supabase
- **Arquivos impactados**: `src/utils/cloudSync.ts`, `supabase_schema.sql`, `src/App.tsx`.
- **Implementação**:
  1. Migrar leituras e gravações de `fb_school_state` para as tabelas relacionais (`profiles`, `classes`, `student_progress`, `submissions`, `assignments`, `certificates`) autenticadas via JWT do usuário logado.
  2. Garantir políticas RLS onde cada aluno acessa apenas seus dados e tarefas de sua turma, enquanto professores e o Admin Mestre visualizam todos os alunos e turmas.

### Sprint 10.2 — Fatiamento de `LessonPlayer.tsx` & `TeacherStudio.tsx`
- **Arquivos impactados**: `src/components/steps/*.tsx`, `src/components/teacher/*.tsx`, `src/hooks/useCloudSyncController.ts`.
- **Implementação**:
  1. Extrair cada um dos 11 tipos de passo do `LessonPlayer.tsx` para componentes isolados em `src/components/steps/`.
  2. Extrair as abas de `TeacherStudio.tsx` (Correções, Turmas, Criar Tópico + Gerador IA, Nuvem/Vozes) para `src/components/teacher/`.
  3. Adicionar controle de cota por IP/usuário no `cloudflare-worker/worker.js` para `/api/tts`, `/api/stt` e `/api/gemini-tutor`.

---

## Fase 11 (`v2.5.0`) — Inteligência Pedagógica & Performance Extrema

- **Carregamento Dinâmico por Idioma (`src/data/languages.ts`)**: converter `getCourseTopics` em carregador assíncrono por idioma (`import('./curriculum/spanishCourse')`, `import('./curriculum/frenchCourse')`) para que alunos de Inglês não façam parse dos demais currículos.
- **Simulados Cronometrados Oficiais**: modo exame para **IELTS / TOEFL (EN)**, **DELE (ES)** e **DELF (FR)** com pontuação estimada por banda CEFR.
- **Mapa de Calor de Pronúncia & Gramática**: registrar histórico de palavras erradas em `dictation`, `minimal_pairs` e `speaking` para gerar revisões personalizadas automáticas.

---

## Fase 12 (`v3.0.0`) — Lojas Oficiais, Áudio Offline em Lote & QA E2E

- **Lojas Oficiais**: submissão de `FluentBridge-v*-playstore.aab` na **Google Play Console** e geração do projeto **iOS / App Store** (`npx cap add ios`).
- **Download Offline de Pacotes de Áudio**: botão na Trilha para pré-cachear os áudios `tts-v3:*` de um nível inteiro no `IndexedDB` antes de viagens sem internet.
- **Testes E2E (`Playwright`) no CI**: validação automatizada de Light/Dark Mode, responsividade mobile/desktop, login e conclusão de lição antes de publicar cada tag `v*`.

---

## Registro das Fases 5 a 9 (Já Entregues em `v1.1.0` → `v2.0.0`)

- **Fase 5 (`v1.1.0`)**: Cloudflare Worker `fluentbridge-api` (Deepgram Aura-2 + proxy Gemini), hash `fbh1:`, upload de áudio Speaking e `mergePlatformStates`.
- **Fase 6 (`v1.2.0`)**: `React.lazy`, `manualChunks`, `ErrorBoundary`, PWA Workbox e suíte `Vitest`.
- **Fase 7 (`v1.3.0`)**: SRS SM-2, Dark Mode, Streak Freeze, notificações locais, Safe Area Android e Whisper STT (`/api/stt`).
- **Fases 8 & 9 (`v2.0.0`)**: Painel Admin Mestre (`AdminPanel.tsx`), bloqueio de usuários, código docente editável, `dictation`, `minimal_pairs`, `story`, tarefas com prazo, chamada ao vivo IA, Gerador IA de unidades, `92` unidades (EN 50 / ES 22 / FR 20), `56` tabelas gramaticais e Gemini 2.5 Neural TTS para Francês.
