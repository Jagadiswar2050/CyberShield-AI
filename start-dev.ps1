Write-Host "====================================================" -ForegroundColor Gold
Write-Host "       CyberShield AI - Full-Stack Launcher" -ForegroundColor Yellow
Write-Host "  Founder: Thallapaka Jagadiswar (Audit3A)" -ForegroundColor Cyan
Write-Host "  Website: https://www.audit3a.com/" -ForegroundColor Cyan
Write-Host "====================================================" -ForegroundColor Gold
Write-Host ""

Write-Host "[1/2] Starting Python FastAPI Backend on http://127.0.0.1:8000..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; python run.py"

Write-Host "[2/2] Starting React Vite Frontend on http://localhost:5173..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend; npm run dev"

Write-Host ""
Write-Host "Both servers launched!" -ForegroundColor Yellow
Write-Host "API Documentation: http://127.0.0.1:8000/docs" -ForegroundColor White
Write-Host "Web Application:   http://localhost:5173" -ForegroundColor White
