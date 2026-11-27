<!-- @file docs/04-ROADMAP-E-EVOLUCAO.md — Histórico consolidado das entregas v1.0→v10.0 e Novo Roadmap Detalhado de Evolução Contínua (v10.1→v12.0). -->

# 04 — Roadmap & Evolução (`v1.0 → v12.0`)

Este documento registra o **ciclo concluído (`v1.0.0 → v10.0.0`)** e estabelece o **novo roadmap incremental (`v10.1 → v12.0`)**, derivado diretamente da Auditoria 360° pós-`v10.0.0`.

> **Diretrizes Permanentes do Projeto:**
> - **Modo 100% Gratuito por padrão** (`billingEnabled: false`) até decisão expressa do proprietário.
> - **Sem publicação na Apple App Store** (iPhone/iPad continuam atendidos gratuitamente via **iOS Safari PWA `$0/ano`**).
> - **Qualidade obrigatória por entrega:** `tsc --noEmit` (`0` erros), Vitest 100% verde, Playwright 100% verde, `0` chunks > 500 kB e cabeçalho `@file` em todo arquivo novo/alterado.

---

## Parte 1 — Ciclo Anterior Concluído (`v1.0.0 → v10.0.0` · 100% Entregue)

| Versão | Marco Entregue | Status |
| --- | --- | :---: |
| **`v1.0 – v5.0`** | Fundação React/Vite, Trilha CEFR A1–C1, SM-2, Tutor IA, Estúdio do Professor, Supabase Auth/Sync e Certificados PDF | ✅ Concluído |
| **`v6.0 – v7.2`** | Cloze SM-2, Drills Gramaticais, Graded Readers, Live Classroom, Windows `.exe` (Electron) + Android `.apk` (Capacitor) + Auto-Updater | ✅ Concluído |
| **`v8.0 – v8.4`** | 12 idiomas × 150 unidades (`1.800` unid.), Comunidade 2.0, Imersão Podcast/Vídeo (`206 Range`), Hands-Free, Dark Mode WCAG AA | ✅ Concluído |
| **`v9.0 – v9.1`** | 16 idiomas (`2.400` unid.), `61` sotaques neurais, YouTube Study Lab, RTL (`ar`/`he` + Niqqud), Login Dark Sober, `0` chunks > 500 kB | ✅ Concluído |
| **`v9.2 – v9.3`** | **Tradutor Bidirecional (`/api/translate`)**, **17º idioma Português PLE (`pt`)** com imersão invertida, `2.550` unidades, `65` sotaques, **Painel R2 Cotas**, i18n no Login/Gateway, modularização inicial | ✅ Concluído |
| **`v9.4.0`** | **Motor de Planos & Assinaturas** estruturado (`subscriptionEngine`, `/api/billing/*`, `subscriptions` Supabase) em modo 100% gratuito | ✅ Concluído |
| **`v10.0.0`** | **Multi-Tenancy Escolar Completo**: isolamento estrito por `schoolId` + PostgreSQL RLS (`Seção 13`), coordenação global Master Admin, alocação fácil de alunos, troca de professor dentro da mesma escola e portal `?escola=<slug>` | ✅ **Concluído (Atual)** |

---

## Parte 2 — Novo Roadmap Incremental (`v10.1 → v12.0`)

### Fase 1 — `v10.1`: Aprendizado Visual & Multimídia (Estilo Duolingo)
*Objetivo: reduzir a dependência exclusiva de texto e aumentar a retenção visual nos 17 idiomas.*
- [ ] **Pipeline de Imagens WebP no Cloudflare R2 (`/api/media/img/*`):** servir ilustrações leves (`<= 25 KB` cada) via R2 + cache HTTP imutável, mantendo o bundle JS abaixo de 500 kB e sem pesar o `.exe`/`.apk`.
- [ ] **Campo `imageKey` / `imageUrl` no `VocabCard` e `LessonStep`:** mapeamento semântico compartilhado por categoria (`food`, `travel`, `work`, `family`, `health`, `city`, `nature`, `tech`, `emotions`, `home`) reaproveitável nos 17 idiomas.
- [ ] **Novo Exercício `VisualMatchStep` no `LessonPlayer`:** associação interativa *"Ouça/Leia e toque na imagem correspondente"*, integrada à trilha A1–B1 e às unidades de vocabulário.
- [ ] **Flashcards Visuais no `VocabReview` (SM-2):** exibição da imagem ilustrativa na frente/verso do card com opção de desativar ("Modo Minimalista Texto").
- [ ] **Suporte a Upload de Imagem em Tópicos Customizados:** permitir que professores anexem ilustração do catálogo R2 ou URL segura ao criar lições no `TopicCreatorTab`.

