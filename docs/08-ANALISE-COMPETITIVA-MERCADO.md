# 08 — Auditoria Qualitativa 360° (`v8.3.0`), UI/UX, Segurança & Análise Competitiva de Mercado

> **Data da auditoria:** 26/11/2026 · **Versão auditada:** `v8.3.0` (commit `1e8d670`)  
> **Escopo:** Documento unificado substituindo o antigo `09-PLANO-v8.3`, consolidando o inventário técnico da plataforma, o **comparativo competitivo com o mercado (incluindo UI & UX)**, a **análise qualitativa do que já foi entregue na `v8.3.0`** e o **plano atualizado do que ainda pode evoluir (`v8.4 → v10.0`)** com diagnóstico real e critérios de aceite.

---

## 1. Raio-X Atual da Plataforma (`v8.3.0`)

### 1.1 Escala de Conteúdo & Qualidade Pedagógica
- **12 Idiomas Completos (CEFR A1–C1):** Inglês (`en`), Espanhol (`es`), Francês (`fr`), Italiano (`it`), Alemão (`de`), Russo (`ru`), Japonês (`ja`), Chinês (`zh`), Árabe (`ar` RTL), Holandês (`nl`), Africâner (`af`) e Sueco (`sv`).
- **1.236 Unidades Estruturadas (`103` por idioma · `13.736` passos totais):** organizadas em **módulos desdobráveis com numeração sequencial única (`Módulo 1 … N`)** e **Pontos de Verificação (+60 XP)** ligados a podcasts e vídeos, unidades de **Expressões Idiomáticas, Gírias e Registro Informal/Tabu `18+`**, imersão a partir do **B2/C1** com botão **"Traduzir PT"** e salvamento de progresso passo a passo (`topicStepProgress`).
- **14.186 Cards de Vocabulário Coesos (SM-2 + Cloze):** mínimo garantido de **`10` palavras por unidade** (`10–13` cards/unidade em 100% das 1.236 unidades, inclusive Unidade 0), extração real das atividades (`inLessonLexicon.ts`), **Revisão Espiral** (`recycledLinks`) e validação automática 100% via `exampleMatchesWord`.
- **Coesão & Dificuldade Adaptativa Real:** Matching de 5 pares, Cloze coeso, glossário Unicode clicável no Reading, **Writing híbrido com IA semântica** (`analyzeWritingHybrid` aceitando respostas alternativas válidas + fallback local), e **dificuldade adaptativa persistente** (`adaptiveDifficulty.ts`) conectada ao `autoShowHints` no `LessonPlayer`.
- **Letras, Sons & Kanji Progressivo (`230` unidades `script_phonics` + Toggle `100% Kana`):** introdução progressiva de letras e Kanji para `ru`, `ar`, `zh` e `ja`, além do Treinador dedicado de Escrita & Traços.
- **Gramática, Leitura Graduada, Tutor IA & Nivelamento:** `2.400` guias gramaticais, `144` **Grammar Drills**, `12` **Graded Readers** (`60` capítulos com leitura contínua corrigida via `speakTextAsync`), `480` cenários de Tutor IA com memória SM-2 e `480` questões adaptativas CAT.
- **80 Simulados Oficiais Cronometrados (`20` exames reais):** CELPIP (usando **`en-CA`** por padrão), IELTS, TOEFL, **DET (`10–160`)**, DELE, DELF, CILS, Goethe, TORFL, JLPT, HSK, ALPT, NT2 e Swedex, com Speaking em 3 partes e Rubrica Analítica de Writing.
- **Imersão Audiovisual:** **`60` Podcasts** (`180` checkpoints) e **`36` Vídeos Curtos Interativos** (`72` checkpoints) com legendas duplas clicáveis (`SM-2`).

