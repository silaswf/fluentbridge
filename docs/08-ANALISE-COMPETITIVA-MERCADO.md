# 08 — Auditoria 360° (`v5.0.0`), Saúde da Arquitetura & Análise Competitiva de Mercado

> **Data da auditoria:** 23/11/2026 · **Versão auditada:** `v5.0.0`  
> **Escopo:** Arquitetura e Estrutura do Código, Bundle/PWA, UI/UX, Pedagogia (`1.200` unidades em `12` idiomas), `72` Simulados Cronometrados Oficiais, Comunidade (Ligas + Fórum), Alfabetos Completos, Gateway de Download, Segurança (RLS Relacional + Compactação Esparsa), Suíte E2E Playwright e Estratégia para Top 1 Mundial.

---

## 1. Auditoria 360° da Plataforma (`v3.0.0`)

### 1.1 Arquitetura & Performance de Bundle
- **Stack:** React 19 + TypeScript + Vite 7 + Tailwind CSS v4 + Workbox PWA + Capacitor 7 (Android) + Electron + `electron-builder` (Windows NSIS Setup) + Cloudflare Workers AI + Supabase.
- **Code-Splitting Modular (`vite.config.ts`):**
  - Chunks isolados por idioma e domínio (`curriculum-en-special`, `curriculum-es`, `curriculum-fr`, `curriculum-it`, `curriculum-de`, `curriculum-ru`, `curriculum-ja`, `curriculum-zh`, `grammar-en..zh`, `placement-bank`), evitando inflar o bundle inicial e respeitando com folga o limite de `3 MB` do precache PWA.
  - Lazy loading de módulos pesados (`LessonPlayer`, `AITutor`, `VocabReview`, `TipsLibrary`, `TeacherStudio`, `AdminPanel`, `PlacementTestModal`, `CertificatesView`).
- **Correção Crítica na `v3.0.0` (`Minified React error #300`):**
  - Identificada e corrigida a causa raiz do crash ao concluir unidades (especialmente reportado em Alemão): um `useEffect` de atalhos de teclado em [`src/components/LessonPlayer.tsx`](../src/components/LessonPlayer.tsx) estava declarado **após** retornos condicionais (`if (isCompletedScreen)` e `if (!currentStep)`). Ao concluir a lição, o React detectava redução no número de hooks e disparava Error #300 antes de exibir a tela de parabéns. O hook foi movido para antes dos retornos condicionais e protegido por guarda interna.

### 1.2 Pedagogia, Subunidades & Revisão Progressiva
- **Subunidades / Etapas estilo Busuu (`LessonPlayer.tsx`, `LearningPath.tsx`):**
  - Toda unidade possui barra visual de etapas clicáveis (**Vocabulário → Dicas → Listening → Reading → Prática → Speaking → Writing**), permitindo revisitar etapas já alcançadas.
  - **Salvamento de progresso parcial (`topicStepProgress`):** ao sair no meio da unidade, o sistema salva `stepIdx`, `completedSteps`, `totalSteps` e `updatedAt` (sincronizado com a nuvem) e exibe barra de progresso + botão **"Continuar (X/Y)"** na trilha.
- **Revisão Progressiva estilo Duolingo/Busuu (`src/utils/vocabUnlock.ts`, `VocabReview.tsx`):**
  - Eliminado o problema crítico em que todas as palavras do sistema apareciam no deck desde o dia 1.
  - Agora o aluno começa com o deck limpo e **desbloqueia palavras progressivamente** ao passar pela etapa inicial **Vocabulário da Unidade** (onde cada palavra tem pronúncia neural, IPA/romanização/pinyin, tradução e **frase de exemplo com áudio próprio**) ou ao concluir a unidade.
  - Flashcards em `VocabReview.tsx` exibem a frase de exemplo contextual já na frente/verso com botão de áudio separado e tag da unidade de origem, mantendo modo opcional **"Catálogo"** para professores/preview.
