# 05 — Manual Completo de Funcionalidades (`v2.0.0`)

Guia prático cobrindo todas as telas e fluxos do **FluentBridge Academy** para alunos, professores e o **Painel Admin Mestre** do **Prof. Silas**.

---

## 1. Tela de Entrada & Cadastro (`AuthScreen.tsx`)

- **Aba Entrar**:
  - Botão **Entrar com Google** (abre OAuth no navegador ou Chrome Custom Tabs no Android).
  - Login com **E-mail** e **Senha** cadastrados (contas bloqueadas no Painel Admin são impedidas de acessar imediatamente com exibição do motivo).
- **Aba Criar conta**:
  - Seletor explícito entre **Cadastro de Aluno** e **Cadastro de Professor**.
  - **Aluno**: informa nome, e-mail, senha (mín. 6 caracteres), confirmação e **Código da Turma** (`TURMA-A1`, `TURMA-B1`, `VIP-2026` ou outro criado pelo Prof. Silas).
  - **Professor**: informa os mesmos dados + **Código de Autorização Docente** configurado no Painel Admin (padrão `SILAS-PROF-2026`, dispensado apenas para `silaswf@gmail.com`).

---

## 2. Navegação Principal & Tema (`Sidebar.tsx`)

- **Desktop**: barra lateral fixa com **botão de recolher/expandir** (`lg:w-72` ↔ `lg:w-20`), identidade da escola, seletor de idioma (`🇬🇧 Inglês`, `🇪🇸 Espanhol`, `🇫🇷 Francês`), abas de navegação (incluindo **`Painel Admin`** exclusivo para `silaswf@gmail.com`) e os seletores de **Sotaque** e **Tema** (`Claro / Escuro / Automático`) posicionados logo abaixo do menu principal.
- **Mobile / Android**: barra superior com Safe Area automática (`WindowInsetsCompat` + `env(safe-area-inset-top)`), troca rápida de idioma/sotaque/tema, streak, XP e barra de navegação fixa inferior.

---

## 3. Trilha de Aprendizagem, Painel Recolhível & Tarefas (`LearningPath.tsx` + `PlacementTestModal.tsx`)

- **Cabeçalho & Painel Lateral Desdobrável**: XP total, dias consecutivos com proteção **Streak Freeze (`🧊`)**, meta diária (`10–30 min`), lembretes diários e botão **Ocultar/Mostrar Painel Lateral** para expandir a trilha em tela cheia no Desktop.
- **Tarefas de Casa do Professor**: seção dedicada no topo da trilha exibindo tarefas atribuídas à turma ou à escola com prazo e botão direto para iniciar a unidade.
- **Trilha Multi-Idiomas (`92` Unidades A1–C1)**: **50** em Inglês, **22** em Espanhol e **20** em Francês, além dos tópicos customizados publicados pelo professor.

---

## 4. Player de Lição Interativa (`LessonPlayer.tsx` — 11 Formatos)

Cada unidade conduz o aluno por uma sequência pedagógica com até **11 formatos de passo** e atalhos de teclado (`1–4`, `Enter`, `R`, `Espaço`, `Esc`):
1. **Dica Contextual (`tip`)**: regra em português + fórmula `[+] / [-] / [?]` + exemplos clicáveis com áudio neural.
2. **Listening (`listening`)**: áudio contextual normal e `0.75x`.
3. **Reading (`reading`)**: textos em `chat`, `menu`, `email`, `boarding_pass` e `article` com **glossário clicável**.
4. **Matching (`matching`)**: pares interativos idioma ↔ português com áudio.
5. **Preencher Lacunas (`fill_blank`)**: conjugação e estrutura em contexto.
6. **Ditado Auditivo (`dictation`)**: o aluno ouve a frase e digita exatamente o que escutou, com checagem normalizada e dicas.
7. **Pares Mínimos (`minimal_pairs`)**: contraste fonético (ex.: *live* `/lɪv/` vs. *leave* `/liːv/`) para treinar escuta fina de brasileiros.
8. **História Multi-Voz (`story`)**: mini-diálogos sequenciais alternando vozes masculina/feminina e sotaques, com tradução opcional e pergunta de compreensão.
9. **Speaking (`speaking`)**: gravação pelo microfone (`32 kbps` em IndexedDB) com transcrição **Whisper Cloud (`/api/stt`)** sem erro `network`, score automático e envio ao professor.
10. **Montagem de Frase (`writing_builder`)**: ordenação de blocos com distratores.
11. **Escrita Livre (`writing_free`)**: produção textual com contador mínimo de palavras, checklist e envio ao professor.

---

## 5. Tutor de Conversação IA & Modo Chamada (`AITutor.tsx`)

- Cenários A1–C1 dedicados para **Inglês, Espanhol e Francês** com adaptação automática do idioma do tutor.
- **Modo Chamada ao Vivo (Mãos-Livres)**: ativa escuta e reprodução automática contínua simulando uma ligação telefônica com professor particular.

---

## 6. Revisão SM-2 (`VocabReview.tsx`) & Central de Dicas (`TipsLibrary.tsx`)

- **Revisão Científica SM-2 (`278` cards)**: fila *"Para hoje (SM-2)"* com 4 botões (*Errei · 10 min*, *Difícil*, *Bom*, *Fácil*).
- **Central de Dicas & Guia Gramatical (`126` dicas + `56` tabelas)**: tabelas filtradas automaticamente pelo idioma ativo (**32 EN**, **12 ES**, **12 FR**) com áudio neural nos exemplos.

---

## 7. Painel Admin Mestre Exclusivo (`AdminPanel.tsx`) & Estúdio (`TeacherStudio.tsx`)

- **Painel Admin Mestre** (visível apenas para `silaswf@gmail.com`):
  - Exibe com destaque o **Código de Cadastro de Professor** (copiar em 1 clique ou alterar dinamicamente);
  - Busca e filtros de usuários (*Todos*, *Alunos*, *Professores*, *Bloqueados*);
  - Ações por usuário: **Bloquear / Liberar acesso** (com motivo opcional), **Alternar Aluno ↔ Professor**, **Mover de Turma**, **Redefinir Senha Local** e **Excluir conta**;
  - Painel de **Saúde da Nuvem & Vozes Neurais** (Deepgram Aura-2 EN/ES + Gemini 2.5 Neural TTS FR + Whisper STT).
- **Estúdio do Professor (`TeacherStudio.tsx`)**:
  - **Analytics Médio da Escola**, criação/exclusão de **Tarefas de Casa com Prazo**, correções com áudio cross-device, turmas, e **Gerador de Rascunho de Unidades com IA** (`/api/gemini-tutor`).
