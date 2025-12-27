# ☕ Install Java 11+ for Android Development

## 🎯 **Quick Java 11 Installation**

### **Method 1: Download Oracle JDK 11**
1. **Visit**: https://www.oracle.com/java/technologies/javase/jdk11-archive-downloads.html
2. **Download**: Windows x64 Installer
3. **Install** with default settings
4. **Restart** command prompt

### **Method 2: OpenJDK 11 (Free)**
1. **Visit**: https://adoptium.net/temurin/releases/
2. **Choose**: JDK 11 (LTS)
3. **Download**: Windows x64 MSI
4. **Install** and restart

### **Method 3: Using Chocolatey (If installed)**
```bash
choco install openjdk11
```

### **Method 4: Using Winget**
```bash
winget install Microsoft.OpenJDK.11
```

## 🔧 **After Installation**

### **Verify Java Version:**
```bash
java -version
```
Should show: `openjdk version "11.x.x"` or higher

### **Set JAVA_HOME (If needed):**
1. **System Properties** → **Environment Variables**
2. **New System Variable**:
   - Name: `JAVA_HOME`
   - Value: `C:\Program Files\Java\jdk-11.x.x`
3. **Add to PATH**: `%JAVA_HOME%\bin`

## 🚀 **Then Build APK:**
```bash
cd android
.\gradlew assembleDebug
```

## 📱 **APK Location:**
`android/app/build/outputs/apk/debug/app-debug.apk`