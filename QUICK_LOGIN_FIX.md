# 🚀 QUICK LOGIN FIX - Thazema App

## Problem
Login fails on mobile because Render server sleeps after 15 minutes of inactivity (free tier).

## ✅ SOLUTION 1: Wake Server First (EASIEST)

### Before using the app:
1. Open Chrome on your phone
2. Visit: `https://thazema.onrender.com/api/health`
3. Wait 10-20 seconds until you see: `{"status":"ok",...}`
4. Now open Thazema app and login

### Login Credentials:
- **Email**: `abebemesfin53@gmail.com`
- **Password**: `admin123`

OR

- **Email**: `test@email.com`
- **Password**: `test123`

---

## ✅ SOLUTION 2: Use Email Login (RECOMMENDED)

Phone OTP doesn't work well on mobile because:
- OTP shows in server terminal (you can't see it)
- Email isn't configured yet

**Use Email Login instead:**
1. Open app
2. Click "Use Email Instead"
3. Enter: `abebemesfin53@gmail.com`
4. Password: `admin123`
5. Done! ✅

---

## ✅ SOLUTION 3: Configure Email OTP (For Phone Login)

To make phone OTP work:

1. **Get Gmail App Password:**
   - Go to: https://myaccount.google.com/apppasswords
   - Sign in with: `abebemesfin53@gmail.com`
   - Create "App Password" for "Mail"
   - Copy the 16-character password

2. **Add to Render:**
   - Go to: https://dashboard.render.com
   - Open your "thazema" service
   - Go to "Environment" tab
   - Add variable:
     - Key: `GMAIL_APP_PASSWORD`
     - Value: (paste the 16-char password)
   - Click "Save Changes"
   - Server will restart automatically

3. **Now phone OTP will work:**
   - OTP will be sent to your email
   - Check email for 6-digit code
   - Enter code in app

---

## 🎯 BEST PRACTICE

**For daily use:**
1. Wake server first (visit health URL)
2. Use email login (faster, more reliable)
3. Configure Gmail App Password later for phone OTP

---

## 📱 Server Status

- **Production URL**: https://thazema.onrender.com
- **Health Check**: https://thazema.onrender.com/api/health
- **Status**: Server sleeps after 15 min (free tier)
- **Wake Time**: 10-20 seconds

---

## 🔧 Troubleshooting

### "Login failed" error:
1. Wake server first (visit health URL)
2. Wait 20 seconds
3. Try login again

### "Connection failed":
1. Check internet connection
2. Visit health URL in Chrome
3. Wait for response
4. Try app again

### Phone OTP not working:
1. Use email login instead
2. Or configure Gmail App Password

---

## 📞 Admin Contact

**Abebe Mesfin**
- Phone: +251 914 319 514
- Email: abebemesfin53@gmail.com
- Password: admin123

---

## ⚡ Quick Commands

```bash
# Test server (on computer)
curl https://thazema.onrender.com/api/health

# Test login (on computer)
curl -X POST https://thazema.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"abebemesfin53@gmail.com","password":"admin123"}'
```

---

**Last Updated**: December 27, 2024
