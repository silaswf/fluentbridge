# FluentBridge Academy (`v3.0.0`)

Plataforma completa de ensino em **8 idiomas (Inglês, Espanhol, Francês, Italiano, Alemão, Russo, Japonês e Chinês Mandarim)** de **A1 a C1** (com **imersão total no idioma estudado a partir do B2** e **Teste de Nivelamento Adaptativo de 15 questões com banco de 40 questões no idioma-alvo para cada língua**), unidades divididas em **subunidades/etapas estilo Busuu com progresso salvo**, vocabulário **SM-2 progressivo** com frases de exemplo, autolimpeza de áudios em **60 dias** preservando feedbacks escritos, Tutor IA dinâmico (**20 situações/idioma + 10 modos por unidade**), vozes neurais humanas (**Deepgram Aura-2 + Gemini 2.5 Neural TTS**), **Vinculação de Alunos VIP**, **Painel Admin Mestre**, Estúdio do Professor e emissão de certificados CEFR por idioma, desenvolvida para o **Prof. Silas**.

---

## Plataformas & Links Ativos

- **Versão Web / PWA (Cloudflare Pages)**: https://fluentbridge.pages.dev
- **Edge API (Cloudflare Workers AI + STT + Gemini)**: https://fluentbridge-api.silaswf.workers.dev
- **Repositório & Releases (GitHub)**: https://github.com/silaswf/fluentbridge
- **Windows Instalador Setup (NSIS)**: [`release/FluentBridge-Setup-2.4.0.exe`](./release/FluentBridge-Setup-2.4.0.exe) (assistente de instalação com escolha de pasta, atalhos na Área de Trabalho / Menu Iniciar e desinstalador no Windows)
- **Windows Executável Direto**: [`release/FluentBridge-win32-x64/FluentBridge.exe`](./release/FluentBridge-win32-x64/FluentBridge.exe) (e [`release/win-unpacked/FluentBridge.exe`](./release/win-unpacked/FluentBridge.exe))
- **Android APK Assinado**: [`release/FluentBridge-v2.4.0.apk`](./release/FluentBridge-v2.4.0.apk) (e [`FluentBridge-latest.apk`](./release/FluentBridge-latest.apk))
- **Google Play Store Bundle**: [`release/FluentBridge-v2.4.0-playstore.aab`](./release/FluentBridge-v2.4.0-playstore.aab)

---

## Números Atuais (`v2.4.0`)

- **260 Unidades CEFR (A1–C1)**: **60** em Inglês + **50** em Espanhol + **50** em Francês + **50** em Italiano + **50** em Alemão (B2/C1 em **imersão total no idioma estudado**)
- **Nivelamento Adaptativo (CAT) nos 5 Idiomas**: **`200` questões 100% no idioma-alvo** (`40` por idioma · `8` por nível A1–C1), adaptando a dificuldade a cada resposta ao longo de **`15` questões**
- **Central & Guia Gramatical**: **`100+` Dicas** E **`100` Tabelas Gramaticais** por idioma (**`500` tabelas** no total)
- **Tutor IA Dinâmico**: **`20` Situações Reais por idioma (`100` total)** + **`10` Modos Dinâmicos por Unidade (`2.600` combinações)** + **Cenário Livre / Surpreenda-me**
- **Qualidade Garantida**: `24/24` testes **Vitest** aprovados (`7` suítes) · `0` erros TypeScript · `DIST_LEAK=CLEAN` · Worker `v2.2.0` com Rate-Limit por IP

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
- [08 — Auditoria 360° & Análise Competitiva de Mercado (v3.0.0)](./docs/08-ANALISE-COMPETITIVA-MERCADO.md)
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
