# 🚀 Thazema Quick Start Guide

## Prerequisites
- Node.js (v14+)
- MongoDB (local or Atlas account)
- npm or yarn

## Installation Steps

### 1. Install Dependencies
```bash
npm run install-all
```

### 2. Database Setup

#### Option A: Local MongoDB
```bash
# Start MongoDB service
net start MongoDB

# Setup database and indexes
npm run db:setup

# Add sample data
npm run db:seed
```

#### Option B: MongoDB Atlas (Cloud)
1. Create free account at mongodb.com/cloud/atlas
2. Create cluster and get connection string
3. Update `.env` file with your connection string

### 3. Environment Configuration
The `.env` file is already created with default settings:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/thazema
JWT_SECRET=thazema_secret_key_change_in_production_2024
NODE_ENV=development
CLIENT_URL=http://localhost:3000
```

### 4. Start Application
```bash
npm run dev
```

This starts:
- Backend server on http://localhost:5000
- React frontend on http://localhost:3000

## 🎯 Test Login

After seeding the database, use these credentials:

**Admin Account:**
- Email: `abebemesfin53@gmail.com`
- Password: `admin123`

**Test Accounts:**
- Email: `john@example.com` | Password: `password123`
- Email: `jane@example.com` | Password: `password123`

## 📝 Available Scripts

```bash
npm run dev          # Start both server and client
npm run server       # Start backend only
npm run client       # Start frontend only
npm run db:setup     # Create database indexes
npm run db:seed      # Add sample data
npm run db:clear     # Delete all data
```

## 🔧 Troubleshooting

**MongoDB Connection Error:**
- Ensure MongoDB is running: `net start MongoDB`
- Check connection string in `.env`

**Port Already in Use:**
- Change PORT in `.env` file
- Or stop the process using the port

**Module Not Found:**
- Run `npm run install-all` again

## 📚 Documentation

- Full setup: `DATABASE_SETUP.md`
- Features: `FEATURES.md`
- Deployment: `DEPLOYMENT.md`
- Main docs: `README.md`

## 📞 Support

**Administrator:** Abebe  
**Email:** abebemesfin53@gmail.com  
**Phone:** +251 914 319 513
