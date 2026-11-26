# 08 — Análise Competitiva, UX/UI, Auditoria Técnica e Plano Mestre 360° (v9.0.0)

> **Data da Auditoria:** 26 de novembro de 2026 · **Versão Auditada:** `v9.0.0`  
> **Ambiente em Produção:** Web PWA (`https://fluentbridge.pages.dev`) · Edge API (`https://fluentbridge-api.silaswf.workers.dev`) · Windows Desktop (Electron NSIS) · Android (Capacitor APK) · iPhone/iPad (PWA Safari sem taxa Apple)  
> **Base Verificada (`v9.0.0`):** **16 idiomas** (`2.400` unidades = `150` por idioma), **`61` sotaques neurais**, **`800` cenários IA**, **`96` simulados oficiais**, **`3.200` guias gramaticais**, **`640` questões CAT**, **YouTube Study Lab**, `23` suítes Vitest (`81` testes verdes) e `15` fluxos Playwright E2E + auditoria WCAG AA.

---

## Parte 1 — Resumo Executivo & Scorecard v8.4.0

O **FluentBridge Academy** evoluiu de uma plataforma escolar com foco em inglês para um ecossistema poliglota completo em **12 idiomas** (`en`, `es`, `fr`, `it`, `de`, `ru`, `ja`, `zh`, `ar`, `nl`, `af`, `sv`), **49 sotaques regionais**, **1.236 unidades estruturadas (A1–C1)** e **76 simulados oficiais** (IELTS, TOEFL iBT, CELPIP, DET, DELE, DELF, CILS, Goethe, JLPT, HSK, ТРКИ, ALPT, CNaVT, TISUS, C1 Afrikaans).

Na `v8.4.0`, implementamos **11 dos 13 itens qualitativos** mapeados na auditoria anterior (`Q-01` a `Q-09`, `Q-11` e `Q-13`), além da correção do nome público de exibição do professor (`teacherDisplayName`), suporte aprimorado de **PWA para iOS sem custo Apple** e streaming HTTP `Range` (`206 Partial Content`) no Cloudflare R2.

| Dimensão Avaliada | v8.2.0 | v8.3.0 | **v8.4.0 (Atual)** | Principais Evidências |
| :--- | :---: | :---: | :---: | :--- |
| **Profundidade Pedagógica (A1–C1)** | 8,5 | 9,2 | **9,6 / 10** | 1.236 unidades, 76 simulados, *Spaced Repetition* SM-2, *Cloze*, *Mistake Notebook*, *Graded Readers*, *Grammar Drills*, *Phoneme Breakdown* nos 12 idiomas. |
| **Voz, Sotaques & Áudio** | 7,0 | 9,1 | **9,5 / 10** | Proxy neural no Worker (`Deepgram Aura-2` + `Google Cloud TTS` + cache R2 `X-TTS-Cache`), Whisper STT, ruído ambiente e **Modo Hands-Free** em loop. |
| **UI, UX & Acessibilidade** | 6,8 | 7,8 | **9,0 / 10** | Dark Mode híbrido (`@custom-variant dark` + `:where`), pulso `+XP` na lição, `EmptyStateCard` padronizado, menu **Imersão** dedicado, contraste WCAG AA ≥ 4,5:1 auditado em Light & Dark. |
| **Comunidade & Engajamento** | 6,5 | 7,4 | **8,8 / 10** | Ligas por idioma, **Desafio do Mês (+80 XP)**, moderação anti-spam/links/palavrões, reações rápidas (`👏🔥💡🎯`), áudio no *snippet*, *diff* visual e aceitação de correção (`+10 XP`), categoria *Parceiro de Estudo*. |
| **Arquitetura & Edge Security** | 7,5 | 8,6 | **9,1 / 10** | Zero chaves Gemini no bundle cliente, cotas diárias persistentes no R2 (`/api/stt` 200/dia, `/api/gemini-tutor` 250/dia), `/api/media/list`, HTTP `206 Range`, `sourcemap: 'hidden'`, telemetria + `VITE_SENTRY_DSN` opcional. |
| **Distribuição Multiplataforma** | 8,0 | 8,2 | **8,7 / 10** | Web PWA, Windows `.exe`, Android `.apk`, **iPhone/iPad via Safari PWA ($0/ano)**. Falta apenas publicação paga opcional nas lojas (`Q-12`) e cobrança SaaS (`Q-10`). |

