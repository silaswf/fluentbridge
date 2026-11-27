<!-- @file docs/02-ARQUITETURA-NUVEM-E-PLATAFORMAS.md — Documentação de arquitetura técnica: cliente React/PWA, Electron, Capacitor, iOS Safari PWA, Cloudflare Worker + R2, Supabase RLS e diretrizes. -->

# 02 — Arquitetura, Nuvem & Plataformas (`v9.3.0`)

Este documento consolida toda a arquitetura técnica do **FluentBridge Academy**: cliente Web/PWA, aplicativos nativos Windows (Electron) e Android (Capacitor), estratégia iOS gratuita (Safari PWA), Edge API no Cloudflare Workers (`v9.3.0`, 10 endpoints incl. `/api/translate` e `/api/admin/quotas`) + R2, banco/autenticação Supabase e pipeline CI/CD no GitHub Actions.

---

## 1. Visão Geral da Topologia

```text
┌─────────────────────────────────────────────────────────────────────────┐
│ Clientes (React 19 + TypeScript + Vite 6 + Tailwind v4)                 │
│  • Web / PWA Offline (Cloudflare Pages + Workbox SW)                    │
│  • iPhone / iPad via Safari PWA ($0/ano — apple-mobile-web-app-capable) │
│  • Windows Desktop (Electron 35 + NSIS Setup .exe)                      │
│  • Android Mobile (Capacitor 7 + APK Assinado + AAB Play Store)         │
└──────────────────────────┬───────────────────────────┬──────────────────┘
                           │ HTTPS JSON / Audio        │ HTTPS + OAuth
                           ▼                           ▼
┌───────────────────────────────────────┐   ┌─────────────────────────────┐
│ Cloudflare Worker (v9.0.0)            │   │ Supabase Cloud              │
│ fluentbridge-api.silaswf.workers.dev  │   │  • Auth (E-mail + Google)   │
│  • /api/tts (Gemini TTS + Aura-2)     │   │  • Postgres + RLS Estrito   │
│  • /api/stt (Whisper STT)             │   │  • fb_school_state + tables │
│  • /api/gemini-tutor (Chat + Grader)  │   │  • Bucket fb-audio (60d)    │
│  • /api/youtube-study (Captions + IA) │   └─────────────────────────────┘
│  • /api/media/list & /api/media/*     │
│  • /api/telemetry & /api/health       │
│  • R2 Bucket: fluentbridge-media      │
└───────────────────────────────────────┘
```

---

## 2. Frontend, Build & Offline-First (`src/` + `vite.config.ts`)

- **Stack Core:** React 19, TypeScript (`tsc --noEmit` estrito), Vite 6.4.6, Tailwind CSS v4 (`@custom-variant dark (&:where(.dark, .dark *))`) e `lucide-react`.
- **Code-Splitting (`vite.config.ts`):**
  - `React.lazy` + `<Suspense fallback={<ViewSkeleton />}>` para todas as visões secundárias (`LessonPlayer`, `AITutor`, `VocabReview`, `MockExamHub`, `TipsLibrary`, `PodcastImmersionView`, `InteractiveVideoView`, `CommunityHub`, `LiveClassroomView`, `CertificatesView`, `TeacherStudio`, `AdminPanel`, `PlacementTestModal`, `SettingsModal`).
  - `manualChunks` dividindo vendors (`react-vendor`, `supabase-vendor`, `icons-vendor`), bancos curriculares por idioma (`curriculum-<lang>`, `curriculum-v9-*`), guias gramaticais (`grammar-<lang>`), exames (`exams-*`) e cenários (`tutor-scenarios`).
  - `build.sourcemap: 'hidden'` (source maps gerados para debug/Sentry sem expor código-fonte via referência pública nos assets servidos).
- **PWA (`vite-plugin-pwa`):**
  - Estratégia Workbox `generateSW` com `30` entradas em precache (`~1.746 KiB`) e exclusão explícita de `**/*.map` em `globIgnores`.
  - Suporte completo a instalação iOS Safari (`manifest.webmanifest`, `public/apple-touch-icon.svg`, meta `apple-mobile-web-app-capable`).
