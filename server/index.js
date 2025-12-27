const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'thazema-secret-key-2024';

// Socket.io setup
const io = socketIO(server, {
  cors: { origin: '*', methods: ['GET', 'POST'] }
});

// Middleware
app.use(cors({ origin: '*' }));
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Thazema server is running', port: PORT });
});

// Login
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  console.log('📧 Login:', email);

  if (email === 'abebemesfin53@gmail.com' && password === 'admin123') {
    const token = jwt.sign({ userId: 'admin', email }, JWT_SECRET, { expiresIn: '7d' });
    return res.json({
      token,
      user: { id: 'admin', username: 'Admin', email, phone: '+251914319514', status: 'online' }
    });
  }

  if (password === 'test123') {
    const token = jwt.sign({ userId: 'test', email }, JWT_SECRET, { expiresIn: '7d' });
    return res.json({
      token,
      user: { id: 'test', username: email.split('@')[0], email, phone: '+251900000000', status: 'online' }
    });
  }

  res.status(401).json({ error: 'Invalid credentials' });
});

// Register
app.post('/api/auth/register', (req, res) => {
  const { username, email, password } = req.body;
  const token = jwt.sign({ userId: 'new', email }, JWT_SECRET, { expiresIn: '7d' });
  res.json({
    token,
    user: { id: 'new', username, email, phone: null, status: 'online' }
  });
});

// Send OTP
app.post('/api/auth/send-otp', (req, res) => {
  const { phone } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  global.otpStore = global.otpStore || {};
  global.otpStore[phone] = { otp, expires: Date.now() + 300000 };
  console.log(`📱 OTP for ${phone}: ${otp}`);
  res.json({ message: 'OTP sent', otp, phone });
});

// Verify OTP
app.post('/api/auth/verify-otp', (req, res) => {
  const { phone, otp } = req.body;
  const stored = global.otpStore?.[phone];
  
  if (!stored || stored.otp !== otp) {
    return res.status(400).json({ error: 'Invalid OTP' });
  }
  
  delete global.otpStore[phone];
  const token = jwt.sign({ userId: 'phone', phone }, JWT_SECRET, { expiresIn: '7d' });
  res.json({
    token,
    user: { id: 'phone', username: `user_${phone.slice(-4)}`, phone, status: 'online' }
  });
});

// Get user
app.get('/api/auth/me', (req, res) => {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: 'No token' });
  
  try {
    const decoded = jwt.verify(auth.replace('Bearer ', ''), JWT_SECRET);
    res.json({ user: { id: decoded.userId, username: 'User', email: decoded.email, status: 'online' } });
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
});

// Users
app.get('/api/users', (req, res) => {
  res.json({ users: [
    { id: '1', username: 'John', phone: '+251911111111', status: 'online' },
    { id: '2', username: 'Jane', phone: '+251922222222', status: 'offline' }
  ]});
});

app.get('/api/users/nearby', (req, res) => {
  res.json({ users: [
    { id: '3', username: 'Nearby User', phone: '+251933333333', distance: 2.5 }
  ]});
});

// Calls
app.get('/api/calls/history', (req, res) => {
  res.json({ calls: [] });
});

// ============ ADMIN API ROUTES ============

// In-memory storage for demo
const adminData = {
  users: [
    { id: '1', username: 'Abebe', phone: '+251911111111', status: 'online', isActive: true, joinDate: '2024-12-01' },
    { id: '2', username: 'Kebede', phone: '+251922222222', status: 'offline', isActive: true, joinDate: '2024-12-10' },
    { id: '3', username: 'Sara', phone: '+251933333333', status: 'online', isActive: false, joinDate: '2024-12-15' },
    { id: '4', username: 'Meron', phone: '+251944444444', status: 'away', isActive: true, joinDate: '2024-12-20' },
  ],
  analytics: {
    totalUsers: 156,
    activeUsers: 89,
    totalCalls: 1234,
    totalMessages: 5678,
    newUsersToday: 12,
    callsToday: 45,
    messagestoday: 234
  },
  notifications: []
};

