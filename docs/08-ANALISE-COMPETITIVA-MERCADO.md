# 08 — Auditoria 360° (`v8.1.0`), Saúde da Arquitetura & Análise Competitiva de Mercado

> **Data da auditoria:** 24/11/2026 · **Versão auditada:** `v8.1.0` (commit `8e90705`)  
> **Escopo:** Estado real da plataforma (`12` idiomas, `1.236` unidades com `13.736` passos, **`14.186` cards de vocabulário coesos 100% validados**, `2.400` guias gramaticais, `144` Grammar Drills, `12` Graded Readers em `60` capítulos, `480` cenários de Tutor IA com memória SM-2, **`80` simulados oficiais em `20` exames incl. DET**, **`60` podcasts (`180` checkpoints)**, **`36` vídeos interativos (`72` checkpoints)**, Chamada Full-Duplex VAD + Osciloscópio F0, Sala ao Vivo Jitsi, Boletim PDF e Comunidade Realtime), comparativo atualizado com o mercado global e plano estruturado de evolução (`v8.2 → v10.0`).

---

## 1. Raio-X Atual da Plataforma (`v8.1.0`)

### 1.1 Escala de Conteúdo & Qualidade Pedagógica
- **12 Idiomas Completos (CEFR A1–C1):** Inglês (`en`), Espanhol (`es`), Francês (`fr`), Italiano (`it`), Alemão (`de`), Russo (`ru`), Japonês (`ja`), Chinês (`zh`), Árabe (`ar` RTL), Holandês (`nl`), Africâner (`af`) e Sueco (`sv`).
- **1.236 Unidades Estruturadas (`103` por idioma · `13.736` passos totais):** organizadas em **Módulos estilo Busuu** (`moduleIndex`, `moduleTitlePt`) com **Pontos de Verificação (+60 XP)** ligados a podcasts e vídeos, unidades de **Expressões Idiomáticas, Gírias e Registro Informal/Tabu `18+`**, imersão no idioma-alvo a partir do **B2/C1** com botão opcional **"Traduzir PT"** e salvamento de progresso passo a passo (`topicStepProgress`).
- **14.186 Cards de Vocabulário Coesos (SM-2 + Cloze):** mínimo garantido de **`10` palavras por unidade** (`10–13` cards/unidade em 100% das 1.236 unidades, inclusive Unidade 0), combinando extração de termos reais de Listening/Reading/Story/Dictation/Speaking (`inLessonLexicon.ts`), **Revisão Espiral** (`recycledLinks` de unidades anteriores) e validação automática 100% via `exampleMatchesWord` (`src/utils/vocabValidation.ts`).
- **Alinhamento Profundo das Etapas (`courseCohesion.ts` & `LessonPlayer.tsx`):** Matching ampliado para `5` pares do vocabulário da unidade, Cloze coeso automático (`Prática · Vocabulário da Unidade`), glossário interativo Unicode no Reading (até `12` termos, compatível com CJK/Árabe/Cirílico), checklist de uso de vocabulário no Writing e faixa clicável **"Vocabulário da unidade em uso"** com áudio em `Listening`, `Reading` e `Story`.
- **Letras, Sons & Kanji Progressivo (`230` unidades com `script_phonics` + Toggle `100% Kana`):** introdução progressiva de letras e novos Kanji antes das atividades para `ru` (33 Cirílico), `ar` (28 Árabe + 4 formas RTL), `zh` (Hanzi + tons) e `ja` (Hiragana/Katakana + Kanji), além de toggle **`漢字 Padrão` / `あいう Kana`** no Japonês e Treinador dedicado de Escrita & Traços.
- **Gramática, Leitura Graduada, Tutor IA & Nivelamento:** `2.400` guias gramaticais (`200`/idioma), `144` **Grammar Drills** (`12`/idioma), `12` **Graded Readers** (`60` capítulos clicáveis para SM-2), `480` cenários de Tutor IA (`40`/idioma + `10` ângulos por unidade) com **memória pedagógica** conectada ao SM-2 e ao Caderno de Erros, e `480` questões adaptativas de nivelamento (CAT, `40`/idioma).
- **80 Simulados Oficiais Cronometrados (`20` exames reais):** CELPIP, IELTS, TOEFL, **DET (4 simulados Duolingo English Test na escala `10–160`)**, DELE, DELF, CILS, Goethe, TORFL, JLPT, HSK, ALPT, NT2 e Swedex, com filtro por categoria, **Speaking em 3 partes (IA + Professor)** e **Rubrica Analítica de Writing em 4 critérios** com reescrita C1/C2.
- **Imersão Audiovisual Expandida:** **`60` Podcasts** (`602` falas e `180` checkpoints distribuídos durante o áudio, 3/episódio) e **`36` Vídeos Curtos Interativos** (`324` falas e `72` checkpoints, 2/clipe) com legendas duplas clicáveis (`SM-2`).

