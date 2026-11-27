@echo off
:: @file publicar-cloudflare.bat
:: Script batch Windows para deploy do frontend no Cloudflare Pages e API Edge no Cloudflare Worker.
setlocal
cd /d "%~dp0"

echo ============================================================
echo   FluentBridge - Publicar Versao Web no Cloudflare Pages
echo ============================================================
echo.

call npx --yes wrangler whoami >nul 2>&1
if errorlevel 1 (
  echo [1/3] Abrindo navegador para autenticar na sua conta Cloudflare...
  call npx --yes wrangler login
  if errorlevel 1 (
    echo [ERRO] Nao foi possivel autenticar no Cloudflare.
    pause
    exit /b 1
  )
)

echo [2/3] Compilando versao web (dist)...
call npm run build
if errorlevel 1 (
  echo [ERRO] Falha no build web.
  pause
  exit /b 1
)

echo [3/3] Publicando no Cloudflare Pages (projeto: fluentbridge)...
call npx --yes wrangler pages project create fluentbridge --production-branch=main >nul 2>&1
call npx --yes wrangler pages deploy dist --project-name=fluentbridge --branch=main
echo.
pause