- **8 Idiomas Completos com Imersão B2/C1 (`EN, ES, FR, IT, DE, RU, JA, ZH`):**
  - **`410` unidades CEFR** (`60` EN + `50` cada nos outros 7 idiomas), **`800+` dicas**, **`800` tabelas gramaticais** (`100`/idioma), **`160` cenários base de Tutor IA** (`20`/idioma + `10` ângulos dinâmicos por unidade = `4.100` combinações) e **`320` questões adaptativas CAT** (`40`/idioma, 100% no idioma-alvo).

### 1.3 Armazenamento, Sincronização & Retenção Automática de Áudios (60 dias)
- **Onde os dados ficam armazenados:**
  1. **Dispositivo local:** `IndexedDB` (`fluentbridge_audio_v1`, store `clips`) armazena gravações de voz (`32 kbps`) e cache local de TTS neural (`tts-v3:*`).
  2. **Nuvem (Supabase Storage):** gravações enviadas ao professor sobem para o bucket **`fb-audio`** em `speaking/<submissionId>.webm|m4a|ogg`. Se o bucket estiver indisponível e o áudio for `<= 600 KB`, há fallback `audioDataUrl` no JSONB `fb_school_state`.
  3. **Atividades escritas & feedbacks:** textos, transcrições, notas automáticas, rubricas (`clarity/intonation/rhythm`), selos e feedbacks escritos do professor ficam como texto leve em `submissions`.
- **Autolimpeza de 60 dias (`src/utils/audioRetention.ts`, `useCloudSyncController.ts`, `AdminPanel.tsx`, `supabase_schema.sql`):**
  - Executa automaticamente a cada 24h na inicialização conectada (e manualmente pelo Painel Admin): remove apenas os arquivos de áudio com mais de **60 dias** no bucket `fb-audio` e `IndexedDB`, marca `audioArchived: true` e **preserva 100% das transcrições, notas, rubricas e feedbacks escritos**.
  - Função SQL `public.cleanup_expired_speaking_audios(60)` incluída em [`supabase_schema.sql`](../supabase_schema.sql) para agendamento opcional via `pg_cron`.

### 1.4 Vozes Neurais, STT & Segurança
- **Vozes (`cloudflare-worker/worker.js` `v3.0.0`):** Deepgram Aura-2 (`en-US`, `en-GB`, `es-ES`, `es-MX`) + Gemini 2.5 Neural TTS (`fr-FR`, `fr-CA`, `it-IT`, `it-CH`, `de-DE`, `de-AT`, `ru-RU`, `ru-SPB`, `ja-JP`, `ja-KANSAI`, `zh-CN`, `zh-TW`) + Whisper Large v3 Turbo (`/api/stt`) nos 8 idiomas.
- **Avaliação de Pronúncia Unicode/CJK (`src/utils/speech.ts`):** `evaluatePronunciation` atualizado para suportar alfabeto cirílico (Russo) e escrita contínua sem espaços em Japonês e Chinês.
- **Segurança:** `GEMINI_API_KEY` permanece isolado em segredo do Cloudflare Worker (`DIST_LEAK=CLEAN`); Rate-Limit por IP nas rotas `/api/tts` (120/min), `/api/stt` (30/min) e `/api/gemini-tutor` (30/min).
- **Ponto de atenção (Dívida Técnica de Segurança):** O snapshot rápido `fb_school_state` ainda usa política permissiva (`using (true)`) para compatibilidade com turmas sem login Supabase obrigatório; a migração definitiva para tabelas relacionais com RLS estrito por JWT (`profiles`, `submissions`, `student_progress`) deve ser priorizada na fase `v3.1–v4.0`.

### 1.5 Multiplataforma
- **Web / PWA:** `https://fluentbridge.pages.dev` (instalável desktop/mobile, cache offline Workbox).
- **Windows:** Instalador NSIS oficial (`FluentBridge-Setup-3.0.0.exe` via `electron-builder`).
- **Android:** Capacitor 7 com `WindowInsetsCompat` (safe areas corrigidas), `.apk` assinado e `.aab` via GitHub Actions.

---

