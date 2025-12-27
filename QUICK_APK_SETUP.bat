@echo off
echo ========================================
echo    Thazema APK Setup Script
echo ========================================
echo.
echo This script will prepare Thazema for mobile APK creation
echo.
pause

echo [1/6] Building React app for production...
cd client
call npm run build
if %errorlevel% neq 0 (
    echo ERROR: Failed to build React app
    pause
    exit /b 1
)
cd ..
echo.

echo [2/6] Installing Capacitor...
call npm install @capacitor/core @capacitor/cli
if %errorlevel% neq 0 (
    echo ERROR: Failed to install Capacitor
    pause
    exit /b 1
)
echo.

echo [3/6] Initializing Capacitor project...
call npx cap init Thazema com.thazema.app
echo.

echo [4/6] Installing Android platform...
call npm install @capacitor/android
call npx cap add android
if %errorlevel% neq 0 (
    echo ERROR: Failed to add Android platform
    pause
    exit /b 1
)
echo.

echo [5/6] Installing mobile plugins...
call npm install @capacitor/camera @capacitor/geolocation @capacitor/push-notifications @capacitor/local-notifications
echo.

echo [6/6] Copying files to Android project...
call npx cap copy
echo.

echo ========================================
echo    Setup Complete!
echo ========================================
echo.
echo Next steps:
echo   1. Install Android Studio from: https://developer.android.com/studio
echo   2. Run: npx cap open android
echo   3. Build APK in Android Studio
echo.
echo APK will be created in:
echo   android/app/build/outputs/apk/release/
echo.
pause