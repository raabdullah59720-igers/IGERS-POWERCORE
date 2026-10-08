@echo off
setlocal
cd /d "%~dp0"
where py >nul 2>nul
if %errorlevel%==0 (
  py airtraffic_live_relay.py
  goto :eof
)
where python >nul 2>nul
if %errorlevel%==0 (
  python airtraffic_live_relay.py
  goto :eof
)
echo Python 3 was not found. Install Python 3 and run this file again.
pause
