---
description: Checklist permanente de regras anti-regressão do FluentBridge Academy (currículo, Worker, bundle, segurança, UI e release)
---
<!-- @file .agents/rules/fluentbridge-core-guidelines.md — Regras centrais anti-regressão carregadas automaticamente pelo Antigravity em todo o projeto -->

# Regras Centrais Anti-Regressão — FluentBridge

Leia e respeite sempre as regras completas em [`AGENTS.md`](../../AGENTS.md). Resumo executivo obrigatório em toda tarefa:

1. **Cabeçalhos `@file`:** todo arquivo funcional, de dados, script ou doc criado/editado deve ter comentário `@file` seguro para sua extensão (nunca comentar `.json`; em `.html` pôr após `<!doctype html>`; em `.bat` após `@echo off`).
2. **Paridade de Idiomas:** nunca usar listas fixas de idiomas em UI — usar `LANGUAGE_COURSES_META`. Preservar `150` unidades/idioma (`147 + 3` idioms), zero `titlePt` duplicado e imersão invertida no Português PLE (`pt`: `A1–B1` em Inglês, `B2–C1` em Português).
3. **Áudio & Mídia:** preservar sotaques regionais intactos até `EXTRA_REGIONAL_TTS` (`worker.js`), nunca cachear fallback Google no R2, manter HTTP `206 Range` em `/api/media/*` e retenção de 60 dias em `fb-audio` preservando feedbacks escritos.
4. **Bundle & Peso:** zero chunks > `500 kB`, zero avisos Rollup, `sourcemap: 'hidden'` e zero mídia pesada dentro de `src/`/`public/` (usar Cloudflare R2).
5. **Resiliência & Cotas:** todo endpoint externo/IA precisa de timeout (`AbortController`), fallback offline e cota diária R2 em `cloudflare-worker/lib/quotas.js`.
6. **UI, Segurança & LGPD:** contraste WCAG AA (Light/Dark), zero overflow mobile (`390×844`), `ConfirmDialog` em ações destrutivas, zero segredos no frontend e SQL 100% idempotente com RLS + `delete_my_account_data()`.
7. **Gate Final:** antes de concluir qualquer alteração de código, rodar `node --check` (Worker/scripts), `npx tsc --noEmit`, `npx vitest run src` e `npm run build` (e `npx playwright test` em mudanças de UI/fluxos/release).
