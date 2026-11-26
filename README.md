# FluentBridge Academy (`v5.0.0`)

Plataforma completa de ensino em **12 idiomas (Inglês, Espanhol, Francês, Italiano, Alemão, Russo, Japonês, Chinês Mandarim, Árabe, Holandês, Africâner e Sueco)** de **A1 a C1** (**`1.200` unidades = `100` por idioma, `20` por nível CEFR**), com **Gateway de Download Multiplataforma na Web**, **72 Simulados Cronometrados Oficiais** com escalas e tabelas reais, **Comunidade por Idioma (Ligas Semanais + Fórum com Correções)**, **Treinador de Escrita & Traços com Alfabetos 100% Completos** (`46` Hiragana, `46` Katakana, `30` Kanji, `33` Cirílico, `28` Árabe com 4 formas RTL, `40` Hanzi + 4 Tons), **Histórico de Pronúncia**, **Feedback Fonético Silábico**, **Modo Shadowing**, **Caderno de Erros**, **60 Podcasts Curtos**, **Suíte E2E Playwright** e **Estúdio do Professor + Admin Mestre**, desenvolvida para o **Prof. Silas**.

---

## Plataformas & Links Ativos

- **Versão Web / PWA (Cloudflare Pages)**: https://fluentbridge.pages.dev
- **Edge API (Cloudflare Workers AI + STT + Gemini)**: https://fluentbridge-api.silaswf.workers.dev
- **Repositório & Releases (GitHub)**: https://github.com/silaswf/fluentbridge
- **Windows Instalador Setup (NSIS)**: [`release/FluentBridge-Setup-5.0.0.exe`](./release/FluentBridge-Setup-5.0.0.exe)
- **Android APK Assinado**: [`release/FluentBridge-v5.0.0.apk`](./release/FluentBridge-v5.0.0.apk)
- **Google Play Store Bundle**: [`release/FluentBridge-v5.0.0-playstore.aab`](./release/FluentBridge-v5.0.0-playstore.aab)

---

## Números Atuais (`v5.0.0`)

- **1.200 Unidades CEFR (A1–C1) em 12 Idiomas**: **100 unidades por idioma** (`20` por nível A1–C1 em `EN, ES, FR, IT, DE, RU, JA, ZH, AR, NL, AF, SV`) com imersão B2/C1 e botão `🌐 Traduzir PT`
- **72 Simulados Cronometrados Oficiais (Fase 11)**: **4 simulados por exame** (IELTS, TOEFL, Cambridge, DELE, SIELE, DELF, TCF, CILS, CELI, Goethe, TestDaF, TORFL, JLPT, HSK, ALPT, NT2, Taaltoets, Swedex) com cálculo na escala oficial e tabela de equivalência CEFR
- **Comunidade por Idioma**: Ligas Semanais (Bronze → Diamante) + Fórum com dúvidas, pedidos de correção e sugestões entre alunos/professores (`+5 XP`)
- **Central, Guia, Escrita Completa & Podcasts**: **`2.400` Tabelas Gramaticais (`200`/idioma)**, **Alfabetos Completos (`46` Hiragana, `46` Katakana, `30` Kanji, `33` Cirílico, `28` Árabe RTL, `40` Hanzi)** e **`60` Podcasts Curtos Multi-Voz**
- **Nivelamento Adaptativo (CAT) nos 12 Idiomas**: **`480` questões 100% no idioma-alvo** (`40` por idioma · `8` por nível A1–C1)
- **Tutor IA Dinâmico**: **`480` Situações Reais (`40`/idioma)** + **`12.000` Combinações Dinâmicas por Unidade**
- **Qualidade Garantida**: `38/38` testes **Vitest** (`14` suítes) + **`7/7` testes E2E Playwright** aprovados · `0` erros TypeScript · Compactação esparsa (~95%) · RLS Relacional v5.0

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
- [09 — Plano de Melhorias `v8.3` (Funcional, UI/UX & Segurança)](./docs/09-PLANO-v8.3-MELHORIAS-FUNCIONAIS-E-UI-UX.md)
- [CHANGELOG.md](./CHANGELOG.md)

---

## Scripts Principais (`package.json`)

```bash
npm run dev           # Servidor local Vite (http://localhost:5173)
npm run build         # Verificação TypeScript + bundle Web em dist/
npm run installer:build # Compila e gera o instalador Setup Windows (NSIS)
npm run apk:sync      # Compila Web e sincroniza assets/plugins no projeto Android
```