### 1.2 Vozes Neurais, IA, Escola & Áudio
- **Cloudflare Worker Edge (`fluentbridge-api`):**
  - TTS neural com Deepgram Aura-2 + Gemini 2.5 Neural TTS com prompts nativos no idioma-alvo, `languageCode` BCP-47, guarda anti-alucinação e **cache persistente no Cloudflare R2 (`fluentbridge-media`)** reduzindo latência e protegendo cotas gratuitas.
  - STT em nuvem via Whisper Large v3 Turbo (`/api/stt`), Tutor IA via `/api/gemini-tutor` com `GEMINI_API_KEY` isolada no servidor, validação **JWT Supabase híbrida** e endpoint `/api/telemetry`.
  - **Chamada de Voz IA Full-Duplex (`voiceVadEngine.ts`) + Osciloscópio F0 (`PitchOscilloscope.tsx`):** detecção contínua de fala (VAD), *barge-in*, análise de prosódia/entoação e visualização de frequência fundamental (`F0`) para tons do Mandarim e *pitch accent* do Japonês.
- **Professor, Sala ao Vivo, Boletim PDF & Comunidade Realtime:**
  - `TeacherStudio.tsx` com turmas, alunos VIP, tarefas, rubrica de Speaking/Writing, **Sala de Aula ao Vivo** (Jitsi WebRTC + bloco de notas + geração de tarefa/flashcards pós-aula com IA), **Boletim Pedagógico Mensal em PDF**, retenção de áudios por 60 dias (`fb-audio`) e **Comunidade Realtime** (Ligas, Fórum e Correções entre pares).

### 1.3 Arquitetura, Testes & Distribuição Multiplataforma
- **Stack & Modularidade:** React 19 + TypeScript + Vite 6 + Tailwind CSS v4 + Workbox PWA + Capacitor 7 (Android) + Electron (`electron-builder` NSIS Windows) + Cloudflare Pages/Workers/R2 + Supabase.
- **Carregamento Dinâmico & Offline Seletivo:** `dynamic import()` por idioma (`courseLoader.ts`) reduziu o precache do PWA para **`28` entradas (`1555,89 KiB`)**, somado ao download seletivo das **próximas 3 unidades offline** em `IndexedDB`, interface multi-idioma **`i18n` (`PT / EN / ES`)** e acessibilidade **WCAG AA** (incluindo Reading Dark Mode com contraste validado).
- **Confiabilidade Automatizada:** **18 suítes / 55 testes unitários Vitest** (validando todos os 14.186 cards, 1.236 unidades, DET, Podcasts/Vídeos e sync de nuvem) + **10/10 testes E2E Playwright** no Chromium.
- **Distribuição & CI/CD (`v8.1.0`):**
  - Web/PWA: `https://fluentbridge.pages.dev` + manifesto `https://fluentbridge.pages.dev/version.json` (`HTTP 200`).
  - GitHub Actions (`build-apk` + `build-windows`) + canal público `https://github.com/silaswf/fluentbridge-releases/releases/tag/v8.1.0` com Windows `.exe` (`93.987.813` bytes, `HTTP 200`) e Android `.apk` (`6.637.350` bytes, `HTTP 200`), mantendo o código-fonte 100% privado em `silaswf/fluentbridge`.

