# Documentação de Desenvolvimento — FluentBridge (`v8.4.0`)

Documentação técnica, diagnóstico arquitetural, guia de uso, auditoria 360°, comparativo competitivo de mercado e roadmap completo do **FluentBridge Academy** (plataforma em **12 idiomas** — **Inglês, Espanhol, Francês, Italiano, Alemão, Russo, Japonês, Chinês Mandarim, Árabe, Holandês, Africâner e Sueco** de `A1` a `C1`, com **`1.236` unidades**, **`49` sotaques neurais**, **`2.400` guias gramaticais**, **`76` Simulados Cronometrados Oficiais**, **Comunidade 2.0**, **Modo Hands-Free**, **Aba Imersão Dedicada**, **Gateway Web/Win/Android/iOS PWA** e **Suíte Vitest + Playwright WCAG AA**).

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
9. **[08 - Análise Competitiva, UX/UI, Auditoria Técnica e Plano Mestre 360° (`v8.4.0`)](./08-ANALISE-COMPETITIVA-MERCADO.md)** — Relatório definitivo unificado com benchmark de mercado (incluindo UI/UX), métricas reais escavadas do código, bugs resolvidos, estratégia iOS gratuita e backlog `3.1`–`3.6` (`Q-01`..`Q-24`).
10. **[Changelog Completo](../CHANGELOG.md)** — Registro histórico versão por versão (`v1.0.0` → `v8.4.0`).

---

## Resumo do Estado Atual (`v8.4.0`)

| Aspecto | Estado Atual |
| --- | --- |
| **Plataformas & Gateway** | **Web / PWA Offline** (`https://fluentbridge.pages.dev`) + **iPhone/iPad Safari PWA ($0/ano)** + **Edge API `v8.4.0`** (`https://fluentbridge-api.silaswf.workers.dev`) + **Android Assinado** (`.apk` + `.aab`) + **Windows Setup** (`.exe`) |
| **Segurança, RLS, Retenção & Storage** | **RLS Relacional Estrito**, cotas diárias R2 (`200` STT / `250` Gemini), streaming HTTP `206 Range`, `sourcemap: 'hidden'` + Sentry DSN opcional, **autolimpeza de áudios > 60d** e **Painel Admin Mestre** |
| **Currículo, Escrita Completa & CAT** | **`1.236` unidades** (`12` idiomas, RTL nativo em Árabe), **Alfabetos 100% Completos**, **`2.400` tabelas gramaticais**, **`480` questões CAT**, **`phonemeBreakdown` nos 12 idiomas** |
| **Simulados, Comunidade & Voz/IA** | **`76` Simulados Cronometrados Oficiais**, **Comunidade 2.0 (Ligas + Desafio do Mês + Moderação + Diff/Aceite + Reações)**, **Modo Hands-Free**, **Aba Imersão Dedicada**, **Tutor IA** |
| **Verificação & CI/CD** | `npm test` (`22` arquivos / `77` testes OK) · `npm run test:e2e` (`14/14` Playwright + WCAG AA OK) · `npx tsc --noEmit` (`0` erros) · Cloudflare Worker + Pages live |