## 2. Comparativo Completo com o Mercado (2026)

| Dimensão | **FluentBridge v5.0** | **Duolingo** | **Busuu** | **Babbel** | **Speak** | **Cambly / Preply** |
| --- | --- | --- | --- | --- | --- | --- |
| **Modelo Pedagógico** | **Híbrido (App + Professor real + IA + Comunidade)** | 100% Autodidata gamificado | Autodidata + correções da comunidade | Cursos estruturados por diálogo | 100% Foco em Speaking com IA | Aulas 1:1 com tutores humanos |
| **Professor Humano & Turmas/VIP** | **Sim (nativo: turmas, VIP, rubrica, selos, tarefas)** | Não | Não (apenas pares) | Não (ou Babbel Live caro) | Não | Sim (pago por hora/mês) |
| **Quantidade de Idiomas** | **12 completos (EN, ES, FR, IT, DE, RU, JA, ZH, AR, NL, AF, SV)** | 40+ | 14 | 14 | ~10 | 50+ (Preply) |
| **Profundidade CEFR (A1–C1)** | **100 unid./idioma (`1.200` total) + imersão B2/C1 + Traduzir PT** | A1–B2 (C1 parcial) | A1–C1 | A1–C1 | A1–C1 | Depende do tutor |
| **Simulados Oficiais Cronometrados** | **Sim (`72` simulados em 18 exames reais + tabelas CEFR)** | Não (só DET pago à parte) | Não | Não | Não | Preparação informal |
| **Comunidade, Ligas & Correções** | **Sim (Ligas Bronze→Diamante + Fórum por idioma + correções)** | Ligas apenas (sem fórum) | Correções sociais | Não | Não | Não |
| **Treinador de Escrita Completa** | **Sim (46 Hiragana, 46 Katakana, 33 Cirílico, 28 Árabe 4 formas RTL, 40 Hanzi)** | Hiragana/Hangul/Árabe | Não | Não | Não | Não |
| **Testes E2E & Confiabilidade** | **38 Vitest + 7 Playwright E2E no navegador** | Interno | Interno | Interno | Interno | Interno |

---

## 3. Diagnóstico Estratégico: Vantagens, Paridade e O Que Falta para Ser Top 1

### 3.1 Onde o FluentBridge JÁ VENCE os Concorrentes
1. **Arquitetura Híbrida Escola + Autonomia (Inexistente no Duolingo/Babbel/Speak):** Nenhum app de mercado une trilha gamificada completa A1–C1, SRS SM-2, Tutor IA e **um Estúdio do Professor real** com turmas, alunos VIP por código (`PROF-SILAS`), rubricas de pronúncia (clareza, entonação, ritmo), tarefas direcionadas e certificados verificáveis.
2. **Didática Desenhada para Brasileiros:** Combate direto ao portunhol/falsos cognatos, dicas fonéticas com aproximação em português no A1–B1 e **transição automática para 100% de imersão no idioma-alvo em B2 e C1**.
3. **Sem Paywall Punitivo & Custo de Infraestrutura Enxuto:** Roda em Cloudflare Workers/Pages + Supabase com autolimpeza de áudio em 60 dias, entregando TTS/STT neurais sem cobrar assinatura por "vidas".
4. **Verdadeiramente Multiplataforma:** Instalador Windows nativo (`Setup.exe`), Android assinado (`.apk`/`.aab`) e Web PWA instalável.

### 3.2 Onde o FluentBridge EMPATA com os Líderes (`v3.0`)
- Estrutura modular estilo Busuu (etapa de Vocabulário introdutório + salvamento passo a passo dentro da unidade).
- Revisão SRS progressiva estilo Duolingo/Busuu (cartões entram conforme o aluno estuda, sempre com frase de exemplo e áudio).
- Teste de nivelamento adaptativo (CAT) no idioma-alvo em todos os 8 idiomas.
- Cobertura dos principais idiomas globais ocidentais e orientais (`EN, ES, FR, IT, DE, RU, JA, ZH`).