---

> **Nota (25/11/2026):** esta análise compara **funcionalidades**. A avaliação qualitativa das funções já existentes e a auditoria de **UI/UX** (navegação, densidade visual, mobile, Dark Mode, i18n) estão em [09 — Plano de Melhorias `v8.3`](./09-PLANO-v8.3-MELHORIAS-FUNCIONAIS-E-UI-UX.md).

## 2. Comparativo Completo com o Mercado (2026)

| Dimensão | **FluentBridge `v8.1.0`** | **Duolingo Max** | **Busuu** | **Babbel** | **Speak** | **Preply / Cambly** |
| --- | --- | --- | --- | --- | --- | --- |
| **Modelo Pedagógico** | **Híbrido (App + Professor real + IA + Comunidade)** | Autodidata gamificado + IA | Autodidata + correção de pares | Cursos estruturados | 100% Speaking com IA | Aulas 1:1 humanas |
| **Professor Humano, Turmas & VIP** | **Sim (turmas, VIP, tarefas, rubrica, Sala ao Vivo + Boletim PDF)** | Não | Não (pares) | Babbel Live (caro) | Não | Sim (por hora) |
| **Idiomas & Profundidade CEFR** | **12 idiomas (`1.236` unid. A1–C1 em Módulos + imersão B2/C1)** | 40+ (maioria A1–B2) | 14 (A1–C1) | 14 (A1–C1) | ~10 | 50+ (depende do tutor) |
| **Vocabulário Contextual SM-2** | **14.186 cards (`>=10`/unid., `100%` validados) + Cloze SM-2 + Revisão Espiral** | Revisão básica | Revisão SM-2 | Revisão por lição | Limitado | Manual |
| **Voz IA Full-Duplex & Fonética** | **Sim (VAD + Prosódia + Barge-in + Osciloscópio F0)** | Video Call (pago) | Não | Não | Sim (pago) | Humano |
| **Escrita Não-Latina Integrada** | **`script_phonics` em 230 unid. (RU/AR/ZH/JA) + Kanji progressivo + Toggle Kana** | Treino separado | Parcial | Não | Não | Depende do tutor |
| **Simulados Oficiais Completos** | **80 simulados em 20 exames (incl. DET `10–160`, CELPIP, IELTS + Rubrica)** | Só DET pago à parte | Não | Não | Não | Informal |
| **Podcasts, Vídeos & Graded Readers** | **60 Podcasts (`180` checkpoints) + 36 Vídeos (`72` checkpoints) + 12 Readers** | Podcasts curtos | Vídeos nativos | Podcasts | Não | Não |
| **Vídeos Reais / Nativos (MP4)** | **Roteiros interativos com TTS/R2 pronto (falta mídia MP4 real)** | Animações | Vídeos nativos | Áudio nativo | Vídeo/Áudio | Vídeo ao vivo |
| **Lojas Oficiais & Pagamentos SaaS** | **`.apk`/`.aab`/`.exe` prontos (ainda sem Play/App Store nem billing SaaS)** | Sim | Sim | Sim | Sim | Sim |

---

## 3. O Que Mais Pode Ser Feito — Plano de Melhorias em Todos os Âmbitos (`v8.2 → v10.0`)

Abaixo está o diagnóstico atualizado do que ainda separa o FluentBridge `v8.1.0` de uma plataforma comercial madura em escala global, organizado por área.

