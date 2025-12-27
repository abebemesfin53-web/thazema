const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('../models/User');
const Call = require('../models/Call');

// Sample users data
const users = [
  {
    username: 'abebe_admin',
    email: 'abebemesfin53@gmail.com',
    phone: '+251914319514',
    password: 'admin123',
    status: 'online',
    about: 'Administrator - Thazema Support',
    isVerified: true,
    location: {
      type: 'Point',
      coordinates: [38.7469, 9.0320] // Addis Ababa, Ethiopia
    }
  },
  {
    username: 'john_doe',
    email: 'john@example.com',
    phone: '+251911234567',
    password: 'password123',
    status: 'online',
    about: 'Software Developer',
    location: {
      type: 'Point',
      coordinates: [38.7500, 9.0350]
    }
  },
  {
    username: 'jane_smith',
    email: 'jane@example.com',
    phone: '+251922345678',
    password: 'password123',
    status: 'offline',
    about: 'UI/UX Designer',
    location: {
      type: 'Point',
      coordinates: [38.7400, 9.0280]
    }
  },
  {
    username: 'mike_wilson',
    email: 'mike@example.com',
    phone: '+251933456789',
    password: 'password123',
    status: 'online',
    about: 'Project Manager',
    location: {
      type: 'Point',
      coordinates: [38.7550, 9.0400]
    }
  },
  {
    username: 'sarah_jones',
    email: 'sarah@example.com',
    phone: '+251944567890',
    password: 'password123',
    status: 'busy',
    about: 'Marketing Specialist',
    location: {
      type: 'Point',
      coordinates: [38.7380, 9.0250]
    }
  },
  {
    username: 'david_brown',
    email: 'david@example.com',
    phone: '+251955678901',
    password: 'password123',
    status: 'away',
    about: 'Business Analyst',
    location: {
      type: 'Point',
      coordinates: [38.7600, 9.0450]
    }
  },
  {
    username: 'emma_davis',
    email: 'emma@example.com',
    phone: '+251966789012',
    password: 'password123',
    status: 'online',
    about: 'Content Creator',
    location: {
      type: 'Point',
      coordinates: [38.7420, 9.0300]
    }
  },
  {
    username: 'alex_miller',
    email: 'alex@example.com',
    phone: '+251977890123',
    password: 'password123',
    status: 'offline',
    about: 'Graphic Designer',
    location: {
      type: 'Point',
      coordinates: [38.7480, 9.0330]
    }
  }
];

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Call.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Hash passwords and create users
    const hashedUsers = await Promise.all(
      users.map(async (user) => {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        return {
          ...user,
          password: hashedPassword
        };
      })
    );

    // Insert users
    const createdUsers = await User.insertMany(hashedUsers);
    console.log(`✅ Created ${createdUsers.length} users`);

    // Create some sample call history
    const sampleCalls = [
      {
        caller: createdUsers[0]._id,
        receiver: createdUsers[1]._id,
        type: 'video',
        status: 'completed',
        duration: 320,
        startTime: new Date(Date.now() - 3600000),
        endTime: new Date(Date.now() - 3280000)
      },
      {
        caller: createdUsers[1]._id,
        receiver: createdUsers[0]._id,
        type: 'audio',
        status: 'completed',
        duration: 180,
        startTime: new Date(Date.now() - 7200000),
        endTime: new Date(Date.now() - 7020000)
      },
      {
        caller: createdUsers[2]._id,
        receiver: createdUsers[0]._id,
        type: 'video',
        status: 'missed',
        startTime: new Date(Date.now() - 10800000)
      },
      {
        caller: createdUsers[0]._id,
        receiver: createdUsers[3]._id,
        type: 'audio',
        status: 'rejected',
        startTime: new Date(Date.now() - 14400000)
      }
    ];

    await Call.insertMany(sampleCalls);
    console.log(`✅ Created ${sampleCalls.length} sample calls`);

    console.log('\n📊 Database seeded successfully!');
    console.log('\n👤 Sample Users:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    users.forEach(user => {
      console.log(`   Username: ${user.username}`);
      console.log(`   Email: ${user.email || 'N/A'}`);
      console.log(`   Phone: ${user.phone || 'N/A'}`);
      console.log(`   Password: ${user.password}`);
      console.log(`   Status: ${user.status}`);
      console.log(`   About: ${user.about || 'N/A'}`);
      console.log('   ─────────────────────────────────────');
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
