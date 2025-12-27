@echo off
echo ========================================
echo    Thazema Setup (After Node.js Install)
echo ========================================
echo.
echo This script will:
echo   1. Install all dependencies
echo   2. Setup the database
echo   3. Add sample data
echo   4. Start the application
echo.
pause
echo.

echo [1/5] Checking Node.js installation...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    echo Then run this script again.
    pause
    exit /b 1
)
echo Node.js is installed!
node --version
echo.

echo [2/5] Installing server dependencies...
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install server dependencies
    pause
    exit /b 1
)
echo.

echo [3/5] Installing client dependencies...
cd client
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install client dependencies
    pause
    exit /b 1
)
cd ..
echo.

echo [4/5] Setting up database...
call npm run db:setup
if %errorlevel% neq 0 (
    echo WARNING: Database setup failed
    echo Make sure MongoDB is installed and running
    echo Run: net start MongoDB
    echo.
    choice /C YN /M "Continue anyway"
    if errorlevel 2 exit /b 1
)
echo.

echo [5/5] Adding sample data...
call npm run db:seed
if %errorlevel% neq 0 (
    echo WARNING: Failed to seed database
    echo You can run 'npm run db:seed' manually later
)
echo.

echo ========================================
echo    Setup Complete!
echo ========================================
echo.
echo To start the application, run:
echo   npm run dev
echo.
echo Or double-click: start.bat
echo.
echo Login credentials:
echo   Email: abebemesfin53@gmail.com
echo   Password: admin123
echo.
pause