### Fase 2 — `v10.2`: Fala, Pronúncia & IA Pedagógica 2.0
*Objetivo: aproximar o feedback de fala de um fonoaudiólogo/professor particular.*
- [ ] **Replay Comparativo Lado a Lado (`SpeakingStepView`):** botões "Ouvir Nativo" e "Ouvir Minha Gravação" lado a lado antes do envio.
- [ ] **Mapa de Calor Palavra-por-Palavra:** destaque visual (verde/âmbar/vermelho) sobre cada palavra da frase após transcrição Whisper STT + `phoneticFeedback.ts`.
- [ ] **Seletor de Velocidade de Áudio (`0.75x`, `1.0x`, `1.15x`):** disponível em `ListeningStep`, `ReadingStep`, `DictationStep`, `PodcastImmersionView` e `HandsFreeAudioModal`.
- [ ] **Ditado Adaptativo em Cadeia & Shadowing Guiado:** modo de repetição em ritmo guiado com contagem regressiva e avaliação automática de fluência.
- [ ] **Painel "Memória da IA" no `AITutor`:** mostrar ao aluno quais 5 erros do `MistakeNotebook` e quais palavras difíceis estão sendo priorizados pela IA na conversa atual.

### Fase 3 — `v10.3`: Engajamento, Hábito & Comunidade 2.0
*Objetivo: aumentar frequência diária (DAU) e conclusão de níveis CEFR.*
- [ ] **Revisão Express "5 Minutos":** botão no topo da `LearningPath` que gera micro-sessão mista (`5` cards SM-2 + `2` erros + `1` frase oral) para dias corridos.
- [ ] **Lembretes Inteligentes Web Push / PWA:** agendamento local/push no horário escolhido para proteger a ofensiva diária.
- [ ] **Streak Freeze por Mérito:** desbloqueio automático de congelamentos de ofensiva ao completar checkpoints CEFR ou marcos de 7 dias seguidos.
- [ ] **Desafios Semanais & Ranking Interno por Escola:** metas semanais e liga competitiva 100% isoladas por `schoolId`, com moderação docente.
- [ ] **Grupos de Estudo por Turma/Idioma:** salas assíncronas dentro da `CommunityHub` vinculadas à escola do aluno.

### Fase 4 — `v10.4`: Operação B2B Multi-Escola Avançada
*Objetivo: dar autonomia operacional para coordenadores de escolas parceiras mantendo o controle global do Master Admin.*
- [ ] **Painel do Coordenador da Escola (`isSchoolAdmin`):** visão administrativa restrita à própria escola (gerenciar professores da escola, turmas, vínculos e exportar CSV local) sem acesso a outras escolas nem ao painel Master.
- [ ] **White-Label por Escola (Logo + Cor Primária):** upload de logotipo no R2 + tema dinâmico aplicado na `Sidebar`, `AuthScreen` (`?escola=<slug>`), **Certificados CEFR** e **Boletins PDF**.
- [ ] **Importação em Lote via CSV & QR Code da Escola/Turma:** cadastro massivo de alunos em 1 upload e geração de QR Code imprimível para matrícula imediata.
- [ ] **Diário de Classe & Lista de Presença (`LiveClassroomView`):** registro de frequência por sessão ao vivo, notas de aula e relatório mensal consolidado por escola/professor (PDF + CSV).
- [ ] **Subdomínios Customizados (Opcional):** mapeamento `escola.fluentbridge.app` resolvendo o tenant automaticamente sem precisar de `?escola=`.

