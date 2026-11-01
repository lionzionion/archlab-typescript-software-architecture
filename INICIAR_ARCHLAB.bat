@echo off
setlocal
cd /d "%~dp0"
title ARCHLAB - Laboratorio de Arquitetura de Software
where node >nul 2>nul
if errorlevel 1 (
  echo [ERRO] Node.js nao encontrado. Instale Node.js 20 ou superior.
  pause
  exit /b 1
)
where npm >nul 2>nul
if errorlevel 1 (
  echo [ERRO] npm nao encontrado.
  pause
  exit /b 1
)
if not exist "node_modules\typescript" (
  echo [1/3] Instalando dependencias...
  call npm install
  if errorlevel 1 goto falha
)
echo [2/3] Compilando TypeScript...
call npm run build
if errorlevel 1 goto falha
echo [3/3] Iniciando servidor local...
echo Abra manualmente: http://localhost:5500
echo Para parar pressione Ctrl+C.
call npm start
pause
exit /b %errorlevel%
:falha
echo [ERRO] Verifique a instalacao do Node.js, npm e dependencias.
pause
exit /b 1