### 3.1 Arquitetura, Performance & Experiência Offline (Impacto Alto · Esforço Médio)
1. **Modularização dos Componentes Orquestradores Ainda Extensos:**
   - **Situação atual:** apesar de `VocabIntroStep.tsx` e `ClassAnalyticsTab.tsx` já terem sido extraídos, `LessonPlayer.tsx` (`2.544` linhas), `TeacherStudio.tsx` (`2.249` linhas), `App.tsx` (`2.214` linhas) e `LearningPath.tsx` (`1.265` linhas) ainda concentram muita lógica no mesmo arquivo.
   - **Melhoria:** extrair subcomponentes por tipo de etapa e por aba do Estúdio/App, reduzindo o risco de regressões visuais e facilitando testes de UI isolados.
2. **Fila Offline de Sincronização (*Outbox* / Background Sync) + Pré-aquecimento no R2:**
   - **Melhoria:** adicionar fila persistente em `IndexedDB` para tentativas de lições, revisões SM-2 e gravações feitas sem internet, sincronizando automaticamente ao reconectar, além de um script de pré-aquecimento em lote dos áudios das `14.186` frases no bucket R2 `fluentbridge-media`.
3. **Sub-splitting de Pacotes por Nível CEFR (`A1–A2` vs. `B1–C1`):**
   - **Melhoria:** dividir os bundles maiores de currículo (`es/fr/it/de ~325–348 kB`) e `tutor-scenarios` (`472,39 kB`) sob demanda por faixa de nível, acelerando ainda mais o carregamento inicial em redes 3G/4G móveis.

### 3.2 Segurança, Backend & Escalabilidade Real (Impacto Crítico · Esforço Médio)
4. **Descomissionamento Definitivo de `fb_school_state` + `REQUIRE_JWT=true` Estrito:**
   - **Risco atual:** o Worker já valida JWT de forma híbrida e o app usa tabelas relacionais, mas o snapshot legado `fb_school_state` e chamadas sem JWT obrigatório ainda permanecem por compatibilidade.
   - **Melhoria:** migrar 100% da leitura/escrita para as tabelas relacionais com RLS estrito em `supabase_schema.sql` e ativar `REQUIRE_JWT=true` no Cloudflare Worker.
5. **Rate-Limiting Distribuído, Telemetria Persistente & Conformidade LGPD:**
   - **Risco atual:** `memoryTelemetryLogs` no `cloudflare-worker/worker.js` é volátil em memória por instância edge.
   - **Melhoria:** persistir `/api/telemetry` e contadores de cota por usuário em D1/KV ou Supabase, e adicionar fluxo self-service de **Exportação e Exclusão de Conta (LGPD)**.
6. **Observabilidade Completa com Source Maps & Health Checks Sintéticos:**
   - **Melhoria:** integrar captura de erros com source maps (ex.: Sentry) e monitoramento periódico automático de `/version.json`, Worker `/api/tts` e Supabase Auth.

### 3.3 Pedagogia, Conteúdo & Retenção de Aprendizado (Impacto Alto · Esforço Médio)
7. **Sotaques Regionais & Áudio com Ruído Realista nos Níveis B1–C1:**
   - **Melhoria:** simular diálogos em estação de trem, café, chamada telefônica e múltiplos sotaques (ex.: escocês/australiano no EN, rioplatense/caribenho no ES, quebequense no FR) para preparar o aluno para compreensão auditiva real.
8. **Corretor Gramatical & de Estilo Linha a Linha no `writing_free`:**
   - **Melhoria:** integrar correção estruturada com *diff* visual (o que o aluno escreveu vs. versão natural B2/C1, explicando por que mudou) e registro automático de recorrências no `mistakeBank`.
9. **Notificações Inteligentes de Retenção (Push Android/Web Push):**
   - **Melhoria:** lembretes contextuais via Capacitor Push / Web Push para cartões SM-2 prestes a vencer, risco de perda de ofensiva (*streak*), feedback publicado pelo professor e aviso 15 min antes da Sala ao Vivo.
