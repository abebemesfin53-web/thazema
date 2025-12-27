const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 3004;
const JWT_SECRET = 'thazema-secret-key-2024';

// Middleware
app.use(cors({ origin: '*' }));
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  console.log('🏥 Health check');
  res.json({ 
    status: 'ok', 
    message: 'Simple Thazema server is running',
    port: PORT,
    timestamp: new Date().toISOString()
  });
});

// Login endpoint
app.post('/api/auth/login', (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('📧 Login attempt:', { email, password });

    // Admin credentials
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

    // Test credentials
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

// Send OTP
app.post('/api/auth/send-otp', (req, res) => {
  try {
    const { phone } = req.body;
    console.log(`📱 Sending OTP to ${phone}`);
    
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    global.otpStore = global.otpStore || {};
    global.otpStore[phone] = {
      otp,
      expires: Date.now() + 5 * 60 * 1000
    };
    
    console.log(`💾 OTP stored for ${phone}: ${otp}`);
    
    res.json({ 
      message: 'OTP sent successfully',
      otp: otp,
      phone: phone
    });
  } catch (error) {
    console.error('❌ Error in send-otp:', error);
    res.status(500).json({ error: error.message });
  }
});

// Verify OTP
app.post('/api/auth/verify-otp', (req, res) => {
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
    
    delete global.otpStore[phone];
    
    const token = jwt.sign({ 
      userId: 'phone-user-id',
      phone: phone 
    }, JWT_SECRET, {
      expiresIn: '7d'
    });

    const user = {
      id: 'phone-user-id',
      username: `user_${phone.replace(/\D/g, '').slice(-4)}`,
      email: null,
      phone: phone,
      avatar: null,
      status: 'online',
      about: 'Phone User',
      isVerified: true
    };

    console.log(`🎉 Phone login successful for ${user.username}`);

    res.json({
      token,
      user
    });
  } catch (error) {
    console.error('❌ Error in verify-otp:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get current user
app.get('/api/auth/me', (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, JWT_SECRET);
    
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

app.listen(PORT, () => {
  console.log(`🚀 Simple Thazema server running on port ${PORT}`);
  console.log(`📱 Test URL: http://localhost:${PORT}/api/health`);
  console.log(`🔐 Login URL: http://localhost:${PORT}/api/auth/login`);
  console.log(`\n📋 Test Credentials:`);
  console.log(`   Email: abebemesfin53@gmail.com`);
  console.log(`   Password: admin123`);
  console.log(`   Phone: +251914319514 (with OTP)`);
});