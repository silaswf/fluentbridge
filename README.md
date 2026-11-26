# FluentBridge Academy (`v9.0.0`)

Plataforma completa de ensino em **16 idiomas (Inglês, Espanhol, Francês, Italiano, Alemão, Russo, Japonês, Chinês Mandarim, Árabe, Holandês, Africâner, Sueco, Turco, Hebraico, Norueguês e Dinamarquês)** de **A1 a C1** (**`2.400` unidades**, **`61` sotaques regionais com vozes neurais**, **`96` Simulados Cronometrados Oficiais**, **`800` cenários de Tutor IA**, **YouTube Study Lab com análise gramatical por IA**, **Comunidade 2.0**, **Modo Hands-Free**, **RTL nativo em Árabe e Hebraico com toggle de Niqqud**, **Gateway Web / Windows / Android / iOS Safari PWA ($0/ano)**, **Suíte Vitest + E2E Playwright com Auditoria WCAG AA** e **Estúdio do Professor + Admin Mestre**), desenvolvida para o **Prof. Silas Wagner**.

---

## Plataformas & Links Ativos

- **Versão Web / PWA (Cloudflare Pages)**: https://fluentbridge.pages.dev
- **Edge API (Cloudflare Workers AI + STT + Gemini + YouTube Study)**: https://fluentbridge-api.silaswf.workers.dev
- **Repositório & Releases (GitHub)**: https://github.com/silaswf/fluentbridge
- **Windows Instalador Setup (NSIS)**: [`FluentBridge-Setup-9.0.0.exe`](https://github.com/silaswf/fluentbridge-releases/releases/download/v9.0.0/FluentBridge-Setup-9.0.0.exe)
- **Android APK Assinado**: [`FluentBridge-v9.0.0.apk`](https://github.com/silaswf/fluentbridge-releases/releases/download/v9.0.0/FluentBridge-v9.0.0.apk)

---

## Números Atuais (`v9.0.0`)

- **2.400 Unidades CEFR (A1–C1) em 16 Idiomas (`150` por idioma)**: progressão espiralada sem repetição de títulos, RTL nativo em Árabe/Hebraico (com toggle de *Niqqud*) e `>= 10` flashcards coesos por unidade
- **61 Sotaques Regionais & Vozes Neurais**: Gemini 2.5 Native Neural TTS + Deepgram Aura-2 + cache SHA-256 em R2 + **Modo Hands-Free** em áudio contínuo + **Phoneme Breakdown** nos 16 idiomas
- **96 Simulados Cronometrados Oficiais (`24` formatos)**: IELTS, TOEFL, CELPIP, DET, DELE, DELF, CILS, Goethe, JLPT, HSK, ТРКИ, ALPT, CNaVT, TISUS, TÖMER, YAEL, Norskprøve, PD3 e mais
- **YouTube Study Lab & Imersão**: estude qualquer vídeo do YouTube com legendas clicáveis para SM-2, explicações de *Gramática & Uso Real* e quiz, além de `80` podcasts e `48` vídeos interativos
- **Qualidade Garantida**: `81/81` testes **Vitest** (`23` suítes) + **`15/15` testes E2E Playwright** (incl. auditoria WCAG AA Light/Dark e Jornada 5) · `0` erros TypeScript · Edge API `v9.0.0` com cotas R2 e HTTP `206 Range`

---

## Documentação Consolidada (`docs/`)

Toda a documentação foi unificada em **5 documentos mestre** na pasta **[`docs/`](./docs/README.md)**:

- [Índice da Documentação](./docs/README.md)
- [01 — Manual Completo de Funcionalidades (Detalhado)](./docs/01-MANUAL-COMPLETO-FUNCIONALIDADES.md)
- [02 — Arquitetura, Nuvem & Plataformas](./docs/02-ARQUITETURA-NUVEM-E-PLATAFORMAS.md)
- [03 — Auditoria 360° (Zero-Based) & Análise Competitiva de Mercado](./docs/03-AUDITORIA-360-E-ANALISE-DE-MERCADO.md)
- [04 — Roadmap & Evolução (`v1.0 → v10.0`)](./docs/04-ROADMAP-E-EVOLUCAO.md)
- [CHANGELOG.md](./CHANGELOG.md)

---

## Comandos Principais

```bash
npm install              # Instala dependências
npm run dev              # Servidor de desenvolvimento Vite (http://localhost:5173)
npx tsc --noEmit         # Verificação estrita TypeScript
npm test                 # Suíte Vitest (23 arquivos / 81 testes)
npm run build            # Build de produção Web/PWA (dist/)
npm run test:e2e         # Suíte E2E Playwright (15 fluxos Desktop + Mobile)
```
