const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 8080;

// Enable CORS for all origins
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Test endpoint
app.get('/api/test', (req, res) => {
  console.log('📱 Mobile test request received!');
  res.json({ 
    message: 'Server connection successful!',
    timestamp: new Date().toISOString(),
    server: 'Thazema Test Server',
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });
});

// Health check
app.get('/api/health', (req, res) => {
  console.log('🏥 Health check from:', req.ip);
  res.json({ 
    status: 'ok', 
    message: 'Thazema server is running',
    port: PORT,
    timestamp: new Date().toISOString()
  });
});

// Simple auth test
app.post('/api/auth/test-login', (req, res) => {
  console.log('🔐 Test login attempt:', req.body);
  res.json({
    success: true,
    message: 'Test login successful!',
    user: { id: 1, name: 'Test User' },
    token: 'test-token-123'
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Test server running on port ${PORT}`);
  console.log(`📱 Mobile should connect to: http://10.14.28.123:${PORT}`);
  console.log(`🌐 Test in browser: http://localhost:${PORT}/api/health`);
});

// Log all requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} from ${req.ip}`);
  next();
});