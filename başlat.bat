@echo off
title Utku Berkay Koc - Domain Checker

REM domains.txt dosyasının varlığını kontrol et
if not exist domains.txt (
    echo domains.txt dosyası bulunamadı. Lütfen kontrol etmek istediğiniz alan adlarını domains.txt dosyasına ekleyin.
    pause
    exit /b
)

REM Node.js'in kurulu olup olmadığını kontrol et
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo Node.js bulunamadı. Lütfen Node.js'i yükleyin: https://nodejs.org
    pause
    exit /b
)

REM domainChecker.js dosyasını çalıştır
node domainChecker.js

pause