### 1.2 Vozes Neurais Naturais, IA, Escola & Áudio
- **Cloudflare Worker Edge (`fluentbridge-api` `v8.3.0`):**
  - **Tier 1:** **Gemini 2.5 Native Neural TTS** em **todos os 49 sotaques regionais** (incluindo `en-US`, `en-GB`, `en-CA`, `es-ES`, `es-MX`, `it-IT-NAP`, `ja-FUK`, `ar-MA`, `de-CH` etc.) com preferência global persistida por idioma (`accentPreference.ts`).
  - **Tier 2:** **Deepgram Aura-2** como fallback neural para EN/ES.
  - **Tier 3:** Fallback emergencial do Translate **nunca** é salvo no R2 (`tts/v6/`) nem no Edge/IndexedDB (`tts-v6:`), evitando envenenamento de cache com voz robótica.
  - Desbloqueio síncrono de `Audio` no clique (WAV silencioso), `Loader2` durante síntese longa, STT via Whisper Large v3 Turbo, `/api/gemini-tutor`, JWT híbrido e `/api/telemetry` persistido no R2.
- **Chamada de Voz IA Full-Duplex (`AITutor.tsx`) + Osciloscópio F0:** VAD contínuo, *barge-in* e ajustes técnicos agrupados sob **⚙️ Avançado**, além de **Ruído Ambiente** com 3 intensidades (`Suave / Real / Desafio`) sincronizado ao Play.
- **Professor, Sala ao Vivo, Boletim PDF & Comunidade Realtime:** `TeacherStudio.tsx`, Jitsi WebRTC + geração pós-aula, Boletim PDF, retenção de áudios 60d e Fórum/Ligas Realtime.

### 1.3 Arquitetura, UI/UX, Testes & Distribuição
- **UI/UX Consolidada na `v8.3.0`:**
  - `Sidebar.tsx` enxuta + `SettingsModal.tsx` centralizando sotaques, tema, `i18n` (`PT/EN/ES` com paridade 100%), fonte, atualização, LGPD e logout em 2 cliques.
  - **Mobile `390x844`:** `Revisão` fixada na bottom bar (`Trilha · Revisão · Tutor IA · Simulados · Mais`), `LogOut` removido do topo, menu *Mais* sem grid quebrado, e `⚙️` + etapas retráteis no `LessonPlayer`.
  - **Hero & Dark Mode:** filtro CEFR único sticky, módulos persistidos em `sessionStorage`, tokens CSS semânticos (`--bg-canvas`, `--bg-surface`, `--text-primary`...), classes `fb-card-primary/secondary/info`, `ViewSkeleton` e `EmptyStateCard`.
- **Confiabilidade & Segurança:** **21 suítes / 73 testes Vitest** + **13/13 Playwright E2E** (Desktop, Mobile `390x844` e guarda de contraste Dark Mode) + job **`secret-scan`** automático no GitHub Actions.

---

## 2. Comparativo Completo com o Mercado (2026) — Incluindo UI & UX

| Dimensão | **FluentBridge `v8.3.0`** | **Duolingo Max** | **Busuu** | **Babbel** | **Speak** | **Preply / Cambly** |
| --- | --- | --- | --- | --- | --- | --- |
| **UI/UX · Clareza & Navegação** | **Sidebar enxuta + Modal `Configurações` + `Revisão` fixa na bottom bar mobile** | Muito limpa e linear | Muito limpa em módulos | Limpa, foco em desktop | Focada em chat/voz | Simples (agenda/vídeo) |
| **UI/UX · Foco na Lição & Mobile** | **Header mínimo mobile (`⚙️` + etapas retráteis) + Skeleton loaders** | Excelente foco por tela | Bom foco por etapa | Bom, menos lúdico | Excelente no mobile | Depende do navegador |
| **UI/UX · Dark Mode & Acessibilidade** | **Tokens CSS + `PT/EN/ES` 100% + Escala `A-..A++` + RTL Árabe** | Dark Mode nativo | Dark Mode nativo | Dark Mode parcial | Dark Mode nativo | Parcial |
| **Modelo Pedagógico** | **Híbrido (App + Professor real + IA + Comunidade)** | Autodidata gamificado + IA | Autodidata + correção de pares | Cursos estruturados | 100% Speaking com IA | Aulas 1:1 humanas |
| **Professor Humano, Turmas & VIP** | **Sim (turmas, VIP, tarefas, rubrica, Sala ao Vivo + Boletim PDF)** | Não | Não (pares) | Babbel Live (caro) | Não | Sim (por hora) |
| **Idiomas & Profundidade CEFR** | **12 idiomas (`1.236` unid. A1–C1 em Módulos + imersão B2/C1)** | 40+ (maioria A1–B2) | 14 (A1–C1) | 14 (A1–C1) | ~10 | 50+ (depende do tutor) |
| **Vocabulário Contextual SM-2** | **14.186 cards (`>=10`/unid., `100%` validados) + Cloze SM-2 + Espiral** | Revisão básica | Revisão SM-2 | Revisão por lição | Limitado | Manual |
| **Vozes Neurais & Sotaques Regionais** | **Gemini 2.5 Native TTS em 49 sotaques globais + Deepgram fallback** | Vozes sintéticas proprietárias | Áudios gravados (poucos sotaques) | Áudios estáticos | Vozes neurais | Voz humana |
| **Voz IA Full-Duplex & Fonética** | **Sim (VAD + Prosódia + Barge-in + Osciloscópio F0)** | Video Call (pago) | Não | Não | Sim (pago) | Humano |
| **Writing & Correção Inteligente** | **Híbrido IA semântica (aceita sinônimos) + Diff linha a linha + fallback** | Só em exercícios pagos | Correção por pares | Correção fixa | Foco em fala | Feedback humano |
| **Simulados Oficiais Completos** | **80 simulados em 20 exames (incl. DET `10–160`, CELPIP `en-CA`, IELTS)** | Só DET pago à parte | Não | Não | Não | Informal |
| **Vídeos Reais / Nativos (MP4)** | **Roteiros interativos com TTS/R2 pronto (falta mídia MP4 real)** | Animações | Vídeos nativos | Áudio nativo | Vídeo/Áudio | Vídeo ao vivo |
| **Lojas Oficiais & Pagamentos SaaS** | **`.apk`/`.aab`/`.exe` no CI (ainda sem Play/App Store nem billing SaaS)** | Sim | Sim | Sim | Sim | Sim |

