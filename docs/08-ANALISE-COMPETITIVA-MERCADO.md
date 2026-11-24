# 08 — Auditoria 360° (`v6.2.1`), Saúde da Arquitetura & Análise Competitiva de Mercado

> **Data da auditoria:** 24/11/2026 · **Versão auditada:** `v6.2.1`  
> **Escopo:** Estado real da plataforma (`12` idiomas, `1.236` unidades, `7.416` cards de vocabulário 100% validados, `2.400` guias gramaticais, `480` cenários de Tutor IA, `76` simulados oficiais, Chamada Full-Duplex VAD + Prosódia, Vídeos Interativos, Comunidade, Atualizador In-App via canal público `silaswf/fluentbridge-releases`), comparativo com o mercado global e plano estruturado de melhorias em todos os âmbitos (`v6.3 → v8.0`).

---

## 1. Raio-X Atual da Plataforma (`v6.2.1`)

### 1.1 Escala de Conteúdo & Qualidade Pedagógica
- **12 Idiomas Completos (CEFR A1–C1):** Inglês (`en`), Espanhol (`es`), Francês (`fr`), Italiano (`it`), Alemão (`de`), Russo (`ru`), Japonês (`ja`), Chinês (`zh`), Árabe (`ar` RTL), Holandês (`nl`), Africâner (`af`) e Sueco (`sv`).
- **1.236 Unidades Estruturadas (`103` por idioma):** incluindo unidades de **Expressões Idiomáticas, Gírias e Registro Informal/Tabu `18+`**, imersão no idioma-alvo a partir do **B2/C1** com botão opcional **"Traduzir PT"**, subunidades clicáveis estilo Busuu e salvamento de progresso passo a passo (`topicStepProgress`).
- **7.416 Cards de Vocabulário (SM-2 Progressivo):** exatamente **6 vocabulários ligados ao tema em cada uma das 1.236 unidades**, com `100%` dos exemplos validados automaticamente por `exampleMatchesWord` (`src/utils/vocabValidation.ts`), `0` duplicatas e `0` frases meta-genéricas.
- **2.400 Guias Gramaticais (`200`/idioma)**, **480 Cenários de Tutor IA (`40`/idioma + `10` ângulos por unidade)**, **60 Podcasts Curtos (`5`/idioma)**, **36 Vídeos Curtos Interativos com Legendas Duplas Clicáveis (`SM-2`)** e **480 Questões Adaptativas de Nivelamento (CAT, `40`/idioma)**.
- **76 Simulados Oficiais Cronometrados (`19` exames reais incl. CELPIP, IELTS, TOEFL, DELE, DELF, CILS, Goethe, TORFL, JLPT, HSK, ALPT, NT2, Swedex):** com filtro por categoria, **Speaking em 3 partes (IA + Professor)** e **Rubrica Analítica de Writing em 4 critérios** com reescrita C1/C2.
- **Treinador de Escrita & Traços Completo:** `46` Hiragana, `46` Katakana, `30` Kanji, `33` Cirílico Russo, `28` Letras Árabes (4 formas contextuais + RTL) e `40` Hanzi + 4 tons.

### 1.2 Vozes Neurais, IA & Áudio
- **Cloudflare Worker Edge (`fluentbridge-api` `v6.1.0`):**
  - TTS neural com Deepgram Aura-2 + Gemini 2.5 Neural TTS com prompts nativos no idioma-alvo, `languageCode` BCP-47, guarda anti-alucinação e cache `/v4/`.
  - STT em nuvem via Whisper Large v3 Turbo (`/api/stt`) e Tutor IA via `/api/gemini-tutor` com `GEMINI_API_KEY` isolada no servidor.
  - **Chamada de Voz IA Full-Duplex (`voiceVadEngine.ts`):** detecção contínua de fala (VAD), *barge-in* e análise de prosódia/entoação (WPM, ritmo, hesitações).
- **Retenção Inteligente de Áudios (60 dias):** gravações enviadas ao professor vão para o bucket `fb-audio` no Supabase Storage e `IndexedDB`, com autolimpeza após 60 dias preservando `100%` das transcrições, notas e feedbacks escritos.

### 1.3 Arquitetura, Testes & Distribuição Multiplataforma
- **Stack:** React 19 + TypeScript + Vite 6 + Tailwind CSS v4 + Workbox PWA + Capacitor 7 (Android) + Electron (`electron-builder` NSIS Windows) + Cloudflare Pages/Workers + Supabase.
- **Confiabilidade Automatizada:** **16 suítes / 43 testes unitários Vitest** (incluindo validação rígida dos 7.416 cards) + **8/8 testes E2E Playwright** no Chromium.
- **Distribuição & Atualização In-App (`v6.2.1`):**
  - Web/PWA: `https://fluentbridge.pages.dev` + manifesto `https://fluentbridge.pages.dev/version.json` (`HTTP 200`).
  - Canal público de instaladores: `https://github.com/silaswf/fluentbridge-releases` (Windows `.exe` e Android `.apk` com download anônimo `HTTP 200`, mantendo o código-fonte 100% privado em `silaswf/fluentbridge`).