// Admin middleware - check if admin
const isAdmin = (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const decoded = jwt.verify(auth.replace('Bearer ', ''), JWT_SECRET);
    if (decoded.email === 'abebemesfin53@gmail.com' || decoded.userId === 'admin') {
      next();
    } else {
      res.status(403).json({ error: 'Admin access required' });
    }
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Get all users
app.get('/api/admin/users', (req, res) => {
  res.json({ users: adminData.users });
});

// Block/unblock user
app.post('/api/admin/users/:id/block', isAdmin, (req, res) => {
  const user = adminData.users.find(u => u.id === req.params.id);
  if (user) {
    user.isActive = !user.isActive;
    res.json({ success: true, user });
  } else {
    res.status(404).json({ error: 'User not found' });
  }
});

// Delete user
app.delete('/api/admin/users/:id', isAdmin, (req, res) => {
  const index = adminData.users.findIndex(u => u.id === req.params.id);
  if (index !== -1) {
    adminData.users.splice(index, 1);
    res.json({ success: true });
  } else {
    res.status(404).json({ error: 'User not found' });
  }
});

// Get analytics
app.get('/api/admin/analytics', (req, res) => {
  res.json(adminData.analytics);
});

// Send notification
app.post('/api/admin/notifications', isAdmin, (req, res) => {
  const { message } = req.body;
  const notification = {
    id: Date.now().toString(),
    message,
    sentAt: new Date().toISOString(),
    reach: adminData.analytics.totalUsers
  };
  adminData.notifications.push(notification);
  
  // Broadcast to all connected sockets
  io.emit('notification', { message, from: 'Admin' });
  
  console.log('📢 Admin notification sent:', message);
  res.json({ success: true, notification });
});

// Get notification history
app.get('/api/admin/notifications', (req, res) => {
  res.json({ notifications: adminData.notifications });
});

// Update settings
app.post('/api/admin/settings', isAdmin, (req, res) => {
  console.log('⚙️ Settings updated:', req.body);
  res.json({ success: true, message: 'Settings saved' });
});

// ============ END ADMIN ROUTES ============

// ============ AI TTS & SMART FEATURES ============

// Text-to-Speech API (supports Amharic via Google Cloud TTS)
app.post('/api/ai/tts', async (req, res) => {
  const { text, language = 'en-US', gender = 'FEMALE' } = req.body;
  
  // Language code mapping for Google TTS
  const langMap = {
    'am': 'am-ET', 'en': 'en-US', 'ar': 'ar-XA', 'fr': 'fr-FR',
    'es': 'es-ES', 'zh': 'cmn-CN', 'hi': 'hi-IN', 'pt': 'pt-BR',
    'ru': 'ru-RU', 'ja': 'ja-JP'
  };
  
  const googleApiKey = process.env.GOOGLE_TTS_API_KEY;
  
  if (!googleApiKey) {
    // Return info that client should use browser TTS
    return res.json({ useBrowserTTS: true, message: 'No Google TTS API key configured' });
  }
  
  try {
    const axios = require('axios');
    const langCode = langMap[language] || language;
    
    const response = await axios.post(
      `https://texttospeech.googleapis.com/v1/text:synthesize?key=${googleApiKey}`,
      {
        input: { text },
        voice: {
          languageCode: langCode,
          ssmlGender: gender
        },
        audioConfig: { audioEncoding: 'MP3' }
      }
    );
    
    res.json({ 
      audioContent: response.data.audioContent,
      format: 'mp3'
    });
  } catch (error) {
    console.error('TTS Error:', error.message);
    res.json({ useBrowserTTS: true, error: error.message });
  }
});

// Weather API (free - wttr.in)
app.get('/api/ai/weather', async (req, res) => {
  const { city = 'Addis Ababa' } = req.query;
  try {
    const axios = require('axios');
    const response = await axios.get(`https://wttr.in/${encodeURIComponent(city)}?format=j1`, { timeout: 5000 });
    const data = response.data;
    const current = data.current_condition[0];
    res.json({
      city,
      temp: current.temp_C,
      feels: current.FeelsLikeC,
      humidity: current.humidity,
      description: current.weatherDesc[0].value,
      wind: current.windspeedKmph
    });
  } catch (error) {
    res.json({ error: 'Weather service unavailable', city });
  }
});

// Translation API (free - LibreTranslate alternative using MyMemory)
app.post('/api/ai/translate', async (req, res) => {
  const { text, from = 'en', to = 'am' } = req.body;
  try {
    const axios = require('axios');
    const response = await axios.get(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${from}|${to}`,
      { timeout: 5000 }
    );
    res.json({
      original: text,
      translated: response.data.responseData.translatedText,
      from, to
    });
  } catch (error) {
    res.json({ error: 'Translation service unavailable', original: text });
  }
});

// Jokes API
app.get('/api/ai/joke', async (req, res) => {
  try {
    const axios = require('axios');
    const response = await axios.get('https://official-joke-api.appspot.com/random_joke', { timeout: 5000 });
    res.json({ setup: response.data.setup, punchline: response.data.punchline });
  } catch {
    const jokes = [
      { setup: "Why do programmers prefer dark mode?", punchline: "Because light attracts bugs!" },
      { setup: "Why did the developer go broke?", punchline: "Because he used up all his cache!" },
      { setup: "What's a programmer's favorite hangout place?", punchline: "Foo Bar!" }
    ];
    res.json(jokes[Math.floor(Math.random() * jokes.length)]);
  }
});

// News headlines (free - using RSS)
app.get('/api/ai/news', async (req, res) => {
  try {
    const axios = require('axios');
    // Using a simple news API
    const response = await axios.get('https://newsapi.org/v2/top-headlines?country=us&apiKey=demo', { timeout: 5000 });
    if (response.data.articles) {
      res.json({ headlines: response.data.articles.slice(0, 5).map(a => a.title) });
    } else {
      throw new Error('No articles');
    }
  } catch {
    res.json({ 
      headlines: [
        "Technology continues to advance rapidly",
        "Global markets show positive trends",
        "New scientific discoveries announced",
        "Sports teams prepare for upcoming season",
        "Entertainment industry releases new content"
      ]
    });
  }
});

// Smart AI response (uses Gemini AI - FREE)
app.post('/api/ai/chat', async (req, res) => {
  const { message, language = 'en', history = [] } = req.body;
  const geminiKey = process.env.GEMINI_API_KEY;
  
  if (geminiKey) {
    try {
      const axios = require('axios');
      
      // Build conversation context
      const langName = language === 'am' ? 'Amharic (አማርኛ)' : 
                       language === 'ar' ? 'Arabic' :
                       language === 'fr' ? 'French' :
                       language === 'es' ? 'Spanish' :
                       language === 'zh' ? 'Chinese' :
                       language === 'hi' ? 'Hindi' :
                       language === 'pt' ? 'Portuguese' :
                       language === 'ru' ? 'Russian' :
                       language === 'ja' ? 'Japanese' : 'English';
      
      const systemPrompt = `You are Thazema AI, a helpful, friendly, and knowledgeable assistant. 
You can answer ANY question about ANY topic - science, history, math, coding, life advice, etc.
Current language: ${langName}. Always respond in ${langName}.
Be conversational, helpful, and concise. Use emojis occasionally.
For Amharic, use Ethiopian script (ፊደል).
Admin: Abebe Mesfin (abebemesfin53@gmail.com, +251914319514)`;

      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`,
        {
          contents: [
            { role: 'user', parts: [{ text: systemPrompt }] },
            { role: 'model', parts: [{ text: 'I understand. I am Thazema AI, ready to help in ' + langName + '!' }] },
            ...history.slice(-6).map(h => ({
              role: h.role === 'user' ? 'user' : 'model',
              parts: [{ text: h.content }]
            })),
            { role: 'user', parts: [{ text: message }] }
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 500,
          }
        },
        { timeout: 15000 }
      );
      
      const aiResponse = response.data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (aiResponse) {
        return res.json({ response: aiResponse, source: 'gemini' });
      }
    } catch (error) {
      console.error('Gemini Error:', error.response?.data || error.message);
    }
  }
  
  // Fallback - return null to use client-side processing
  res.json({ response: null, useLocal: true });
});

// ============ END AI FEATURES ============

// Socket handlers
io.on('connection', (socket) => {
  console.log('🔌 User connected:', socket.id);
  socket.on('disconnect', () => console.log('🔌 User disconnected:', socket.id));
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Thazema server running on port ${PORT}`);
  console.log(`📧 Login: abebemesfin53@gmail.com / admin123`);
});