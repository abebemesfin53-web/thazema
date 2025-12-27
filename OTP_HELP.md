# 📱 Thazema Login Help - Complete Guide

## 🎯 QUICK FIX (EASIEST WAY)

### Use Email Login Instead of Phone OTP:

1. Open Thazema app
2. Click **"Use Email Instead"**
3. Enter: `abebemesfin53@gmail.com`
4. Password: `admin123`
5. ✅ Done!

**Alternative Test Account:**
- Email: `test@email.com`
- Password: `test123`

---

## 🔧 Why Phone OTP Doesn't Work Yet

Phone OTP requires email configuration on the server. Until configured:
- OTP is generated but not sent to your email
- OTP shows in server logs (you can't see on mobile)
- **Solution**: Use email login instead!

---

## ⚡ NEW: Auto Server Wake

The app now automatically wakes the server when you open it!

**What you'll see:**
1. Blue/green screen with 📡 icon
2. "Waking server..." message
3. Progress bar
4. "Server ready! ✅"
5. Login screen appears

**If it takes too long:**
- Wait 20-30 seconds
- Server is starting from sleep (Render free tier)
- It will work!

---

## 🌐 Manual Server Wake (If Needed)

If auto-wake fails, manually wake the server:

1. Open Chrome on your phone
2. Visit: `https://thazema.onrender.com/api/health`
3. Wait for: `{"status":"ok",...}`
4. Now open Thazema app

---

## 📧 Configure Email OTP (Optional)

To make phone OTP work with email delivery:

### Step 1: Get Gmail App Password

1. Go to: https://myaccount.google.com/apppasswords
2. Sign in with: `abebemesfin53@gmail.com`
3. Click "Create" or "Generate"
4. App name: "Thazema"
5. Copy the 16-character password (like: `abcd efgh ijkl mnop`)

### Step 2: Add to Render

1. Go to: https://dashboard.render.com
2. Find your "thazema" service
3. Click "Environment" tab
4. Click "Add Environment Variable"
5. Add:
   - **Key**: `GMAIL_APP_PASSWORD`
   - **Value**: (paste the 16-char password, no spaces)
6. Click "Save Changes"
7. Server will restart automatically (takes 1-2 minutes)

### Step 3: Test Phone OTP

1. Open Thazema app
2. Enter phone number
3. Click "Send OTP"
4. Check email: `abebemesfin53@gmail.com`
5. Enter 6-digit code from email
6. ✅ Login successful!

---

## 🚀 Server Information

- **Production URL**: https://thazema.onrender.com
- **Health Check**: https://thazema.onrender.com/api/health
- **Status**: Free tier - sleeps after 15 minutes
- **Wake Time**: 10-30 seconds
- **Auto-Wake**: Built into app (v2.0+)

---

## 🔐 Login Methods

### Method 1: Email Login (RECOMMENDED)
- Fast and reliable
- No configuration needed
- Works immediately
- Credentials: `abebemesfin53@gmail.com` / `admin123`

### Method 2: Phone OTP
- Requires Gmail App Password setup
- OTP sent to email
- More secure
- Takes 2 minutes to configure

### Method 3: Register New Account
- Create your own account
- Use any email
- Choose your password
- Works immediately

---

## ❌ Troubleshooting

### "Login failed" error:
1. ✅ Wait for auto-wake screen to finish
2. ✅ Check internet connection
3. ✅ Try email login instead of phone OTP
4. ✅ Use credentials: `abebemesfin53@gmail.com` / `admin123`

### "Connection failed":
1. ✅ Server is waking up - wait 20 seconds
2. ✅ Check WiFi/mobile data
3. ✅ Visit health URL in Chrome first
4. ✅ Try again

### Phone OTP not working:
1. ✅ Use email login instead (faster!)
2. ✅ Or configure Gmail App Password
3. ✅ Check email for OTP code
4. ✅ Code expires in 5 minutes

### App shows "Server ready" but login fails:
1. ✅ Server just woke up - wait 5 more seconds
2. ✅ Use email login (more reliable)
3. ✅ Check credentials are correct
4. ✅ Try test account: `test@email.com` / `test123`

---

## 📞 Admin Contact

**Abebe Mesfin**
- Phone: +251 914 319 514
- Email: abebemesfin53@gmail.com
- Password: admin123

---

## 🎉 Features After Login

Once logged in, you can:
- ✅ Make video/audio calls
- ✅ Send messages
- ✅ Find nearby users
- ✅ View call history
- ✅ Chat with Thazema AI (10 languages!)
- ✅ Customize profile
- ✅ Admin panel (for admin account)

---

## 🔄 Updates

**v2.0 - December 27, 2024**
- ✅ Auto server wake on app start
- ✅ Progress indicator
- ✅ Better error messages
- ✅ OTP shown in app (test mode)
- ✅ Improved connection handling

**v1.0 - December 2024**
- Initial release
- Video/audio calling
- Phone OTP login
- Email login
- Thazema AI assistant

---

## 💡 Tips

1. **Always use email login** - it's faster and more reliable
2. **Wait for auto-wake** - don't skip the blue screen
3. **Configure Gmail App Password** - makes phone OTP work
4. **Save credentials** - app remembers you for 7 days
5. **Check email** - OTP codes sent there (when configured)

---

**Last Updated**: December 27, 2024
**App Version**: 2.0
**Server**: Render.com (Free Tier)
