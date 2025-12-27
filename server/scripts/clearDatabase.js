const mongoose = require('mongoose');
const readline = require('readline');
require('dotenv').config();

const User = require('../models/User');
const Call = require('../models/Call');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const clearDatabase = async () => {
  try {
    console.log('⚠️  WARNING: This will delete ALL data from the database!\n');

    rl.question('Are you sure you want to continue? (yes/no): ', async (answer) => {
      if (answer.toLowerCase() !== 'yes') {
        console.log('❌ Operation cancelled');
        process.exit(0);
      }

      // Connect to MongoDB
      await mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      });

      console.log('\n✅ Connected to MongoDB');

      // Get counts before deletion
      const userCount = await User.countDocuments();
      const callCount = await Call.countDocuments();

      console.log(`\n📊 Found ${userCount} users and ${callCount} calls`);
      console.log('🗑️  Deleting...\n');

      // Delete all data
      await User.deleteMany({});
      await Call.deleteMany({});

      console.log('✅ All data deleted successfully!');
      console.log(`   - Deleted ${userCount} users`);
      console.log(`   - Deleted ${callCount} calls\n`);

      process.exit(0);
    });
  } catch (error) {
    console.error('❌ Error clearing database:', error);
    process.exit(1);
  }
};

clearDatabase();
