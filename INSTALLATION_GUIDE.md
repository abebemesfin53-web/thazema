# 📦 Thazema Installation Guide for Windows

## Step 1: Install Node.js

### Download Node.js
1. Visit: https://nodejs.org/
2. Download the **LTS version** (recommended for most users)
3. Run the installer (.msi file)

### Installation Steps
1. Click "Next" on the welcome screen
2. Accept the license agreement
3. Choose installation location (default is fine)
4. **Important**: Make sure "Add to PATH" is checked
5. Click "Install"
6. Wait for installation to complete
7. Click "Finish"

### Verify Installation
Open a **new** Command Prompt or PowerShell and run:
```bash
node --version
npm --version
```

You should see version numbers like:
```
v18.17.0
9.6.7
```

## Step 2: Install MongoDB

### Option A: Local MongoDB (Recommended for Development)

#### Download MongoDB
1. Visit: https://www.mongodb.com/try/download/community
2. Select:
   - Version: Latest (7.0 or higher)
   - Platform: Windows
   - Package: MSI
3. Click "Download"

#### Install MongoDB
1. Run the downloaded .msi file
2. Choose "Complete" installation
3. **Important**: Check "Install MongoDB as a Service"
4. **Important**: Check "Install MongoDB Compass" (GUI tool)
5. Click "Install"
6. Wait for installation to complete

#### Verify MongoDB Installation
Open Command Prompt and run:
```bash
mongod --version
```

#### Start MongoDB Service
```bash
net start MongoDB
```

### Option B: MongoDB Atlas (Cloud - No Installation)

1. Go to: https://www.mongodb.com/cloud/atlas
2. Sign up for free account
3. Create a free cluster (M0 Sandbox)
4. Create database user
5. Whitelist IP: 0.0.0.0/0 (for development)
6. Get connection string
7. Update `.env` file with your connection string

## Step 3: Install Thazema

### Open PowerShell or Command Prompt
Navigate to your project folder:
```bash
cd "C:\Users\Hp\websyit project"
```

### Install Dependencies
```bash
npm install
cd client
npm install
cd ..
```

### Setup Environment
The `.env` file is already created. If using MongoDB Atlas, update it:
```env
MONGODB_URI=your_atlas_connection_string_here
```

### Setup Database
```bash
npm run db:check
npm run db:setup
npm run db:seed
```

### Start Application
```bash
npm run dev
```

## Step 4: Access Application

- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## 🎯 Login Credentials

**Admin Account:**
- Email: `abebemesfin53@gmail.com`
- Password: `admin123`

**Test Accounts:**
- Email: `john@example.com` | Password: `password123`
- Email: `jane@example.com` | Password: `password123`

## 🔧 Troubleshooting

### "npm is not recognized"
- Node.js not installed or not in PATH
- Restart your terminal after installing Node.js
- Reinstall Node.js and ensure "Add to PATH" is checked

### "MongoDB connection failed"
- MongoDB service not running: `net start MongoDB`
- Check connection string in `.env` file
- For Atlas: Verify IP whitelist and credentials

### "Port 3000 already in use"
- Another app is using the port
- Stop the other app or change port in client/package.json

### "Port 5000 already in use"
- Change PORT in `.env` file to 5001 or another port

## 📞 Need Help?

**Administrator:** Abebe  
**Email:** abebemesfin53@gmail.com  
**Phone:** +251 914 319 513

## 🎬 Quick Video Tutorial

### Installing Node.js
1. Download from nodejs.org
2. Run installer
3. Click Next → Next → Install
4. Restart terminal

### Installing MongoDB
1. Download from mongodb.com
2. Run installer
3. Choose Complete installation
4. Install as Service
5. Start service: `net start MongoDB`

### Running Thazema
1. Open terminal in project folder
2. Run: `npm install`
3. Run: `cd client && npm install && cd ..`
4. Run: `npm run db:setup`
5. Run: `npm run db:seed`
6. Run: `npm run dev`
7. Open browser: http://localhost:3000

## ✅ Checklist

- [ ] Node.js installed (v14 or higher)
- [ ] npm working (comes with Node.js)
- [ ] MongoDB installed and running
- [ ] Project dependencies installed
- [ ] Database setup complete
- [ ] Sample data seeded
- [ ] Application running
- [ ] Can access http://localhost:3000
- [ ] Can login with test credentials

## 🚀 After Installation

Once everything is running:

1. **Register a new account** or use test credentials
2. **Grant location permission** to use nearby users feature
3. **Test video/audio calls** with other users
4. **Explore features** in the dashboard

## 📚 Additional Resources

- Node.js Documentation: https://nodejs.org/docs
- MongoDB Documentation: https://docs.mongodb.com
- React Documentation: https://react.dev
- WebRTC Guide: https://webrtc.org/getting-started

## 🎨 Project Structure

```
thazema/
├── client/              # React frontend
│   ├── src/
│   │   ├── components/  # UI components
│   │   ├── pages/       # Page components
│   │   ├── context/     # React context
│   │   └── styles/      # CSS files
│   └── package.json
├── server/              # Node.js backend
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   ├── socket/          # Socket.io handlers
│   ├── scripts/         # Database scripts
│   └── config/          # Configuration
├── .env                 # Environment variables
└── package.json         # Server dependencies
```

## 🔐 Security Notes

- Change JWT_SECRET in `.env` for production
- Use strong passwords for database users
- Enable HTTPS for production deployment
- Restrict MongoDB IP whitelist in production
- Never commit `.env` file to version control

## 🌟 Features to Try

1. **Video Calls** - Click video icon on any user
2. **Audio Calls** - Click phone icon on any user
3. **Nearby Users** - Switch to "Nearby Users" tab
4. **Call Controls** - Mute, video toggle, end call
5. **User Status** - See who's online/offline
6. **Call History** - View past calls (coming soon)

Enjoy using Thazema! 🎉