- **Armazenamento Local & Fila Offline:**
  - `localStorage` para estado do usuário (`fluentbridge_state_v1`), preferências de tema (`fluentbridge_theme_mode`), sotaque (`accentPreference.ts`) e dificuldade adaptativa (`adaptiveDifficulty.ts`).
  - `IndexedDB` (`audioDb.ts` + `speech.ts`) para cache local de áudios gravados pelo aluno (`32 kbps`) e sínteses neurais (`tts-v6:<dialect>:<hash>`).
  - `offlineOutbox.ts`: enfileira conclusões de lição, revisões SM-2 e checkpoints enquanto offline e drena automaticamente ao reconectar (`flushProgressOutbox`).
  - `offlineUnitPack.ts`: permite baixar as próximas 3 unidades diretamente para uso offline.

---

## 3. Edge API — Cloudflare Worker `v9.0.0` (`cloudflare-worker/worker.js`)

Hospedado em `https://fluentbridge-api.silaswf.workers.dev` com bindings `env.AI` (Workers AI), `env.MEDIA_BUCKET` (R2 `fluentbridge-media`) e secrets (`GEMINI_API_KEY`, `DEEPGRAM_API_KEY`, `SUPABASE_JWT_SECRET`).

| Endpoint | Método | Função & Regras | Limite / Cota Persistente (R2) |
| --- | --- | --- | --- |
| `/api/health` | `GET` | Versão (`9.0.0`), `61` sotaques, `16` idiomas, bindings e cotas | Público |
| `/api/tts` | `POST` | TTS Neural em 3 camadas (`tts/v6/`): Tier 1 **Gemini 2.5 Native TTS** (todos os 61 sotaques); Tier 2 **Deepgram Aura-2** (`en`/`es`); Tier 3 `google-tts-fallback` com `Cache-Control: no-store` e `X-TTS-Fallback: true` (nunca gravado no R2) | `120 req/min` + cache SHA-256 R2 |
| `/api/stt` | `POST` | Transcrição de áudio via Whisper (`@cf/openai/whisper`) com suporte aos 16 idiomas | `30 req/min` · **`200 req/dia`** (`quotas/YYYY-MM-DD/stt`) |
| `/api/gemini-tutor` | `POST` | Proxy seguro do Gemini para Tutor IA, correção analítica de Writing e avaliação | `30 req/min` · **`250 req/dia`** (`quotas/YYYY-MM-DD/gemini`) |
| `/api/youtube-study` | `POST` | Recebe URL/ID do YouTube + transcrição opcional; busca metadados (`oEmbed`) + legendas públicas, gera `subtitles` tokenizadas, `grammarInsights` e `checkpoints` via Gemini | `20 req/min` · **`100 req/dia`** (`quotas/YYYY-MM-DD/youtube`) |
| `/api/media/list` | `GET` | Lista vídeos/áudios disponíveis no bucket R2 (`videos/`) para descoberta dinâmica no cliente | Cache curto |
| `/api/media/*` | `GET` | Streaming de mídia do R2 com suporte obrigatório a **HTTP `206 Partial Content` (`Range`)** para Safari/iOS | Edge/R2 |
| `/api/telemetry` | `POST/GET` | Registro de erros do cliente; leitura protegida em modo estrito (`ADMIN`) | Protegido |

---

## 4. Supabase: Autenticação, RLS, Sync Granular & Áudio

1. **Autenticação & Google OAuth:**
   - Cliente singleton (`getSupabaseClient()` em `cloudSync.ts`) evitando múltiplas instâncias GoTrue.
   - Login por e-mail/senha (com hash local `fbh1:` + salt para fallback offline em `storage.ts`) e **Google OAuth** (web redirect padrão; Android via `@capacitor/browser` + deep link `com.fluentbridge.app://auth-callback` tratado por `@capacitor/app`).
   - Master Admin automático para `silaswf@gmail.com` (`appConfig.ts`); professores exigem `Código de Autorização Docente` (padrão `SILAS-PROF-2026`, editável no Admin); alunos escolhem **Turma**, **Aluno VIP** ou **Sem vínculo**.
