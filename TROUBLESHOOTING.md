# 🔧 Thazema Troubleshooting Guide

## ❌ Common Errors and Solutions

### "Failed to send OTP"

**Cause**: The application is trying to run but Node.js is not installed.

**Solution**:
1. **Install Node.js first**:
   - Go to: https://nodejs.org/
   - Download LTS version
   - Install and restart computer

2. **Install MongoDB**:
   - Go to: https://www.mongodb.com/try/download/community
   - Install with "Complete" option

3. **Then run the application**:
   ```bash
   npm run db:seed
   npm run dev
   ```

### "'npm' is not recognized"

**Cause**: Node.js is not installed or not in PATH.

**Solution**:
1. Install Node.js from nodejs.org
2. Restart your computer
3. Open a NEW terminal/command prompt
4. Try again

### "MongoDB connection failed"

**Cause**: MongoDB service is not running.

**Solution**:
```bash
# Start MongoDB service
net start MongoDB

# Or check if it's running
net start | findstr MongoDB
```

### "Port 3000 already in use"

**Cause**: Another application is using port 3000.

**Solution**:
```bash
# Kill process on port 3000
netstat -ano | findstr :3000
taskkill /PID <PID_NUMBER> /F
```

### "Cannot connect to server"

**Cause**: Backend server is not running.

**Solution**:
1. Make sure you ran `npm run dev` (starts both frontend and backend)
2. Or run backend separately: `npm run server`

## 📱 Phone Authentication Issues

### OTP Not Received

**In Development Mode**:
- OTP is displayed in the server console
- Check the terminal where you ran `npm run dev`
- Look for: `📱 OTP for +251XXXXXXXXX: 123456`

**For Production**:
- Integrate with SMS service (Twilio, AWS SNS)
- Update `/api/auth/send-otp` endpoint

### Invalid Phone Format

**Correct Format**: +251XXXXXXXXX
**Examples**:
- +251914319514 ✅
- +251 914 319 514 ✅
- 0914319514 ❌ (will be auto-converted)
- 914319514 ❌ (will be auto-converted)

### OTP Expired

**Cause**: OTP expires after 5 minutes.

**Solution**:
1. Request new OTP
2. Enter within 5 minutes

## 🗄️ Database Issues

### "Collection doesn't exist"

**Solution**:
```bash
npm run db:setup
npm run db:seed
```

### "Duplicate key error"

**Solution**:
```bash
npm run db:clear
npm run db:seed
```

### "No users found"

**Solution**:
```bash
npm run db:seed
```

## 🌐 Network Issues

### "Network Error" / "CORS Error"

**Cause**: Frontend can't connect to backend.

**Solution**:
1. Make sure backend is running on port 5000
2. Check `.env` file:
   ```env
   PORT=5000
   CLIENT_URL=http://localhost:3000
   ```

### "Failed to fetch"

**Cause**: Backend server not responding.

**Solution**:
1. Check if server is running: http://localhost:5000/api/health
2. Restart the server: `npm run server`

## 🔐 Authentication Issues

### "Invalid credentials"

**For Email Login**:
- Email: abebemesfin53@gmail.com
- Password: admin123

**For Phone Login**:
- Phone: +251914319514
- OTP: Check server console

### "Token expired"

**Solution**:
1. Logout and login again
2. Clear browser storage:
   - Press F12
   - Go to Application tab
   - Clear Local Storage

## 🎨 UI Issues

### "Components not loading"

**Solution**:
```bash
cd client
npm install
npm start
```

### "Styles not applied"

**Solution**:
1. Clear browser cache (Ctrl+F5)
2. Check if CSS files are loading in Network tab

## 📱 Mobile Issues

### "Bottom navigation not showing"

**Cause**: CSS not loaded or viewport issue.

**Solution**:
1. Add to HTML head:
   ```html
   <meta name="viewport" content="width=device-width, initial-scale=1">
   ```
2. Clear browser cache

### "Touch events not working"

**Solution**:
1. Use Chrome DevTools mobile emulation
2. Test on actual mobile device

## 🔍 Debugging Steps

### 1. Check Server Status
```bash
# Test server health
curl http://localhost:5000/api/health

# Or open in browser
http://localhost:5000/api/health
```

### 2. Check Database Connection
```bash
npm run db:check
```

### 3. View Server Logs
- Look at terminal where you ran `npm run dev`
- Check for error messages
- OTP codes are displayed here

### 4. Check Browser Console
- Press F12
- Go to Console tab
- Look for JavaScript errors

### 5. Network Tab
- Press F12
- Go to Network tab
- Check if API calls are successful (200 status)

## 📞 Get Help

### Self-Help Resources
1. **README.md** - Basic setup
2. **INSTALLATION_GUIDE.md** - Detailed installation
3. **ENHANCED_FEATURES.md** - New features guide
4. **DATABASE_SETUP.md** - Database configuration

### Contact Administrator
**Name**: Abebe Mesfin  
**Phone**: +251 914 319 514  
**Email**: abebemesfin53@gmail.com

### Common Commands Reference
```bash
# Installation
npm run install-all

# Database
npm run db:check      # Test connection
npm run db:setup      # Create indexes
npm run db:seed       # Add sample data
npm run db:clear      # Delete all data

# Running
npm run dev           # Start both frontend and backend
npm run server        # Backend only
npm run client        # Frontend only

# Debugging
node --version        # Check Node.js
npm --version         # Check npm
mongod --version      # Check MongoDB
```

## 🚀 Quick Fix Checklist

- [ ] Node.js installed (v14+)
- [ ] MongoDB installed and running
- [ ] Dependencies installed (`npm install`)
- [ ] Database seeded (`npm run db:seed`)
- [ ] Server running (`npm run dev`)
- [ ] Browser at http://localhost:3000
- [ ] No console errors
- [ ] Network requests successful

## 🎯 Test Login Credentials

### Email Login
- **Email**: abebemesfin53@gmail.com
- **Password**: admin123

### Phone Login
- **Phone**: +251914319514
- **OTP**: Check server console output

### Other Test Users
All with password `password123`:
- john@example.com
- jane@example.com
- mike@example.com
- sarah@example.com

If you're still having issues after following this guide, contact the administrator for personalized support!