---

## 2. Comparativo Completo com o Mercado (2026)

| Dimensão | **FluentBridge `v6.2.1`** | **Duolingo Max** | **Busuu** | **Babbel** | **Speak** | **Preply / Cambly** |
| --- | --- | --- | --- | --- | --- | --- |
| **Modelo Pedagógico** | **Híbrido (App + Professor real + IA + Comunidade)** | Autodidata gamificado + IA | Autodidata + correção de pares | Cursos estruturados | 100% Speaking com IA | Aulas 1:1 humanas |
| **Professor Humano, Turmas & VIP** | **Sim (nativo: turmas, VIP, tarefas, rubrica, selos)** | Não | Não (pares) | Babbel Live (caro) | Não | Sim (por hora) |
| **Idiomas & Profundidade CEFR** | **12 idiomas (`1.236` unid. A1–C1 + imersão B2/C1)** | 40+ (maioria A1–B2) | 14 (A1–C1) | 14 (A1–C1) | ~10 | 50+ (depende do tutor) |
| **Vocabulário Contextual SM-2** | **7.416 cards (`6`/unid., `100%` validados) + Caderno de Erros** | Revisão básica | Revisão SM-2 | Revisão por lição | Limitado | Manual |
| **Voz IA Full-Duplex (VAD)** | **Sim (VAD + Prosódia + Barge-in)** | Video Call (pago) | Não | Não | Sim (pago) | Humano |
| **Simulados Oficiais Completos** | **76 simulados em 19 exames (incl. CELPIP + Speaking + Rubrica)** | Só DET pago à parte | Não | Não | Não | Informal |
| **Vídeos com Legendas Clicáveis** | **Sim (36 clipes com envio direto ao SM-2)** | Não | Parcial | Não | Não | Não |
| **Aulas ao Vivo 1:1 + Agenda** | **Ainda não** | Não | Não | Sim | Não | **Líder** |
| **Lojas Oficiais (Play / iOS)** | **APK/AAB pronto (ainda não publicado nas lojas)** | Sim | Sim | Sim | Sim | Sim |
| **Vídeos Reais / Nativos (MP4)** | **Roteiros interativos com TTS (ainda sem vídeo real)** | Animações | Vídeos nativos | Áudio nativo | Vídeo/Áudio | Vídeo ao vivo |

---

## 3. O Que Mais Pode Ser Feito — Plano de Melhorias em Todos os Âmbitos (`v6.3 → v8.0`)

Abaixo está o diagnóstico honesto do que ainda separa o FluentBridge `v6.2.1` de uma plataforma líder comercial em escala global, dividido por área e priorizado.

### 3.1 Arquitetura, Performance & Experiência Offline (Impacto Alto · Esforço Médio)
1. **Carregamento Dinâmico Real por Idioma (`dynamic import()`):**
   - **Problema atual:** `src/data/lessons.ts` importa estaticamente todos os 12 idiomas de uma vez (`ALL_BUILTIN_TOPICS`, `ALL_INITIAL_VOCABULARY`), fazendo o PWA colocar **83 arquivos (~9,24 MB)** em precache e manter os 12 currículos em memória RAM mesmo quando o aluno estuda apenas 1 idioma.
   - **Melhoria:** carregar o currículo, vocabulário, gramática e simulados sob demanda apenas do `activeLanguage` selecionado. **Ganho estimado:** redução de ~80–85% na memória RAM e abertura quase instantânea em celulares Android de entrada.
2. **Cache de Áudio Pré-Gerado no Cloudflare R2 + Modo Offline Seletivo por Unidade:**
   - **Oportunidade:** você já tem **Cloudflare R2** habilitado na sua conta sincronizada! Armazenar no R2 os MP3s mais requisitados (palavras-chave e frases das unidades) reduz latência de voz para `< 100 ms` e protege drasticamente as cotas gratuitas do Gemini TTS e Workers AI.
   - **Offline seletivo:** botão **"Baixar próximas 3 unidades offline"** na trilha do aluno (faz cache apenas dos textos e áudios dessas 3 unidades no `IndexedDB`, ideal para avião/metrô sem estourar cota).
3. **Modularização de Componentes Gigantes:**
   - `LessonPlayer.tsx` (~2.450 linhas) e `TeacherStudio.tsx` (~2.230 linhas) concentram muitas responsabilidades. Extrair cada tipo de etapa (`VocabIntroStep`, `ListeningStep`, `ReadingStep`, `SpeakingStep`, `WritingStep`) e cada aba do Estúdio melhora a velocidade de manutenção e permite testes unitários de UI isolados.

