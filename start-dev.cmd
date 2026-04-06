@echo off
setlocal
cd /d "%~dp0web"
if not exist "package.json" (
  echo Could not find web\package.json. Run this script from the Project Eli folder.
  pause
  exit /b 1
)
echo Starting Next.js dev server in a new window...
start "Next.js dev server" cmd /k "npm run dev"
echo Waiting for the server to start...
timeout /t 5 /nobreak >nul
start "" "http://localhost:3000"
echo Browser opened. Close the dev server window when you are done.
endlocal