### 3.3 O Que FALTA Implementar (`Roadmap v3.1 → v4.0`) para Rivalizar com os Melhores do Mundo

#### Lacunas em relação a funcionalidades já existentes nos líderes:
1. **Treinador de Escrita & Alfabetos Não-Latinos (`Duolingo / Busuu / LingoDeer`):**
   - Para **Japonês (Hiragana, Katakana, Kanji)**, **Chinês (Hanzi/Radicais/Tons)** e **Russo (Cirílico cursivo e de imprensa)**, falta uma aba dedicada de **Prática de Escrita / Ordem de Traços & Leitura Fonética** (canvas de desenho + reconhecimento de caracteres e treino visual de tons do mandarim).
2. **Análise Fonética por Fonema/Sílaba (`ELSA Speak / Speak`):**
   - Hoje o `evaluatePronunciation` avalia acertos palavra-a-palavra. Falta destaque **por sílaba/fonema** com feedback articulatório específico (ex.: `/θ/` vs `/s/` no inglês, vogais nasais do francês, tons 1–4 do mandarim).
3. **Chamada de Voz IA em Tempo Real (Full-Duplex / Baixa Latência) (`Speak / Duolingo Max`):**
   - Modo "Ligação ao Vivo" no Tutor IA com VAD (detecção automática de fim de fala) para conversar sem apertar botão a cada turno.
4. **Pacotes de Áudio Offline Baixáveis (`Busuu / Babbel`):**
   - Permitir baixar um nível inteiro (`A1`, `A2`, etc.) em cache antes de viagens de avião/metrô sem internet.
5. **Comunidade & Correção entre Pares / Desafios Semanais (`Busuu / Duolingo Leagues`):**
   - Ligas semanais automáticas por XP dentro da escola/turma e opcionalmente revisão comentada entre alunos avançados (C1) e iniciantes, moderada pelo professor.

#### Inovações de Próxima Geração (Diferenciais Novos):
6. **Caderno Inteligente de Erros & Gramática em SRS ("Mistake Bank"):**
   - Capturar automaticamente frases em que o aluno errou no `Dictation`, `FillBlank`, `Tutor IA` ou recebeu `correctedText` do professor, transformando os **próprios erros do aluno** em mini-lições de revisão espaçada.
7. **Agenda Integrada & Aulas ao Vivo 1:1 / Turma (`Preply / Cambly` dentro do FluentBridge):**
   - Calendário de agendamentos VIP com o professor, link direto WebRTC/Jitsi/Meet dentro da plataforma, histórico de notas de aula e geração automática de tarefa pós-aula com IA a partir dos erros da sessão ao vivo.
8. **Blindagem Total de Segurança & RLS Relacional (`v3.1`):**
   - Migrar a persistência principal do blob `fb_school_state` para tabelas relacionais autenticadas com RLS estrito por `auth.uid()` e Edge Functions para validação de roles, evitando qualquer exposição cruzada de dados entre turmas diferentes.
9. **Modo Shadowing & Imersão por Vídeo/Podcast Curto:**
   - Exercícios de *shadowing* com controle de velocidade (`0.75x / 0.9x / 1.0x / 1.15x`) e comparação lado a lado da onda sonora do aluno vs. falante nativo.


---

## 4. Avaliação de Arquitetura & Estrutura do Programa (`v4.0.0`)

Para responder diretamente sobre a saúde estrutural do projeto: **sim, a arquitetura e a estrutura do programa estão muito sólidas e bem organizadas**, especialmente considerando o salto para `800` unidades e `8` idiomas:

1. **Separação clara de camadas (`src/types/`, `src/data/`, `src/utils/`, `src/components/`, `src/hooks/`):**
   - Toda a lógica de negócio pura (SRS SM-2, nivelamento adaptativo CAT, desbloqueio progressivo de vocabulário, compactação esparsa, retenção de áudio 60d, feedback fonético, caderno de erros e sync relacional) é desacoplada da UI e coberta por **`33` testes automatizados Vitest (`12` suítes)**.
