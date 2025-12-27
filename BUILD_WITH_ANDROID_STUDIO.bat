@echo off
echo ========================================
echo    Thazema APK - Android Studio Method
echo ========================================
echo.
echo Android Studio should be open now.
echo.
echo STEPS TO BUILD APK:
echo.
echo 1. Wait for Gradle sync to complete
echo    (Check bottom status bar in Android Studio)
echo.
echo 2. Build APK:
echo    Build → Build Bundle(s)/APK(s) → Build APK(s)
echo.
echo 3. Wait for build to complete
echo    (Usually takes 2-5 minutes)
echo.
echo 4. Find your APK at:
echo    android\app\build\outputs\apk\debug\app-debug.apk
echo.
echo 5. Copy APK to your phone and install
echo.
echo ========================================
echo    Alternative: Install Java 11+
echo ========================================
echo.
echo If you want to build from command line:
echo 1. Install Java 11+ (see INSTALL_JAVA11.md)
echo 2. Run: cd android
echo 3. Run: .\gradlew assembleDebug
echo.
echo ========================================
echo    Your APK will include:
echo ========================================
echo.
echo ✓ Video and Audio Calling
echo ✓ Chat System with Stories
echo ✓ Discover Feed
echo ✓ Call History
echo ✓ Profile Settings
echo ✓ Nearby Users
echo ✓ Water Blue/Green Theme
echo.
echo App Size: ~15-25 MB
echo Package: com.thazema.app
echo Min Android: 5.0+
echo.
pause