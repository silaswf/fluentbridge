# Documentação de Desenvolvimento — FluentBridge (`v5.0.0`)

Documentação técnica, diagnóstico arquitetural, guia de uso, auditoria 360°, comparativo competitivo de mercado e roadmap completo do **FluentBridge Academy** (plataforma em **12 idiomas** — **Inglês, Espanhol, Francês, Italiano, Alemão, Russo, Japonês, Chinês Mandarim, Árabe, Holandês, Africâner e Sueco** de `A1` a `C1`, com **`1.200` unidades**, **`2.400` guias gramaticais**, **`480` cenários IA**, **`72` Simulados Cronometrados Oficiais**, **Comunidade com Ligas & Fórum**, **Alfabetos Completos no Treinador de Escrita**, **Gateway de Download Web/Win/Android** e **Suíte E2E Playwright**).

---

## Índice de Documentos

1. **[01 - Diagnóstico Atual do Sistema](./01-DIAGNOSTICO-ATUAL.md)** — Inventário técnico completo da versão `v2.0.0`.
2. **[02 - Arquitetura Nativa (Windows + Android + Web)](./02-ARQUITETURA-NATIVA-WINDOWS-ANDROID.md)** — Arquitetura Electron + Capacitor 7 + Cloudflare Pages/Workers (Aura-2 + Gemini Neural TTS + Whisper STT), assinatura Release (`.apk`/`.aab`), deep link OAuth e CI/CD no GitHub Actions.
3. **[03 - Roadmap até a Completude](./03-ROADMAP-DESENVOLVIMENTO.md)** — Histórico das Fases 0 a 9 concluídas (`v1.0.0` → `v2.0.0`) e o próximo plano das **Fases 10 a 12 (`v2.1` → `v3.0`)**.
4. **[04 - Guia de Sincronização Online com Supabase](./04-GUIA-SINCRONIZACAO-SUPABASE.md)** — Estrutura do banco (`supabase_schema.sql`), merge granular em `fb_school_state`, tombstones, áudios cross-device e backups JSON.
5. **[04 - Guia Supabase Autenticação & IA Compartilhada](./04-GUIA-SUPABASE-AUTENTICACAO.md)** — Configuração de Google OAuth Web/Android nativo, separação Aluno vs. Professor, código docente dinâmico, bloqueio de acesso, usuário Admin Mestre (`silaswf@gmail.com`) e proxy seguro Gemini no Cloudflare Worker.
6. **[05 - Manual Completo de Funcionalidades](./05-MANUAL-FUNCIONALIDADES.md)** — Guia detalhado de uso das telas do aluno, do Estúdio do Professor e do **Painel Admin Mestre**.
7. **[06 - Auditoria Completa & Plano de Otimizações](./06-AUDITORIA-OTIMIZACOES.md)** — Auditoria pós-`v2.0.0` com medições reais de bundle (`122,94 kB` inicial), segurança, Dark Mode/responsividade, latência TTS/STT e recomendações futuras.
8. **[07 - Plano Técnico das Próximas Fases (Fases 10 a 12 · v2.1 → v3.0)](./07-PLANO-FASE-8-DIFERENCIAIS.md)** — Histórico da Fase 8 entregue e blueprints técnicos detalhados para as próximas fases.
9. **[08 - Auditoria 360° & Análise Competitiva de Mercado (v3.0.0)](./08-ANALISE-COMPETITIVA-MERCADO.md)** — Auditoria completa de todos os âmbitos do programa + comparativo detalhado com Duolingo, Busuu, Babbel, Speak, Cambly e Preply + próximos diferenciais (`v3.1 → v4.0`).
10. **[09 - Plano de Melhorias `v8.3` (Funcional, UI/UX & Segurança)](./09-PLANO-v8.3-MELHORIAS-FUNCIONAIS-E-UI-UX.md)** — Auditoria qualitativa das funções existentes (`F-01…F-07`), auditoria de UI/UX desktop/mobile/Dark Mode/i18n (`U-01…U-07`), incidente da chave Gemini exposta e salvaguardas (`S-01…S-06`), matriz de prioridade e sequência `v8.3 → v8.5`.
11. **[Changelog Completo](../CHANGELOG.md)** — Registro histórico versão por versão (`v1.0.0` → `v3.0.0`).

---

## Resumo do Estado Atual (`v5.0.0`)

| Aspecto | Estado Atual |
| --- | --- |
| **Plataformas & Gateway** | **Web / PWA Offline** (`https://fluentbridge.pages.dev`) com **Gateway de Download** + **Edge API `v5.0.0`** (`https://fluentbridge-api.silaswf.workers.dev`) + **Android Assinado** (`.apk` + `.aab`) + **Windows Setup** (`FluentBridge-Setup-5.0.0.exe`) |
| **Segurança, RLS, Retenção & Storage** | **RLS Relacional Estrito (`Seções 9 e 10`)**, `syncRelationalFullState`, **compactação esparsa (~95%)**, **autolimpeza de áudios > 60d** e **Painel Admin Mestre** |
| **Currículo, Escrita Completa & CAT** | **`1.200` unidades** (`12` idiomas × `100`/idioma, RTL nativo em Árabe), **Alfabetos 100% Completos (`46` Hiragana, `46` Katakana, `30` Kanji, `33` Cirílico, `28` Árabe 4 formas, `40` Hanzi)**, **`2.400` tabelas gramaticais**, **`480` questões CAT** |
| **Simulados, Comunidade & Voz/IA** | **`72` Simulados Cronometrados Oficiais** (18 exames, escalas e tabelas reais), **Comunidade por Idioma (Ligas + Fórum)**, **Histórico de Pronúncia**, **Shadowing**, **Caderno de Erros**, **`60` Podcasts**, **Tutor IA (`480` cenários + `12.000` modos)** |
| **Verificação & CI/CD** | `npm test` (`14` arquivos / `38` testes OK) · `npm run test:e2e` (`7/7` Playwright OK) · `npx tsc --noEmit` (`0` erros) · GitHub Actions `.apk` + `.aab` |