### Fase 5 — `v10.5`: Engenharia, Modularização & QA Profundo
*Objetivo: eliminar arquivos monolíticos, elevar testabilidade e blindar contra regressões.*
- [ ] **Refatoração Modular do Frontend:**
  - Quebrar `src/App.tsx` (`2.536` LOC) em hooks dedicados (`useAuthAndTenant`, `useLearningActions`, `useTeacherActions`, `useAdminActions`).
  - Quebrar `AdminPanel.tsx` (`1.416` LOC) em `src/components/admin/` (`SchoolsPanel`, `UsersControlPanel`, `QuotasPanel`, `BillingPanel`, `TelemetryPanel`).
  - Quebrar `LearningPath.tsx` (`1.323` LOC) em `src/components/path/`.
  - Quebrar `LessonPlayer.tsx` (`2.018` LOC) extraindo renderizadores (`ReadingStepView`, `WritingStepView`, `MatchingStepView`, `DictationStepView`).
  - Fatiar `cloudSync.ts` (`1.304` LOC) em `supabaseClient.ts`, `stateMerge.ts`, `audioUpload.ts`.
- [ ] **Modularização Final do Cloudflare Worker:** extrair `routes/tts.js`, `routes/stt.js`, `routes/gemini.js` e `routes/youtube.js` de `worker.js` (`1.294` LOC).
- [ ] **Lazy-load de `japaneseKana.ts` (`1.099` LOC):** carregar o dicionário Kanji→Kana dinamicamente apenas quando o curso `ja` for ativado.
- [ ] **Suíte E2E Multi-Tenant & Testing Library:**
  - Teste Playwright dedicado validando isolamento completo entre Escola A e Escola B e troca de professor dentro da mesma escola.
  - Testes de componentes React com `@testing-library/react`.
  - Auditoria automatizada de acessibilidade com `@axe-core/playwright`.
- [ ] **Log de Auditoria Administrativa & Latência p95:** histórico no painel Master de alterações de escola/professor/suspensão e latência p95 por rota de IA.

### Fase 6 — `v11.0`: Offline-First Real & Sincronização Delta
*Objetivo: permitir estudo completo em viagens, zonas rurais ou redes instáveis sem conflitos de dados.*
- [ ] **Pacote Offline por Nível CEFR:** botão "Baixar Nível para Estudo Offline" armazenando unidades, áudios TTS e imagens WebP em Cache API / IndexedDB com medidor de espaço.
- [ ] **Delta Sync Relacional:** migrar a sincronização primária de snapshot JSONB integral (`fb_school_state`) para sincronização incremental por entidade/timestamp nas tabelas relacionais do Supabase, reduzindo banda e evitando sobrescritas entre múltiplos professores simultâneos.
- [ ] **Resolução Inteligente de Conflitos Offline→Online:** merge determinístico por `updatedAt` de progresso, XP, SRS e submissões ao reconectar.

### Fase 7 — `v11.5 → v12.0`: Expansão Pedagógica Avançada & Escala Comercial Opcional
*Objetivo: ampliar profundidade acadêmica e preparar eventual escala comercial quando desejado.*
- [ ] **Simulados Oficiais Cronometrados v2:** modo prova real com bloqueio de dicas, redação cronometrada com contagem de palavras e relatório comparativo de evolução por tentativa.
- [ ] **Trilhas Especializadas (Negócios, Tecnologia, Saúde & Viagens):** pacotes temáticos transversais nos principais idiomas.
- [ ] **Ativação Opcional de Planos & Checkout (Somente sob Decisão Futura):** ligar `BILLING_ENABLED = true` com chaves Stripe / Mercado Pago / Asaas para B2C ou licenciamento B2B de escolas parceiras.
- [ ] **Publicação em Lojas (Opcional/Futuro):** Google Play Store (`.aab`) e Microsoft Store (`.msix`/`.exe`) quando houver interesse estratégico — *Apple App Store permanece fora do roadmap até decisão explícita*.