---

## Parte 2 — Análise Competitiva & de Mercado (incluindo UI/UX)

### 2.1 Matriz Comparativa Direta (vs. Líderes Globais)

| Critério | FluentBridge `v8.4.0` | Duolingo Max | Babbel | Busuu | Cambly / Preply | ELSA Speak |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **Modelo Híbrido (IA + Professor Real)** | **Sim (Nativo)** | Não | Não | Parcial | Só Prof. | Não |
| **UI/UX & Clareza Visual** | **9,0** (Desktop + Mobile + Dark AA) | **9,5** (Polimento extremo) | **8,5** | **8,4** | **7,8** | **8,0** |
| **Profundidade Gramatical A1–C1** | **9,6** (Guias + Drills + Rubricas) | 7,0 | **9,0** | 8,5 | Depende do tutor | 5,0 |
| **Simulados Oficiais Multi-Exame** | **76 exames** (12 idiomas) | DET (só inglês) | Não | Certificados próprios | Preparatório pago | IELTS Speaking |
| **Vozes Regionais / Sotaques** | **49 sotaques** + cache R2 | 2–3 vozes/idioma | 2 vozes | 2 vozes | Nativos variados | Foco em inglês |
| **Modo Hands-Free / Podcast** | **Sim** (Modal contínuo + Podcasts) | Não | Podcasts | Não | Não | Não |
| **Comunidade & Correção entre Pares** | **Sim** (Ligas + Diff + Moderação) | Só Ligas | Não | **Sim** (Forte) | Não | Não |
| **Gestão B2B / Turmas / Certificados PDF** | **Sim** (Estúdio + Admin Mestre) | Duolingo for Schools (básico) | B2B Corporativo | B2B | Não | B2B |
| **Custo Mensal p/ Aluno** | **Personalizável / R$ 0 (Escola)** | ~US$ 30/mês | ~US$ 14/mês | ~US$ 12/mês | US$ 80–250/mês | ~US$ 12/mês |

### 2.2 Análise SWOT Atualizada

- **Forças (Strengths):** Único produto da categoria que combina **trilha gamificada A1–C1 + 76 simulados oficiais + Tutor IA seguro (Worker Proxy) + Estúdio do Professor + Aulas ao Vivo + Certificados verificáveis** em 12 idiomas e 4 idiomas não-latinos completos (`ru`, `ja`, `zh`, `ar`).
- **Fraquezas (Weaknesses):**
  - Ausência de cobrança recorrente nativa (Stripe/Mercado Pago — `Q-10` adiado).
  - Sem app listado diretamente na Apple App Store (contornado via **PWA Safari gratuito**, porém sem aparecer na busca da App Store).
  - Três arquivos ainda concentrados acima de 1.800 linhas (`App.tsx`, `LessonPlayer.tsx`, `TeacherStudio.tsx`).
- **Oportunidades (Opportunities):**
  - **Escolas de idiomas e professores autônomos no Brasil/LATAM** buscando *white-label* com IA e correção de áudio/texto sem pagar mensalidade em dólar por aluno.
  - **Candidatos à imigração e intercâmbio** (CELPIP/IELTS/DELF/Goethe/JLPT/CNaVT) — nicho com ticket médio 3x–5x maior que estudo casual.
- **Ameaças (Threats):**
  - Mudanças de preço ou cota em APIs externas de IA (mitigado por cache SHA-256 em R2 + fallback local + cotas diárias por usuário/IP).
  - Concorrentes nativos com grande orçamento de marketing mobile (mitigado pela proposta B2B2C via professores e escolas parceiras).

### 2.3 TAM / SAM / SOM & Posicionamento

- **TAM (Mercado Global de Aprendizado Digital de Idiomas):** ~US$ 60B+ anuais.
- **SAM (Mercado LATAM + Preparatórios Oficiais + Escolas Independentes):** ~US$ 2,4B/ano.
- **SOM Realista (Ano 1–2 com foco em professores parceiros + alunos preparatórios):** 50 a 200 escolas/professores independentes × 40 alunos ativos = **2.000 a 8.000 alunos pagantes**, com potencial de ARR entre **R$ 720 mil e R$ 3,8 milhões** caso o módulo SaaS (`Q-10`) seja ativado no futuro.

