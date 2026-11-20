# 05 — Manual Completo de Funcionalidades (`v1.0.3`)

Guia prático cobrindo todas as telas e fluxos do **FluentBridge Academy** para alunos e para a gestão docente do **Prof. Silas**.

---

## 1. Tela de Entrada & Cadastro (`AuthScreen.tsx`)

- **Aba Entrar**:
  - Botão **Entrar com Google** (abre OAuth no navegador ou Chrome Custom Tabs no Android).
  - Login com **E-mail** e **Senha** cadastrados.
- **Aba Criar conta**:
  - Seletor explícito entre **Cadastro de Aluno** e **Cadastro de Professor**.
  - **Aluno**: informa nome, e-mail, senha (mín. 6 caracteres), confirmação e **Código da Turma** (`TURMA-A1`, `TURMA-B1`, `VIP-2026` ou outro criado pelo Prof. Silas).
  - **Professor**: informa os mesmos dados + **Código de Autorização Docente** (`SILAS-PROF-2026`, dispensado apenas para `silaswf@gmail.com`).

---

## 2. Navegação Principal (`Sidebar.tsx`)

- **Desktop**: barra lateral com identidade da escola, seletor de idioma (`🇬🇧 Inglês`, `🇪🇸 Espanhol`, `🇫🇷 Francês`), seletor de sotaque (`🇺🇸 Americano`, `🇬🇧 Britânico`), XP, ofensiva (*streak*), links das 5–6 seções e botão **Sair**.
- **Mobile / Android**: barra superior compacta (troca rápida de idioma e sotaque, streak, XP, sair) + barra de navegação fixa inferior.

---

## 3. Trilha de Aprendizagem & Nivelamento (`LearningPath.tsx` + `PlacementTestModal.tsx`)

- **Cabeçalho de Progresso**: XP total, dias consecutivos, meta diária configurável (`10`, `15`, `20`, `30` min/dia) e botão para refazer o **Teste de Nivelamento CEFR**.
- **Radar das 4 Habilidades (`SkillRadar.tsx`)**: exibe percentuais equilibrados de *Listening*, *Reading*, *Speaking* e *Writing*.
- **Missões Diárias & Ranking da Turma**: 3 missões diárias resgatáveis com bônus em XP + tabela de classificação entre colegas de turma.
- **Trilha por Nível CEFR (`A1` → `C1`)**: filtros por nível e acesso direto às **34 unidades de Inglês** + tópicos personalizados publicados pelo professor.
- **Devolutivas Publicadas**: cards mostrando correções de Writing e Speaking já avaliadas pelo **Prof. Silas**.

---

## 4. Player de Lição Interativa (`LessonPlayer.tsx`)

Cada unidade conduz o aluno por uma sequência pedagógica em até **8 formatos de passo**:
1. **Dica Contextual (`tip`)**: regra gramatical/cultural em português com caixa visual `[+] / [-] / [?]` e exemplos clicáveis com **`🇺🇸 US`** e **`🇬🇧 UK`**.
2. **Listening (`listening`)**: reprodução do áudio em velocidade normal (**US/UK**) ou **`0.75x`** lenta, seguida de interpretação de contexto.
3. **Reading (`reading`)**: textos simulando `chat`, `menu`, `email`, `boarding_pass` e `article`, com **glossário clicável** (tradução, transcrição fonética IPA e áudio US/UK).
4. **Matching (`matching`)**: associação interativa de expressões no idioma-alvo com português e áudio por card.
5. **Preencher Lacunas (`fill_blank`)**: seleção da conjugação ou estrutura correta com dica de verbo e feedback explicativo.
6. **Speaking (`speaking`)**: frase modelo com áudio US/UK + dica fonética abrasileirada + gravação pelo microfone (`MediaRecorder` salvo em IndexedDB `audioDb.ts`) + transcrição e nota automática de pronúncia (`speech.ts`) + envio para o professor.
7. **Montagem de Frase (`writing_builder`)**: ordenação de blocos de palavras com distratores intencionais.
8. **Escrita Livre (`writing_free`)**: produção textual com contador de palavras mínimo, checklist dinâmico em tempo real, resposta modelo com áudio e envio ao professor.

