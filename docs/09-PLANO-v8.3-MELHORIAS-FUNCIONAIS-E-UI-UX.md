# 09 — Plano de Melhorias `v8.3.0`: Auditoria Qualitativa Funcional, UI/UX & Segurança

> **Data:** 25/11/2026 · **Base auditada:** `v8.2.0` (commit `2a5a6c4`) · **Tipo:** documento de planejamento (nenhum item abaixo está implementado ainda, exceto onde marcado ✅).
> **Origem:** auditoria de código somente-leitura feita após a entrega da `v8.2.0`, seguindo a estrutura de [08 — Análise Competitiva](./08-ANALISE-COMPETITIVA-MERCADO.md), que cobria funcionalidades de mercado mas **não avaliava UI/UX nem a qualidade de configuração das funções já existentes**.
> **Premissa:** o app já tem volume pedagógico superior ao de vários concorrentes pagos. O gargalo agora é **conexão entre funções** (recursos entregues "meio ligados"), **densidade visual** e **ergonomia mobile/Dark Mode**.

---

## 1. Resumo Executivo

| Eixo | Diagnóstico | Risco se não tratado |
| --- | --- | --- |
| **Funcional** | Várias entregas da `v8.2.0` existem como módulo isolado, mas não estão plugadas ao fluxo real (sotaques, Outbox, adaptativo, LGPD). | Aluno não percebe o valor; dados offline podem não sincronizar. |
| **UI/UX** | Sidebar com até 10 abas + 8 controles de preferência; Hero da trilha com muitos CTAs e filtros duplicados; bugs de layout no menu "Mais" mobile. | Sobrecarga cognitiva, abandono no mobile. |
| **Dark Mode** | Implementado por ~220 linhas de overrides `!important` em `src/index.css`, com buracos de cobertura. | Regressões recorrentes de contraste (como ocorreu no Reading). |
| **i18n** | Seletor `PT/EN/ES` traduz só parte da casca da interface. | Interface bilíngue misturada. |
| **Segurança** | Chave do Gemini foi exposta no histórico público do Git (ver [seção 6](#6-incidente-de-segurança-e-lições-chave-gemini-exposta)). | Resolvido operacionalmente (✅); faltam salvaguardas preventivas. |

---

## 2. Auditoria Qualitativa das Funções Existentes

Cada item traz **o que acontece hoje** (verificado no código), **como melhorar** e **critério de aceite**.

### F-01 · Sotaques Regionais (49) desconectados da preferência global e do TTS
- **Hoje:**
  - `Sidebar.tsx` e o cabeçalho do `LessonPlayer.tsx` (≈L1251–1260) exibem só os **2 dialetos legados** (`activeCourse.dialects`).
  - Os 49 sotaques (`src/data/regionalAccents.ts`) aparecem apenas no popover `+N sotaques` de `DualAudioButtons.tsx` e **somem quando `size="xs"`** (usado em `VocabIntroStep`, `ReadingStepView`, `MatchingStepView`). Escolher um sotaque toca só aquele clipe e **não persiste** como preferência (`dialectByLanguage`).
  - `cloudflare-worker/worker.js` (`resolveTtsConfig`) tem prompts dedicados só para parte dos códigos; estes caem no fallback do idioma: `it-IT-MIL`, `it-IT-NAP`, `de-CH`, `de-DE-BY`, `ru-KZ`, `ja-FUK`, `zh-SG`, `ar-LB`, `ar-MA`, `ar-AE`, `nl-SR`, `af-CPT`, `sv-GBG`.
- **Melhoria:**
  1. Seletor único de sotaque (lista de `getRegionalAccents(languageCode)`) em **Configurações** e no header da lição, gravando em `dialectByLanguage`.
  2. Ícone compacto de sotaque também em `size="xs"`.
  3. Adicionar os 13 prompts regionais faltantes no Worker (voz + `promptPrefix` nativo + `bcp47`) e invalidar cache com novo prefixo (`tts/v6/`).
- **Aceite:** escolher "Napolitano" em Configurações faz todo áudio do curso `it` usar `it-IT-NAP`; teste unitário garante que **todos os 49 códigos** resolvem para configuração própria (não fallback); `X-TTS-Locale` do Worker reflete o código pedido.

### F-02 · Writing Diff penaliza respostas válidas diferentes do gabarito
- **Hoje:** `src/utils/writingDiffGrader.ts` usa LCS de palavras contra **uma** `modelAnswer` + regras de regex. Frase correta com sinônimos/ordem diferente é marcada em vermelho e derruba a nota (caso real nos E2E: `19%`).
- **Melhoria:** manter o diff local como **fallback offline/instantâneo**; quando online, chamar `/api/gemini-tutor` pedindo JSON estruturado (`correctedText`, `errors[]`, `cefrFeedback`, `score`) e exibir o diff **entre o texto do aluno e a versão corrigida**, preservando a intenção dele.
- **Aceite:** frase alternativa gramaticalmente correta obtém nota ≥ 80% online; offline continua funcionando (com aviso "correção simplificada"); falha/timeout da IA cai no diff local sem erro visível.

### F-03 · Dificuldade Adaptativa parcialmente ligada e sem persistência
- **Hoje:** `src/utils/adaptiveDifficulty.ts` calcula `rateMultiplier` e `autoShowHints`, porém `autoShowHints` **não abre** dica/tradução no `LessonPlayer.tsx`; o perfil zera ao fechar a lição; o botão `⚡ Guiado/Equilibrado/Imersivo` usa `hidden md:inline-flex` (**invisível no celular**).
- **Melhoria:** persistir média móvel de acurácia por usuário+idioma; no modo *Guiado* abrir dica automaticamente após 1 erro; no *Imersivo* ocultar tradução PT até clique; expor o seletor num menu `⚙️` mobile (ver U-04).
- **Aceite:** 3 erros seguidos mudam o perfil para *Guiado* e a dica abre sozinha; o perfil sobrevive a fechar/reabrir o app.

### F-04 · Fila Offline (Outbox) só cobre telemetria
- **Hoje:** `src/utils/offlineOutbox.ts` define `lesson_complete`, `srs_review`, `checkpoint` e `telemetry`, mas só `telemetry.ts` chama `enqueueOfflineMutation`. No flush (`App.tsx`), os 3 primeiros tipos retornam `true` sem enviar nada.
- **Melhoria:** enfileirar conclusão de lição, revisão SM-2 e checkpoint quando `!navigator.onLine`; no flush, chamar o sync relacional real (`relationalSync`/`cloudSync`) e mostrar toast "N itens sincronizados".
- **Aceite:** teste E2E: completar lição offline → reconectar → registro aparece no estado de nuvem; contador da Sidebar volta a 0.

### F-05 · Ruído Ambiente precisa de ergonomia pedagógica
- **Hoje:** `src/utils/ambientNoiseEngine.ts` liga em loop ao clicar no chip (antes do *Play*), sem controle de volume e disponível igual em A1.
- **Melhoria:** 3 intensidades (`Suave / Real / Desafio`), tocar/pausar sincronizado com a fala (ou botão explícito "Tocar fundo") e selo "Modo Desafio" em níveis iniciais.
- **Aceite:** ruído não inicia sozinho; volume muda sem recarregar; para ao sair da etapa.

### F-06 · Exclusão de conta LGPD só apaga localmente
- **Hoje:** `App.tsx` (≈L2238–2249): `onDeleteAccount` limpa outbox e remove o usuário do estado local; **não chama** a RPC `delete_my_account_data()` criada em `supabase_schema.sql` (Seção 10).
- **Melhoria:** com sessão Supabase ativa, chamar `supabase.rpc('delete_my_account_data')`, tratar erro (não apagar localmente se a nuvem falhar sem avisar), `signOut()` e só então limpar local. Já existe `src/utils/__tests__/deleteAccountCloud.test.ts` como ponto de partida.
- **Aceite:** teste com cliente Supabase mockado confirma a chamada da RPC e a ordem RPC → signOut → limpeza local.

### F-07 · Alertas de Retenção, Central & Guia, Tutor IA
- **Retenção (`retentionNotifications.ts`):** UI mostra só `retentionAlerts[0]` com selo `+N alerta(s)` não expansível; só usa Web `Notification` (sem `@capacitor/local-notifications` no Android). → Tornar o selo expansível; agendar notificações locais nativas para cartões SM-2 vencidos e aulas ao vivo.
- **Central & Guia (`TipsLibrary.tsx`):** concentra 7 produtos (`tips`, `guide`, `drills`, `readers`, `scripts`, `podcasts`, `videos`) numa só tela, dificultando descoberta. → Promover **Podcasts & Vídeos** e **Leitores Graduados** a uma área "Imersão" própria (ver U-01) e deixar "Guia" só com Dicas/Gramática/Drills/Alfabetos.
- **Tutor IA (`AITutor.tsx`):** parâmetros técnicos de voz (`vadSilenceMs`, `bargeInEnabled`) ficam expostos a iniciantes. → Agrupar em uma engrenagem "Avançado" dentro da chamada.

---

## 3. Auditoria de UI & UX (Desktop + Mobile)

### U-01 · Sobrecarga de navegação na Sidebar (`Sidebar.tsx`)
- **Hoje:** até **10 abas** (`Trilha`, `Conversação IA`, `Revisão`, `Simulados`, `Comunidade`, `Ao Vivo`, `Central & Guia`, `Certificados`, `Modo Professor`, `Painel Admin`) **+** seletor de idioma, card de perfil, streak/XP, caixa de dialeto, tema, idioma da UI, escala de fonte, Atualizar App, LGPD e Baixar App numa coluna única de `288px`.
- **Melhoria:**
  - Navegação principal enxuta (5–6 destinos): `Trilha`, `Revisão`, `Conversação IA`, `Imersão & Guias`, `Simulados`, `Comunidade/Ao Vivo` (as demais viram sub-abas ou itens condicionais por papel).
  - **Modal/Drawer "Configurações"** aberto pelo card do perfil, reunindo: sotaque padrão (F-01), tema, idioma da UI, tamanho da fonte, notificações, LGPD, atualizar app, baixar app e sair.
- **Aceite:** Sidebar desktop cabe em 1 viewport 1080p sem rolagem para um aluno; todas as preferências continuam acessíveis em ≤ 2 cliques.

### U-02 · Hero da Trilha com excesso de CTAs e controles duplicados (`LearningPath.tsx` ≈L299–533)
- **Hoje:** até 5 badges, 4 botões (`Continuar`, `Teste de Nivelamento`, `Definir Objetivo`, `Baixar próximas 3 unidades`), card de Meta Diária completo e **5 chips CEFR**; logo abaixo, **outra** barra de filtros CEFR (duplicada) e dois controles de lembrete (Hero e card de retenção). `expandedModules` não persiste ao trocar de aba/idioma.
- **Melhoria:** 1 CTA primário ("Continuar") + 1 secundário discreto; mover "Baixar offline" para ícone no módulo; **uma única** barra CEFR sticky; um só controle de lembrete; persistir módulos abertos em `sessionStorage` e rolar suavemente até a unidade atual ao filtrar.
- **Aceite:** acima da dobra restam ≤ 2 botões de ação; nenhum controle duplicado (teste de e2e conta ocorrências de `ALL/A1…C1` = 1).

### U-03 · Bugs de layout/ergonomia mobile (`Sidebar.tsx` ≈L701–965)
1. **Grid quebrado no menu "Mais" (≈L829–915):** o card de idioma da UI + escala de fonte está **dentro** de `grid grid-cols-2`, ocupando metade da largura (~165px em telas de 360–390px). → mover para fora do grid ou `col-span-2`.
2. **`Revisão` (SM-2) escondida em "Mais" (≈L771):** a bottom bar fixa tem `Trilha`, `Tutor IA`, `Simulados`, `Comunidade`. → fixar `Trilha · Revisão · Tutor IA · Simulados` + `Mais`.
3. **`Sair` exposto no header mobile (≈L754–761):** ao lado do tema, fácil de tocar sem querer. → mover para Configurações com confirmação.
4. **Controles escondidos no `LessonPlayer`:** som (`hidden sm:inline-flex`), sotaque (`hidden … sm:inline-flex`) e dificuldade (`hidden … md:inline-flex`) não existem no celular. → botão único `⚙️` no header mobile abrindo um sheet com som, sotaque, dificuldade adaptativa e modo sem pressão.
- **Aceite:** Playwright viewport `390x844` — sheet "Mais" sem overflow horizontal; `Revisão` na bottom bar; `⚙️` visível durante a lição.

### U-04 · Foco na lição (`LessonPlayer.tsx`)
- **Hoje:** header com X, título, contador, barra, combo, vidas, som, sotaque, adaptativo + tira de pills das etapas.
- **Melhoria:** no mobile, header mínimo (X, barra, vidas, `⚙️`); pills de etapas recolhidas atrás de "Etapa 5/11 ▾"; transição animada entre etapas e barra de progresso animada ao ganhar XP; confirmação sutil ao salvar palavra no deck; skeletons consistentes nos *lazy chunks*.

### U-05 · Dark Mode frágil (`src/index.css` L155–376)
- **Hoje:** componentes usam classes claras (`bg-white`, `bg-slate-50`, `text-slate-900`) e o Dark Mode "inverte à força" com `!important`. Contagem de classes claras: `TeacherStudio.tsx` 88, `AdminPanel.tsx` 44, `MockExamHub.tsx` 42, `LessonPlayer.tsx` 41, `VocabReview.tsx` 38, `LearningPath.tsx` 38, `Sidebar.tsx` 37.
- **Bugs confirmados agora:**
  - L286–302: `bg-orange-50`, `bg-orange-50/70`, `bg-orange-100` estão agrupados com índigo/violeta e ficam **roxos** no Dark Mode.
  - Faltam overrides de texto para `text-teal-800/900/950`, `text-sky-800`, `text-orange-800/900` (contraste baixo em fundo escuro).
- **Melhoria:**
  1. **Imediato:** corrigir os dois buracos acima (laranja próprio: fundo `rgba(124,45,18,0.38)`, texto `#FDBA74`; teal/sky/orange 800–950 mapeados para tons claros).
  2. **Estrutural:** tokens semânticos CSS (`--bg-canvas`, `--bg-surface`, `--bg-surface-muted`, `--text-primary`, `--text-secondary`, `--border-subtle`) + `dark:` do Tailwind, migrando por componente na ordem: `LessonPlayer` → `LearningPath` → `Sidebar` → `VocabReview` → `MockExamHub` → `AdminPanel` → `TeacherStudio`. Remover overrides `!important` à medida que cada componente migra.
  3. **Guarda de regressão:** teste Playwright que percorre as telas principais em Dark Mode e verifica razão de contraste ≥ 4.5:1 para texto (axe-core ou checagem de `getComputedStyle`).

### U-06 · i18n incompleto
- **Hoje:** em `Sidebar.tsx` (≈L183–258) só `community`, `live`, `tips` e rótulos de acessibilidade usam `tUi(uiLocale, …)`; `Trilha`, `Conversação IA`, `Revisão`, `Simulados`, `Certificados`, `Modo Professor`, `Painel Admin`, `LearningPath` e `LessonPlayer` ficam fixos em português.
- **Melhoria:** completar o dicionário `tUi` para toda a casca (navegação, headers, botões primários, estados vazios, toasts) e adicionar teste que falha se uma chave existir em `pt` e faltar em `en`/`es`. Se não der tempo, rotular o seletor como "Interface (parcial)".

### U-07 · Hierarquia visual e consistência
- Cards quase idênticos (`rounded-3xl border border-slate-200 bg-white p-6`) com muitos badges `text-[10px]/[11px]`. → definir 3 níveis de card (primário, secundário, informativo) e reduzir badges a no máximo 2 por card.
- Estados vazios e erros com mensagens padronizadas e ação clara (ex.: "Seu deck começa vazio de propósito" em `VocabReview.tsx` já é um bom padrão a replicar).

---

## 4. Matriz de Prioridade & Esforço

| Prio | ID | Melhoria | Tipo | Esforço | Impacto |
| --- | --- | --- | --- | --- | --- |
| **P0** | U-03 | Corrigir menu "Mais", fixar Revisão, tirar Sair do topo, `⚙️` no LessonPlayer mobile | UI/UX Mobile | Baixo | Altíssimo |
| **P0** | U-05 (1) | Corrigir Dark Mode `orange` e `teal/sky/orange 800–950` | UI Dark | Baixo | Alto |
| **P0** | F-01 | Sotaques integrados à preferência global + 13 prompts regionais no Worker | Funcional | Médio | Altíssimo |
| **P1** | U-01 | Modal Configurações + Sidebar enxuta | UI/UX Desktop | Médio | Altíssimo |
| **P1** | U-02 | Hero enxuto, filtro CEFR único, persistência de módulos | UI/UX | Médio | Altíssimo |
| **P1** | F-06 | RPC `delete_my_account_data()` na exclusão LGPD | Funcional/Compliance | Baixo | Alto |
| **P1** | F-04 | Outbox para lição/SRS/checkpoint | Funcional | Médio | Alto |
| **P1** | F-03 | Adaptativo: dica automática + persistência | Funcional | Médio | Alto |
| **P1** | F-05 | Ruído ambiente com volume e sincronismo | Funcional | Baixo | Médio |
| **P2** | F-02 | Writing híbrido com IA + fallback local | Funcional/Pedagogia | Médio | Muito alto |
| **P2** | F-07 | Retenção expansível + notificações nativas; área "Imersão"; Tutor "Avançado" | Funcional/UX | Médio | Alto |
| **P2** | U-04 | Header mínimo no mobile + animações/skeletons | UI/UX | Médio | Médio |
| **P2** | U-05 (2) | Migração para design tokens + guarda de contraste | Arquitetura UI | Alto | Alto |
| **P2** | U-06 | i18n completo da casca + teste de chaves | UX/Qualidade | Médio | Alto |
| **P2** | U-07 | Sistema de cards/estados vazios | UI | Médio | Médio |
| **P1** | S-02..S-04 | Salvaguardas contra novo vazamento (ver seção 6) | Segurança/DevOps | Baixo | Alto |

---

## 5. Sequência Sugerida de Entrega

| Versão | Escopo | Critério de saída |
| --- | --- | --- |
| **`v8.3.0`** | Todos os **P0** + **P1** (U-03, U-05.1, F-01, U-01, U-02, F-06, F-04, F-03, F-05, S-02..S-04) | Vitest + `tsc` limpos; Playwright desktop **e** `390x844` cobrindo menu "Mais", Configurações, trilha sem filtro duplicado, sotaque persistente e exclusão LGPD; deploy Web + Worker + release espelhada. |
| **`v8.4.0`** | **P2** de pedagogia e conexão (F-02, F-07, U-04) | Writing híbrido com IA validado por testes com respostas alternativas; área "Imersão" navegável. |
| **`v8.5.0`** | **P2** estruturais (U-05.2, U-06, U-07) | 0 overrides `!important` nos componentes migrados; teste de contraste em Dark Mode; teste de paridade de chaves `pt/en/es`. |
| **`v9.0.0`+** | Estratégico já previsto em [08](./08-ANALISE-COMPETITIVA-MERCADO.md): lojas oficiais, vídeos MP4 no R2, planos/pagamentos | — |

**Regra de não-regressão (obrigatória em cada versão):** manter verdes os 19 suítes/60 testes Vitest e os 13 testes Playwright atuais; qualquer teste existente que dependa de `data-testid` movido (`sidebar-download-app-btn`, `ui-locale-*`, `font-scale-*`, `mobile-*`) deve ser ajustado **junto** com a mudança de UI, preservando os `data-testid` sempre que possível.

---

## 6. Incidente de Segurança e Lições (chave Gemini exposta)

**O que aconteceu (25/11/2026):** ao tornar o repositório `silaswf/fluentbridge` público, o Google detectou uma chave de API do Gemini (vinculada a service account) em `src/config/appConfig.ts` no commit inicial `919cfbb` e a **revogou** automaticamente. O Tutor IA, os simulados com correção por IA e o TTS neural do Gemini ficaram sem credencial.

**Estado do código:** o `appConfig.ts` atual **não contém chave** (`DEFAULT_GEMINI_API_KEY` vem só de `VITE_DEFAULT_GEMINI_API_KEY`, vazio por padrão; o cliente usa o proxy `__CLOUD_PROXY__`). O histórico ainda contém a chave **revogada** nos commits `919cfbb`, `fba45d4` e `26e1c90`.

**Correção aplicada (✅):**
1. Nova chave gerada no Google AI Studio/Cloud.
2. Gravada **apenas** como segredo do Worker: `npx wrangler secret put GEMINI_API_KEY` (em `cloudflare-worker/`). Nenhum arquivo do projeto ou commit contém a chave nova.
3. Verificação em produção: `/api/health` → `hasGeminiSecret: true`; `/api/gemini-tutor` respondeu via `gemini-3.8-flash`; `/api/tts` gerou áudio neural para `fr-FR` e `it-IT` (`gemini-neural-tts`), e `en-US` via Deepgram.
4. Varredura de segredos no histórico (padrões `AQ.`, `AIza`, `ghp_`, `github_pat_`, `sk-`, `service_role`, `cfut_`): só a chave Gemini já revogada foi encontrada. Os 3 scripts do bundle web publicado estão limpos.

**Salvaguardas pendentes (parte do `v8.3.0`):**

| ID | Ação | Detalhe |
| --- | --- | --- |
| **S-01** ✅ | Chave nova só no Worker | Concluído. |
| **S-02** | Restringir a chave | No Google Cloud Console → Credentials, limitar à *Generative Language API* (e, se possível, por cota/orçamento com alerta). |
| **S-03** | Ativar **Secret Scanning + Push Protection** | GitHub → Settings → Code security (gratuito em repositório público). |
| **S-04** | Varredura de segredos no CI | Job `gitleaks` no GitHub Actions bloqueando PR/push com padrões de chave; `.gitignore` já cobre `.env` e `.env.*`. |
| **S-05** | (Opcional) Reescrever histórico | `git filter-repo` + `push --force` removeria a chave revogada do histórico, mas quebra clones/espelho; só vale se aparecer outro segredo. |
| **S-06** | Rotação periódica | Documentar procedimento de rotação: gerar chave → `wrangler secret put GEMINI_API_KEY` → testar `/api/health` e `/api/gemini-tutor`. |

**Regra de ouro:** segredos (`GEMINI_API_KEY`, `RELEASES_REPO_TOKEN`, tokens Cloudflare, `service_role` do Supabase) vivem **somente** em *Worker Secrets* ou *GitHub Secrets*. Na chave `anon` do Supabase, a proteção é o RLS.

---

## 7. Como Esta Fase Se Relaciona com o Comparativo de Mercado

| Diferencial frente a Duolingo/Busuu/Babbel/Speak | O que o plano `v8.3` faz por ele |
| --- | --- |
| Busuu/Duolingo: interface limpa, foco total na lição | U-01, U-02, U-04 reduzem densidade e CTAs. |
| Duolingo: hábito diário (streak, lembretes nativos) | F-07 (notificações nativas) e Revisão fixa na bottom bar (U-03). |
| Speak/Praktika: correção que entende intenção, não só gabarito | F-02 (Writing híbrido com IA). |
| Diferencial exclusivo do FluentBridge: 49 sotaques regionais | F-01 transforma o recurso de "popover escondido" em preferência global real. |
| Confiabilidade offline | F-04 faz a fila Outbox realmente sincronizar progresso. |
| Confiança/compliance (LGPD) | F-06 garante exclusão real na nuvem; S-02..S-04 evitam novo vazamento. |
