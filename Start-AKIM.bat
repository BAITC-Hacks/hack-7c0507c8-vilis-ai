@echo off
setlocal
set "AKIM_DIR=%~dp0akim"

if not exist "%AKIM_DIR%\package.json" (
  echo AqmolaCouncil folder was not found: "%AKIM_DIR%"
  pause
  exit /b 1
)

where node >nul 2>&1
if errorlevel 1 (
  echo Install Node.js 22.13 or newer, then run this file again.
  pause
  exit /b 1
)

node -e "const [major,minor]=process.versions.node.split('.').map(Number);process.exit(major>22||(major===22&&minor>=13)?0:1)"
if errorlevel 1 (
  echo Node.js 22.13 or newer is required.
  pause
  exit /b 1
)

if not exist "%AKIM_DIR%\node_modules\vinext\package.json" (
  echo Installing AqmolaCouncil dependencies. Internet access is needed for this first run.
  where npm >nul 2>&1
  if errorlevel 1 (
    echo npm is required to install the dependencies. Install Node.js with npm and retry.
    pause
    exit /b 1
  )
  pushd "%AKIM_DIR%"
  call npm ci
  if errorlevel 1 (
    popd
    echo Dependency installation failed.
    pause
    exit /b 1
  )
  popd
)

powershell.exe -NoProfile -Command "try { $r=Invoke-WebRequest -Uri 'http://localhost:5173/' -UseBasicParsing -TimeoutSec 1; if ($r.Content -match 'AqmolaCouncil') { exit 0 } } catch {}; exit 1" >nul 2>&1
if not errorlevel 1 (
  echo AqmolaCouncil is already running. Opening http://localhost:5173/
  start "" "http://localhost:5173/"
  exit /b 0
)

start "AqmolaCouncil dev server" cmd /k "cd /d ""%AKIM_DIR%"" && node scripts/run-framework.mjs dev"
for /l %%i in (1,1,45) do (
  powershell.exe -NoProfile -Command "try { $r=Invoke-WebRequest -Uri 'http://localhost:5173/' -UseBasicParsing -TimeoutSec 1; if ($r.Content -match 'AqmolaCouncil') { exit 0 } } catch {}; exit 1" >nul 2>&1
  if not errorlevel 1 goto :open_app
  timeout /t 1 /nobreak >nul
)

echo The local server did not become ready. Check the server window for errors.
pause
exit /b 1

:open_app
start "" "http://localhost:5173/"
exit /b 0
