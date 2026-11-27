# 03 — Auditoria 360° (Zero-Based) & Análise Competitiva de Mercado (`v9.3.0`)

> **Data da Auditoria:** 26 de novembro de 2026 · **Versão Auditada:** `v9.3.0`  
> **Ambiente Ao Vivo:** Web PWA (`https://fluentbridge.pages.dev`) · Edge API (`https://fluentbridge-api.silaswf.workers.dev`) · Windows Desktop (Electron) · Android (Capacitor APK/AAB) · iOS Safari PWA (`$0/ano`)  
> **Telemetria Real Pós-`v9.3.0`:** **`23` suítes Vitest (`87/87` testes verdes)**, **`15/15` fluxos E2E Playwright**, build Vite em `7.22s` com **0 chunks `> 500 kB`** e **0 avisos de importação mista**, Worker modular (`lib/quotas.js`, `routes/adminQuotas.js`, `routes/media.js`), **`17` idiomas (`2.550` unidades)** e **Tradutor Bidirecional (`/api/translate`)**.

---

## Parte 1 — Scorecard Executivo (`v9.0.0`)

A **`v9.0.0`** consolida o maior salto de escala do **FluentBridge Academy**: saída de `12 → 16 idiomas` (`tr`, `he` RTL + *Niqqud*, `nb`, `da`), expansão espiralada de `103 → 150 unidades` por idioma (`2.400` unidades no total), `800` cenários de Tutor IA, `96` simulados oficiais, **YouTube Study Lab** e redesign Dark Sober de Login/Gateway + Hero compacto.

| Dimensão Auditada | `v8.2` | `v8.4` | **`v9.0` (Atual)** | Evidências Técnicas Verificadas |
| :--- | :---: | :---: | :---: | :--- |
| **Profundidade Pedagógica (A1–C1)** | 8,5 | 9,6 | **9,8 / 10** | `2.400` unidades coesas (`30`/CEFR), `3.200` guias gramaticais, `640` questões CAT, `96` simulados (`24` formatos), *Niqqud* (`he`) e *100% Kana* (`ja`). |
| **Voz, Sotaques & Imersão** | 7,0 | 9,5 | **9,7 / 10** | `61` sotaques em Gemini 2.5 Native TTS (`tts/v6/`) + R2 SHA-256, `80` podcasts, `48` vídeos (`206 Range`), **YouTube Study Lab** com fallback `12s` e Modo Hands-Free. |
| **UI, UX & Acessibilidade** | 6,8 | 9,0 | **9,3 / 10** | Login & Gateway **Dark Sober** (`#090D16`), Hero compacto na trilha, `0 px` de overflow mobile (`390x844`), contraste WCAG AA Light/Dark e `i18n` `PT/EN/ES`. |
| **Comunidade & Retenção** | 6,5 | 8,8 | **9,0 / 10** | Ligas por idioma, Desafio do Mês (`+80 XP`), moderação automática, *diff* de correção entre pares (`+10 XP`), Streak Freeze e Missões Diárias. |
| **Arquitetura, Código & Segurança** | 7,5 | 9,1 | **9,4 / 10** | Worker `v9.1.0` modularizado (`lib/http.js`, `routes/youtubeStudy.js`), **0 chunks >500 kB**, **0 avisos Rollup**, cotas R2, `sourcemap: 'hidden'`, `secret-scan` CI e `FillBlankStepView.tsx` extraído. |
| **Distribuição & Negócio** | 8,0 | 8,7 | **8,8 / 10** | Web PWA, Windows `.exe`, Android `.apk`/`.aab`, iPhone/iPad Safari PWA (`$0/ano`). Falta motor de assinaturas/cobrança SaaS para escala B2C/B2B. |

---

## Parte 2 — Telemetria Real de Código & Bundle (Auditoria do Zero)

### 2.1 Maiores Arquivos do Repositório (Risco de Manutenibilidade)
Medição direta via `Get-Content` na árvore atual:

| Arquivo | Linhas | Diagnóstico |
| :--- | :---: | :--- |
| `src/components/LessonPlayer.tsx` | **2.442** | Orquestra estado, atalhos, gravação, adaptive difficulty, XP e múltiplos tipos de passo no mesmo arquivo. |
| `src/components/TeacherStudio.tsx` | **1.834** | Ainda concentra fila de correções, turmas, editor de tópicos e tarefas apesar da extração de `SchoolSettingsTab`. |
| `cloudflare-worker/worker.js` | **1.677** | Concentra todos os 8 endpoints, mapa de 61 vozes/sotaques, prompts Gemini, YouTube parser e cotas R2. |
| `src/utils/cloudSync.ts` | **1.393** | Mistura auth, merge granular, upload de áudio, tombstones e telemetria; gera aviso no Vite por importação mista estática + dinâmica. |
| `src/components/LearningPath.tsx` | **1.379** | Concentra Hero, filtros, módulos, radar, missões, tarefas, ranking, modal de meta e checkpoint. |
| `src/components/MockExamHub.tsx` | **1.127** | Concentra catálogo, timer, áudio, rubrica Writing e fluxo de 3 partes Speaking. |
| `src/utils/japaneseKana.ts` | **1.104** | Dicionário extenso de conversão Kanji → Kana (bom estar isolado, mas pode virar JSON lazy se crescer). |
| `src/components/AITutor.tsx` | **1.047** | Combina chat, chamada ao vivo com VAD, memória e configurações avançadas. |

