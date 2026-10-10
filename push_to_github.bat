@echo off
title EduPocket - Push to GitHub
echo ====================================================
echo  Pushing EduPocket Backend to GitHub (origin/main)
echo ====================================================
"C:\Users\lokes\AppData\Local\Programs\Git\cmd\git.exe" push -u origin main
if %ERRORLEVEL% EQU 0 (
    echo.
    echo ====================================================
    echo  SUCCESS! All code has been pushed to GitHub:
    echo  https://github.com/LokeshReddyT-dev/EDU-PROJECT
    echo.
    echo  Next Step to get your Vercel Link:
    echo  1. Open https://vercel.com/new
    echo  2. Click "Import" on EDU-PROJECT
    echo  3. Click "Deploy"
    echo ====================================================
) else (
    echo.
    echo [ERROR] Push failed. Please check your GitHub credentials.
)
echo.
pause
