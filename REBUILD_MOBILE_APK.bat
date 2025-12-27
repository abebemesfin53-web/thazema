@echo off
echo ========================================
echo Thazema Mobile APK Rebuild
echo ========================================
echo.
echo This will rebuild the mobile APK with latest changes
echo Including: Auto server wake feature
echo.
pause

echo.
echo [1/4] Building React app...
cd client
call npm run build
if errorlevel 1 (
    echo ERROR: Build failed!
    pause
    exit /b 1
)

echo.
echo [2/4] Syncing with Capacitor...
cd ..
call npx cap sync
if errorlevel 1 (
    echo ERROR: Capacitor sync failed!
    pause
    exit /b 1
)

echo.
echo [3/4] Opening Android Studio...
echo.
echo MANUAL STEPS IN ANDROID STUDIO:
echo 1. Wait for Gradle sync to complete
echo 2. Click Build menu
echo 3. Select "Build Bundle(s) / APK(s)"
echo 4. Click "Build APK(s)"
echo 5. Wait for build to complete
echo 6. Click "locate" link in notification
echo.
call npx cap open android

echo.
echo [4/4] APK will be at:
echo android\app\build\outputs\apk\debug\app-debug.apk
echo.
echo ========================================
echo INSTALLATION INSTRUCTIONS:
echo ========================================
echo.
echo 1. Copy APK to your phone
echo 2. Open the APK file on phone
echo 3. Allow "Install from unknown sources" if asked
echo 4. Install the app
echo 5. Open Thazema
echo 6. Wait for "Waking server..." screen (NEW!)
echo 7. Login with email:
echo    - Email: abebemesfin53@gmail.com
echo    - Password: admin123
echo.
echo ========================================
echo NEW FEATURES IN THIS BUILD:
echo ========================================
echo - Auto server wake on app start
echo - Progress indicator
echo - Better error messages
echo - OTP shown in app (test mode)
echo - Improved connection handling
echo.
echo Press any key to exit...
pause > nul