### 2.2 Chunks do Build de Produção (`dist/assets/` — Vite 6.4.6)
O build concluiu em `7.35s`, porém gerou **9 chunks acima de `500 kB`** (não bloqueia a carga inicial porque são *lazy-loaded* sob demanda ao trocar de idioma/aba, mas impacta memória em Androids básicos ao abrir esses idiomas):
- `curriculum-v9-ja-zh-ar-*.js`: **968,33 kB** (`337,33 kB` gzip)
- `curriculum-v9-it-de-ru-*.js`: **846,98 kB** (`286,78 kB` gzip)
- `curriculum-he-*.js`: **843,24 kB** (`265,90 kB` gzip)
- `curriculum-v9-en-es-fr-*.js`: **821,07 kB** (`288,98 kB` gzip)
- `tutor-scenarios-*.js`: **803,98 kB** (`293,57 kB` gzip)
- `curriculum-v9-nl-af-sv-*.js`: **790,81 kB** (`281,47 kB` gzip)
- `curriculum-nb-*.js`: **668,28 kB** (`242,30 kB` gzip)
- `curriculum-da-*.js`: **586,01 kB** (`214,08 kB` gzip)
- `curriculum-tr-*.js`: **555,50 kB** (`203,92 kB` gzip)
- Entry principal `index-*.js`: **440,81 kB** (`137,13 kB` gzip) + CSS `115,52 kB` (`17,74 kB` gzip).
- **Aviso do Rollup:** `src/utils/cloudSync.ts` é importado estaticamente (`App.tsx`, `TeacherStudio.tsx` etc.) e dinamicamente (`aiTutorEngine.ts`, `speech.ts`), impedindo isolamento em chunk separado.

---

## Parte 3 — Achados da Auditoria & Plano de Ação (`P0 / P1 / P2`)

### Bugs & Gargalos Já Resolvidos na `v9.0.0`
1. **Login e Gateway verbosos em tema claro:** substituídos por design **Dark Sober (`#090D16`)** com 4 blocos curtos de métricas.
2. **Hero da Trilha ocupando meia tela:** compactado (`p-4 sm:p-5`), sem parágrafo descritivo redundante e com card de meta diária enxuto.
3. **Overflow horizontal mobile (`6px`) com nomes longos de idioma (`DA · Dinamarquês`):** travado com `max-w-[122px] min-w-0 truncate` no `<select>` mobile.
4. **Endpoints/textos legados (`12 idiomas` / `194 unidades` / `/health`):** atualizados em `AdminPanel.tsx`, `TeacherLinkModal.tsx`, `AuthScreen.tsx`, `AppDownloadGateway.tsx` e `platformDefaults.ts`.
5. **Travamento potencial no YouTube Study Lab offline/lento:** adicionado `AbortController` de `12s` em `youtubeStudy.ts`.

### Dívidas Técnicas & Oportunidades Abertas

