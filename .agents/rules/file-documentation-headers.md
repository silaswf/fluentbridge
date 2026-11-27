---
description: Diretriz obrigatória de documentação de cabeçalho para todos os arquivos funcionais e estruturais do FluentBridge
---

# Diretriz: Comentários Obrigatórios de Cabeçalho (`@file`)

Todo arquivo criado ou alterado no repositório **FluentBridge** que possua lógica, configuração, interface, testes, automação ou documentação relevante **deve** conter um comentário explicativo no topo (ou logo após diretivas obrigatórias de sintaxe) descrevendo:

1. **O que o arquivo faz** (`@description`): papel objetivo dentro da arquitetura do programa.
2. **O que ele exporta ou executa** (`@exports` / responsabilidades principais): funções, componentes React, hooks, tipos, rotas ou regras que influenciam o funcionamento do aplicativo.

## Formatos e Regras de Segurança por Extensão

- **`.ts`, `.tsx`, `.js`, `.mjs`, `.cjs`**: bloco JSDoc `/** ... */` com `@file`, `@description` e `@exports`. Se houver shebang (`#!/usr/bin/env node`), manter o shebang na linha 1 e inserir o JSDoc na linha 2.
- **`.css`**: bloco `/* @file ... */` no topo do arquivo.
- **`.html`**: comentário `<!-- @file ... -->` **sempre após** `<!doctype html>` (nunca antes do doctype).
- **`.sql`**: linhas `-- @file ...` e `-- ...` no topo do script.
- **`.yml`, `.yaml`**: linhas `# @file ...` no topo do arquivo.
- **`.bat`**: linhas `:: @file ...` **sempre após** `@echo off`.
- **`.md`**: comentário HTML `<!-- @file ... -->` no topo (exceto arquivos com frontmatter YAML `---`, onde deve ir logo após o fechamento `---`).
- **Arquivos `.json`**: **não comentar** (JSON padrão não aceita comentários).
