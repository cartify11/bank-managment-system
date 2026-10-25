@echo off
title Bank Management System - Frontend Server
cd /d "%~dp0frontend"
echo ========================================================
echo Starting Bank Management System Frontend on port 3000...
echo ========================================================
npm run dev
pause
