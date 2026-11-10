@echo off
title CyberShield AI Dev Server
echo ====================================================
echo        CyberShield AI - Full-Stack Launcher
echo   Founder: Thallapaka Jagadiswar (Audit3A)
echo   Website: https://www.audit3a.com/
echo ====================================================
echo.

echo [1/2] Starting Python FastAPI Backend on http://127.0.0.1:8000...
start cmd /k "cd backend && python run.py"

echo [2/2] Starting React Vite Frontend on http://localhost:5173...
start cmd /k "cd frontend && npm run dev"

echo.
echo Both servers initiated!
echo Backend Docs: http://127.0.0.1:8000/docs
echo Frontend Portal: http://localhost:5173
echo.
pause

