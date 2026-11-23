# 06 — Auditoria Completa do Sistema & Plano de Otimizações (`v2.4.0`)

Relatório técnico da auditoria pós-`v2.4.0` do **FluentBridge Academy**, validando o **Nivelamento Adaptativo (CAT) de `15` questões (`200` questões totais em `placement-bank`)**, **`260` unidades**, **imersão B2/C1**, **`500` guias gramaticais**, **Tutor IA dinâmico**, **Alunos VIP** e segurança (`DIST_LEAK=CLEAN` + `24/24` testes Vitest).

---

## 1. Resumo da Auditoria Pós-`v2.1.0` (Status de Cada Pilar)

| Pilar | Nota `v1.0.3` | Nota `v2.1.0` | Evidência Verificada |
| --- | --- | --- | --- |
| **Bundle Inicial & Lazy Loading** | `1.032,37 kB` (monolítico) | **`124,05 kB`** (`36,62 kB` gzip) | `index.js` caiu **88,0%**; módulos pesados, `grammar-guide` e 8 chunks curriculares separados (`a1a2`, `b1b2`, `c1`, `en-special`, `es`, `fr`, `it`, `de`). |
| **Segurança & Credenciais** | Chave Gemini no JS + senha texto plano | **`DIST_LEAK=CLEAN`** + `fbh1:` + Admin Block | Chave Gemini isolada no Worker `/api/gemini-tutor`, senhas com hash `fbh1:`, bloqueio imediato de usuários no login/OAuth. |
| **Currículo & 5 Idiomas** | `35` unidades (`34` EN + `1` ES) | **`194` unidades** (`50` EN + `36` ES + `36` FR + `36` IT + `36` DE) | `1.834` passos em `11` formatos, `372` dicas, `584` cards SM-2, `144` tabelas gramaticais (`32` EN + `28` cada ES/FR/IT/DE), **`0` erros** em `verify_curriculum.mjs`. |
| **Vozes Neurais & STT** | Deepgram Aura-2 apenas EN/ES | **Aura-2 (EN/ES) + Gemini 2.5 TTS (FR/IT/DE) + Whisper STT** | `fr-FR/CA`, `it-IT/CH`, `de-DE/AT` retornando `200 audio/wav`; Whisper `/api/stt` em EN/ES/FR/IT/DE. |
| **UI/UX, Dark Mode & Mobile** | Bugs de contraste e invasão de barra | **Corrigido e Responsivo** | Seletores Tailwind v4 (`lg:bg-white`, `text-amber-950/85`, `.topic-tips-box`), `WindowInsetsCompat`, Sidebar e painel recolhíveis. |
| **Testes Automatizados** | Sem testes unitários | **`6` suítes / `17` testes OK** | Vitest validando `srsEngine`, `speech`, `curriculum`, `storage`, `streakEngine` e `cloudSync` + `tsc --noEmit` (`0` erros). |

---

## 2. Medições Reais do Build de Produção (`npm run build` · `v2.0.0`)

- `dist/assets/index-BFhmmsG-.js`: **`122,94 kB`** (`gzip: 36,30 kB`) — shell principal + rotas iniciais.
- `dist/assets/curriculum-a1a2-BW1kkgux.js`: `101,80 kB` (`gzip: 35,28 kB`)
- `dist/assets/curriculum-b1b2-dC6kIUNR.js`: `111,59 kB` (`gzip: 38,74 kB`)
- `dist/assets/curriculum-c1-CFuYBSBp.js`: `50,48 kB` (`gzip: 18,27 kB`)
- `dist/assets/curriculum-en-special-wTwrqz7U.js`: `49,14 kB` (`gzip: 19,58 kB`)
- `dist/assets/curriculum-es-R-MWhXek.js`: `69,17 kB` (`gzip: 25,38 kB`)
- `dist/assets/curriculum-fr-BbtWMaVp.js`: `65,84 kB` (`gzip: 24,51 kB`)
- `dist/assets/TeacherStudio-ufmW-81u.js`: `54,24 kB` · `LessonPlayer`: `48,29 kB` · `AITutor`: `36,18 kB` · `TipsLibrary`: `28,30 kB` · `AdminPanel`: `14,22 kB`.
- **PWA Precaching**: `27` arquivos (`1.337,65 KiB`) com Workbox gerado automaticamente (`dist/sw.js`).
- **Auditoria de Vazamento**: `Select-String` por chaves privadas em `dist/assets/*.js` retornou **`DIST_LEAK=CLEAN`**.

---

## 3. Pontos Remanescentes para o Próximo Ciclo (`v2.1` → `v3.0`)

1. **Sync ainda híbrido (`fb_school_state` JSONB com merge granular)**:
   - Embora `mergePlatformStates` + tombstones evite perda de dados entre dispositivos, o payload ainda trafega em um documento compartilhado. **Recomendação (Fase 10)**: migrar para queries diretas nas tabelas relacionais com RLS em `supabase_schema.sql`.
2. **Tamanho de arquivos de UI (`LessonPlayer.tsx` e `TeacherStudio.tsx`)**:
   - Com a adição dos passos `dictation`, `minimal_pairs`, `story`, tarefas e gerador IA, `LessonPlayer.tsx` (`2.174` linhas) e `TeacherStudio.tsx` (`2.133` linhas) devem ser fatiados em subcomponentes por passo/aba na Fase 10.
3. **Importação síncrona de `spanishCourse` e `frenchCourse` dentro de `languages.ts`**:
   - Os chunks já estão separados pelo Rollup (`curriculum-es`, `curriculum-fr`), mas ainda são referenciados estaticamente no grafo de `languages.ts`. Transformar `getCourseTopics` em carregador assíncrono por idioma reduzirá ainda mais o parse inicial.
4. **Rate-Limit & Cache Compartilhado no Worker**:
   - Para turmas grandes usando TTS Francês via Gemini 2.5, adicionar controle de cota por usuário/IP e pré-aquecimento de cache CDN garantirá custo previsível e latência mínima.
5. **Cobertura E2E Automatizada (`Playwright`)**:
   - Complementar os `17` testes unitários do Vitest com testes visuais automatizados de Light/Dark Mode e fluxo completo de lição no navegador.