### 3.2 Segurança, Backend & Escalabilidade Real (Impacto Crítico · Esforço Médio)
4. **Autenticação JWT no Cloudflare Worker (`/api/gemini-tutor`, `/api/stt`):**
   - **Risco atual:** hoje o Worker protege as rotas de IA por rate-limit de IP, mas não exige autenticação do usuário. Se alguém inspecionar a URL do Worker, pode disparar chamadas diretas à sua cota de Gemini/Whisper.
   - **Melhoria:** validar o token JWT do Supabase (`Authorization: Bearer <jwt>`) no Worker (mantendo `/api/tts` cacheado ou com rate-limit rigoroso) e registrar uso por usuário.
5. **Migração Definitiva para Tabelas Relacionais + Supabase Auth (Aposentar `fb_school_state`):**
   - **Risco atual:** o app ainda mantém compatibilidade híbrida com o snapshot JSONB `fb_school_state` e senhas locais com hash `fbh1:`. Com dezenas/centenas de alunos simultâneos, um único JSONB compartilhado gera conflitos de concorrência e não isola permissões no banco.
   - **Melhoria:** mover 100% do login para Supabase Auth (e-mail/senha + Google OAuth) e todas as leituras/escritas para tabelas relacionais (`profiles`, `classes`, `submissions`, `assignments`, `community_posts`, `vocab_progress`) com RLS estrito por `auth.uid()` e `role` validado server-side.
6. **Observabilidade & Monitoramento de Erros em Produção:**
   - Integrar captura automática de erros (ex.: Sentry Free Tier ou endpoint `/api/telemetry` no Worker gravando em log/Supabase) com source maps, para você descobrir qualquer crash no celular de um aluno antes mesmo dele enviar um print.

### 3.3 Pedagogia, Conteúdo & Retenção de Aprendizado (Impacto Alto · Esforço Médio)
7. **Memória Pedagógica no Tutor IA (IA Conectada ao SM-2 e ao Caderno de Erros):**
   - **Melhoria:** injetar no contexto do `/api/gemini-tutor` as 5 palavras mais fracas do aluno no SM-2 e os últimos erros do `mistakeBank`. Assim a IA conduz a conversa naturalmente para o aluno reutilizar exatamente o vocabulário e a gramática em que tem dificuldade.
8. **Treinador Dedicado de Conjugação, Casos & Estruturas (`Grammar Drill Lab`):**
   - Modo rápido de 3 minutos para treinar conjugação verbal (EN/ES/FR/IT/DE/SV/NL/AF), os 6 casos do Russo, partículas japonesas (`は/が/を/に/で`), classificadores chineses e padrões de raiz árabe.
9. **Leitura Graduada em Capítulos (`Graded Readers`, estilo LingQ / Beelinguapp):**
   - Histórias curtas seriadas (5 capítulos por nível A1–C1) com narração contínua sincronizada, destaque da frase em leitura e clique em qualquer palavra para salvar no SM-2.
10. **Trilha Personalizada por Objetivo (Onboarding Inteligente):**
    - No primeiro acesso, perguntar objetivo (*Viagem*, *Trabalho/Tech*, *Imigração/Exame CELPIP-IELTS*, *Morar Fora*, *Cultura/Séries*) e prazo, gerando um **Plano Semanal Dinâmico** que destaca as unidades e simulados prioritários.
11. **Cartões Cloze (Lacuna Contextual) no SM-2:**
    - Além do flashcard clássico Frente/Verso, oferecer modo **"Complete a frase"** escondendo a palavra-alvo dentro do próprio `exampleEn` (já que agora `100%` dos 7.416 cards contêm a palavra-alvo no exemplo!).

### 3.4 Voz, Fonética & Imersão Audiovisual (Impacto Alto · Esforço Médio/Alto)
12. **Osciloscópio de Tons & Pitch Accent em Tempo Real (Web Audio F0):**
    - Detecção de frequência fundamental (`F0`) no microfone exibindo a curva tonal do aluno sobreposta à curva nativa — diferencial enorme para **Mandarim (tons 1–4)** e **Japonês (pitch accent)**.
13. **Vídeos Reais Curtos no Cloudflare R2 (Evolução do Modo Imersão):**
    - Evoluir os 36 clipes interativos de áudio/roteiro para vídeos curtos reais (15–45s em MP4/WebM hospedados no **Cloudflare R2**) com legendas duplas sincronizadas clicáveis (`SM-2`) e modo *shadowing* frase a frase.
