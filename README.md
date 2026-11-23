# FluentBridge Academy (`v2.1.0`)

Plataforma completa de ensino em **5 idiomas (Inglês, Espanhol, Francês, Italiano e Alemão)** de **A1 a C1** nas habilidades (*Listening, Reading, Speaking, Writing, Ditado, Pares Mínimos, Matching e Histórias Multi-Voz*) com dicas contextuais voltadas para brasileiros, Tutor de Conversação IA (texto e **Chamada ao Vivo**), vocabulário com revisão científica **SM-2**, vozes neurais humanas (**Deepgram Aura-2 + Gemini 2.5 Neural TTS**), **Painel Admin Mestre**, Estúdio do Professor com **Tarefas** e **Gerador IA**, e emissão de certificados CEFR por idioma, desenvolvida para o **Prof. Silas**.

---

## Plataformas & Links Ativos

- **Versão Web / PWA (Cloudflare Pages)**: https://fluentbridge.pages.dev
- **Edge API (Cloudflare Workers AI + STT + Gemini)**: https://fluentbridge-api.silaswf.workers.dev
- **Repositório & Releases (GitHub)**: https://github.com/silaswf/fluentbridge
- **Windows Desktop**: [`release/FluentBridge-win32-x64/FluentBridge.exe`](./release/FluentBridge-win32-x64/FluentBridge.exe) (Electron 34)
- **Android APK Assinado**: [`release/FluentBridge-v2.1.0.apk`](./release/FluentBridge-v2.1.0.apk) (e [`FluentBridge-latest.apk`](./release/FluentBridge-latest.apk))
- **Google Play Store Bundle**: [`release/FluentBridge-v2.1.0-playstore.aab`](./release/FluentBridge-v2.1.0-playstore.aab)

---

## Números Atuais (`v2.1.0`)

- **194 Unidades CEFR (A1–C1)**: **50** em Inglês + **36** em Espanhol + **36** em Francês + **36** em Italiano + **36** em Alemão
- **1.834 Passos Interativos** em **11 formatos** (`tip`, `listening`, `reading`, `matching`, `fill_blank`, `dictation`, `minimal_pairs`, `story`, `speaking`, `writing_builder`, `writing_free`)
- **584 Flashcards SM-2** + **372 Dicas Contextuais** + **144 Tabelas no Guia Gramatical** (`32` EN, `28` ES, `28` FR, `28` IT, `28` DE)
- **Qualidade Garantida**: `17/17` testes **Vitest** aprovados · `0` erros TypeScript · `0` erros estruturais em `verify_curriculum.mjs`

---

## Documentação Técnica & Roadmap

Toda a documentação detalhada está organizada na pasta **[`docs/`](./docs/README.md)**:

- [Índice da Documentação](./docs/README.md)
- [01 — Diagnóstico Atual do Sistema](./docs/01-DIAGNOSTICO-ATUAL.md)
- [02 — Arquitetura Nativa (Windows + Android + Web)](./docs/02-ARQUITETURA-NATIVA-WINDOWS-ANDROID.md)
- [03 — Roadmap de Desenvolvimento até a Completude](./docs/03-ROADMAP-DESENVOLVIMENTO.md)
- [04 — Guia de Sincronização Online com Supabase](./docs/04-GUIA-SINCRONIZACAO-SUPABASE.md)
- [04 — Guia Supabase Autenticação & Google OAuth](./docs/04-GUIA-SUPABASE-AUTENTICACAO.md)
- [05 — Manual Completo de Funcionalidades](./docs/05-MANUAL-FUNCIONALIDADES.md)
- [06 — Auditoria Completa & Plano de Otimizações](./docs/06-AUDITORIA-OTIMIZACOES.md)
- [07 — Plano Técnico das Próximas Fases (v1.1 → v2.0)](./docs/07-PLANO-FASE-8-DIFERENCIAIS.md)
- [CHANGELOG.md](./CHANGELOG.md)

---

## Scripts Principais (`package.json`)

```bash
npm run dev           # Servidor local Vite (http://localhost:5173)
npm run build         # Verificação TypeScript + bundle Web em dist/
npm run exe:build     # Compila e gera o executável Windows (Electron)
npm run apk:sync      # Compila Web e sincroniza assets/plugins no projeto Android
npm run cf:deploy     # Compila e publica a versão Web no Cloudflare Pages
npm run release:patch # Incrementa versão, cria tag v* e dispara build APK/AAB no GitHub
```

Ou utilize os atalhos diretos na raiz do projeto: [`publicar-versao.bat`](./publicar-versao.bat), [`publicar-cloudflare.bat`](./publicar-cloudflare.bat) e [`gerar-apk.bat`](./gerar-apk.bat).