10. **Dificuldade Adaptativa em Tempo Real na Trilha:**
    - **Melhoria:** ajustar automaticamente a proporção de revisão em espiral, velocidade do áudio e dicas em português conforme a taxa de acerto e o tempo de resposta recente do aluno.

### 3.4 Voz, Fonética & Imersão Audiovisual (Impacto Alto · Esforço Médio/Alto)
11. **Vídeos Curtos Reais (MP4/WebM) no Bucket R2 `fluentbridge-media`:**
    - **Melhoria:** substituir gradualmente a reprodução TTS dos `36` roteiros em `InteractiveVideoView.tsx` por gravações reais nativas (15–45s) hospedadas no **Cloudflare R2** com legendas duplas sincronizadas clicáveis e *shadowing* frase a frase.
12. **Alinhamento Fonético por Fonema (Forced Alignment Real):**
    - **Melhoria:** evoluir `phoneticFeedback.ts` (hoje heurístico sobre transcrição Whisper + oscilador F0) para pontuar fonemas críticos individuais (`/θ/`, `/ð/`, `/ɪ/` vs. `/iː/`, vogais nasais FR, `ü/ö` DE) com confiança por segmento.
13. **Modo Hands-Free ("Só Áudio" para Trânsito/Caminhada):**
    - **Melhoria:** reprodução contínua de revisão SM-2 e flashcards por comando de voz sem precisar olhar para a tela no celular.

