@echo off
title Portal SST Brasil
cd /d "%~dp0"

echo ====================================================
echo   PORTAL SST BRASIL - iniciando...
echo ====================================================
echo.

where node >nul 2>nul
if errorlevel 1 (
  echo [ERRO] Node.js nao encontrado. Instale em https://nodejs.org e tente de novo.
  pause
  exit /b
)

if not exist ".env" (
  echo [ERRO] Arquivo .env nao encontrado nesta pasta.
  echo Copie o .env.example, renomeie a copia para .env e preencha.
  pause
  exit /b
)

where az >nul 2>nul
if errorlevel 1 (
  echo [ERRO] Azure CLI nao encontrada.
  echo Instale com:  winget install Microsoft.AzureCLI
  echo Depois feche esta janela e abra o atalho de novo.
  pause
  exit /b
)

echo Verificando login no Azure...
call az account show >nul 2>nul
if errorlevel 1 (
  echo Voce nao esta logado. O navegador vai abrir para voce entrar na conta do Foundry.
  call az login
)

echo.
echo Abrindo o site no navegador...
start "" http://localhost:3000
echo.
echo NAO FECHE ESTA JANELA enquanto estiver usando o site.
echo Para desligar o site, feche esta janela.
echo.
node server.js
pause
