@echo off
:: @file gerar-apk.bat
:: Script batch Windows para build web, sincronização Capacitor e geração do APK/AAB Android assinado.
setlocal
cd /d "%~dp0"

echo ==================================================
echo   FluentBridge - Gerador de APK Android
echo ==================================================
echo.

if "%ANDROID_HOME%"=="" (
  if exist "%LOCALAPPDATA%\Android\Sdk" (
    set "ANDROID_HOME=%LOCALAPPDATA%\Android\Sdk"
  )
)

if "%ANDROID_HOME%"=="" (
  echo [AVISO] ANDROID_HOME nao encontrado neste Windows.
  echo Para compilar localmente, instale o Android Studio e o Android SDK Platform Tools,
  echo ou suba este projeto para o GitHub para gerar o APK automatico na nuvem via GitHub Actions.
  pause
  exit /b 1
)

echo [1/3] Compilando versao web (dist)...
call npm run build
if errorlevel 1 exit /b 1

echo [2/3] Sincronizando com projeto nativo Capacitor (android)...
call npx cap sync android
if errorlevel 1 exit /b 1

echo [3/3] Gerando APK Release e Bundle Play Store (.aab) via Gradle...
if exist "keystore\fluentbridge-release.jks" (
  set "ANDROID_KEYSTORE_PATH=%cd%\keystore\fluentbridge-release.jks"
  set "ANDROID_KEYSTORE_PASSWORD=FluentBridge2026!"
  set "ANDROID_KEY_ALIAS=fluentbridge"
  set "ANDROID_KEY_PASSWORD=FluentBridge2026!"
)
pushd android
call gradlew.bat assembleRelease bundleRelease
set "ERR=%errorlevel%"
popd

if not "%ERR%"=="0" (
  echo [ERRO] Falha ao compilar APK/AAB com Gradle.
  pause
  exit /b %ERR%
)

if exist "android\app\build\outputs\apk\release\app-release.apk" (
  if not exist "release" mkdir "release"
  copy /Y "android\app\build\outputs\apk\release\app-release.apk" "release\FluentBridge.apk" >nul
  if exist "android\app\build\outputs\bundle\release\app-release.aab" (
    copy /Y "android\app\build\outputs\bundle\release\app-release.aab" "release\FluentBridge-playstore.aab" >nul
  )
  echo.
  echo [SUCESSO] APK assinado em: release\FluentBridge.apk
  echo [SUCESSO] Play Store Bundle em: release\FluentBridge-playstore.aab
) else (
  echo [ERRO] APK nao encontrado apos build Gradle.
)
pause
