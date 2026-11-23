# Documentação de Desenvolvimento — FluentBridge (`v2.1.0`)

Documentação técnica, diagnóstico arquitetural, guia de uso, auditoria de otimizações e roadmap completo do **FluentBridge Academy** (plataforma em **5 idiomas** — **Inglês, Espanhol, Francês, Italiano e Alemão** de `A1` a `C1` — com dicas contextuais para brasileiros, Tutor IA com modo Chamada, vocabulário SM-2, **Painel Admin Mestre**, Estúdio do **Prof. Silas**, emissão de certificados CEFR por idioma e sincronização multiplataforma em **Windows**, **Android** e **Web**).

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
9. **[Changelog Completo](../CHANGELOG.md)** — Registro histórico versão por versão (`v1.0.0` → `v2.0.0`).

---

## Resumo do Estado Atual (`v2.1.0`)

| Aspecto | Estado Atual |
| --- | --- |
| **Plataformas** | **Web / PWA Offline** (`https://fluentbridge.pages.dev`) + **Edge API** (`https://fluentbridge-api.silaswf.workers.dev`) + **Android Nativo Assinado** (Safe Area `WindowInsetsCompat`, `.apk` + `.aab`) + **Windows Desktop** (`FluentBridge.exe`) |
| **Autenticação, Admin & Nuvem** | **Supabase Auth** (E-mail/Senha + Google OAuth Web/Android), **Painel Admin Mestre (`AdminPanel.tsx`)** com código docente visível/editável (`SILAS-PROF-2026`), bloqueio/liberação de acesso em tempo real, hash `fbh1:` e **merge granular** com tombstones |
| **Currículo & Conteúdo (`5 Idiomas`)** | **`194` unidades totais** (`50` EN + `36` ES + `36` FR + `36` IT + `36` DE de A1 a C1), **`1.834` passos interativos** em **`11` formatos**, **`372` dicas contextuais**, **`584` flashcards SM-2** e **`144` tabelas** no Guia Gramatical (`32` EN, `28` ES, `28` FR, `28` IT, `28` DE) |
| **Áudio Neural, STT & Pronúncia** | **`DualAudioButtons`** com **Deepgram Aura-2** (`en-US`, `en-GB`, `es-ES`, `es-MX`) + **Gemini 2.5 Neural TTS** (`fr-FR`, `fr-CA`, `it-IT`, `it-CH`, `de-DE`, `de-AT` em WAV) + cache `tts-v3` + **Whisper Cloud STT (`/api/stt`)** nos 5 idiomas |
| **Pedagogia & UX (`Fases 6–9+`)** | **Ditado**, **Minimal Pairs**, **Histórias Multi-Voz**, **Tarefas com Prazo**, **Analytics da Escola**, **Gerador IA de Unidades**, **Tutor IA com Chamada ao Vivo**, **Tema Escuro corrigido**, **Sidebar & Painel recolhíveis**, **SM-2**, **Streak Freeze** |
| **Verificação & CI/CD** | `npm test` (`6` arquivos / `17` testes OK) · `npx tsc --noEmit` (`0` erros) · `verify_curriculum.mjs` (`0` erros) · `DIST_LEAK=CLEAN` · GitHub Actions `.apk` + `.aab` |