---

## 3. Análise Qualitativa Atualizada & O Que Ainda Pode Melhorar (`v8.4 → v10.0`)

A entrega da `v8.3.0` resolveu as desconexões funcionais (`F-01…F-07`) e os gargalos críticos de UI/UX (`U-01…U-07`). Abaixo está a auditoria qualitativa atualizada do que **ainda pode evoluir** para levar o FluentBridge de “plataforma completa” para **produto de classe mundial em escala comercial**.

### 3.1 UI & UX — Polimento Estrutural & Micro-experiência
- **Q-01 · Migração completa dos arquivos restantes para Design Tokens sem `!important`**
  - **Hoje:** `src/index.css` já define variáveis semânticas (`--bg-canvas`, `--bg-surface`, `--text-primary` etc.) e corrigiu os buracos de contraste (`orange`, `teal`, `sky`), mas `TeacherStudio.tsx`, `AdminPanel.tsx`, `MockExamHub.tsx` e `VocabReview.tsx` ainda usam dezenas de classes claras (`bg-white`, `bg-slate-50`) sustentadas pelos overrides `!important` no `index.css`.
  - **Melhoria:** migrar esses quatro painéis para `fb-card-primary/secondary` e `dark:`, removendo gradualmente os `!important` globais de `index.css`.
  - **Aceite:** 0 overrides `!important` de cor de fundo em `index.css` e contraste ≥ 4.5:1 validado por Playwright em todas as abas.
- **Q-02 · Transições de etapa, feedback animado de XP e estados vazios unificados**
  - **Hoje:** `EmptyStateCard.tsx` e `ViewSkeleton.tsx` foram criados, mas parte das sub-telas (`CommunityHub`, `CertificatesView`, `LiveClassroomView`) ainda usa cards manuais distintos para listas vazias, e a troca entre etapas do `LessonPlayer` não anima o ganho de XP na barra.
  - **Melhoria:** adotar `EmptyStateCard` em todas as telas de lista vazia e adicionar micro-animação de progresso + *toast* sutil ao salvar palavra ou concluir checkpoint.
- **Q-03 · Sub-tabs dedicadas para “Imersão” vs. “Guias” na Sidebar**
  - **Hoje:** `TipsLibrary.tsx` já separa visualmente *Guias & Treino* e *Imersão*, mas ambos ainda compartilham o único item de menu `Imersão & Guias`.
  - **Melhoria:** avaliar separar `Imersão` (Podcasts, Vídeos, Graded Readers) como atalho direto se os dados de uso mostrarem baixa descoberta dos Leitores Graduados.

