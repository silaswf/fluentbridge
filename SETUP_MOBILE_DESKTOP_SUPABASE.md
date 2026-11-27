<!-- @file SETUP_MOBILE_DESKTOP_SUPABASE.md — Guia prático de configuração inicial de ambientes Windows (Electron), Android (Capacitor) e projeto Supabase. -->

# Guia Completo: Empacotamento Windows, Android, iOS & Supabase

Este projeto já foi configurado com:
- **`vite.config.ts` (`base: './'`)** para carregamento 100% offline dentro de aplicativos nativos.
- **`capacitor.config.ts`** pronto para Android e iOS (`com.fluentbridge.app`).
- **`public/manifest.webmanifest`** para instalação PWA no navegador.
- **`supabase_schema.sql`** com tabelas relacionais, regras RLS de segurança e bucket de áudio.

---

## 1. Gerar Aplicativo para Android (.apk / .aab) e iOS (Xcode) com Capacitor

### Pré-requisitos
- **Android:** Instale o [Android Studio](https://developer.android.com/studio) (com Android SDK e Java 17+).
- **iOS:** Requer um Mac com **Xcode** instalado (ou serviço na nuvem como **Codemagic** / **Ionic Appflow** / **GitHub Actions macOS**).

### Comandos Passo a Passo (na pasta do projeto)

```bash
# 1. Gere o build web de produção
npm run build

# 2. Adicione as plataformas nativas (execute uma única vez)
npx cap add android
npx cap add ios

# 3. Sempre que atualizar o código React, sincronize com o Android/iOS:
npm run cap:sync
```

### Permissões de Microfone obrigatórias (para Speaking & Tutor IA)

1. **Android (`android/app/src/main/AndroidManifest.xml`):** adicione antes de `<application>`:
```xml
<uses-permission android:name="android.permission.RECORD_AUDIO" />
<uses-permission android:name="android.permission.MODIFY_AUDIO_SETTINGS" />
<uses-permission android:name="android.permission.INTERNET" />
```

2. **iOS (`ios/App/App/Info.plist`):** adicione dentro de `<dict>`:
```xml
<key>NSMicrophoneUsageDescription</key>
<string>O FluentBridge precisa do microfone para avaliar sua pronúncia em inglês e enviar áudios ao professor.</string>
<key>NSSpeechRecognitionUsageDescription</key>
<string>O reconhecimento de voz ajuda a comparar sua fala com a frase modelo.</string>
```

### Abrir e compilar o pacote instalável
```bash
# Abre no Android Studio (Build > Build APK(s) ou Generate Signed Bundle .aab)
npm run cap:android

# Abre no Xcode (Product > Archive para App Store / TestFlight)
npm run cap:ios
```

---

## 2. Gerar Executável para Windows (.exe / .msi) com Tauri 2

O **Tauri 2** reutiliza exatamente a pasta `dist/` gerada pelo Vite, produzindo um instalador leve (~5–10 MB) usando o WebView2 nativo do Windows 10/11:

### Pré-requisitos no Windows
1. Instale o [Rust (rustup)](https://rustup.rs/) e o **Visual Studio Build Tools** (C++ Desktop workload).

### Comandos Passo a Passo
```bash
# 1. Instale a CLI do Tauri na pasta do projeto
npm install -D @tauri-apps/cli@latest

# 2. Inicialize a pasta src-tauri (responda: distDir = ../dist, devUrl = http://localhost:5173)
npx tauri init

# 3. Rode em janela nativa Windows de desenvolvimento
npx tauri dev

# 4. Gere o instalador final (.exe e .msi em src-tauri/target/release/bundle/)
npx tauri build
```

---

## 3. Banco de Dados & Sincronização: Por que Supabase e como configurar

### Por que Supabase vence o Firestore para este aplicativo?
1. **Estrutura relacional:** Turmas, Alunos, Matrículas, Submissões, Notas de Pronúncia e Certificados relacionam-se naturalmente em **PostgreSQL** (`JOIN`, chaves estrangeiras e códigos únicos de turma).
2. **Storage integrado para áudios:** O plano gratuito já inclui **Storage (1 GB)** para salvar os arquivos `.webm`/`.mp4` de Speaking sem custos extras ou necessidade de habilitar cartão de crédito (no Firebase Storage exige plano Blaze).
3. **Sem surpresas de leitura:** No Firestore você paga por cada leitura de documento; no PostgreSQL consultas agregadas de turma consomem muito menos cota.

### Passo a passo no Supabase (5 minutos)
1. Acesse [supabase.com](https://supabase.com/) → **New Project**.
2. No menu lateral, clique em **SQL Editor** → **New query**.
3. Copie todo o conteúdo de **`supabase_schema.sql`** (ou clique em *"Copiar SQL Supabase"* dentro do **Modo Professor → Nuvem, IA & Escola**) e clique em **Run**.
4. Vá em **Project Settings → API** e copie:
   - **Project URL** (`https://xxxx.supabase.co`)
   - **anon public key** (`eyJ...`)
5. Abra o **FluentBridge → Modo Professor → Nuvem, IA & Escola**, cole a URL e a Anon Key, clique em **Salvar chaves → Testar conexão → Enviar p/ Nuvem**.
