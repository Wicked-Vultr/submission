@echo off
setlocal
title ProcureIQ Launcher

pushd "%~dp0"

echo.
echo ========================================
echo        ProcureIQ - One-click start
echo ========================================
echo.

where node >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js was not found. Install Node.js, then run start.bat again.
    pause
    popd
    exit /b 1
)

where npm >nul 2>&1
if errorlevel 1 (
    echo ERROR: npm was not found. Install Node.js with npm, then try again.
    pause
    popd
    exit /b 1
)

set "PYTHON_CMD="
where py >nul 2>&1
if not errorlevel 1 set "PYTHON_CMD=py -3"
if not defined PYTHON_CMD (
    where python >nul 2>&1
    if not errorlevel 1 set "PYTHON_CMD=python"
)

if not defined PYTHON_CMD (
    echo ERROR: Python 3 was not found. Install Python 3.10 or later, then try again.
    pause
    popd
    exit /b 1
)

if not exist ".venv\Scripts\python.exe" (
    echo Creating backend virtual environment...
    %PYTHON_CMD% -m venv ".venv"
    if errorlevel 1 (
        echo ERROR: Could not create the Python virtual environment.
        pause
        popd
        exit /b 1
    )
)

".venv\Scripts\python.exe" -c "import fastapi, uvicorn, sqlalchemy, pydantic_settings" >nul 2>&1
if errorlevel 1 (
    echo Installing backend dependencies. This may take a few minutes on first run...
    ".venv\Scripts\python.exe" -m pip install -r "backend\requirements.txt"
    if errorlevel 1 (
        echo ERROR: Backend dependency installation failed.
        pause
        popd
        exit /b 1
    )
)

if not exist "node_modules\vite\bin\vite.js" (
    echo Installing frontend dependencies. This may take a few minutes on first run...
    call npm install
    if errorlevel 1 (
        echo ERROR: Frontend dependency installation failed.
        pause
        popd
        exit /b 1
    )
)

echo Starting the ProcureIQ API and frontend...
start "ProcureIQ API" /D "%~dp0" cmd /k ""%~dp0.venv\Scripts\python.exe" -m uvicorn app.main:app --app-dir "%~dp0backend" --host 127.0.0.1 --port 8000 --reload"
start "ProcureIQ Frontend" /D "%~dp0" cmd /k "npm run dev -- --host 127.0.0.1"

echo Waiting for the frontend server...
timeout /t 4 /nobreak >nul
start "" "http://localhost:5173"

echo.
echo ProcureIQ is starting.
echo Frontend: http://localhost:5173
echo API docs: http://localhost:8000/docs
echo Close the ProcureIQ API and ProcureIQ Frontend windows to stop the servers.
echo.

popd
exit /b 0
