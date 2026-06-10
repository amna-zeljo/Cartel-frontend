@echo off
echo Starting Grocery API on http://0.0.0.0:8000
echo Your phone will connect using your PC's LAN IP (same Wi-Fi as the phone).
echo.
.\.venv\Scripts\uvicorn.exe main:app --reload --host 0.0.0.0 --port 8000
