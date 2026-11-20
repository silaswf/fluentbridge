@echo off
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

echo [3/3] Gerando APK Debug via Gradle...
pushd android
call gradlew.bat assembleDebug
set "ERR=%errorlevel%"
popd

if not "%ERR%"=="0" (
  echo [ERRO] Falha ao compilar APK com Gradle.
  pause
  exit /b %ERR%
)

if exist "android\app\build\outputs\apk\debug\app-debug.apk" (
  if not exist "release" mkdir "release"
  copy /Y "android\app\build\outputs\apk\debug\app-debug.apk" "release\FluentBridge-debug.apk" >nul
  echo.
  echo [SUCESSO] APK gerado em: release\FluentBridge-debug.apk
) else (
  echo [ERRO] APK nao encontrado apos build Gradle.
)
pause
