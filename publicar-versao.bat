@echo off
setlocal
cd /d "%~dp0"

echo ============================================================
echo   FluentBridge - Publicar Nova Versao (Git Tag + APK Release)
echo ============================================================
echo.

git status --short
echo.
set /p MSG="Descreva rapidamente o que mudou nesta versao (Enter = atualizacao geral): "
if "%MSG%"=="" set "MSG=Atualizacao do FluentBridge"

echo [1/4] Salvando alteracoes no Git...
git add .
git diff --cached --quiet
if errorlevel 1 (
  git commit -m "chore: %MSG%"
  if errorlevel 1 (
    echo [ERRO] Falha ao criar commit.
    pause
    exit /b 1
  )
) else (
  echo Nenhuma alteracao pendente para commit; seguindo para tag de versao...
)

echo [2/4] Incrementando versao e criando tag (v*)...
call npm version patch -m "chore(release): v%%s - %MSG%"
if errorlevel 1 (
  echo [ERRO] Falha ao incrementar versao.
  pause
  exit /b 1
)

echo [3/4] Enviando codigo e tag para o GitHub...
git push origin main --follow-tags
if errorlevel 1 (
  echo [ERRO] Falha ao enviar para o GitHub.
  pause
  exit /b 1
)

echo [4/4] Disparo concluido! Acompanhe o build do APK e do AAB (Play Store) em:
gh run list --limit 3
echo.
echo Quando finalizar, baixe o APK assinado e o AAB da Play Store com:
echo   gh release download --pattern "*.apk" --pattern "*.aab" -D release --clobber
pause