### 3.2 Arquitetura, Performance & Experiência Offline
- **Q-04 · Fatiamento de `TeacherStudio.tsx`, `App.tsx` e sub-splitting CEFR**
  - **Hoje:** `LessonPlayer.tsx` já teve etapas extraídas (`ListeningStepView`, `ReadingStepView`, `MatchingStepView`, `WritingFreeStepView`), mas `TeacherStudio.tsx` (~2.250 linhas) e `App.tsx` (~2.300 linhas) ainda concentram muitas responsabilidades; além disso, currículos maiores (`es/fr/it/de ~325–348 kB`) e `tutor-scenarios` (`472 kB`) carregam tudo de uma vez.
  - **Melhoria:** extrair hooks de domínio de `App.tsx` (progresso, comunidade, outbox) e abas de `TeacherStudio.tsx`; dividir currículos por faixa `A1–A2` vs. `B1–C1`.
  - **Aceite:** chunk inicial e chunk de idioma `< 180 kB` gzip no `npm run build`.
- **Q-05 · Pré-aquecimento em lote de áudios prioritários no Cloudflare R2 (`tts/v6/`)**
  - **Hoje:** como `v8.3.0` migrou para Gemini Tier 1 (`tts/v6/`), a 1ª reprodução de trechos longos de simulado leva ~3–15s até entrar em cache no R2.
  - **Melhoria:** rodar `scripts/prewarm-r2-tts.mjs` ampliado para pré-aquecer os **áudios dos 80 simulados** e primeiras unidades A1/A2 no bucket R2 `fluentbridge-media`.
  - **Aceite:** 100% dos áudios de `Listening` dos simulados respondendo com `X-TTS-Cache: R2-HIT` em `< 300ms`.

### 3.3 Segurança, Backend & Governança (incl. Lições de Vazamento)
- **Q-06 · Salvaguardas manuais pendentes no Console (`S-02`, `S-03`, `S-05`)**
  - **Hoje:** o incidente de 25/11/2026 (chave antiga exposta no histórico `919cfbb`/`fba45d4`/`26e1c90` e revogada) foi mitigado com chave nova só em Worker Secret (`S-01` ✅) e job `secret-scan` no CI (`S-04` ✅).
  - **Ações manuais pendentes:**
    - **S-02:** Restringir a chave no Google Cloud Console à *Generative Language API* + alerta de cota/orçamento.
    - **S-03:** Ativar *Secret Scanning + Push Protection* nas configurações do GitHub.
    - **S-05 (Opcional):** `git filter-repo` apenas se houver necessidade de limpar os commits históricos já revogados.
- **Q-07 · Descomissionar `fb_school_state` + `REQUIRE_SUPABASE_JWT=true` + Rate-Limit Distribuído**
  - **Hoje:** o Worker opera em modo JWT híbrido (`jwtMode: 'hybrid'`) e o rate-limit em memória é por instância edge.
  - **Melhoria:** exigir JWT válido nas rotas `/api/stt`, `/api/gemini-tutor` e `/api/telemetry` (`REQUIRE_SUPABASE_JWT=true`), mover cotas para `user_quotas` / KV e aposentar o snapshot JSONB legado.

### 3.4 Pedagogia, Voz & Imersão Audiovisual
- **Q-08 · Vídeos Curtos Reais (MP4/WebM) no Bucket R2 (`fluentbridge-media`)**
  - **Hoje:** os `36` vídeos interativos usam roteiros com síntese neural TTS.
  - **Melhoria:** hospedar clipes reais (15–45s) no R2 mantendo as legendas duplas clicáveis para SM-2 e checkpoints.
- **Q-09 · Alinhamento Fonético por Fonema & Modo *Hands-Free* ("Só Áudio")**
  - **Melhoria:** evoluir `phoneticFeedback.ts` com pontuação por fonema crítico (`/θ/`, `/ð/`, vogais nasais FR, `ü/ö` DE) e adicionar modo contínuo de revisão SM-2 para uso em trânsito/caminhada.

### 3.5 Professor, Escola & Monetização (SaaS)
- **Q-10 · Planos, Pagamentos (Pix/Stripe) & Multi-Escolas**
  - **Melhoria:** integrar Stripe / Mercado Pago para planos (*Gratuito*, *Pro Autônomo*, *Mentoria VIP*), controle de créditos de aulas VIP em `LiveClassroomView.tsx` e arquitetura *multi-tenant* para licenciar o FluentBridge a outros professores/escolas.