---

## 5. Tutor de Conversação IA (`AITutor.tsx`)

- Escolha de cenários práticos A1–C1 (*Café em NYC*, *Check-in no Hotel*, *Aeroporto*, *Entrevista*, etc.).
- Chat em tempo real com:
  - Dicas de resposta sugeridas para iniciar ou destravar;
  - Entrada por voz (microfone Web Speech) ou teclado;
  - Correção imediata da frase do aluno + coaching em português sobre vícios comuns de brasileiros;
  - Botões **`🇺🇸 US`**, **`🇬🇧 UK`**, **`0.75x`** e toggle **Traduzir / Ocultar PT** em cada mensagem do tutor;
  - Indicador de conexão com **Google Gemini** (`gemini-3.8-flash`) ou **Tutor Inteligente Local**.

---

## 6. Revisão Inteligente (`VocabReview.tsx`) & Central de Dicas (`TipsLibrary.tsx`)

- **Revisão (`140` cards SRS)**:
  - Filtros por nível CEFR, grau de domínio (*Fracos*, *Médios*, *Dominados*) e busca livre.
  - **Modo Flashcards** (frente com palavra + IPA + botões `🇺🇸 US / 🇬🇧 UK` que não viram o card por acidente; verso com tradução + frase exemplo e áudio; avaliação em 3 níveis).
  - **Modo Lista**: consulta rápida com áudio US/UK em cada termo.
- **Central de Dicas & Guia Gramatical**:
  - Aba **Dicas (`69`)**: busca por tópico, categoria (*Gramática*, *Pronúncia*, *Falsos Cognatos*, *Cultura*) e nível, com botão *"Praticar lição →"*.
  - Aba **Guia Gramatical SWJ (`24` tabelas)**: referência estruturada cobrindo *Tempos Simples/Contínuos/Perfeitos*, *Futuros*, *Modais*, *Voz Passiva*, *Discurso Indireto* e *Question Tags*, com áudio US/UK nos exemplos.

---

## 7. Certificados CEFR (`CertificatesView.tsx`)

- Exibe o progresso de unidades por nível (`A1`–`C1`) e libera a emissão de certificados com **código único verificável (`FB-A1-XXXX`)**, médias das 4 habilidades, assinatura da escola/**Prof. Silas** e exportação para impressão/PDF (`certificatePdf.ts`).

---

## 8. Estúdio do Professor (`TeacherStudio.tsx`)

Disponível apenas para contas com `role: 'teacher'` e privilégios ampliados para o **Admin Mestre (`silaswf@gmail.com`)**:
1. **Aba Correções**: fila de envios pendentes/corrigidos de *Writing* (comparativo lado a lado com texto reescrito + selos) e *Speaking* (áudio local se no mesmo aparelho + frase alvo com `🇺🇸 US / 🇬🇧 UK / 0.75x` + rubrica deslizante de Clareza, Entonação e Ritmo).
2. **Aba Turmas & Usuários**:
   - Criação/exclusão de turmas com geração automática de código de convite (`TURMA-A1`, etc.) e emissão manual de certificados para alunos;
   - Painel **Gestão de Usuários & Permissões** exclusivo para Admin Mestre: visualização do código de convite docente (`SILAS-PROF-2026`), promoção/rebaixamento `Aluno ↔ Professor`, mudança de turma e exclusão de contas de teste.
3. **Aba Criar Tópico**: construtor completo para publicar unidades próprias multi-etapas em Inglês, Espanhol ou Francês diretamente na Trilha dos alunos.
4. **Aba Nuvem, IA & Vozes**: diagnóstico ao vivo das vozes neurais US/UK detectadas no dispositivo, status da chave fixa Gemini + campo de fallback, status de auto-sync Supabase, cópia rápida do SQL, identidade da escola e Exportar/Importar backup `.json`.
