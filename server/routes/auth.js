const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// Simple JWT secret fallback
const JWT_SECRET = process.env.JWT_SECRET || 'thazema-secret-key-2024';

// Test endpoint for connection debugging
router.get('/test', (req, res) => {
  res.json({ 
    message: 'Server connection successful!',
    timestamp: new Date().toISOString(),
    server: 'Thazema Backend'
  });
});

// Simple login for testing (bypasses database for now)
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    console.log('📧 Login attempt:', { email, password });

    // For testing - accept admin credentials
    if (email === 'abebemesfin53@gmail.com' && password === 'admin123') {
      const token = jwt.sign({ 
        userId: 'admin-user-id',
        email: email 
      }, JWT_SECRET, {
        expiresIn: '7d'
      });

      const user = {
        id: 'admin-user-id',
        username: 'Admin',
        email: email,
        phone: '+251914319514',
        avatar: null,
        status: 'online',
        about: 'Thazema Administrator'
      };

      console.log('✅ Admin login successful');
      
      return res.json({
        token,
        user
      });
    }

    // Try database login if available
    try {
      const user = await User.findOne({ email });
      if (user) {
        const isMatch = await user.comparePassword(password);
        if (isMatch) {
          const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
            expiresIn: '7d'
          });

          return res.json({
            token,
            user: {
              id: user._id,
              username: user.username,
              email: user.email,
              phone: user.phone,
              avatar: user.avatar,
              status: user.status,
              about: user.about
            }
          });
        }
      }
    } catch (dbError) {
      console.log('⚠️ Database not available, using fallback auth');
    }

    // Fallback for testing - accept any email with password "test123"
    if (password === 'test123') {
      const token = jwt.sign({ 
        userId: 'test-user-id',
        email: email 
      }, JWT_SECRET, {
        expiresIn: '7d'
      });

      const user = {
        id: 'test-user-id',
        username: email.split('@')[0],
        email: email,
        phone: '+251900000000',
        avatar: null,
        status: 'online',
        about: 'Test User'
      };

      console.log('✅ Test login successful');
      
      return res.json({
        token,
        user
      });
    }

    res.status(401).json({ error: 'Invalid credentials' });
  } catch (error) {
    console.error('❌ Login error:', error);
    res.status(500).json({ error: 'Login failed: ' + error.message });
  }
});

// Register
router.post('/register', async (req, res) => {
  try {
    const { username, email, phone, password } = req.body;

    // Try database registration if available
    try {
      const existingUser = await User.findOne({ 
        $or: [
          { email: email || null }, 
          { phone: phone || null },
          { username }
        ]
      });
      
      if (existingUser) {
        return res.status(400).json({ error: 'User already exists' });
      }

      const user = new User({ username, email, phone, password });
      await user.save();

      const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
        expiresIn: '7d'
      });

      return res.status(201).json({
        token,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          phone: user.phone,
          avatar: user.avatar,
          status: user.status,
          about: user.about
        }
      });
    } catch (dbError) {
      console.log('⚠️ Database not available, using fallback registration');
    }

    // Fallback registration for testing
    const token = jwt.sign({ 
      userId: 'new-user-id',
      email: email 
    }, JWT_SECRET, {
      expiresIn: '7d'
    });

    const user = {
      id: 'new-user-id',
      username: username,
      email: email,
      phone: phone,
      avatar: null,
      status: 'online',
      about: 'New User'
    };

    console.log('✅ Fallback registration successful');
    
    res.status(201).json({
      token,
      user
    });
  } catch (error) {
    console.error('❌ Registration error:', error);
    res.status(500).json({ error: 'Registration failed: ' + error.message });
  }
});

// Send OTP for phone login
router.post('/send-otp', async (req, res) => {
  try {
    const { phone } = req.body;
    
    console.log(`📱 Sending OTP to ${phone}`);
    
    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Store OTP temporarily
    global.otpStore = global.otpStore || {};
    global.otpStore[phone] = {
      otp,
      expires: Date.now() + 5 * 60 * 1000 // 5 minutes
    };
    
    console.log(`💾 OTP stored for ${phone}: ${otp}`);
    
    res.json({ 
      message: 'OTP sent successfully',
      // Show OTP in development for testing
      otp: otp,
      phone: phone
    });
  } catch (error) {
    console.error('❌ Error in send-otp:', error);
    res.status(500).json({ error: error.message });
  }
});

// Verify OTP and login
router.post('/verify-otp', async (req, res) => {
  try {
    const { phone, otp } = req.body;
    
    console.log(`🔍 Verifying OTP for ${phone}: ${otp}`);
    
    const storedOTP = global.otpStore?.[phone];
    if (!storedOTP) {
      return res.status(400).json({ error: 'No OTP found. Please request a new OTP.' });
    }
    
    if (storedOTP.expires < Date.now()) {
      delete global.otpStore[phone];
      return res.status(400).json({ error: 'OTP expired. Please request a new OTP.' });
    }
    
    if (storedOTP.otp !== otp) {
      return res.status(400).json({ error: 'Invalid OTP' });
    }
    
    console.log(`✅ OTP verified successfully for ${phone}`);
    
    // Try to find user in database
    let user = null;
    try {
      user = await User.findOne({ phone });
      if (!user) {
        const username = `user_${phone.replace(/\D/g, '').slice(-4)}`;
        user = new User({
          username,
          phone,
          password: 'temp_password',
          isVerified: true
        });
        await user.save();
      }
    } catch (dbError) {
      console.log('⚠️ Database not available, using fallback user');
      // Fallback user for testing
      user = {
        _id: 'phone-user-id',
        username: `user_${phone.replace(/\D/g, '').slice(-4)}`,
        phone: phone,
        email: null,
        avatar: null,
        status: 'online',
        about: 'Phone User',
        isVerified: true
      };
    }
    
    // Clear OTP
    delete global.otpStore[phone];
    
    const token = jwt.sign({ 
      userId: user._id || user.id,
      phone: phone 
    }, JWT_SECRET, {
      expiresIn: '7d'
    });

    console.log(`🎉 Phone login successful for ${user.username}`);

    res.json({
      token,
      user: {
        id: user._id || user.id,
        username: user.username,
        email: user.email,
        phone: user.phone,
        avatar: user.avatar,
        status: user.status,
        about: user.about,
        isVerified: user.isVerified
      }
    });
  } catch (error) {
    console.error('❌ Error in verify-otp:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get current user
router.get('/me', (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Return user info from token
    const user = {
      id: decoded.userId,
      username: decoded.email ? decoded.email.split('@')[0] : 'User',
      email: decoded.email || null,
      phone: decoded.phone || '+251900000000',
      avatar: null,
      status: 'online',
      about: 'Thazema User'
    };

    res.json({ user });
  } catch (error) {
    console.error('❌ Auth verification error:', error);
    res.status(401).json({ error: 'Invalid token' });
  }
});

module.exports = router;