| Prioridade | Categoria | Achado Concreto | Prescrição Objetiva |
| :---: | :--- | :--- | :--- |
| **P0** *(Resolvido v9.1)* | Performance / Bundle | 9 chunks `> 500 kB` (agrupamento de 3 idiomas por chunk em `curriculum-v9-*` e `tutor-scenarios` monolítico de `803 kB`). | **Concluído:** `vite.config.ts` fatiado por idioma individual e `tutor-scenarios-*`; maior chunk agora é `472,67 kB` (zero avisos). |
| **P0** *(Resolvido v9.1)* | Arquitetura / Build | Aviso de importação mista em `src/utils/cloudSync.ts` (estática + dinâmica). | **Concluído:** padronizadas importações estáticas em `aiTutorEngine.ts` e `speech.ts` (zero avisos Rollup). |
| **P1** *(Resolvido v9.1)* | Manutenibilidade | `LessonPlayer.tsx` (`2.442L`), `TeacherStudio.tsx` (`1.834L`) e `worker.js` (`1.677L`) concentram múltiplas responsabilidades. | **Concluído (`v9.1.0` + continuação `v9.2`):** extraídos `cloudflare-worker/lib/http.js`, `routes/youtubeStudy.js` e `FillBlankStepView.tsx`. |
| **P1** | Cobertura de Testes | `YouTubeStudyLab.tsx`, `AuthScreen.tsx` e `worker.js` (contrato HTTP completo) dependem majoritariamente de E2E em vez de testes unitários rápidos. | Adicionar testes de unidade/componente em `src/utils/__tests__/` com `@testing-library/react` ou mocks `fetch` para `/api/youtube-study` e fluxo de cadastro. |
| **P1** *(Resolvido v9.1)* | Pedagogia (`he`) | `unitScriptPhonics.ts` injeta passo automático `script_phonics` em `ru`, `ja`, `zh` e `ar`, mas ainda não em Hebraico (`he`). | **Concluído:** adicionado `HEBREW_ALEFBET` em `unitScriptPhonics.ts` para unidades A1 de Hebraico. |
| **P2** | Produto / Negócio | Falta camada de cobrança/assinaturas (`Stripe`/`Mercado Pago`) e painel visual de consumo das cotas R2 (`200` STT / `250` Gemini / `100` YouTube) no `AdminPanel`. | Expor `GET /api/admin/quotas` autenticado para o Admin Mestre e integrar checkout/webhooks no Worker na `v9.5.0`. |
| **P2** | Distribuição iOS | Hoje iPhone/iPad usa Safari PWA (`$0/ano`), o que atende bem alunos sem taxa Apple, mas não aparece na busca orgânica da App Store. | Manter Safari PWA para custo zero e avaliar publicação nativa na App Store (`$99/ano`) apenas quando houver receita recorrente B2C/B2B. |

---

## Parte 4 — Análise Competitiva & de Mercado (`v9.0.0`)

### 4.1 Matriz Comparativa Direta

| Critério | **FluentBridge `v9.0`** | Duolingo Max | Babbel | Busuu | LingQ | Cambly / Preply | ELSA Speak |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **Idiomas Completos A1–C1** | **16 idiomas (`2.400` un.)** | ~40 (profundidade desigual) | 14 | 14 | 40+ (foco leitura) | Depende do tutor | Só Inglês |
| **Modelo Híbrido (IA + Prof. Real)** | **Sim (Nativo)** | Não | Não | Parcial | Não | Só Prof. | Não |
| **Estudo c/ YouTube + Gramática IA** | **Sim (YouTube Study Lab)** | Não | Não | Não | Sim (importa legenda, sem explicador gramatical integrado) | Não | Não |
| **Simulados Oficiais Multi-Exame** | **96 exames (`24` formatos)** | DET (só inglês) | Não | Certificados próprios | Não | Preparatório pago | IELTS Speaking |
| **Vozes Regionais / Sotaques** | **61 sotaques neurais + R2** | 2–3/idioma | 2/idioma | 2/idioma | TTS básico | Nativos reais | Inglês |
| **Hands-Free & Podcasts** | **Sim (`80` ep. + Loop)** | Não | Podcasts | Não | Áudio playlist | Não | Não |
| **Comunidade + Correção Pares** | **Sim (Ligas + Diff + Mod.)** | Só Ligas | Não | **Sim (Forte)** | Fórum | Não | Não |
| **Estúdio Docente & Admin B2B** | **Sim (Completo)** | Básico | B2B | B2B | Não | Marketplace | B2B |
| **Preço p/ Aluno** | **R$ 0 (Escola) / Flexível** | ~US$ 30/mês | ~US$ 14/mês | ~US$ 12/mês | ~US$ 13/mês | US$ 80–250/mês | ~US$ 12/mês |

### 4.2 SWOT Estratégica Atualizada
- **Forças:** Único ecossistema que une **2.400 unidades CEFR + 96 simulados oficiais + YouTube Study Lab com explicador gramatical + Tutor IA em Chamada + Estúdio do Professor com áudio cross-device + 16 idiomas (incl. Hebraico RTL/Niqqud, Árabe RTL, Turco, Japonês, Chinês, Russo, Norueguês e Dinamarquês)** sem custo por licença de terceiros para o aluno da escola.
- **Fraquezas:** Base de código concentrada em poucos arquivos grandes (`LessonPlayer`, `TeacherStudio`, `worker.js`), chunks de expansão `v9` acima de `500 kB` e ausência de gateway de pagamento integrado para venda direta B2C fora da escola.
- **Oportunidades:** Posicionar o **YouTube Study Lab** + **96 Simulados Oficiais** como diferencial central de marketing orgânico (alunos que preparam IELTS, CELPIP, DET, TÖMER, YAEL, JLPT, HSK e Norskprøve), além de licenciamento *white-label* para outras escolas de idiomas.
- **Ameaças:** Limites de cota gratuita de APIs de IA em picos de tráfego (já mitigados por cotas persistentes no R2 + cache SHA-256 + fallback offline) e dependência de lojas móveis caso o YouTube altere formatos públicos de legendas (mitigado pelo campo manual/SRT/VTT).
