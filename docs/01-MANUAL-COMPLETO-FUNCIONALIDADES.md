# 01 — Manual Completo de Funcionalidades (`v9.0.0`)

Este manual descreve **detalhe por detalhe** como funciona cada tela, botão, algoritmo, atalho de teclado, fluxo offline e permissão de perfil dentro do **FluentBridge Academy (`v9.0.0`)**.

---

## Sumário das 14 Áreas Funcionais

1. [Gateway Multiplataforma, Login & Cadastro (`AppDownloadGateway` + `AuthScreen`)](#1-gateway-multiplataforma-login--cadastro)
2. [Navegação Global, Idiomas, Sotaques, Temas & Configurações (`Sidebar` + `SettingsModal`)](#2-navegação-global-idiomas-sotaques-temas--configurações)
3. [Trilha Modular CEFR A1–C1, Metas & Checkpoints (`LearningPath` + `TrailCheckpointModal`)](#3-trilha-modular-cefr-a1c1-metas--checkpoints)
4. [Teste de Nivelamento Adaptativo CAT (`PlacementTestModal`)](#4-teste-de-nivelamento-adaptativo-cat)
5. [Player de Lição Interativa (`LessonPlayer` — 12 Formatos & Recursos Avançados)](#5-player-de-lição-interativa)
6. [Tutor IA de Conversação — Chat & Chamada de Voz (`AITutor`)](#6-tutor-ia-de-conversação--chat--chamada-de-voz)
7. [Revisão Espaçada SM-2, Cloze, Hands-Free & Caderno de Erros (`VocabReview` + `HandsFreeAudioModal` + `MistakeNotebookView`)](#7-revisão-espaçada-sm-2-cloze-hands-free--caderno-de-erros)
8. [Simulados Oficiais Cronometrados (`MockExamHub`)](#8-simulados-oficiais-cronometrados)
9. [Imersão: Podcasts, Vídeos Interativos & YouTube Study Lab (`PodcastImmersionView` + `InteractiveVideoView` + `YouTubeStudyLab`)](#9-imersão-podcasts-vídeos-interativos--youtube-study-lab)
10. [Guias Gramaticais, Drills, Graded Readers & Script/Stroke Trainer (`TipsLibrary` + `GrammarDrillLab` + `GradedReadersView` + `ScriptStrokeTrainer`)](#10-guias-gramaticais-drills-graded-readers--scriptstroke-trainer)
11. [Comunidade 2.0 & Aulas ao Vivo (`CommunityHub` + `LiveClassroomView`)](#11-comunidade-20--aulas-ao-vivo)
12. [Certificados CEFR & Relatórios Pedagógicos PDF (`CertificatesView`)](#12-certificados-cefr--relatórios-pedagógicos-pdf)
13. [Estúdio do Professor (`TeacherStudio`)](#13-estúdio-do-professor)
14. [Painel Admin Mestre (`AdminPanel`)](#14-painel-admin-mestre)

---

## 1. Gateway Multiplataforma, Login & Cadastro

### 1.1 Gateway de Download (`AppDownloadGateway.tsx`)
Exibido na primeira visita Web (com opção **"Ir direto para o login web nas próximas visitas"**) ou a qualquer momento via **Configurações → Baixar App**:
- **Aplicativo Windows (`.exe`):** link direto para `FluentBridge-Setup-9.0.0.exe` (NSIS 64-bit) com microfone nativo sem bloqueios de navegador.
- **Aplicativo Android (`.apk`):** link direto para `FluentBridge-v9.0.0.apk` assinado (Android 8.0+), com notificações nativas e login Google via Chrome Custom Tabs.
- **iPhone / iPad (iOS Safari PWA — `$0/ano`):** instruções em 3 passos (*Safari → Compartilhar → Adicionar à Tela de Início*) para instalar como app nativo sem taxa anual da Apple.
- **Continuar na Versão Web:** abre imediatamente a tela de login/cadastro no navegador.

### 1.2 Autenticação & Vínculos (`AuthScreen.tsx`)
Interface **Dark Sober** (`#090D16`) com 4 cards curtos de resumo e formulário em duas abas:
- **Entrar:**
  - **Entrar com Google:** fluxo OAuth via Supabase (no Android abre Chrome Custom Tabs e retorna pelo deep link `com.fluentbridge.app://auth-callback`).
  - **E-mail e Senha:** valida primeiro na nuvem Supabase; em falha de rede/offline, valida localmente contra hash com salt (`fbh1:` em `storage.ts`). Contas bloqueadas pelo Admin exibem imediatamente o motivo da suspensão.
- **Criar Conta:**
  - **Sou Aluno(a):** exige nome, e-mail, senha (mín. 6 caracteres) + confirmação e escolha de vínculo:
    1. **Turma:** código da turma (ex.: `TURMA-A1`, `TURMA-B1`, `VIP-2026`, com atalhos clicáveis das turmas ativas).
    2. **Aluno VIP:** código do professor (`PROF-SILAS` etc.) para acompanhamento individual.
    3. **Sem vínculo (Autônomo):** libera todas as `2.400` unidades, Tutor IA, SM-2, Simulados e Guias; envios de *Speaking/Writing* que exigem correção docente ficam bloqueados até o aluno se vincular (`TeacherLinkModal.tsx`).
  - **Sou Professor(a):** exige **Código de Autorização Docente** (padrão `SILAS-PROF-2026`, configurável no Admin).
  - **Admin Mestre:** quando o e-mail é `silaswf@gmail.com`, o sistema concede automaticamente papel docente + privilégio global de Administrador Mestre, dispensando código.

---

## 2. Navegação Global, Idiomas, Sotaques, Temas & Configurações

### 2.1 Barra Lateral & Navegação Mobile (`Sidebar.tsx`)
- **Desktop:** barra lateral retrátil (`Recolher barra lateral` entre `lg:w-72` e `lg:w-20`), badge da escola, seletor de idioma em dropdown, perfil do usuário, ofensiva (`Streak`) e `Total XP`.
- **Abas Principais:**
  - `Trilha de Aulas (150)`
  - `Conversação IA`
  - `Revisão & Vocab` (badge com contagem de cards vencidos no SM-2)
  - `Simulados Oficiais`
  - `Comunidade & Ligas`
  - `Aulas ao Vivo`
  - `Imersão (Áudio & Vídeo)` (sub-abas: Podcasts, Vídeos Interativos + **YouTube Study Lab**)
  - `Guias & Gramática` (sub-abas: Guias Gramaticais, Drills, Graded Readers, Caderno de Erros, Script & Stroke Trainer)
  - `Certificados`
  - `Estúdio do Professor` (visível para professores/admin com badge de envios pendentes)
  - `Admin Mestre` (exclusivo para `silaswf@gmail.com`)
- **Mobile (`< 1024px`):** barra superior compacta (com seletor `<select>` limitado a `122px` para zero overflow horizontal em `390x844`), globo rápido de sotaque, streak, XP, alternador de tema, engrenagem de configurações e **bottom nav** fixa com `Trilha`, `Tutor IA`, `Revisão` (pinned), `Simulados` e gaveta `Mais`.

### 2.2 16 Idiomas, 61 Sotaques & Suporte RTL / Niqqud
- **16 Idiomas Completos (`150` unidades cada):** Inglês (`en`), Espanhol (`es`), Francês (`fr`), Italiano (`it`), Alemão (`de`), Russo (`ru`), Japonês (`ja`), Chinês Mandarim (`zh`), Árabe (`ar` — **RTL**), Holandês (`nl`), Africâner (`af`), Sueco (`sv`), Turco (`tr`), Hebraico (`he` — **RTL**), Norueguês Bokmål (`nb`) e Dinamarquês (`da`).
- **61 Sotaques Regionais (`regionalAccents.ts` + `accentPreference.ts`):** troca instantânea pelo globo na barra ou dentro das telas; a escolha persiste por idioma (`resolvePreferredAccent`) e é enviada intacta ao Worker para síntese neural nativa.
- **Hebraico com Toggle de Niqqud (`hebrewNiqqud.ts`):** em `LessonPlayer` e `VocabReview`, o botão **Niqqud ON/OFF** alterna entre hebraico vocalizado (iniciantes) e texto sem diacríticos (leitura real de jornais/Israel).

### 2.3 Configurações, Acessibilidade & LGPD (`SettingsModal.tsx` + `PrivacyLgpdModal.tsx`)
Acessível pelo botão **Configurações** (em 2 cliques):
- **Idioma da Interface (`i18n.ts`):** alterna textos de navegação entre **Português (`pt`)**, **English (`en`)** e **Español (`es`)** com paridade de chaves.
- **Tema (`theme.ts`):** `Claro`, `Escuro` (`html.dark`) ou `Automático` (segue o sistema operacional).
- **Acessibilidade:** *Fonte ampliada*, *Alto contraste* e *Reduzir animações*.
- **Notificações & Retenção (`retentionNotifications.ts`):** lembrete diário de estudo e alertas de revisão SM-2.
- **Privacidade & LGPD:**
  - **Exportar Dados (JSON):** baixa todo o perfil, progresso, cards e submissões do aluno.
  - **Excluir Minha Conta (`deleteMyCloudAccount`):** chama `rpc('delete_my_account_data')` no Supabase, limpa dados locais e encerra a sessão.
- **Atualizador & Download (`appUpdater.ts`):** verifica nova versão em `version.json` / GitHub Releases e abre o modal de download.

---

## 3. Trilha Modular CEFR A1–C1, Metas & Checkpoints

### 3.1 Hero Compacto & Meta Diária (`LearningPath.tsx`)
- **Pills de Contexto:** idioma ativo com progresso (`1/150 unidades`), turma vinculada, professor responsável (com opção `Desvincular` ou `Vincular agora`) e nível indicado no teste de nivelamento.
- **Botões Principais:** `Continuar lição` / `Revisar` (abre a próxima unidade pendente), `Teste de Nivelamento` e `Definir Objetivo` (`GoalOnboardingModal.tsx` — Viagem, Carreira, Exames ou Fluência Geral, gerando um **Plano Semanal** com minutos/semana e exame recomendado).
- **Card de Meta Diária:** mostra minutos estudados hoje, barra de progresso, seletor rápido de ritmo (`10m` / `15m` / `20m`) e contador de **Streak Freeze** (`🧊` protege a ofensiva automaticamente em dias sem estudo).

### 3.2 Filtros CEFR, Módulos Desdobráveis & Offline
- **Barra CEFR Sticky (`cefr-filter-bar`):** `Todos`, `A1 (0/30)`, `A2 (0/30)`, `B1 (0/30)`, `B2 (0/30)`, `C1 (0/30)`.
- **Módulos Desdobráveis (`ModuleAccordionHeader.tsx`):**
  - Agrupam as 150 unidades em blocos temáticos sequenciais (`Módulo 1 … N`) sem repetição de títulos.
  - Apenas o **Módulo Atual** inicia expandido; o estado aberto/fechado fica salvo por idioma em `sessionStorage`, com botão `Expandir todos / Recolher todos`.
  - Botão **`Baixar 3 próximas` (`offlineUnitPack.ts`):** pré-baixa textos e áudios neurais das próximas 3 unidades para estudo 100% sem internet.
- **Checkpoint de Módulo (`TrailCheckpointModal.tsx`):** ao concluir as unidades de um bloco, libera um mini-exame de consolidação; aprovação concede XP bônus e registra conclusão mesmo offline (`offlineOutbox.ts`).
- **Painel Lateral Direito (recolhível):** mostra **Radar de 4 Habilidades (`SkillRadar.tsx`)**, **Missões Diárias** (`Concluir 1 unidade +25 XP`, `Revisar 5 cards +25 XP`, `1 sessão Tutor IA +25 XP`), **Tarefas de Casa** atribuídas pelo professor e **Ranking da Turma**.

---

## 4. Teste de Nivelamento Adaptativo CAT (`PlacementTestModal.tsx`)

- **Banco:** **`640` questões** inéditas no idioma-alvo (`40` por idioma × `16` idiomas, `8` por nível CEFR `A1–C1`, zero enunciados em português).
- **Algoritmo Adaptativo (`placementEngine.ts`):**
  - Aplica **15 questões** começando no nível intermediário (`B1`).
  - Cada acerto sobe o probe (`B1 → B2 → C1`); cada erro desce (`B1 → A2 → A1`).
  - Ao final, `computeAdaptivePlacementResult` calcula o nível CEFR recomendado (`A1` a `C1`) e salva por idioma em `recommendedLevelByLanguage`, além de exibir diagnóstico e botão direto para filtrar a trilha no nível indicado.

---

## 5. Player de Lição Interativa (`LessonPlayer.tsx`)

Cada unidade possui **10+ flashcards coesos** e conduz o aluno por etapas modulares (navegáveis pelas pílulas no topo; no mobile, o menu `⚙️` agrupa opções extras):

1. **Vocabulário da Unidade (`VocabIntroStep`):** apresenta as palavras-chave com IPA, tradução, frase contextual e áudio neural (`DualAudioButtons`: normal + `0.75x`). Botão **`Desbloquear palavras`** libera a lição e envia os cards para o deck SM-2.
2. **Script & Phonics (`ScriptPhonicsStepView`):** presente em `ru`, `ja`, `zh` e `ar` para introduzir novos caracteres/kanji/letras antes das frases, com quiz sonoro integrado.
3. **Dica Contextual (`tip`):** explicação em português com foco em erros comuns de brasileiros, fórmula `[+] / [-] / [?]` e áudio clicável.
4. **Listening (`ListeningStepView`):** reprodução neural (com controle opcional de **Ruído Ambiente** em 3 intensidades: *Suave*, *Real* e *Desafio* via `ambientNoiseEngine.ts`) e pergunta de compreensão.
5. **Reading (`ReadingStepView`):** formatos variados (`chat`, `article`, `email`, `menu`, `boarding_pass`) com **glossário clicável** (tocar em qualquer palavra destacada abre tradução, nota e botão para salvar no SM-2). Em Japonês, botão **100% Kana** converte Kanji via `japaneseKana.ts`; em Hebraico, toggle **Niqqud**.
6. **Matching (`MatchingStepView`):** associação interativa de 5+ pares idioma ↔ português com áudio ao clicar.
7. **Preencher Lacunas (`fill_blank`) & Ditado (`dictation`):** seleção contextual / transcrição auditiva com comparação normalizada e dicas adaptativas.
8. **Pares Mínimos (`minimal_pairs`):** contraste fonético entre palavras parecidas (ex.: *live* vs *leave*).
9. **História Multi-Voz (`story`):** mini-diálogo alternando vozes/personagens com tradução ocultável e pergunta de interpretação.
10. **Speaking (`speaking` + `ShadowingPanel` + `PitchOscilloscope`):**
    - Gravação pelo microfone (`audioRecorder.ts`, `32 kbps` salvos no IndexedDB).
    - Transcrição via Whisper Cloud (`/api/stt`), pontuação automática, **`PhonemeBreakdown`** (chips visuais destacando fonemas acertados/trocados nos 16 idiomas), oscilador de entonação em tempo real e botão **Enviar ao Professor**.
11. **Writing Builder & Writing Free (`WritingFreeStepView`):**
    - Montagem guiada de frases e redação livre avaliada por **`analyzeWritingHybrid` (`writingDiffGrader.ts`):** usa Gemini para aceitar respostas alternativas válidas (`>=80%`) e cai automaticamente no *diff* local detalhado quando offline, com opção de envio ao professor.

**Mecânicas transversais do Player:**
- **Dificuldade Adaptativa (`adaptiveDifficulty.ts`):** monitora erros recentes e ativa automaticamente dicas visuais (`autoShowHints`) após sequência de erros.
- **Vidas vs. Modo Sem Pressão:** 5 corações por tentativa; ao zerar, o aluno pode ativar o **Modo Sem Pressão** para continuar sem perder o progresso.
- **Pulso `+XP` em Tempo Real:** feedback visual instantâneo no cabeçalho ao acertar etapas.
- **Atalhos de Teclado:** `1–4` (escolher alternativa), `Enter` (confirmar/avançar), `R` (repetir áudio), `Espaço` (play/pause), `Esc` (fechar).

---

## 6. Tutor IA de Conversação — Chat & Chamada de Voz (`AITutor.tsx`)

- **800 Cenários (`50` por idioma):** situações reais A1–C1 (aeroporto, entrevista técnica, consultório, negociação, cultura local, debates C1).
- **Modo Chat:** conversa por texto ou microfone, com correção gramatical inline, sugestão de resposta natural, tradução sob demanda e botão para salvar expressões no SM-2.
- **Modo Chamada de Voz (Live Call):** usa `voiceVadEngine.ts` (detecção automática de início/fim de fala) + resposta falada via TTS neural no sotaque escolhido, simulando ligação real.
- **Memória & Painel Avançado (`⚙️`):** `tutorMemory.ts` guarda pontos fortes e erros recorrentes do aluno; engrenagem permite ajustar velocidade de fala, idioma das dicas e modo offline (`aiTutorEngine.ts` garante continuidade mesmo sem internet).

---

## 7. Revisão Espaçada SM-2, Cloze, Hands-Free & Caderno de Erros

- **Algoritmo SM-2 (`srsEngine.ts` + `VocabReview.tsx`):** calcula intervalo (`1d`, `6d`, `interval × easeFactor`) e fator de facilidade conforme a nota do aluno (*Errei*, *Difícil*, *Bom*, *Fácil*).
- **Modo Flashcard & Modo Cloze:** alterna entre cartão clássico frente/verso (com toggle *Niqqud* em Hebraico) e exercício de lacuna contextual extraída da frase de exemplo.
- **Modo Hands-Free (`HandsFreeAudioModal.tsx`):** reprodução contínua em loop (*palavra no idioma alvo → pausa → tradução em PT → frase de exemplo*), ideal para treinar dirigindo ou caminhando sem tocar na tela.
- **Caderno de Erros (`MistakeNotebookView.tsx` + `mistakeBank.ts`):** centraliza erros cometidos em lições/simulados para prática focada até zerar a pendência.

---

## 8. Simulados Oficiais Cronometrados (`MockExamHub.tsx`)

- **96 Simulados (`24` formatos oficiais × `4` simulações cada):**
  - *Inglês:* IELTS Academic/General, TOEFL iBT, CELPIP General (`en-CA` padrão), Duolingo English Test (DET, escala `10–160`).
  - *Outros 15 idiomas:* DELE, DELF/DALF, CILS, Goethe-Zertifikat, ТРКИ, JLPT, HSK, ALPT, CNaVT, TISUS, Swedex, **TÖMER (`tr`)**, **YAEL (`he`)**, **Norskprøve (`nb`)** e **Prøve i Dansk 3 / PD3 (`da`)**.
- **Filtros & Estrutura:** filtro por categoria (`Todos`, `Completos`, `Leitura/Escuta`, `Speaking/Writing`), cronômetro regressivo, limite de reproduções no Listening (simulação fiel de prova), **Speaking em 3 partes cronometradas** (aquecimento, turno longo, discussão) e **Writing com Rubrica Analítica** (`examAiGrader.ts` + cálculo oficial em `examScoring.ts` + envio ao professor).

---

## 9. Imersão: Podcasts, Vídeos Interativos & YouTube Study Lab

Acessível na barra lateral em **Imersão (Áudio & Vídeo)**:
1. **Podcasts (`PodcastImmersionView.tsx`):** **80 episódios** (`5` por idioma) com mínimo de 10 falas multi-personagem, áudio neural contínuo e 3 checkpoints de compreensão por episódio.
2. **Vídeos Interativos (`InteractiveVideoView.tsx`):** **48 clipes** (`3` por idioma) + **descoberta automática de vídeos no bucket R2 (`/api/media/list`)** com streaming **HTTP `206 Partial Content` (`Range`)** compatível com Safari/iOS, controle de `playbackRate` sincronizado e legenda clicável para SM-2.
3. **YouTube Study Lab (`YouTubeStudyLab.tsx` + `youtubeStudy.ts`):**
   - Cole qualquer link do YouTube (`watch?v=`, `youtu.be/`, `shorts/`) ou use o botão **Carregar Exemplo**.
   - Campo opcional para colar transcrição manual, **`.SRT` ou `.VTT`** (parser reconhece timestamps `0:00 Texto` e blocos SRT/VTT).
   - Clique em **Analisar Vídeo**: consulta `POST /api/youtube-study` (Gemini + legendas públicas + oEmbed, cota `100/dia` no R2) com **timeout de segurança de `12s`** que aciona automaticamente o analisador offline caso a rede demore.
   - **3 Sub-abas no Resultado:**
     - *Legendas Interativas:* player sincronizado + frases bilíngues onde **cada palavra é clicável**, abrindo popover com lema, IPA, classe gramatical, nota de uso e botão **Salvar no Deck SM-2**.
     - *Gramática & Uso Real:* cards explicando *por que* o falante nativo escolheu aquela estrutura, registro (formal/coloquial) e frase alternativa.
     - *Quiz de Fixação:* checkpoints interativos sobre o conteúdo real do vídeo.

---

## 10. Guias Gramaticais, Drills, Graded Readers & Script/Stroke Trainer

Acessível em **Guias & Gramática**:
- **Guias Gramaticais (`TipsLibrary.tsx`):** **`3.200` entradas (`200` por idioma)** pesquisáveis por nível CEFR e tópico, com exemplos e áudio.
- **Grammar Drill Lab (`GrammarDrillLab.tsx`):** bateria rápida de transformação e concordância gramatical para os 16 idiomas.
- **Graded Readers (`GradedReadersView.tsx`):** textos graduados por nível com leitura neural contínua (`speakTextAsync`), destaque de trecho e glossário.
- **Script & Stroke Trainer (`ScriptStrokeTrainer.tsx`):** treino visual, ordem de traços e áudio para **Hiragana, Katakana, Kanji (JLPT), Hanzi (HSK), Cirílico Russo, Alfabeto Árabe, Alefbet Hebraico (`27+` letras incl. finais *Sofit*)** e letras especiais do **Turco (`ç, ğ, ı, İ, ö, ş, ü`)** e **Nórdico (`æ, ø, å`)**.

---

## 11. Comunidade 2.0 & Aulas ao Vivo

- **Comunidade (`CommunityHub.tsx` + `communityEngine.ts`):**
  - **Ligas Semanais por Idioma:** ranking separado por idioma estudado.
  - **Desafio do Mês (`+80 XP`):** meta mensal comunitária destacada no topo.
  - **Fórum & Parceiro de Estudo:** criação de tópicos com filtro anti-spam/links/palavrões (`moderateCommunityText`), reações rápidas (`👏🔥💡🎯`), áudio nos *snippets* (`DualAudioButtons`) e **correção entre pares com *diff* visual e aceite de correção (`+10 XP`)**.
- **Aulas ao Vivo (`LiveClassroomView.tsx`):** agenda de sessões síncronas da escola/professor com link de entrada e estados vazios padronizados (`EmptyStateCard`).

---

## 12. Certificados CEFR & Relatórios Pedagógicos PDF

- **Certificados (`CertificatesView.tsx` + `certificatePdf.ts`):** emitidos automaticamente ao atingir os requisitos de um nível CEFR (`A1` a `C1`) no idioma, com código verificável, carga horária estimada e exportação direta para impressão/PDF.
- **Relatório Pedagógico PDF (`pedagogicalReportPdf.ts`):** resumo executivo de evolução nas 4 habilidades, histórico de simulados e vocabulário dominado.

---

## 13. Estúdio do Professor (`TeacherStudio.tsx`)

Exclusivo para perfis `teacher` e `admin`:
- **Fila de Correções:** exibe envios de **Writing** e **Speaking** dos alunos vinculados, com **player de áudio remoto (`resolveSubmissionAudioUrl`)** para ouvir no PC a gravação feita pelo aluno no celular, nota manual/rubrica, feedback escrito e concessão de selo/XP.
- **Turmas & Alunos VIP (`VipStudentsPanel.tsx` + `ClassAnalyticsTab.tsx`):** criação de turmas e códigos de convite, métricas de engajamento por turma e acompanhamento individual de alunos VIP.
- **Criar Tópico & Tarefas:** editor para publicar unidades customizadas na trilha da turma/escola e atribuir tarefas com prazo.
- **Nuvem, IA & Escola (`SchoolSettingsTab.tsx`):** configuração do nome da escola, **nome público de exibição do professor (`teacherDisplayName`)**, código de convite docente e status de sincronização Supabase.

---

## 14. Painel Admin Mestre (`AdminPanel.tsx`)

Exclusivo para `silaswf@gmail.com`:
- **Gestão Global de Usuários:** busca, filtro (`Todos`, `Alunos`, `Professores`, `Bloqueados`), troca de turma, promoção/rebaixamento de papel, redefinição de senha local, **atribuição/desvinculação de professor** (exibindo `teacherDisplayName` com fallback para o nome de cadastro) e **bloqueio com justificativa**.
- **Segurança & Códigos Globais:** edição do **Código de Autorização Docente**, inspeção do status de RLS do Supabase e cópia rápida de scripts de auditoria.
- **Saúde dos Serviços & Vozes Neurais:** status do Supabase Cloud, Worker Edge API (`/api/health` com versão e bindings), diagnóstico interativo de voz para **todos os `16` idiomas (`16/16 idiomas ativos`)**, **Health-Check Sintético** ao vivo, logs de telemetria (`/api/telemetry`) e botão de **limpeza de áudios antigos (> 60 dias)** no R2/Supabase.
