const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 8080;

// Very permissive CORS for mobile testing
app.use(cors({
  origin: '*',
  methods: '*',
  allowedHeaders: '*',
  credentials: false
}));

app.use(express.json());

// Simple health check
app.get('/api/health', (req, res) => {
  console.log('📱 Health check from:', req.ip, req.get('User-Agent'));
  res.json({ 
    status: 'ok', 
    message: 'Simple server working!',
    port: PORT,
    timestamp: new Date().toISOString()
  });
});

// Test endpoint
app.get('/api/test', (req, res) => {
  console.log('📱 Test request from:', req.ip);
  res.json({ 
    message: 'Mobile connection successful!',
    server: 'Simple Test Server',
    timestamp: new Date().toISOString()
  });
});

// Test login
app.post('/api/auth/test-login', (req, res) => {
  console.log('🔐 Test login from:', req.ip, req.body);
  res.json({
    success: true,
    message: 'Login test successful!',
    user: { id: 1, name: 'Test User' }
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Simple server running on port ${PORT}`);
  console.log(`📱 Test URL: http://10.14.28.123:${PORT}/api/health`);
});