# Documentação de Desenvolvimento — FluentBridge (`v3.0.0`)

Documentação técnica, diagnóstico arquitetural, guia de uso, auditoria 360°, comparativo competitivo de mercado e roadmap completo do **FluentBridge Academy** (plataforma em **8 idiomas** — **Inglês, Espanhol, Francês, Italiano, Alemão, Russo, Japonês e Chinês Mandarim** de `A1` a `C1` — com subunidades estilo Busuu, revisão progressiva SM-2, autolimpeza de áudios em 60 dias, Tutor IA dinâmico, **Painel Admin Mestre**, Estúdio do **Prof. Silas**, emissão de certificados CEFR por idioma e sincronização multiplataforma em **Windows**, **Android** e **Web**).

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

## Resumo do Estado Atual (`v3.0.0`)

| Aspecto | Estado Atual |
| --- | --- |
| **Plataformas** | **Web / PWA Offline** (`https://fluentbridge.pages.dev`) + **Edge API `v3.0.0`** (`https://fluentbridge-api.silaswf.workers.dev`) + **Android Nativo Assinado** (`.apk` + `.aab`) + **Windows Setup** (`FluentBridge-Setup-3.0.0.exe`) |
| **Autenticação, VIP, Retenção & Nuvem** | **Supabase Auth** (E-mail/Senha + Google OAuth), **Vinculação VIP (`PROF-SILAS`)**, **Painel Admin Mestre**, **autolimpeza de áudios de Speaking > 60 dias** preservando feedbacks escritos e sync granular |
| **Currículo, Subunidades & Nivelamento CAT** | **`410` unidades** (`60` EN + `50` ES/FR/IT/DE/RU/JA/ZH) em **subunidades estilo Busuu com progresso salvo**, **vocabulário progressivo SM-2**, **Nivelamento CAT (`320` questões, `40`/idioma)**, **imersão B2/C1**, **`800` tabelas gramaticais** |
| **Tutor IA Dinâmico** | **`20` situações/idioma (`160` total)** + **`10` modos dinâmicos por unidade (`4.100` combinações)** + **Cenário Livre** via Gemini + fallback offline nos 8 idiomas |
| **Áudio Neural, STT & Pronúncia** | **Deepgram Aura-2** (`EN/ES`) + **Gemini 2.5 Neural TTS** (`FR/IT/DE/RU/JA/ZH`) + **Whisper Cloud STT (`/api/stt`)** nos 8 idiomas + avaliador Unicode/CJK |
| **Verificação & CI/CD** | `npm test` (`9` arquivos / `29` testes OK) · `npx tsc --noEmit` (`0` erros) · `DIST_LEAK=CLEAN` · GitHub Actions `.apk` + `.aab` |
