# FluentBridge Academy (`v4.0.0`)

Plataforma completa de ensino em **8 idiomas (Inglês, Espanhol, Francês, Italiano, Alemão, Russo, Japonês e Chinês Mandarim)** de **A1 a C1** (**`800` unidades = `100` por idioma, `20` por nível CEFR**), com **imersão B2/C1 e botão opcional de tradução PT**, **Treinador de Escrita & Ordem de Traços** (Japonês/Chinês/Russo), **Feedback Fonético Silábico**, **Modo Shadowing**, **Caderno Inteligente de Erros**, **Podcasts Curtos Multi-Voz**, **Subunidades estilo Busuu com progresso salvo**, **Vocabulário SM-2 progressivo** com compactação esparsa, **Nivelamento Adaptativo CAT (`320` questões)**, **Autolimpeza de áudios (60d)**, **RLS Relacional Estrito** e **Estúdio do Professor + Admin Mestre**, desenvolvida para o **Prof. Silas**.

---

## Plataformas & Links Ativos

- **Versão Web / PWA (Cloudflare Pages)**: https://fluentbridge.pages.dev
- **Edge API (Cloudflare Workers AI + STT + Gemini)**: https://fluentbridge-api.silaswf.workers.dev
- **Repositório & Releases (GitHub)**: https://github.com/silaswf/fluentbridge
- **Windows Instalador Setup (NSIS)**: [`release/FluentBridge-Setup-4.0.0.exe`](./release/FluentBridge-Setup-4.0.0.exe)
- **Android APK Assinado**: [`release/FluentBridge-v4.0.0.apk`](./release/FluentBridge-v4.0.0.apk)
- **Google Play Store Bundle**: [`release/FluentBridge-v4.0.0-playstore.aab`](./release/FluentBridge-v4.0.0-playstore.aab)

---

## Números Atuais (`v4.0.0`)

- **800 Unidades CEFR (A1–C1) em 8 Idiomas**: **100 unidades por idioma** (`20` por nível A1–C1 em `EN, ES, FR, IT, DE, RU, JA, ZH`) com etapas Busuu, progresso salvo e vocabulário de sobrevivência/viagens/carreira
- **Central, Guia, Escrita & Podcasts**: **`200+` Dicas**, **`200` Tabelas Gramaticais por idioma (`1.600` total)**, **Treinador de Escrita/Traços** e **`40` Podcasts Curtos Multi-Voz**
- **Nivelamento Adaptativo (CAT) nos 8 Idiomas**: **`320` questões 100% no idioma-alvo** (`40` por idioma · `8` por nível A1–C1)
- **Tutor IA Dinâmico**: **`40` Situações Reais por idioma (`320` total)** + **`10` Modos Dinâmicos por Unidade (`8.000` combinações)** + **Cenário Livre / Surpreenda-me**
- **Qualidade Garantida**: `33/33` testes **Vitest** aprovados (`12` suítes) · `0` erros TypeScript · Compactação esparsa (~95%) · RLS Relacional v4.0

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
- [07 — Plano Técnico das Próximas Fases](./docs/07-PLANO-FASE-8-DIFERENCIAIS.md)
- [08 — Auditoria 360°, Saúde da Arquitetura & Análise Competitiva de Mercado](./docs/08-ANALISE-COMPETITIVA-MERCADO.md)
- [CHANGELOG.md](./CHANGELOG.md)

---

## Scripts Principais (`package.json`)

```bash
npm run dev           # Servidor local Vite (http://localhost:5173)
npm run build         # Verificação TypeScript + bundle Web em dist/
npm run installer:build # Compila e gera o instalador Setup Windows (NSIS)
npm run apk:sync      # Compila Web e sincroniza assets/plugins no projeto Android
```
