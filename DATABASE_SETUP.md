# Thazema Database Setup Guide

## 📋 Table of Contents
1. [Local MongoDB Setup](#local-mongodb-setup)
2. [MongoDB Atlas Setup](#mongodb-atlas-setup)
3. [Database Scripts](#database-scripts)
4. [Database Schema](#database-schema)
5. [Troubleshooting](#troubleshooting)

---

## 🖥️ Local MongoDB Setup

### Windows Installation

1. **Download MongoDB**
   - Visit: https://www.mongodb.com/try/download/community
   - Select Windows version
   - Download and run the installer

2. **Install MongoDB**
   ```
   - Choose "Complete" installation
   - Install MongoDB as a Service
   - Install MongoDB Compass (GUI tool)
   ```

3. **Verify Installation**
   ```bash
   mongod --version
   ```

4. **Start MongoDB Service**
   ```bash
   net start MongoDB
   ```

5. **Connect to MongoDB**
   ```bash
   mongosh
   ```

### Create Database

```bash
# In mongosh
use thazema
db.createCollection("users")
db.createCollection("calls")
```

---

## ☁️ MongoDB Atlas Setup (Cloud Database)

### Step 1: Create Account
1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up for free account
3. Create a new cluster (Free tier available)

### Step 2: Configure Cluster
1. Choose cloud provider (AWS recommended)
2. Select region closest to you
3. Choose M0 Sandbox (Free tier)
4. Click "Create Cluster"

### Step 3: Create Database User
1. Go to "Database Access"
2. Click "Add New Database User"
3. Choose authentication method: Password
4. Username: `thazema_admin`
5. Password: Generate secure password
6. User Privileges: Read and write to any database
7. Click "Add User"

### Step 4: Whitelist IP Address
1. Go to "Network Access"
2. Click "Add IP Address"
3. For development: Click "Allow Access from Anywhere" (0.0.0.0/0)
4. For production: Add specific IP addresses

### Step 5: Get Connection String
1. Click "Connect" on your cluster
2. Choose "Connect your application"
3. Copy the connection string
4. Replace `<password>` with your database user password
5. Replace `<dbname>` with `thazema`

Example:
```
mongodb+srv://thazema_admin:<password>@cluster0.xxxxx.mongodb.net/thazema?retryWrites=true&w=majority
```

### Step 6: Update .env File
```env
MONGODB_URI=mongodb+srv://thazema_admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/thazema?retryWrites=true&w=majority
```

---

## 🔧 Database Scripts

### Setup Database (Create Indexes)
```bash
npm run db:setup
```

This script:
- Creates all necessary indexes
- Sets up geospatial index for location queries
- Displays database statistics

### Seed Database (Add Sample Data)
```bash
npm run db:seed
```

This script:
- Clears existing data
- Creates 8 sample users
- Creates sample call history
- Displays login credentials

**Sample Users Created:**
- Username: `abebe` | Email: `abebemesfin53@gmail.com` | Password: `admin123`
- Username: `john_doe` | Email: `john@example.com` | Password: `password123`
- Username: `jane_smith` | Email: `jane@example.com` | Password: `password123`
- And 5 more users...

### Clear Database (Delete All Data)
```bash
npm run db:clear
```

⚠️ **Warning**: This deletes ALL data! Use with caution.

### Add Scripts to package.json
```json
{
  "scripts": {
    "db:setup": "node server/scripts/setupDatabase.js",
    "db:seed": "node server/scripts/seedDatabase.js",
    "db:clear": "node server/scripts/clearDatabase.js"
  }
}
```

---

## 📊 Database Schema

### Users Collection

```javascript
{
  _id: ObjectId,
  username: String (unique, required),
  email: String (unique, required),
  password: String (hashed, required),
  avatar: String,
  status: String (enum: ['online', 'offline', 'busy', 'away']),
  contacts: [ObjectId],
  socketId: String,
  location: {
    type: 'Point',
    coordinates: [longitude, latitude]
  },
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
- `email` (unique)
- `username` (unique)
- `location` (2dsphere - for geospatial queries)
- `status`

### Calls Collection

```javascript
{
  _id: ObjectId,
  caller: ObjectId (ref: User),
  receiver: ObjectId (ref: User),
  type: String (enum: ['audio', 'video']),
  status: String (enum: ['missed', 'received', 'rejected', 'completed']),
  duration: Number (seconds),
  startTime: Date,
  endTime: Date,
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
- `caller` + `createdAt` (compound)
- `receiver` + `createdAt` (compound)
- `status`
- `createdAt`

---

## 🔍 Database Queries Examples

### Find Users Near Location
```javascript
db.users.find({
  location: {
    $near: {
      $geometry: {
        type: "Point",
        coordinates: [38.7469, 9.0320]
      },
      $maxDistance: 50000 // 50km in meters
    }
  }
})
```

### Get User's Call History
```javascript
db.calls.find({
  $or: [
    { caller: userId },
    { receiver: userId }
  ]
}).sort({ createdAt: -1 })
```

### Find Online Users
```javascript
db.users.find({ status: 'online' })
```

---

## 🐛 Troubleshooting

### Connection Issues

**Error: "MongoServerError: Authentication failed"**
- Check username and password in connection string
- Verify database user has correct permissions
- Ensure password is URL-encoded (special characters)

**Error: "MongooseServerSelectionError: connect ECONNREFUSED"**
- MongoDB service not running
- Start MongoDB: `net start MongoDB` (Windows)
- Check if MongoDB is listening on port 27017

**Error: "IP not whitelisted"**
- Add your IP to MongoDB Atlas Network Access
- Or allow access from anywhere (0.0.0.0/0) for development

### Index Issues

**Duplicate Key Error**
- Clear existing data: `npm run db:clear`
- Drop indexes: `db.users.dropIndexes()`
- Re-run setup: `npm run db:setup`

### Performance Issues

**Slow Queries**
- Check if indexes are created: `db.users.getIndexes()`
- Use `.explain()` to analyze queries
- Consider adding more indexes for frequent queries

### Data Issues

**Location Not Working**
- Ensure geospatial index exists: `db.users.getIndexes()`
- Verify coordinates format: [longitude, latitude]
- Check coordinates are valid numbers

---

## 📈 Monitoring

### MongoDB Compass (GUI)
- Download: https://www.mongodb.com/products/compass
- Connect using connection string
- View collections, documents, and indexes
- Run queries visually

### MongoDB Atlas Dashboard
- Real-time metrics
- Query performance
- Storage usage
- Connection monitoring

### Useful Commands

```bash
# Show all databases
show dbs

# Use thazema database
use thazema

# Show collections
show collections

# Count documents
db.users.countDocuments()
db.calls.countDocuments()

# View indexes
db.users.getIndexes()

# Database stats
db.stats()

# Collection stats
db.users.stats()
```

---

## 🔐 Security Best Practices

1. **Never commit .env file**
   - Add to .gitignore
   - Use .env.example for template

2. **Use strong passwords**
   - Minimum 12 characters
   - Mix of letters, numbers, symbols

3. **Restrict IP access**
   - Production: Whitelist specific IPs
   - Development: Can use 0.0.0.0/0

4. **Regular backups**
   - MongoDB Atlas: Automatic backups
   - Local: Use `mongodump`

5. **Monitor access logs**
   - Check for suspicious activity
   - Review connection attempts

---

## 📞 Support

For database setup issues, contact:

**Administrator**: Abebe  
**Email**: abebemesfin53@gmail.com  
**Phone**: +251 914 319 513

---

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Setup environment
cp .env.example .env
# Edit .env with your MongoDB URI

# 3. Setup database
npm run db:setup

# 4. Seed with sample data
npm run db:seed

# 5. Start the server
npm run dev
```

Your database is now ready! 🎉