---

## Parte 3 — Raio-X Técnico, Arquitetura & Escavação do Código

### 3.1 Métricas Reais da Base de Código (`v8.4.0`)

Medição executada diretamente sobre o repositório após o build final de `v8.4.0`:

- **Arquivos em `src/`:** `253` arquivos (`.ts`, `.tsx`, `.css`), totalizando **`201.961` linhas de código e conteúdo pedagógico**.
- **Atributos de teste (`data-testid`):** `123` ocorrências rastreáveis em componentes `.tsx`.
- **Regras `!important` residuais em `src/index.css`:** `47` ocorrências remanescentes (focadas em utilitários específicos de caixas/cores antigas; os fundos principais `.bg-white`, `.bg-slate-50*` e `.bg-[#F7F9FC]` já migraram para `:where(html.dark)`).
- **Cobertura de Testes:** `22` suítes Vitest (`77` testes unitários passando) + `14` testes E2E Playwright passando (Desktop 1280×800, Mobile 390×844, RTL Árabe, Japonês Kana e auditoria de contraste WCAG AA).

#### Maiores Hotspots de Código (excluindo arquivos estáticos de currículo/dados)

| Arquivo | Linhas (LOC) | Diagnóstico & Ação Recomendada |
| :--- | :---: | :--- |
| `src/App.tsx` | **2.417** | Orquestrador global de estado, sync e views. **Sugestão:** extrair hooks `useNavigationState` e `useCommunityHandlers`. |
| `src/components/LessonPlayer.tsx` | **2.410** | Motor completo das 9 etapas de lição. **Sugestão:** extrair `SpeakingStepPanel.tsx` e `WritingStepPanel.tsx`. |
| `src/components/TeacherStudio.tsx` | **1.834** | Reduzido de 2.253 para 1.834 na `v8.4.0` (com extração de `SchoolSettingsTab.tsx`). **Próximo passo:** extrair `SubmissionsGraderTab.tsx`. |
| `src/utils/cloudSync.ts` | **1.393** | Merge de estado + upload R2/Supabase + sync relacional. |
| `src/components/LearningPath.tsx` | **1.379** | Trilha modular, filtros CEFR, diagnóstico e checkpoints. |
| `src/components/MockExamHub.tsx` | **1.127** | 76 simulados oficiais + rubrica analítica + áudio. |
| `src/utils/japaneseKana.ts` | **1.104** | Conversor Kanji/Kana e mapa furigana offline. |
| `src/components/AITutor.tsx` | **1.047** | Tutor conversacional com 4 modos e cenários. |
| `src/utils/speech.ts` | **970** | Cadeia TTS (Worker Aura-2 → Google TTS → Web Speech) e Whisper STT. |
| `src/components/AdminPanel.tsx` | **949** | Gestão de usuários, vínculo professor-aluno, diagnóstico de voz e telemetria. |

#### Maiores Chunks de Produção (`dist/assets/`)

| Chunk JS | Tamanho (Raw) | Carregamento | Observação |
| :--- | :---: | :--- | :--- |
| `tutor-scenarios-*.js` | **461,3 KB** | Lazy (`AITutor`) | Candidato a split por idioma (`Q-15`). |
| `index-*.js` | **396,0 KB** | Inicial (Eager) | Core App + Auth + Sidebar + LearningPath. |
| `curriculum-de-*.js` | **340,1 KB** | Lazy por idioma | Carregado sob demanda ao selecionar Alemão. |
| `curriculum-fr-*.js` | **334,8 KB** | Lazy por idioma | Carregado sob demanda ao selecionar Francês. |
| `curriculum-it-*.js` | **331,5 KB** | Lazy por idioma | Carregado sob demanda ao selecionar Italiano. |
| `curriculum-es-*.js` | **317,9 KB** | Lazy por idioma | Carregado sob demanda ao selecionar Espanhol. |
| `supabase-vendor-*.js` | **225,1 KB** | Chunk separado | SDK Supabase isolado em vendor cacheável. |

