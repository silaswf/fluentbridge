# FluentBridge Academy (`v1.0.3`)

Plataforma completa de ensino de idiomas nas **4 habilidades** (*Listening, Reading, Speaking & Writing*) com dicas contextuais voltadas para brasileiros, Tutor de Conversação com IA, vocabulário com revisão SRS, vozes neurais **`🇺🇸 US` / `🇬🇧 UK`**, Estúdio do Professor e emissão de certificados CEFR (`A1`–`C1`), desenvolvida para o **Prof. Silas**.

---

## Plataformas & Links Ativos

- **Versão Web / PWA (Cloudflare Pages)**: https://fluentbridge.pages.dev
- **Repositório & Releases (GitHub)**: https://github.com/silaswf/fluentbridge
- **Windows Desktop**: [`release/FluentBridge-win32-x64/FluentBridge.exe`](./release/FluentBridge-win32-x64/FluentBridge.exe) (Electron 34)
- **Android APK Assinado**: [`release/FluentBridge-v1.0.3.apk`](./release/FluentBridge-v1.0.3.apk)
- **Google Play Store Bundle**: [`release/FluentBridge-v1.0.3-playstore.aab`](./release/FluentBridge-v1.0.3-playstore.aab)

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
