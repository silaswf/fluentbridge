# Documentação de Desenvolvimento — FluentBridge (`v1.3.0`)

Documentação técnica, diagnóstico arquitetural, guia de uso, auditoria de otimizações e roadmap completo do **FluentBridge Academy** (plataforma de ensino de idiomas nas **4 habilidades** — *Listening, Reading, Speaking & Writing* — com dicas contextuais para brasileiros, Tutor IA, vocabulário SRS, acompanhamento do **Prof. Silas**, emissão de certificados CEFR e sincronização multiplataforma em **Windows**, **Android** e **Web**).

---

## Índice de Documentos

1. **[01 - Diagnóstico Atual do Sistema](./01-DIAGNOSTICO-ATUAL.md)** — Inventário técnico completo de tudo o que já está implementado na versão `v1.1.0`.
2. **[02 - Arquitetura Nativa (Windows + Android + Web)](./02-ARQUITETURA-NATIVA-WINDOWS-ANDROID.md)** — Arquitetura Electron + Capacitor 7 + Cloudflare Pages/Workers, assinatura Release (`.apk`/`.aab`), deep link OAuth e CI/CD no GitHub Actions.
3. **[03 - Roadmap até a Completude](./03-ROADMAP-DESENVOLVIMENTO.md)** — Histórico das Fases 0 a 5 concluídas (`v1.0.0` → `v1.1.0`) e o plano completo das Fases 6 a 9 (`v1.2` → `v2.0`) rumo ao máximo potencial.
4. **[04 - Guia de Sincronização Online com Supabase](./04-GUIA-SINCRONIZACAO-SUPABASE.md)** — Estrutura do banco (`supabase_schema.sql`), merge granular em `fb_school_state`, tombstones, áudios cross-device e backups JSON.
5. **[04 - Guia Supabase Autenticação & IA Compartilhada](./04-GUIA-SUPABASE-AUTENTICACAO.md)** — Configuração de Google OAuth Web/Android nativo, separação Aluno vs. Professor (`SILAS-PROF-2026`), usuário Admin Mestre (`silaswf@gmail.com`) e proxy seguro Gemini no Cloudflare Worker.
6. **[05 - Manual Completo de Funcionalidades](./05-MANUAL-FUNCIONALIDADES.md)** — Guia detalhado de uso de todas as telas do aluno e do Estúdio do Professor.
7. **[06 - Auditoria Completa & Plano de Otimizações](./06-AUDITORIA-OTIMIZACOES.md)** — Varredura profunda de suficiência, achados reais no código (`TeacherStudio.tsx`, bundle, modularização, SRS SM-2) e plano de melhorias em arquitetura, código, UI/UX, conteúdo e segurança.
8. **[07 - Plano Técnico das Próximas Fases (Fases 5 a 9)](./07-PLANO-FASE-8-DIFERENCIAIS.md)** — Blueprint detalhado de implementação por Sprints (`v1.1` → `v2.0`) com arquivos impactados e critérios de aceite.
9. **[Changelog Completo](../CHANGELOG.md)** — Registro histórico versão por versão (`v1.0.0` → `v1.1.0`).

---

## Resumo do Estado Atual (`v1.3.0`)

| Aspecto | Estado Atual |
| --- | --- |
| **Plataformas** | **Web / PWA Offline** (`https://fluentbridge.pages.dev` com `vite-plugin-pwa`) + **Edge API** (`https://fluentbridge-api.silaswf.workers.dev`) + **Android Nativo Assinado** (Safe Area `WindowInsetsCompat`, `.apk` + `.aab`) + **Windows Desktop** (`FluentBridge.exe`) |
| **Autenticação & Nuvem** | **Supabase Auth** (E-mail/Senha + Google OAuth Web e Android nativo), cadastro separado **Aluno** vs. **Professor** (`SILAS-PROF-2026`), Admin Mestre `silaswf@gmail.com` (**Prof. Silas**), senhas com hash `fbh1:` e **merge granular entity-level** com tombstones + upload cross-device de Speaking |
| **Currículo & Conteúdo** | **`35` unidades totais** (`34` de Inglês A1–C1 + `1` unidade inicial de Espanhol), **`274` passos interativos**, **`69` dicas contextuais**, **`140` flashcards SM-2** e **`24` tabelas** no Guia Gramatical |
| **Áudio Neural, STT & Pronúncia** | **`DualAudioButtons`** (`🇺🇸 US` + `🇬🇧 UK` + `0.75x`) com síntese neural **Deepgram Aura-2** (`thalia` US / `pandora` UK / `nestor` ES), reconhecimento **Whisper Cloud STT (`/api/stt`)** sem erro `network` e gravação `32 kbps` sincronizada entre dispositivos |
| **IA, SRS & UX (`Fase 6–7`)** | **Tutor IA** via `/api/gemini-tutor`, **SRS SM-2** com 4 botões, **Tema Claro/Escuro/Auto**, **Streak Freeze (`🧊`)**, lembretes diários (`@capacitor/local-notifications`), `ErrorBoundary`, lazy chunks e suíte **Vitest** |
| **Verificação & CI/CD** | `npm test` + `npx tsc --noEmit` (`0` erros) · `verify_curriculum.mjs` (`0` erros) · GitHub Actions gerando `.apk` e `.aab` assinados por tag `v*` |
