# 🔧 Fix "Failed to send OTP" Error

## ⚠️ The Problem
You're seeing "Failed to send OTP" because **Node.js is not installed** on your computer.

## ✅ The Solution

### Step 1: Install Node.js (REQUIRED!)
1. **Open your web browser**
2. **Go to**: https://nodejs.org/
3. **Click the GREEN button** labeled "18.x.x LTS"
4. **Download and install** the file
5. **RESTART YOUR COMPUTER** after installation

### Step 2: Install MongoDB (REQUIRED!)
1. **Go to**: https://www.mongodb.com/try/download/community
2. **Download MongoDB Community Server**
3. **Install with "Complete" option**
4. **Check "Install MongoDB as a Service"**

### Step 3: Run the Application
After restarting your computer:

**Option A: Easy Way**
- Double-click: `AFTER_NODEJS_INSTALL.bat`

**Option B: Manual Way**
```bash
npm install
cd client
npm install
cd ..
npm run db:setup
npm run db:seed
npm run dev
```

### Step 4: Test Phone Login
1. **Open browser**: http://localhost:3000
2. **Click "Phone" tab** on login screen
3. **Enter**: +251914319514
4. **Click "Send OTP"**
5. **Check the terminal** where you ran the app - OTP will be displayed like:
   ```
   📱 OTP for +251914319514: 123456
   ```
6. **Enter the OTP** and login

## 🎯 Why This Error Happens

The phone authentication system needs:
1. **Node.js** - To run the server
2. **MongoDB** - To store user data
3. **Running server** - To process OTP requests

Without Node.js, the server can't start, so OTP requests fail.

## 📱 How Phone Login Works

```
1. User enters phone number
   ↓
2. Frontend sends request to backend
   ↓
3. Backend generates 6-digit OTP
   ↓
4. OTP displayed in server console (dev mode)
   ↓
5. User enters OTP
   ↓
6. Backend verifies OTP
   ↓
7. User logged in successfully
```

## 🔍 Verify Installation

After installing Node.js, test these commands:
```bash
node --version    # Should show: v18.x.x
npm --version     # Should show: 9.x.x
```

If you see version numbers, Node.js is installed correctly!

## 📞 Need Help?

**Administrator**: Abebe Mesfin  
**Phone**: +251 914 319 514  
**Email**: abebemesfin53@gmail.com

He can help you install Node.js over the phone if needed.

## ⚡ Quick Summary

1. **Install Node.js** from nodejs.org
2. **Install MongoDB** from mongodb.com
3. **Restart computer**
4. **Run**: `AFTER_NODEJS_INSTALL.bat`
5. **Open**: http://localhost:3000
6. **Test phone login** with +251914319514

The OTP error will be fixed once Node.js is properly installed! 🚀