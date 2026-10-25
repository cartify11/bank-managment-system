@echo off
title Bank Management System Server
color 0A
echo ===================================================
echo     BANK MANAGEMENT SYSTEM - AUTO LAUNCHER
echo ===================================================
echo.
set "PATH=C:\node;%PATH%"
cd /d "C:\Users\X COMPUTER\Desktop\Bank managemant system\frontend"

echo [1/2] Opening browser to http://localhost:3000 ...
start http://localhost:3000

echo [2/2] Checking if server is already active...
netstat -ano | findstr ":3000" >nul
if %errorlevel% == 0 (
    echo.
    echo Server is ALREADY running and online!
    echo You can now use the Bank Management System.
    timeout /t 3 >nul
    exit
)

echo Starting Vite Local Server...
npx vite --port 3000 --host