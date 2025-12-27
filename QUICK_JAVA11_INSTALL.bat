@echo off
echo ========================================
echo    Quick Java 11 Installation
echo ========================================
echo.
echo Your system has Java 8, but Android development needs Java 11+
echo.
echo OPTION 1: Use Android Studio (RECOMMENDED)
echo ==========================================
echo 1. Android Studio has built-in Java
echo 2. In Android Studio: File → Project Structure
echo 3. Set Gradle JDK to "Embedded JDK"
echo 4. Build → Build Bundle(s)/APK(s) → Build APK(s)
echo.
echo OPTION 2: Install Java 11 (If needed)
echo =====================================
echo 1. Download from: https://adoptium.net/temurin/releases/
echo 2. Choose: JDK 11 (LTS) - Windows x64 MSI
echo 3. Install with default settings
echo 4. Restart command prompt
echo 5. Verify: java -version
echo.
echo OPTION 3: Using Winget (Windows 10/11)
echo ======================================
echo Run: winget install Microsoft.OpenJDK.11
echo.
echo ========================================
echo    Current Java Version:
echo ========================================
java -version
echo.
echo ========================================
echo    Recommended Action:
echo ========================================
echo.
echo 1. Use Android Studio method (easiest)
echo 2. Follow ANDROID_STUDIO_BUILD_GUIDE.md
echo 3. Your APK will be ready in 5-10 minutes!
echo.
pause