<!-- @file AGENTS.md — Diretrizes permanentes de engenharia e manutenibilidade do FluentBridge Academy -->

# Diretrizes do Projeto — FluentBridge Academy

## 1. Regra Obrigatória de Documentação de Arquivos (`@file`)

De agora em diante, **todos os arquivos do programa** que possuam alguma função, componente, dado estruturado, script, configuração ou documentação relevante **devem** possuir um comentário explicativo de cabeçalho (`@file` + `@description` + `@exports`/responsabilidades).

- **Ao criar um novo arquivo:** inclua o comentário de cabeçalho já na criação.
- **Ao modificar um arquivo existente:** garanta que o cabeçalho esteja presente e atualizado caso novas funções ou responsabilidades tenham sido adicionadas.
- **Regras de segurança sintática:**
  - Em `.html`, insira `<!-- ... -->` **após** `<!doctype html>`.
  - Em `.bat`, insira `:: ...` **após** `@echo off`.
  - Em `.js`/`.mjs` com shebang (`#!/...`), insira o JSDoc **após** a linha 1.
  - Nunca adicione comentários em arquivos `.json`.
  - Consulte a regra completa em [`.agents/rules/file-documentation-headers.md`](./.agents/rules/file-documentation-headers.md).

## 2. Verificação Obrigatória Antes de Commit / Release

Antes de concluir qualquer alteração em código:
1. `npx tsc --noEmit` (0 erros)
2. `npx vitest run src` (100% verde)
3. `npm run build` (0 erros, 0 avisos Rollup, 0 chunks > 500 kB)
