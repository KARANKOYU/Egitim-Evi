@echo off
chcp 65001 >nul
title Egitim Evi - Sunucu
cd /d "%~dp0"

where node >nul 2>nul
if errorlevel 1 (
  echo.
  echo   HATA: Node.js bulunamadi.
  echo   https://nodejs.org adresinden indirip kurduktan sonra tekrar dene.
  echo.
  pause
  exit /b 1
)

echo.
echo   Egitim Evi baslatiliyor...
echo.

start "" http://localhost:3000
node server.js

echo.
echo   Sunucu durdu.
pause
