# FluentBridge Academy (`v9.3.0`)

Plataforma completa de ensino em **17 idiomas (Inglês, Espanhol, Francês, Italiano, Alemão, Russo, Japonês, Chinês Mandarim, Árabe, Holandês, Africâner, Sueco, Turco, Hebraico, Norueguês, Dinamarquês e Português PLE para falantes de Inglês)** de **A1 a C1** (**`2.550` unidades**, **`65` sotaques regionais com vozes neurais**, **`100` Simulados Cronometrados Oficiais**, **`850` cenários de Tutor IA**, **Tradutor Bidirecional por Curso com IPA e SM-2**, **YouTube Study Lab com análise gramatical por IA**, **Comunidade 2.0**, **Modo Hands-Free**, **RTL nativo em Árabe e Hebraico com toggle de Niqqud**, **Gateway Web / Windows / Android / iOS Safari PWA ($0/ano)**, **Suíte Vitest + E2E Playwright com Auditoria WCAG AA** e **Estúdio do Professor + Admin Mestre**), desenvolvida para o **Prof. Silas Wagner**.

---

## Plataformas & Links Ativos

- **Versão Web / PWA (Cloudflare Pages)**: https://fluentbridge.pages.dev
- **Edge API (Cloudflare Workers AI + STT + Gemini + Translate + YouTube Study)**: https://fluentbridge-api.silaswf.workers.dev
- **Repositório & Releases (GitHub)**: https://github.com/silaswf/fluentbridge
- **Windows Instalador Setup (NSIS)**: [`FluentBridge-Setup-9.3.0.exe`](https://github.com/silaswf/fluentbridge-releases/releases/download/v9.3.0/FluentBridge-Setup-9.3.0.exe)
- **Android APK Assinado**: [`FluentBridge-v9.3.0.apk`](https://github.com/silaswf/fluentbridge-releases/releases/download/v9.3.0/FluentBridge-v9.3.0.apk)

---

## Números Atuais (`v9.3.0`)

- **2.550 Unidades CEFR (A1–C1) em 17 Idiomas (`150` por idioma)**: progressão espiralada sem repetição de títulos, **Português PLE com imersão invertida (`A1–B1` em Inglês, `B2–C1` em Português)**, RTL nativo em Árabe/Hebraico (com toggle de *Niqqud*) e `>= 10` flashcards coesos por unidade
- **Tradutor Bidirecional por Curso (`POST /api/translate`)**: adapta-se automaticamente ao idioma selecionado (`PT ⇄ Idioma` e `EN ⇄ PT` no curso de Português), com registro, IPA, TTS neural, salvamento direto no deck SM-2 e fallback offline
- **65 Sotaques Regionais & Vozes Neurais**: Gemini 2.5 Native Neural TTS + Deepgram Aura-2 + cache SHA-256 em R2 + **Modo Hands-Free** em áudio contínuo + **Phoneme Breakdown** nos 17 idiomas
- **100 Simulados Cronometrados Oficiais (`25` formatos)**: IELTS, TOEFL, CELPIP, DET, DELE, DELF, CILS, Goethe, JLPT, HSK, ТРКИ, ALPT, CNaVT, TISUS, TÖMER, YAEL, Norskprøve, PD3, **CELPE-Bras** e mais
- **YouTube Study Lab & Imersão**: estude qualquer vídeo do YouTube com legendas clicáveis para SM-2, explicações de *Gramática & Uso Real* e quiz, além de `85` podcasts e `51` vídeos interativos
- **Qualidade Garantida**: `87/87` testes **Vitest** (`23` suítes) + **`15/15` testes E2E Playwright** (incl. auditoria WCAG AA Light/Dark, Admin Cotas R2 e Jornada 5) · `0` erros TypeScript · `0` chunks > 500 kB · Edge API `v9.3.0` modularizada (`/api/admin/quotas`, `/api/translate` e HTTP `206 Range`)

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
