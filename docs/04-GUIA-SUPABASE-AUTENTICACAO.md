# 04 — Guia de Autenticação Supabase, Google OAuth & Chave Gemini

Este documento explica o funcionamento completo da camada de identidade, separação de papéis (Aluno vs. Professor), Google OAuth na Web e no Android nativo e configuração da IA Gemini no **FluentBridge (`v1.0.3`)**.

---

## 1. Fluxo de Autenticação Real (Sem Acesso Demo)

A partir da versão `v1.0.3`, o FluentBridge exige autenticação real na entrada (`AuthScreen.tsx`), removendo atalhos de login rápido sem senha:

1. **Login por E-mail e Senha**:
   - Quando conectado ao Supabase (`getEffectiveSupabaseConfig`), executa `signInWithPassword` no Supabase Auth via singleton `getSupabaseClient` (`cloudSync.ts`).
   - Se o usuário ainda estiver sem conexão ou usando credencial já validada localmente (`u.password.length > 0 && u.password === password`), valida e restaura o perfil sem permitir login em branco para contas OAuth.
2. **Cadastro Separado (`Criar conta`)**:
   - **Cadastro de Aluno**: solicita nome completo, e-mail, senha (mín. 6 caracteres), confirmação de senha e **Código da Turma** opcional (`TURMA-A1`, `TURMA-B1`, `VIP-2026`). Registra também no `auth.signUp` com metadados `full_name` e `role: 'student'`.
   - **Cadastro de Professor**: exige o **Código de Autorização Docente** (`DEFAULT_TEACHER_ACCESS_CODE = 'SILAS-PROF-2026'` em `src/config/appConfig.ts`). Sem o código válido (e caso não seja o Admin Mestre), o cadastro como professor é bloqueado.
3. **Admin Mestre (`silaswf@gmail.com`)**:
   - Reconhecido automaticamente por `isMasterAdminEmail(email)` no frontend, pelo `normalizePlatformState` em `storage.ts` e pelo trigger PostgreSQL `public.handle_new_user()` em `supabase_schema.sql`.
   - Sempre recebe `role: 'teacher'` e `isMasterAdmin: true`, podendo gerenciar usuários, promover/rebaixar professores e visualizar o código docente em **Modo Professor → Turmas & Usuários**.

---

## 2. Google OAuth na Web e no Android Nativo

O Google bloqueia OAuth tradicional dentro de WebViews embutidas (`disallowed_useragent`). Por isso, o FluentBridge implementa dois caminhos integrados em `src/utils/cloudSync.ts`:

- **Versão Web (`https://fluentbridge.pages.dev`) & Desktop (`localhost`)**:
  - Chama `client.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: window.location.origin } })`.
  - No retorno com `#access_token` ou `?code=`, `subscribeSupabaseAuthChanges` (`onAuthStateChange` + `getSession`) captura a sessão automaticamente em `App.tsx` usando um único cliente `GoTrueClient` (`persistSession: true`, `autoRefreshToken: true`, `detectSessionInUrl: true`), evitando o erro *"Multiple GoTrueClient instances detected"*.
- **Versão Android Nativa (`.apk` / Play Store `.aab`)**:
  - Detecta `Capacitor.isNativePlatform()`.
  - Solicita a URL de OAuth com `skipBrowserRedirect: true` e `redirectTo: 'com.fluentbridge.app://auth-callback'`.
  - Abre no **Chrome Custom Tabs** oficial via `@capacitor/browser` (`Browser.open`).
  - Ao concluir no Google, o sistema redireciona para `com.fluentbridge.app://auth-callback`, capturado pelo `<intent-filter>` em `android/app/src/main/AndroidManifest.xml` e tratado por `registerNativeOAuthListener` (`@capacitor/app` `appUrlOpen` + `getLaunchUrl`) e `handleNativeOAuthCallbackUrl` (`setSession` / `exchangeCodeForSession` + `Browser.close()`).

---

## 3. Configuração Obrigatória no Google Cloud Console & Supabase

1. **Google Cloud Console** (*APIs & Services → Credentials → OAuth 2.0 Client IDs → Web application*):
   - **Authorized JavaScript origins**:
     - `https://fluentbridge.pages.dev`
     - `http://localhost:5173`
   - **Authorized redirect URIs**:
     - `https://wyonvrrcdoikrspbpeis.supabase.co/auth/v1/callback`
   - Publique a **OAuth Consent Screen** (*Publish App*) para liberar qualquer aluno Gmail.
2. **Supabase Dashboard** (*Authentication → Providers → Google*):
   - Cole o **Client ID** e o **Client Secret**.
3. **Supabase Dashboard** (*Authentication → URL Configuration*):
   - **Site URL**: `https://fluentbridge.pages.dev`
   - **Redirect URLs**:
     - `https://fluentbridge.pages.dev/**`
     - `com.fluentbridge.app://auth-callback`
     - `http://localhost:5173/**`

---

## 4. Chave Fixa do Google Gemini & Evolução de Segurança

- Hoje (`v1.0.3`), `src/config/appConfig.ts` embute `DEFAULT_GEMINI_API_KEY` (com opção de override pelo campo `geminiApiKey` em `TeacherStudio` → `Nuvem & IA`), alimentando `aiTutorEngine.ts` nos modelos `gemini-3.8-flash` (principal) e `gemini-2.5-flash` (fallback).
- Se não houver internet ou a cota falhar, o `AITutor` alterna transparentemente para o motor heurístico local offline (correção de *actually/currently*, *I have X years*, *make/do*, etc.).
- **Próximo passo recomendado (Fase 5 — `v1.1.0`)**: migrar a chamada do Gemini para uma **Supabase Edge Function (`gemini-tutor`)**, mantendo a `GEMINI_API_KEY` exclusivamente nos Secrets do servidor e validando o JWT de cada aluno autenticado.
