const mongoose = require('mongoose');
require('dotenv').config();

const User = require('../models/User');
const Call = require('../models/Call');

const setupDatabase = async () => {
  try {
    console.log('🔧 Setting up database...\n');

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log('✅ Connected to MongoDB');

    // Create indexes
    console.log('\n📑 Creating indexes...');

    // User indexes
    await User.collection.createIndex({ email: 1 }, { unique: true });
    await User.collection.createIndex({ username: 1 }, { unique: true });
    await User.collection.createIndex({ location: '2dsphere' });
    await User.collection.createIndex({ status: 1 });
    console.log('✅ User indexes created');

    // Call indexes
    await Call.collection.createIndex({ caller: 1, createdAt: -1 });
    await Call.collection.createIndex({ receiver: 1, createdAt: -1 });
    await Call.collection.createIndex({ status: 1 });
    await Call.collection.createIndex({ createdAt: -1 });
    console.log('✅ Call indexes created');

    // Get collection stats
    const userCount = await User.countDocuments();
    const callCount = await Call.countDocuments();

    console.log('\n📊 Database Statistics:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`   Users: ${userCount}`);
    console.log(`   Calls: ${callCount}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    // List all indexes
    console.log('\n📑 Indexes:');
    const userIndexes = await User.collection.indexes();
    console.log('\n   User Collection:');
    userIndexes.forEach(index => {
      console.log(`   - ${JSON.stringify(index.key)}`);
    });

    const callIndexes = await Call.collection.indexes();
    console.log('\n   Call Collection:');
    callIndexes.forEach(index => {
      console.log(`   - ${JSON.stringify(index.key)}`);
    });

    console.log('\n✅ Database setup complete!\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error setting up database:', error);
    process.exit(1);
  }
};

setupDatabase();