14. **Avaliação Fonética por Fonema (Além da Transcrição Textual):**
    - Evoluir `phoneticFeedback.ts` (hoje baseado em heurística sobre o texto transcrito pelo Whisper) com análise de confiança por palavra/segmento do Whisper + exercícios corretivos automáticos para sons críticos (`/θ/`, `/ð/`, `/ɪ/` vs `/iː/`, vogais nasais FR, `ü/ö` DE).

### 3.5 Professor, Escola, Comunidade & Monetização (Impacto Estratégico · Esforço Médio/Alto)
15. **Agenda Integrada & Sala de Aula ao Vivo 1:1 / Turmas (Preply/Cambly Embutido):**
    - Calendário de agendamentos VIP com o professor, link/embed WebRTC/Jitsi dentro do app, bloco de notas ao vivo da aula e botão **"Gerar Tarefa + Flashcards Pós-Aula com IA"** a partir das anotações da aula.
16. **Comunidade Real em Nuvem (Supabase Realtime):**
    - Transformar Ligas Semanais, Fórum e Correções entre Alunos em tabelas reais no Supabase com atualização em tempo real, denúncia/moderação docente e notificações push quando um colega ou professor responde.
17. **Relatório Pedagógico Mensal em PDF (B2B / Alunos VIP / Pais):**
    - Geração de boletim profissional com gráfico de radar das 4 habilidades, horas estudadas, evolução CEFR, taxa de acertos em simulados e parecer do professor — excelente para retenção de alunos particulares e contratos corporativos.
18. **Planos, Pagamentos & Multi-Escolas (SaaS):**
    - Integração com Stripe / Mercado Pago (Pix + Cartão) para monetizar planos (*Gratuito*, *Pro Autônomo*, *Mentoria VIP*) e arquitetura *multi-tenant* caso queira licenciar o FluentBridge para outros professores e escolas.

### 3.6 DevOps, CI/CD & Distribuição nas Lojas (Impacto Alto · Esforço Baixo/Médio)
19. **Pipeline 100% Automatizado no GitHub Actions (`Windows .exe` + `Android .apk/.aab` + `silaswf/fluentbridge-releases` + `version.json`):**
    - Hoje o Android compila no CI, mas o `.exe` Windows e o espelhamento para `silaswf/fluentbridge-releases` ainda rodam localmente. Adicionar um job `windows-latest` + secret PAT automatiza toda a release com um único `git push --tags`, além de limpar o erro de cota de *Artifacts* do GitHub Actions (removendo o step redundante `upload-artifact` quando o arquivo já vai para a Release).
20. **Publicação nas Lojas Oficiais (Google Play Store + Apple App Store / iOS) & Assinatura Windows:**
    - Submeter o `.aab` assinado na Google Play Store (atualizações automáticas nativas sem "fontes desconhecidas"), compilar o alvo Capacitor iOS e assinar digitalmente o instalador Windows (certificado Code Signing) para remover o alerta do Windows SmartScreen.
21. **Acessibilidade (WCAG AA) & Internacionalização da Interface (`i18n`):**
    - Controle de tamanho de fonte (muito útil para árabe, chinês e japonês), navegação completa por teclado/leitor de tela e interface traduzível (`PT / EN / ES`) para alcançar alunos fora do Brasil.

---

## 4. Status de Implementação (`v7.0.0` Entregue) e Próxima Matriz

Em **`v7.0.0`**, foram entregues integralmente os blocos **3.1** (#1–#3), **3.2** (#4–#6), **3.3** (#7–#11), **3.4** (#12–#14), **3.5 (#15–#17)** e **3.6 (#19 e #21)**. Permanecem em aberto para o ciclo **`v8.0.0`** apenas o **Item #18 (Planos, Pagamentos & Multi-Escolas)** e o **Item #20 (Publicação nas Lojas Oficiais Google Play / App Store e Code Signing Windows)**.

| Fase | Foco Principal | Status / Entregas |
| --- | --- | --- |
| **`v7.0.0` (Entregue)** | **Performance, R2, Segurança, Pedagogia, Pitch F0, Aulas ao Vivo, PDF & CI/CD** | ✅ `dynamic import()` por idioma + Cache TTS/MP4 no Cloudflare R2 + Offline 3 unidades + JWT híbrido & `/api/telemetry` + Cloze SM-2 + Memória IA + 144 Grammar Drills + 12 Graded Readers (60 cap.) + Pitch F0 + Sala ao Vivo Jitsi + Boletim PDF + Realtime + CI Windows/Android + `i18n` (`PT/EN/ES`) & WCAG AA. |
| **`v8.0.0` (Em Aberto)** | **Lojas Oficiais & Monetização SaaS** | ⏳ Publicação Google Play Store + iOS (App Store) + Windows Code Signing (#20) e Sistema de Planos/Pagamentos + Multi-Escolas (#18). |