*Nota de Build:* O Vite emite aviso informativo de que `src/utils/cloudSync.ts` é importado tanto estaticamente quanto dinamicamente em `aiTutorEngine.ts` e `speech.ts` (sem impacto funcional, mas limpar os imports dinâmicos redundantes melhora o *tree-shaking*).

### 3.2 Topologia de Edge, IA, Storage e Segurança

1. **Cloudflare Worker (`fluentbridge-api`, `v8.4.0`):**
   - `GET /api/tts`: gera áudio via `@cf/deepgram/aura-2-en` / `aura-2-es` ou Google Cloud TTS, grava em cache SHA-256 no bucket R2 (`fluentbridge-media/tts/v6/...`) e retorna `X-TTS-Cache: R2-HIT|R2-MISS`.
   - `POST /api/stt`: transcrição neural via `@cf/openai/whisper-large-v3-turbo` com rate-limit por minuto (30–60 req/min) + **cota diária persistente no R2 (`quotas/YYYY-MM-DD/stt/...`, 200/dia)**.
   - `POST /api/gemini-tutor`: proxy seguro com `GEMINI_API_KEY` em secret de servidor, modelos `gemini-3.8-flash` / `gemini-2.5-flash`, rate-limit por minuto + **cota diária persistente no R2 (`quotas/YYYY-MM-DD/gemini/...`, 250/dia)**.
   - `GET /api/media/list` e `GET /api/media/*`: descoberta automática de vídeos no R2 (`videos/...`) e streaming com suporte a **HTTP `Range` (`206 Partial Content`, `Accept-Ranges: bytes`)** obrigatório no Safari/iOS.
   - `POST / GET /api/telemetry`: registro de erros no R2 (`telemetry/errors.json`), leitura protegida quando `REQUIRE_SUPABASE_JWT === 'true'` e encaminhamento opcional para `VITE_SENTRY_DSN` via Envelope API.

---

## Parte 4 — Auditoria de Bugs, Qualidade & Débitos Residuais

### 4.1 Bugs Críticos Resolvidos (v8.2.1 → v8.4.0)

1. **Módulos duplicados na trilha (`v8.2.1`):** Blocos curriculares com numeração/título repetido antes de avançar. **Resolvido** com deduplicação e ordenação canônica + teste regressivo em todos os 12 idiomas.
2. **Áudio falhando em simulados e sotaques (`v8.2.1` / `v8.3.0`):** Voz robótica no CELPIP e falhas de reprodução em sotaques regionais. **Resolvido** com mapeamento de 49 sotaques para vozes neurais no Worker + cache R2 + pré-aquecimento via `scripts/prewarm-r2-tts.mjs`.
3. **Exposição de API key em repositório público (`v8.3.0`):** Remoção da chave Gemini do bundle cliente, migração total para secret no Worker proxy e rotação de credenciais.
4. **Nome de exibição do professor no AdminPanel (`v8.4.0`):** Professor configurava `"Silas Wagner"` em *Estúdio do Professor → Nuvem, IA & Escola*, mas o dropdown de atribuição no *Admin Mestre* continuava exibindo o nome de cadastro `"Silas"`. **Resolvido** com `UserProfile.teacherDisplayName`, helper `getTeacherDisplayName()` (`src/utils/teacherDisplay.ts`), persistência dupla no `handleUpdateSettings` e propagação em `AdminPanel`, `TeacherLinkModal` e `App.tsx`.

### 4.2 Débitos Técnicos & Casos de Borda Escavados (O que ainda merece atenção)

