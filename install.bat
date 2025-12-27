@echo off
echo ========================================
echo    Thazema Installation Script
echo ========================================
echo.

echo [1/4] Installing server dependencies...
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install server dependencies
    pause
    exit /b 1
)
echo.

echo [2/4] Installing client dependencies...
cd client
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install client dependencies
    pause
    exit /b 1
)
cd ..
echo.

echo [3/4] Checking MongoDB connection...
call npm run db:check
if %errorlevel% neq 0 (
    echo WARNING: MongoDB connection failed
    echo Please ensure MongoDB is running or update .env with Atlas URI
    echo.
    choice /C YN /M "Continue anyway"
    if errorlevel 2 exit /b 1
)
echo.

echo [4/4] Setting up database...
call npm run db:setup
if %errorlevel% neq 0 (
    echo WARNING: Database setup failed
    echo You can run 'npm run db:setup' manually later
)
echo.

echo ========================================
echo    Installation Complete!
echo ========================================
echo.
echo Next steps:
echo   1. Review .env file for configuration
echo   2. Run 'npm run db:seed' to add sample data
echo   3. Run 'npm run dev' to start the application
echo.
pause
