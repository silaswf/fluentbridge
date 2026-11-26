# 04 — Roadmap & Evolução (`v1.0.0 → v10.0.0`)

Histórico consolidado de todas as fases entregues até a **`v9.0.0`** e plano de evolução técnica e comercial para as próximas versões.

---

## 1. Fases Concluídas (`v1.0.0 → v9.0.0`)

| Versão | Marco Principal | Entregas-Chave Verificadas |
| --- | --- | --- |
| **`v1.0.0 → v1.3.0`** | Fundação Busuu + Multiplataforma + Edge | Player multi-etapas, Gemini Proxy + Deepgram Aura-2 no Cloudflare Worker, Supabase OAuth/Sync granular com tombstones, Electron `.exe`, Capacitor `.apk`/`.aab`, PWA offline e Vitest inicial. |
| **`v2.0.0 → v7.0.0`** | Expansão Poliglota, Exames & Comunidade | Expansão de `3 → 12` idiomas, alfabetos completos (Japonês, Chinês, Russo, Árabe RTL), Cloze SM-2, Grammar Drills, Graded Readers, Live Classroom, Mistake Notebook, Certificados PDF, Relatórios Pedagógicos e Comunidade. |
| **`v8.0.0 → v8.2.1`** | Coesão, DET & Correção de Trilha | `courseCohesion.ts` (`>=10` flashcards coesos por unidade), 100% Kana toggle em Japonês, DET (10–160), módulos desdobráveis sequenciais sem repetição (`v8.2.1`), timeout dinâmico para áudios longos e `49` sotaques preservados até o Worker. |
| **`v8.3.0`** | Vozes Neurais Globais & Plano P0–P2 | Gemini 2.5 Native TTS em todos os 49 sotaques (`tts/v6/`), `SettingsModal` unificado, barra CEFR única sticky, guarda de contraste Dark Mode, `i18n` `PT/EN/ES` 100%, `deleteMyCloudAccount()` LGPD, `secret-scan` no CI e Playwright mobile/desktop. |
| **`v8.4.0`** | Dark Híbrido, Imersão, Hands-Free & Comunidade 2.0 | `@custom-variant dark` + `:where`, `EmptyStateCard`, pulso `+XP`, aba dedicada **Imersão**, **Modo Hands-Free**, `phonemeBreakdown` nos 12 idiomas, Comunidade 2.0 (Desafio do Mês `+80 XP`, moderação, reações, *diff* `+10 XP`), iOS Safari PWA `$0/ano`, cotas R2, HTTP `206 Range`, `sourcemap: 'hidden'` e correção de `teacherDisplayName`. |
| **`v9.0.0` (Atual)** | **16 Idiomas, 2.400 Unidades, YouTube Study Lab & UI Sober** | **4 novos idiomas** (`tr`, `he` RTL + *Niqqud*, `nb`, `da`), expansão espiralada para **150 unidades/idioma (`2.400` totais)**, **`61` sotaques**, **`800` cenários IA**, **`96` simulados (`24` formatos)**, **`3.200` guias gramaticais**, **`640` questões CAT**, **YouTube Study Lab** (`POST /api/youtube-study` + timeout fallback `12s`), **Login & Gateway Dark Sober**, **Hero da Trilha compacto** e documentação consolidada em 5 arquivos. |

---

## 2. Próximas Ondas Planejadas

### Onda `v9.1.0` — Modularização & Otimização de Bundle (Dívida Técnica `P0/P1`)
- [ ] **Quebrar monolitos de UI/lógica:** extrair subcomponentes de `LessonPlayer.tsx` (`2.442` linhas → `< 600` linhas no orquestrador), `TeacherStudio.tsx` (`1.834` linhas), `LearningPath.tsx` (`1.379` linhas) e `MockExamHub.tsx` (`1.127` linhas).
- [ ] **Modularizar `cloudflare-worker/worker.js` (`1.677` linhas):** dividir em módulos (`routes/tts.js`, `routes/youtube.js`, `routes/gemini.js`, `routes/media.js`, `lib/quotas.js`).
- [ ] **Eliminar chunks `> 500 kB` e aviso de import misto:** dividir os bundles `curriculum-v9-*` e `tutor-scenarios` por idioma individual (`curriculum-v9-<lang>`) e padronizar `cloudSync.ts` apenas com imports estáticos ou gateway assíncrono único.
- [ ] **Testes de componente & contrato:** adicionar testes unitários em Vitest para `YouTubeStudyLab` (UI), `AuthScreen` (validação de vínculos) e contrato dos endpoints do Worker.

### Onda `v9.5.0` — Monetização B2C/B2B & Telemetria Proativa
- [ ] **Motor de Planos & Assinaturas:** integração com Stripe / Mercado Pago via webhooks no Cloudflare Worker para planos *Aluno Autônomo Pro*, *Aluno VIP* e *Escola B2B*, respeitando contas gratuitas vinculadas pelo Prof. Silas.
- [ ] **Painel de Observabilidade de Cotas:** exibir consumo diário em tempo real de `/api/stt` (`200`), `/api/gemini-tutor` (`250`) e `/api/youtube-study` (`100`) diretamente no `AdminPanel`.
- [ ] **Expansão de `script_phonics` para Hebraico (`he`):** gerar passos automáticos de Alefbet + vogais *Niqqud* dentro das unidades A1 de Hebraico (paridade com `ru`, `ar`, `ja`, `zh`).

### Onda `v10.0.0` — Escala Global & App Store Nativa
- [ ] **Publicação Opcional na Apple App Store:** empacotar via Capacitor iOS + Apple Developer Program (quando o faturamento justificar a taxa anual de US$ 99), mantendo o PWA gratuito como alternativa permanente.
- [ ] **Multi-tenancy Escolar:** isolamento completo por `school_id` no Supabase para licenciamento white-label a outras escolas de idiomas.
