@echo off
setlocal
cd /d "%~dp0"
where py >nul 2>nul
if %errorlevel%==0 (
  start "IGERS Server" cmd /k "py -m http.server 4173"
  timeout /t 2 /nobreak >nul
  start "" "http://127.0.0.1:4173/"
  exit /b
)
where python >nul 2>nul
if %errorlevel%==0 (
  start "IGERS Server" cmd /k "python -m http.server 4173"
  timeout /t 2 /nobreak >nul
  start "" "http://127.0.0.1:4173/"
  exit /b
)
where node >nul 2>nul
if %errorlevel%==0 (
  start "IGERS Server" cmd /k "node server.mjs"
  timeout /t 2 /nobreak >nul
  start "" "http://127.0.0.1:4173/"
  exit /b
)
echo Python or Node.js is required to run the local server.
pause