- **Q-11 · Moderação Assistida por IA & Desafios Sazonais na Comunidade**
  - **Melhoria:** filtro automático de spam/linguagem imprópria no Fórum Realtime e desafios mensais por idioma.

### 3.6 DevOps, Lojas Oficiais & Observabilidade
- **Q-12 · Publicação nas Lojas Oficiais (Google Play + App Store) & Code Signing Windows**
  - **Hoje:** CI já gera `.apk`, `.aab` e `.exe` e espelha em `silaswf/fluentbridge-releases`.
  - **Melhoria:** publicar o `.aab` na Google Play Console, compilar alvo Capacitor iOS e assinar o `.exe` com certificado EV/OV para eliminar o aviso do SmartScreen.
- **Q-13 · Observabilidade com Source Maps (Sentry) & Testes Visuais por Snapshot**
  - **Melhoria:** integrar captura de erros com source maps em produção e snapshots visuais Playwright Light/Dark em todos os viewports.

---

## 4. Histórico & Status de Implementação (`v7.0.0 → v10.0.0`)

| Versão | Foco Principal | Status / Entregas |
| --- | --- | --- |
| **`v7.0.0`** | **Performance, R2, Segurança, Pitch F0, Aulas ao Vivo, PDF & CI/CD** | ✅ `dynamic import()` por idioma + Cache R2 + Offline 3 unidades + JWT híbrido + Cloze SM-2 + Memória IA + 144 Drills + 12 Readers + Pitch F0 + Sala Jitsi + Boletim PDF + Realtime + CI Windows/Android + `i18n` & WCAG AA. |
| **`v8.0.0` – `v8.1.0`** | **Coesão Busuu, `>=10` Cards/Unid., Kanji/Kana, DET & Checkpoints** | ✅ Reading Dark Mode contraste AA + `script_phonics` (230 unid.) + Toggle `100% Kana` + `4` DET + `60` Podcasts (`180` checkpoints) & `36` Vídeos (`72` checkpoints) + `14.186` cards (`10–13`/unid.) 100% validados + glossário Unicode. |
| **`v8.2.0` – `v8.2.1`** | **Módulos Desdobráveis, 49 Sotaques, Outbox, LGPD & Correção Simulados** | ✅ Acordeão sequencial `Módulo 1…N` sem repetições + 4 etapas extraídas do `LessonPlayer` + Outbox + 49 sotaques com prompts nativos no Worker + Ruído Ambiente + Writing Diff + Adaptativo + Retenção + LGPD + Health Check + timeout longo nos simulados. |
| **`v8.3.0` (Atual)** | **Vozes Neurais Gemini nos 49 Sotaques + Auditoria Completa Funcional, UI/UX & Segurança** | ✅ **Gemini 2.5 Native TTS Tier 1 em 100% dos 49 sotaques** (Deepgram fallback neural; `tts/v6/` sem cache de fallback robótico; unlock síncrono + `speakTextAsync` + CELPIP `en-CA`) + `SettingsModal` + Sidebar enxuta + `Revisão` fixa mobile + menu *Mais* corrigido + Hero/CEFR único + Dark Mode tokens + correção `orange/teal/sky` + `i18n` 100% + Writing híbrido IA + Adaptativo persistente + Outbox real + LGPD `delete_my_account_data()` + Ruído c/ volume + `secret-scan` CI (**21/73 Vitest · 13/13 E2E**). |
| **`v8.4.0` – `v8.5.0`** | **Polimento Estrutural (`Q-01…Q-07`)** | ⏳ Migração total de `TeacherStudio`/`AdminPanel`/`MockExamHub` para tokens semânticos (`0` `!important`), sub-splitting CEFR, pré-aquecimento R2 dos 80 simulados, `REQUIRE_JWT=true` e ações manuais `S-02`/`S-03`. |
| **`v9.0.0` – `v10.0.0`** | **Escala Comercial (`Q-08…Q-13`)** | ⏳ Vídeos MP4 reais no R2, Alinhamento por fonema, Modo *Hands-Free*, Google Play + App Store + Windows Code Signing, e SaaS (Planos/Pix/Stripe + Multi-Escolas). |
