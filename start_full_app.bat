@echo off
echo ============================================================
echo Starting Bharat Suraksha (Sangyan Investor Safety Shield)
echo ============================================================
echo.
echo [1/3] Launching FastAPI Backend on Port 8000...
start "Sangyan Backend API" cmd /k "cd /d "%~dp0backend" && python -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload"

echo [2/3] Launching Frontend Server on Port 3000...
start "Sangyan Frontend Web" cmd /k "cd /d "%~dp0frontend" && python -m http.server 3000"

echo [3/3] Opening App in your default browser...
timeout /t 2 /nobreak >nul
start "" "http://localhost:3000"

echo.
echo [OK] Backend API: http://localhost:8000
echo [OK] Swagger Docs: http://localhost:8000/docs
echo [OK] Web Frontend: http://localhost:3000
echo.
exit
