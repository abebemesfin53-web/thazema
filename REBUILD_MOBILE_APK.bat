@echo off
echo 📱 REBUILDING THAZEMA MOBILE APK
echo =================================
echo.

echo 📋 Step 1: Building React app...
cd client
call npm run build
if %errorlevel% neq 0 (
    echo ❌ Build failed!
    pause
    exit /b 1
)
echo ✅ React build completed
echo.

echo 📋 Step 2: Copying to Capacitor...
cd ..
call npx cap copy
if %errorlevel% neq 0 (
    echo ❌ Capacitor copy failed!
    pause
    exit /b 1
)
echo ✅ Capacitor copy completed
echo.

echo 📋 Step 3: Opening Android Studio...
call npx cap open android
echo.

echo 🎯 NEXT STEPS IN ANDROID STUDIO:
echo 1. Wait for Gradle sync to complete
echo 2. Build → Build Bundle(s)/APK(s) → Build APK(s)
echo 3. Install APK on your phone
echo 4. Test connection in mobile app
echo.

echo 📱 MOBILE APP FEATURES:
echo ✅ Enhanced connection diagnostic
echo ✅ Automatic connection testing
echo ✅ Multiple server port support
echo ✅ Detailed error reporting
echo ✅ Network troubleshooting guide
echo.

echo 🔧 IF CONNECTION STILL FAILS:
echo 1. Run FIREWALL_FIX.bat as administrator
echo 2. Test phone browser: http://10.14.28.123:3001/api/health
echo 3. Try mobile hotspot instead of WiFi
echo 4. Check MOBILE_CONNECTION_COMPLETE_FIX.md
echo.

echo 🚀 Your updated Thazema APK is ready to build!
pause