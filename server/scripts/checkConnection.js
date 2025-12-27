const mongoose = require('mongoose');
require('dotenv').config();

const checkConnection = async () => {
  try {
    console.log('🔍 Testing MongoDB connection...\n');
    console.log(`📍 Connection URI: ${process.env.MONGODB_URI.replace(/\/\/([^:]+):([^@]+)@/, '//$1:****@')}`);
    
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000
    });

    console.log('\n✅ MongoDB connection successful!');
    console.log(`📊 Database: ${mongoose.connection.name}`);
    console.log(`🖥️  Host: ${mongoose.connection.host}`);
    console.log(`🔌 Port: ${mongoose.connection.port}`);
    
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log(`\n📁 Collections (${collections.length}):`);
    collections.forEach(col => {
      console.log(`   - ${col.name}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('\n❌ MongoDB connection failed!');
    console.error(`Error: ${error.message}\n`);
    
    console.log('💡 Troubleshooting tips:');
    console.log('   1. Check if MongoDB is running: net start MongoDB');
    console.log('   2. Verify connection string in .env file');
    console.log('   3. Check if port 27017 is available');
    console.log('   4. For Atlas: Check IP whitelist and credentials\n');
    
    process.exit(1);
  }
};

checkConnection();
