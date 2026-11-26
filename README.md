# FluentBridge Academy (`v9.0.0`)

Plataforma completa de ensino em **16 idiomas (Inglês, Espanhol, Francês, Italiano, Alemão, Russo, Japonês, Chinês Mandarim, Árabe, Holandês, Africâner, Sueco, Turco, Hebraico, Norueguês e Dinamarquês)** de **A1 a C1** (**`2.400` unidades**, **`61` sotaques regionais com vozes neurais**, **`96` Simulados Cronometrados Oficiais**, **`800` cenários de Tutor IA**, **YouTube Study Lab com análise gramatical por IA**, **Comunidade 2.0**, **Modo Hands-Free**, **RTL nativo em Árabe e Hebraico com toggle de Niqqud**, **Gateway Web / Windows / Android / iOS Safari PWA ($0/ano)**, **Suíte Vitest + E2E Playwright com Auditoria WCAG AA** e **Estúdio do Professor + Admin Mestre**), desenvolvida para o **Prof. Silas Wagner**.

---

## Plataformas & Links Ativos

- **Versão Web / PWA (Cloudflare Pages)**: https://fluentbridge.pages.dev
- **Edge API (Cloudflare Workers AI + STT + Gemini + YouTube Study)**: https://fluentbridge-api.silaswf.workers.dev
- **Repositório & Releases (GitHub)**: https://github.com/silaswf/fluentbridge
- **Windows Instalador Setup (NSIS)**: [`release/FluentBridge-Setup-5.0.0.exe`](./release/FluentBridge-Setup-5.0.0.exe)
- **Android APK Assinado**: [`release/FluentBridge-v5.0.0.apk`](./release/FluentBridge-v5.0.0.apk)
- **Google Play Store Bundle**: [`release/FluentBridge-v5.0.0-playstore.aab`](./release/FluentBridge-v5.0.0-playstore.aab)

---

## Números Atuais (`v9.0.0`)

- **2.400 Unidades CEFR (A1–C1) em 16 Idiomas (`150` por idioma)**: progressão espiralada sem repetição de títulos, RTL nativo em Árabe/Hebraico (com toggle de *Niqqud*) e `>= 10` flashcards coesos por unidade
- **61 Sotaques Regionais & Vozes Neurais**: Gemini 2.5 Native Neural TTS + Deepgram Aura-2 + cache SHA-256 em R2 + **Modo Hands-Free** em áudio contínuo + **Phoneme Breakdown** nos 16 idiomas
- **96 Simulados Cronometrados Oficiais (`24` formatos)**: IELTS, TOEFL, CELPIP, DET, DELE, DELF, CILS, Goethe, JLPT, HSK, ТРКИ, ALPT, CNaVT, TISUS, TÖMER, YAEL, Norskprøve, PD3 e mais
- **YouTube Study Lab & Imersão**: estude qualquer vídeo do YouTube com legendas clicáveis para SM-2, explicações de *Gramática & Uso Real* e quiz, além de `80` podcasts e `48` vídeos interativos
- **Qualidade Garantida**: `81/81` testes **Vitest** (`23` suítes) + **`15/15` testes E2E Playwright** (incl. auditoria WCAG AA Light/Dark e Jornada 5) · `0` erros TypeScript · Edge API `v9.0.0` com cotas R2 e HTTP `206 Range`

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
- [08 — Auditoria Qualitativa 360° (`v8.3.0`), UI/UX, Segurança & Análise Competitiva de Mercado](./docs/08-ANALISE-COMPETITIVA-MERCADO.md)
- [CHANGELOG.md](./CHANGELOG.md)

---

## Scripts Principais (`package.json`)

```bash
npm run dev           # Servidor local Vite (http://localhost:5173)
npm run build         # Verificação TypeScript + bundle Web em dist/
npm run installer:build # Compila e gera o instalador Setup Windows (NSIS)
npm run apk:sync      # Compila Web e sincroniza assets/plugins no projeto Android
```