1. **47 `!important` residuais no `src/index.css`:** Embora os fundos principais já usem `:where(html.dark)`, classes de texto/borda (`text-slate-900`, `border-slate-200`, badges) ainda usam `!important` no CSS legado. Migrar gradualmente para tokens CSS semânticos eliminará 100% dos `!important`.
2. **Import misto estático/dinâmico de `cloudSync.ts`:** `aiTutorEngine.ts` e `speech.ts` usam `await import('./cloudSync')` enquanto `App.tsx` já importa estaticamente. Unificar remove o warning do Rollup no build.
3. **Upload de vídeo R2 sem thumbnail automática:** `InteractiveVideoView.tsx` já lista vídeos do R2 (`/api/media/list`), sincroniza legendas e velocidade e suporta HTTP `206 Range`, mas ainda depende de arquivos nomeados com o `clip.id` (ex.: `videos/en-vid-1.mp4`) e não extrai capa/thumbnail automaticamente.
4. **Sincronização em tempo real do Fórum sem Supabase Realtime ativo:** `CommunityHub` funciona perfeitamente via estado + sync periódico, mas sem WebSockets ativos no projeto Supabase de todos os ambientes, reações e comentários entre dois alunos podem levar até o próximo ciclo de sync para aparecer.
5. **Bundle de `tutor-scenarios` (461 KB):** Embora seja carregado *lazy*, usuários de um único idioma baixam os cenários dos 12 idiomas quando abrem o Tutor IA.

---

## Parte 5 — Plano Mestre de Melhorias Qualitativas (Categorias 3.1 a 3.6)

### 5.1 Status do Ciclo Anterior (`Q-01` a `Q-13` — Entregas da `v8.4.0`)

| Código | Categoria | Melhoria | Status `v8.4.0` |
| :---: | :--- | :--- | :---: |
| **Q-01** | 3.1 UI/UX | Dark Mode híbrido (`@custom-variant dark` + `:where(html.dark)`) e remoção de `!important` nos fundos | ✅ Implementado |
| **Q-02** | 3.1 UI/UX | Padronização de `EmptyStateCard` + pulso visual `+XP` em tempo real no `LessonPlayer` | ✅ Implementado |
| **Q-03** | 3.1 UI/UX | Aba dedicada **Imersão (Áudio & Vídeo)** na barra lateral separada de **Guias & Gramática** | ✅ Implementado |
| **Q-04** | 3.2 Performance | Extração de `SchoolSettingsTab.tsx` do `TeacherStudio.tsx` (-419 LOC no componente) | ✅ Implementado |
| **Q-05** | 3.2 Performance | Pré-aquecimento R2 expandido (`--exams --limit`) e `sourcemap: 'hidden'` fora do precache PWA | ✅ Implementado |
| **Q-06** | 3.3 Segurança | Rotas `/api/stt` e `/api/gemini-tutor` com JWT híbrido/estrito e proxy seguro | ✅ Já ativo / Mantido |
| **Q-07** | 3.3 Segurança | Cotas diárias persistentes no R2 (`quotas/YYYY-MM-DD/...`) + `/api/telemetry` protegido em modo estrito | ✅ Implementado |
| **Q-08** | 3.4 Pedagogia & Voz | Descoberta automática `/api/media/list`, streaming HTTP `206 Range` e sync `playbackRate` no vídeo | ✅ Implementado |
| **Q-09** | 3.4 Pedagogia & Voz | Chips de **Phoneme Breakdown** nos 12 idiomas + **Modo Hands-Free** em loop contínuo | ✅ Implementado |
| **Q-10** | 3.5 Monetização | Checkout Stripe / Mercado Pago & planos recorrentes B2C/B2B | ⏸️ Adiado (decisão estratégica) |
| **Q-11** | 3.5 Comunidade | Moderação automática + Desafio do Mês (+80 XP) + Reações + Áudio no snippet + Diff/Aceite (+10 XP) + Parceiro de Estudo | ✅ Implementado |
| **Q-12** | 3.6 Distribuição | Publicação paga na Google Play Store (US$ 25) e Apple App Store (US$ 99/ano) | ⏸️ Adiado (decisão estratégica) |
| **Q-13** | 3.6 Observabilidade | `sourcemap: 'hidden'`, encaminhamento `VITE_SENTRY_DSN` e auditoria WCAG AA automatizada no Playwright | ✅ Implementado |

### 5.2 Próxima Onda Recomendada (`Q-14` a `Q-24` — Categorias 3.1 a 3.6)