2. **Persistência & Merge Granular (`cloudSync.ts` + `relationalSync.ts`):**
   - `fb_school_state` armazena snapshot JSON e `relationalSync.ts` sincroniza entidades em modo híbrido com RLS estrito (`supabase_schema.sql`).
   - `mergePlatformStates`: união sem sobrescrita destrutiva de usuários, turmas, tópicos customizados, submissões (`reviewed` prevalece sobre `pending`), XP e progresso, respeitando tombstones (`deletedUserIds`, `deletedClassIds`, `deletedTopicIds`).
   - `deleteMyCloudAccount()`: invoca `rpc('delete_my_account_data')` seguido de `signOut()` para conformidade LGPD.
3. **Áudio Cross-Device & Retenção (`audioRetention.ts`):**
   - Gravações de Speaking do aluno são comprimidas (`32 kbps`) e enviadas para o bucket `fb-audio` (com fallback `audioDataUrl`).
   - `runAudioRetentionCleanup()` remove automaticamente áudios com mais de **60 dias** para manter o storage enxuto.

---

## 5. Plataformas Nativas & Estratégia iOS

| Plataforma | Tecnologia | Build / Entrega | Observações |
| --- | --- | --- | --- |
| **Web / PWA** | Vite + Workbox SW | Cloudflare Pages (`fluentbridge.pages.dev`) | Deploy contínuo via Wrangler; suporte offline completo |
| **iPhone / iPad (iOS)** | Safari PWA (`$0/ano`) | `apple-mobile-web-app-capable` + `apple-touch-icon.svg` + HTTP `206 Range` | Contorna taxa anual de US$ 99 da Apple Developer; instalação em 3 toques no Safari |
| **Windows Desktop** | Electron 35 + NSIS | `FluentBridge-Setup-9.0.0.exe` | Atalho desktop/menu iniciar, acesso direto ao microfone, auto-updater (`appUpdater.ts`) |
| **Android Mobile** | Capacitor 7 + Gradle | `FluentBridge-v9.0.0.apk` + `.aab` | Keystore PKCS12 (`fluentbridge-release.jks`), Chrome Custom Tabs OAuth, Safe Area (`WindowInsetsCompat`) |

### CI/CD (`.github/workflows/build-android-apk.yml`)
- **Job `secret-scan`:** bloqueia o pipeline caso padrões de chaves privadas/tokens existam no repositório antes de qualquer build.
- **Jobs de Build & Release:** executam `tsc`, `vitest`, `vite build`, compilam Windows `.exe` (NSIS) e Android `.apk`/`.aab` assinados e publicam automaticamente em `silaswf/fluentbridge-releases` a cada tag `v*`.

---

## 6. Diretriz de Manutenibilidade, Comentários & Regras Anti-Regressão

Todos os arquivos funcionais, estruturais, de dados, scripts, Worker Edge e documentação do repositório seguem as diretrizes permanentes definidas em [`AGENTS.md`](../AGENTS.md), [`.agents/rules/file-documentation-headers.md`](../.agents/rules/file-documentation-headers.md) e [`.agents/rules/fluentbridge-core-guidelines.md`](../.agents/rules/fluentbridge-core-guidelines.md): cabeçalhos `@file` obrigatórios, paridade dinâmica dos 17 idiomas, teto de chunks `< 500 kB`, cotas R2, RLS + LGPD, `ConfirmDialog` e gate completo de testes antes de cada entrega.

---

## 6. Diretriz de Manutenibilidade, Comentários & Regras Anti-Regressão

Todos os arquivos funcionais, estruturais, de dados, scripts, Worker Edge e documentação do repositório seguem as diretrizes permanentes definidas em [`AGENTS.md`](../AGENTS.md), [`.agents/rules/file-documentation-headers.md`](../.agents/rules/file-documentation-headers.md) e [`.agents/rules/fluentbridge-core-guidelines.md`](../.agents/rules/fluentbridge-core-guidelines.md): cabeçalhos `@file` obrigatórios, paridade dinâmica dos 17 idiomas, teto de chunks `< 500 kB`, cotas R2, RLS + LGPD, `ConfirmDialog` e gate completo de testes antes de cada entrega.
