# Documentação de Desenvolvimento — FluentBridge (`v4.0.0`)

Documentação técnica, diagnóstico arquitetural, guia de uso, auditoria 360°, comparativo competitivo de mercado e roadmap completo do **FluentBridge Academy** (plataforma em **8 idiomas** — **Inglês, Espanhol, Francês, Italiano, Alemão, Russo, Japonês e Chinês Mandarim** de `A1` a `C1`, com **`800` unidades**, **`1.600` guias gramaticais**, **`320` cenários IA**, **Treinador de Escrita/Traços**, **Feedback Fonético**, **Modo Shadowing**, **Caderno de Erros**, **Podcasts Curtos**, **RLS Relacional Estrito** e **Compactação Esparsa**).

---

## Índice de Documentos

1. **[01 - Diagnóstico Atual do Sistema](./01-DIAGNOSTICO-ATUAL.md)** — Inventário técnico completo da versão `v2.0.0`.
2. **[02 - Arquitetura Nativa (Windows + Android + Web)](./02-ARQUITETURA-NATIVA-WINDOWS-ANDROID.md)** — Arquitetura Electron + Capacitor 7 + Cloudflare Pages/Workers (Aura-2 + Gemini Neural TTS + Whisper STT), assinatura Release (`.apk`/`.aab`), deep link OAuth e CI/CD no GitHub Actions.
3. **[03 - Roadmap até a Completude](./03-ROADMAP-DESENVOLVIMENTO.md)** — Histórico das Fases 0 a 9 concluídas (`v1.0.0` → `v2.0.0`) e o próximo plano das **Fases 10 a 12 (`v2.1` → `v3.0`)**.
4. **[04 - Guia de Sincronização Online com Supabase](./04-GUIA-SINCRONIZACAO-SUPABASE.md)** — Estrutura do banco (`supabase_schema.sql`), merge granular em `fb_school_state`, tombstones, áudios cross-device e backups JSON.
5. **[04 - Guia Supabase Autenticação & IA Compartilhada](./04-GUIA-SUPABASE-AUTENTICACAO.md)** — Configuração de Google OAuth Web/Android nativo, separação Aluno vs. Professor, código docente dinâmico, bloqueio de acesso, usuário Admin Mestre (`silaswf@gmail.com`) e proxy seguro Gemini no Cloudflare Worker.
6. **[05 - Manual Completo de Funcionalidades](./05-MANUAL-FUNCIONALIDADES.md)** — Guia detalhado de uso das telas do aluno, do Estúdio do Professor e do **Painel Admin Mestre**.
7. **[06 - Auditoria Completa & Plano de Otimizações](./06-AUDITORIA-OTIMIZACOES.md)** — Auditoria pós-`v2.0.0` com medições reais de bundle (`122,94 kB` inicial), segurança, Dark Mode/responsividade, latência TTS/STT e recomendações futuras.
8. **[07 - Plano Técnico das Próximas Fases (Fases 10 a 12 · v2.1 → v3.0)](./07-PLANO-FASE-8-DIFERENCIAIS.md)** — Histórico da Fase 8 entregue e blueprints técnicos detalhados para as próximas fases.
9. **[08 - Auditoria 360° & Análise Competitiva de Mercado (v3.0.0)](./08-ANALISE-COMPETITIVA-MERCADO.md)** — Auditoria completa de todos os âmbitos do programa + comparativo detalhado com Duolingo, Busuu, Babbel, Speak, Cambly e Preply + próximos diferenciais (`v3.1 → v4.0`).
10. **[Changelog Completo](../CHANGELOG.md)** — Registro histórico versão por versão (`v1.0.0` → `v3.0.0`).

---

## Resumo do Estado Atual (`v4.0.0`)

| Aspecto | Estado Atual |
| --- | --- |
| **Plataformas** | **Web / PWA Offline** (`https://fluentbridge.pages.dev`) + **Edge API `v3.0.0`** (`https://fluentbridge-api.silaswf.workers.dev`) + **Android Nativo Assinado** (`.apk` + `.aab`) + **Windows Setup** (`FluentBridge-Setup-4.0.0.exe`) |
| **Segurança, RLS, Retenção & Storage** | **RLS Relacional Estrito (`v4.0` Seção 9)**, `syncRelationalFullState`, **compactação esparsa (~95% menor no JSONB/localStorage)**, **autolimpeza de áudios > 60 dias** preservando feedbacks escritos e **Painel Admin Mestre** |
| **Currículo, Escrita & Nivelamento CAT** | **`800` unidades** (`100`/idioma, `20`/nível A1–C1), **Treinador de Escrita & Traços** (`JA/ZH/RU`), **botão Traduzir PT em B2/C1**, **`1.600` tabelas gramaticais**, **`320` questões CAT** |
| **Voz, Fonética, Shadowing, Erros & Podcasts** | **Feedback Fonético Silábico**, **Modo Shadowing** (`0.75x–1.15x`), **Caderno Inteligente de Erros**, **`40` Podcasts Curtos Multi-Voz**, **Tutor IA (`320` cenários + `8.000` modos)** |
| **Verificação & CI/CD** | `npm test` (`12` arquivos / `33` testes OK) · `npx tsc --noEmit` (`0` erros) · GitHub Actions `.apk` + `.aab` |
