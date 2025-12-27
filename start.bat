@echo off
echo ========================================
echo    Starting Thazema Application
echo ========================================
echo.

echo Checking MongoDB connection...
call npm run db:check
if %errorlevel% neq 0 (
    echo.
    echo ERROR: Cannot connect to MongoDB
    echo Please ensure MongoDB is running or check .env configuration
    echo.
    pause
    exit /b 1
)
echo.

echo Starting application...
echo Server will run on http://localhost:5000
echo Client will run on http://localhost:3000
echo.
echo Press Ctrl+C to stop the application
echo.

call npm run dev
