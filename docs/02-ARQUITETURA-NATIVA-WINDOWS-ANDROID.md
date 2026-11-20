# 02 — Arquitetura Nativa e Multiplataforma (Windows, Android & Web)

Este documento detalha como o **FluentBridge** é compilado e distribuído a partir de uma única base `React + TypeScript + Vite` para **Windows (`.exe`)**, **Android (`.apk` / `.aab` Play Store)** e **Web / PWA (Cloudflare Pages)**.

---

## 1. Visão Geral dos 3 Alvos de Compilação

```text
  src/ (React 19 + TypeScript + Tailwind v4)
     │
     ▼  npm run build (tsc --noEmit && vite build -> dist/)
     ├──► Web / PWA         ──► Cloudflare Pages (https://fluentbridge.pages.dev)
     ├──► Windows Desktop   ──► electron/main.cjs + @electron/packager (release/FluentBridge-win32-x64/FluentBridge.exe)
     └──► Android Nativo    ──► npx cap sync android -> android/ (Gradle assembleRelease + bundleRelease)
                                   ├──► APK Assinado (release/FluentBridge-v*.apk)
                                   └──► Play Store App Bundle (release/FluentBridge-v*-playstore.aab)
```

- **Base Relativa em Produção (`vite.config.ts`)**: usa `base: command === 'build' ? './' : '/'`, garantindo que o `dist/index.html` carregue `./assets/...` tanto via protocolo `file://` no Electron quanto via `https://localhost` no Capacitor Android e HTTPS no Cloudflare Pages.

---

## 2. Windows Nativo (`Electron 34`)

- **Arquivo principal**: `electron/main.cjs`.
- **Janela & Isolamento**: cria uma `BrowserWindow` (`1280×820`, mínimo `960×680`, barra de menu ocultada automaticamente com `autoHideMenuBar: true`) com `contextIsolation: true` e `nodeIntegration: false`, carregando `dist/index.html` com `win.loadFile(...)`.
- **Permissões de Microfone e Áudio**: configura `setPermissionRequestHandler` e `setPermissionCheckHandler` no `session.defaultSession` para aprovar automaticamente `'media'`, `'audioCapture'` e `'microphone'`, permitindo que os exercícios de *Speaking* e ditado no Tutor IA funcionem sem popups bloqueados no Desktop.
- **Empacotamento**: comando `npm run exe:build` em `package.json` executa `npm run build` seguido de `electron-packager . FluentBridge --platform=win32 --arch=x64 --out=release --overwrite` (ignorando `release/`, `android/`, `ios/`, `.github/` e `src/`).

---

## 3. Android Nativo (`Capacitor 7`) & Assinatura Google Play

- **Configuração (`capacitor.config.ts`)**:
  - `appId`: `com.fluentbridge.app`
  - `appName`: `FluentBridge`
  - `webDir`: `dist`
  - `server.androidScheme`: `'https'` · `android.allowMixedContent`: `false`
- **Plugins Nativos Integrados**:
  - `@capacitor/app` (`^7.1.2`): captura abertura por URL externa (`appUrlOpen` e `getLaunchUrl`) ao voltar do login Google.
  - `@capacitor/browser` (`^7.0.5`): abre o fluxo OAuth em **Chrome Custom Tabs**, evitando o bloqueio `disallowed_useragent` que o Google impõe a WebViews embarcadas.
- **Permissões e Deep Link (`android/app/src/main/AndroidManifest.xml`)**:
  - `android.permission.INTERNET`
  - `android.permission.RECORD_AUDIO`
  - `android.permission.MODIFY_AUDIO_SETTINGS`
  - `<intent-filter>` configurado em `.MainActivity` para `android:scheme="com.fluentbridge.app"` e `android:host="auth-callback"` (`DEFAULT` + `BROWSABLE` + `VIEW`).
- **Configuração SDK (`android/variables.gradle` & `android/app/build.gradle`)**:
  - `minSdkVersion = 23` (Android 6.0+), `compileSdkVersion = 35`, `targetSdkVersion = 35`.
  - Versionamento dinâmico por propriedades Gradle (`-PversionCode=... -PversionName=...`) alimentadas pelo CI.
- **Assinatura Criptográfica de Produção (`.jks`)**:
  - Keystore PKCS12 gerada com JDK 21 `keytool`: `keystore/fluentbridge-release.jks` (protegida no `.gitignore`, fora do Git), alias `fluentbridge`, RSA 2048-bit (`SHA384withRSA`), validade de `10.000` dias.
  - Backup das senhas e hashes gravado localmente em `keystore/CREDENCIAIS_ASSINATURA_PLAYSTORE.txt`:
    - **SHA-1**: `83:FC:A9:CC:D7:AE:7D:80:4D:8B:63:3E:CE:21:6C:9D:CA:47:1A:92`
    - **SHA-256**: `80:40:09:2D:0C:EE:44:34:7F:22:3B:B3:AF:41:D6:E8:29:2A:60:A5:4C:CC:60:27:05:AE:E6:92:29:1D:1E:A7`
  - `android/app/build.gradle` lê as variáveis de ambiente `ANDROID_KEYSTORE_PATH`, `ANDROID_KEYSTORE_PASSWORD`, `ANDROID_KEYSTORE_ALIAS` (no CI mapeado para `ANDROID_KEY_ALIAS`) e `ANDROID_KEY_PASSWORD` no bloco `signingConfigs.release`.

---

## 4. Versão Web / PWA (`Cloudflare Pages`)

- **Projeto Cloudflare Pages**: `fluentbridge` na conta `silaswf@gmail.com` (`https://fluentbridge.pages.dev`).
- **Roteamento SPA (`public/_redirects`)**: regra `/* /index.html 200` garantindo que callbacks de login ou rotas diretas funcionem sem erro 404.
- **Manifesto PWA (`public/manifest.webmanifest` + `index.html`)**: permite instalação em Chrome/Edge e uso em tela cheia no **iPhone/iPad (iOS Safari → Adicionar à Tela de Início)**, servindo em HTTPS (requisito obrigatório dos navegadores para microfone/Web Speech).
- **Publicação local**: `publicar-cloudflare.bat` ou `npm run cf:deploy`.

---

## 5. Pipeline CI/CD Automático (`.github/workflows/build-android-apk.yml`)

- **Gatilhos**: `push` em `main` / `master`, tags `v*` e execução manual (`workflow_dispatch`).
- **Etapas na Nuvem (`ubuntu-latest` + Node 20 + Java 21)**:
  1. `npm ci`, `npm run build` e `npx cap sync android`;
  2. Decodificação segura do secret `ANDROID_KEYSTORE_BASE64` para `android/app/fluentbridge-release.jks`;
  3. Cálculo automático de `VERSION_LABEL` (nome da tag ou `v1.0.0-build.<run>`), `VERSION_NAME` e `VERSION_CODE`;
  4. Execução de `./gradlew assembleRelease bundleRelease`;
  5. Empacotamento e upload de artefatos (`FluentBridge-<versão>.apk`, `FluentBridge.apk`, `FluentBridge-<versão>-playstore.aab`, `FluentBridge-playstore.aab`);
  6. Criação/atualização automática da **GitHub Release** quando o push for de uma tag `v*` (`gh release create` / `gh release upload --clobber`).
- **Automação no PC**: execute `publicar-versao.bat` (ou `npm run release:patch` / `release:minor`) para versionar, criar tag `v*` e disparar novo build assinado na nuvem.