### 3.5 Professor, Escola, Comunidade & Monetização (Impacto Estratégico · Esforço Médio/Alto)
14. **Planos, Pagamentos & Multi-Escolas (SaaS — antigo #18):**
    - **Melhoria:** integração com Stripe / Mercado Pago (Pix + Cartão) para planos (*Gratuito*, *Pro Autônomo*, *Mentoria VIP*), cotas de IA por plano e arquitetura *multi-tenant* para licenciar o FluentBridge a outros professores e escolas.
15. **Pacotes de Aulas VIP, Presença & Reagendamento Automático:**
    - **Melhoria:** vincular a `LiveClassroomView.tsx` a um controle de créditos de aulas VIP, histórico de presença, cancelamento com regra de antecedência e resumo automático enviado ao aluno após a sessão.
16. **Moderação Assistida por IA & Desafios Sazonais na Comunidade:**
    - **Melhoria:** filtro automático de spam/linguagem imprópria no Fórum Realtime e desafios mensais temáticos por idioma com medalhas exclusivas.

### 3.6 DevOps, CI/CD & Distribuição nas Lojas (Impacto Alto · Esforço Baixo/Médio)
17. **Publicação nas Lojas Oficiais (Google Play Store + Apple App Store / iOS) & Code Signing Windows (antigo #20):**
    - **Melhoria:** submeter o `.aab` já gerado pelo CI na Google Play Console (atualizações nativas sem "fontes desconhecidas"), compilar o alvo Capacitor iOS e assinar digitalmente o instalador Windows (EV/OV Code Signing) para eliminar o aviso do SmartScreen.
18. **Automação Total do Espelho Público via Secret no CI:**
    - **Situação atual:** `.github/workflows/build-android-apk.yml` já compila `.apk`, `.aab` e `.exe`, mas o espelhamento para `silaswf/fluentbridge-releases` ainda depende do secret `RELEASES_MIRROR_TOKEN` configurado no repositório (sem ele, o espelho precisa ser finalizado localmente via `gh release`).
    - **Melhoria:** configurar `RELEASES_MIRROR_TOKEN` nas Secrets do GitHub para publicação 100% *zero-touch* em cada tag `v*`.
19. **Suite E2E Multi-Viewport & Regressão Visual:**
    - **Melhoria:** expandir os 10 testes Playwright atuais para cobrir também viewport mobile (`390x844`), fluxo completo de escrita árabe RTL, destaque de glossário em Japonês/Chinês e snapshots visuais em Dark/Light Mode.

---

## 4. Status de Implementação (`v8.1.0` Entregue) e Próxima Matriz

| Fase | Foco Principal | Status / Entregas |
| --- | --- | --- |
| **`v7.0.0` (Entregue)** | **Performance, R2, Segurança, Pedagogia, Pitch F0, Aulas ao Vivo, PDF & CI/CD** | ✅ `dynamic import()` por idioma + Cache TTS/MP4 no Cloudflare R2 + Offline 3 unidades + JWT híbrido & `/api/telemetry` + Cloze SM-2 + Memória IA + 144 Grammar Drills + 12 Graded Readers (60 cap.) + Pitch F0 + Sala ao Vivo Jitsi + Boletim PDF + Realtime + CI Windows/Android + `i18n` (`PT/EN/ES`) & WCAG AA. |
| **`v8.0.0` – `v8.0.1` (Entregues)** | **Coesão Busuu, Kanji/Kana, DET & Podcasts/Vídeos com Checkpoints** | ✅ Reading Dark Mode contraste AA + `script_phonics` (230 unid. RU/AR/ZH/JA + Kanji progressivo) + Toggle `100% Kana` + `4` simulados DET (`10–160`) + 60 Podcasts (`180` checkpoints) & 36 Vídeos (`72` checkpoints) integrados aos Módulos da trilha + preservação do Passo 1 após Cloud Sync. |
| **`v8.1.0` (Entregue — Atual)** | **`>=10` Palavras Coesas/Unidade, Extração das Atividades & Glossário Unicode** | ✅ `14.186` cards (`10–13`/unidade em 100% das 1.236 unidades, incl. Unidade 0) + extração de termos de Listening/Reading/Story/Dictation/Speaking (`inLessonLexicon.ts`) + Matching 5 pares + Cloze coeso + faixa clicável *"Vocabulário da unidade em uso"* + glossário Unicode CJK/Árabe/Cirílico + 18/18 Vitest (55 testes) + 10/10 Playwright E2E. |
| **`v8.2.0` (Entregue — Atual)** | **Módulos Desdobráveis, 49 Sotaques, Offline Outbox, LGPD & Testes Humanos** | ✅ Acordeão por módulo na trilha + extração de 4 etapas do `LessonPlayer` + fila offline *Outbox* + **49 sotaques regionais** + ruído ambiente Web Audio + Writing Diff + Dificuldade Adaptativa + Alertas de Retenção + Privacidade/LGPD (JSON + exclusão) + Health Check ao vivo + `RELEASES_REPO_TOKEN` no CI + **19 suítes (60 testes) Vitest** + **13/13 Playwright E2E** (incl. 3 jornadas humanas Desktop/Mobile). |
| **`v8.3.0` (Entregue — Atual)** | **Vozes Neurais Gemini nos 49 Sotaques + Auditoria Completa Funcional, UI/UX & Segurança (`F-01…F-07`, `U-01…U-07`, `S-01`, `S-04`)** | ✅ Gemini 2.5 Native TTS como Tier 1 em todos os 49 sotaques (Deepgram fallback neural; `tts/v6/` sem cache de fallback robótico); `SettingsModal`, Sidebar enxuta, `Revisão` fixa na bottom bar mobile, Hero limpo, Dark Mode tokens + correção laranja/teal/sky, `i18n` 100%, Writing híbrido com IA, Adaptativo persistente, Outbox real, LGPD RPC, Ruído Ambiente c/ volume e `secret-scan` no CI. Detalhes em [09 — Plano `v8.3`](./09-PLANO-v8.3-MELHORIAS-FUNCIONAIS-E-UI-UX.md). |
| **`v9.0.0` – `v10.0.0` (Estratégico)** | **Lojas Oficiais, Vídeos MP4 no R2 & Monetização SaaS** | ⏳ Vídeos MP4 reais no R2 (#11), Publicação Google Play Store + iOS (App Store) + Windows Code Signing (#17) e Sistema de Planos/Pagamentos + Multi-Escolas (#14). |