2. **Code-Splitting & Bundle Saudável (`vite.config.ts`):**
   - O shell inicial carrega em **`160,04 kB`** (`47,02 kB` gzip). Todo o conteúdo pesado (currículos por idioma, guias gramaticais, banco de 320 questões CAT, treinador de traços e podcasts) é fatiado em **chunks independentes** (`< 350 kB` cada), muito abaixo do limite de `3 MB` do PWA.
3. **Resiliência de Armazenamento & Cota Gratuita:**
   - A compactação esparsa (`compactPlatformStateForStorage`) evita que `2.900+` cards saturem o `localStorage` ou o plano gratuito do Supabase.
   - A decisão de **não** pré-baixar pacotes de áudio inteiros por nível protege suas cotas gratuitas do Cloudflare Workers AI e Gemini TTS.
4. **Segurança & Multiplataforma:**
   - `GEMINI_API_KEY` fica isolado no Cloudflare Worker (`fluentbridge-api`), senhas locais usam hash `fbh1:`, e a Seção 9 do `supabase_schema.sql` + `relationalSync.ts` habilita o RLS estrito por `auth.uid()`.
5. **Único ponto de atenção futuro (manutenibilidade, não é bug):**
   - `TeacherStudio.tsx` (~2.230 linhas) e `LessonPlayer.tsx` (~2.440 linhas) cresceram naturalmente com tantas funcionalidades. Já iniciamos a modularização em subpastas (`src/components/steps/` e `src/components/teacher/`), e em ciclos futuros (`v5.1+`) vale continuar extraindo sub-etapas isoladas desses dois arquivos apenas para manter a leitura do código ainda mais leve.

---

## 5. Opções Estratégicas para Chegar ao Top 1 Mundial (`v5.1 → v6.0`)

Com a entrega de **`12` idiomas (`1.200` unidades)**, **`72` Simulados Oficiais Cronometrados**, **Comunidade com Ligas + Fórum**, **Alfabetos Completos (`46/46/30/33/28/40`)**, **Gateway de Download Multiplataforma** e **Suíte E2E Playwright (`7/7` passando)**, o FluentBridge já supera Duolingo e Busuu em **profundidade pedagógica + mentoria docente + simulados reais**. Para consolidar liderança absoluta no mercado:

1. **Chamada de Voz IA Full-Duplex em Tempo Real (WebRTC / VAD Contínuo)** — igualar e superar o *Speak* / *Duolingo Max* com conversação por voz de latência sub-segundo sem apertar botão a cada turno e análise de prosódia/entoação.
2. **Agenda Integrada & Sala de Aula ao Vivo 1:1 / Turmas** — unir o modelo *Preply/Cambly* diretamente dentro da plataforma (agendamento VIP, vídeo WebRTC/Jitsi embutido e geração automática de plano de revisão pós-aula com IA a partir dos erros reais da sessão).
3. **Publicação Oficial nas Lojas (Google Play Store + Apple App Store / iOS)** — distribuir o `.aab` assinado na Play Store e compilar o alvo Capacitor iOS com Sign-in com Apple e Push Notifications FCM/APNs.
4. **Imersão por Vídeo Curto Interativo com Legendas Duplas Clicáveis** — clipes curtos estilo *FluentU / Lingopie* onde o aluno clica em qualquer palavra da legenda para ver tradução, IPA e enviar direto para o deck SM-2.
5. **Simulados de Speaking Avaliados por IA + Professor (IELTS Speaking Part 1–3 / DELF Oral)** — adicionar etapa de entrevista oral cronometrada nos simulados oficiais com transcrição Whisper, pontuação nos critérios oficiais de fluência/coerência e revisão pelo professor.
6. **Correção Automática de Redação Estilo Exame Oficial (Rubrica Analítica IA)** — detalhar a nota do Writing dos simulados por critério oficial (*Task Achievement, Coherence & Cohesion, Lexical Resource, Grammatical Range*) com reescrita banda C1/C2 gerada via `/api/gemini-tutor`.
