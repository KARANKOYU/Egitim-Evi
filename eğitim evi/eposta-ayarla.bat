@echo off
chcp 65001 >nul
title Egitim Evi - E-posta Kurulumu
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

node araclar\eposta-ayarla.js

echo.
pause