| Código | Categoria | Proposta Concreta | Impacto | Esforço |
| :---: | :--- | :--- | :---: | :---: |
| **Q-14** | 3.1 UI/UX | Eliminar os últimos 47 `!important` em `src/index.css` migrando badges e bordas para tokens CSS v4 nativos | Médio | Baixo |
| **Q-15** | 3.2 Performance | Quebrar `tutor-scenarios` (461 KB) e `LessonPlayer` (2.410 LOC) em módulos lazy por idioma / subetapa | Alto | Médio |
| **Q-16** | 3.2 Performance | Remover importação mista (estática + dinâmica) de `cloudSync.ts` para otimizar tree-shaking | Baixo | Baixo |
| **Q-17** | 3.3 Segurança | Ativar `REQUIRE_SUPABASE_JWT=true` por padrão após validar 100% dos usuários em sessão Supabase Auth | Alto | Baixo |
| **Q-18** | 3.3 Segurança | Painel de auditoria de cotas R2 no `AdminPanel` (consumo diário por endpoint e alertas de pico) | Médio | Baixo |
| **Q-19** | 3.4 Pedagogia | Gravação real + espectrograma visual simples no `Speaking` comparando duração/pausas com o áudio nativo | Alto | Médio |
| **Q-20** | 3.4 Pedagogia | Gerador automático de baralho SM-2 a partir dos erros de `MockExamHub` (erro no simulado vira flashcard imediato) | Alto | Baixo |
| **Q-21** | 3.5 Comunidade | Salas de prática assíncrona por áudio no Fórum (enviar nota de voz de 15s para colegas avaliarem) | Alto | Médio |
| **Q-22** | 3.5 Monetização | Quando desejar monetizar: Stripe Checkout / PIX Mercado Pago para planos VIP & Escolas (ex-`Q-10`) | Altíssimo | Alto |
| **Q-23** | 3.6 Distribuição | Botão inteligente de banner "Instalar no iPhone" detectando iOS Safari (`navigator.standalone === false`) dentro da Home | Alto | Baixo |
| **Q-24** | 3.6 Observabilidade | Workflow GitHub Actions semanal rodando `prewarm-r2-tts.mjs` + verificação de links/versões no Worker | Médio | Baixo |

---

## Parte 6 — Estratégia iOS Sem Taxa da Apple ($0/ano vs. $99/ano)

**Pergunta-chave:** *É possível que usuários de iPhone/iPad (iOS) usem e instalem o FluentBridge sem pagar a taxa de US$ 99/ano da Apple?*

**Resposta direta: Sim — 100% gratuito e legal via PWA no Safari.**

1. **Como funciona hoje na `v8.4.0`:**
   - Já configuramos em `index.html` as metatags `apple-mobile-web-app-capable="yes"`, `apple-mobile-web-app-status-bar-style="default"`, `apple-mobile-web-app-title="FluentBridge"`, `apple-touch-icon.svg` e `manifest.webmanifest`, além de um card dedicado na tela de entrada (`AppDownloadGateway`).
   - O aluno no iPhone/iPad abre `https://fluentbridge.pages.dev` no **Safari**, toca em **Compartilhar** (ícone quadrado com seta para cima) → **"Adicionar à Tela de Início"**.
   - O app ganha ícone próprio na tela inicial do iPhone, abre em **tela cheia sem barra do Safari**, funciona offline via Service Worker (`Workbox`), toca áudio neural e vídeo MP4 (graças ao suporte HTTP `206 Range` implementado na `v8.4.0` no Worker R2) e até suporta **Web Push Notifications** desde o iOS 16.4+ quando aberto pela Tela de Início.
2. **Por que evitar *sideloading* IPA fora da App Store?**
   - Existe o método técnico de assinar um `.ipa` com Apple ID gratuito via Xcode/AltStore/Sideloadly, **porém a Apple expira o certificado a cada 7 dias**, exigindo reconectar o iPhone a um computador toda semana (inviável para alunos finais).
3. **Quando vale pagar US$ 99/ano no Apple Developer Program?**
   - Apenas quando você quiser aparecer na busca orgânica da **App Store** ou precisar de integrações nativas exclusivas (ex.: Apple In-App Purchase obrigatório para assinaturas vendidas dentro de app nativo iOS). Até lá, o **PWA Safari + R2 Range** entrega ~95% da experiência nativa a **custo zero**.
