const express = require('express');

const router = express.Router();

// Simple auth middleware for testing
const simpleAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }
    // For testing, just pass through
    req.user = { _id: 'test-user-id' };
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Get call history
router.get('/history', simpleAuth, async (req, res) => {
  try {
    // Sample call history for testing
    const calls = [
      {
        id: 'call1',
        caller: { username: 'John Doe', avatar: null },
        receiver: { username: 'You', avatar: null },
        type: 'video',
        duration: 120,
        status: 'completed',
        createdAt: new Date(Date.now() - 3600000) // 1 hour ago
      },
      {
        id: 'call2',
        caller: { username: 'You', avatar: null },
        receiver: { username: 'Jane Smith', avatar: null },
        type: 'audio',
        duration: 45,
        status: 'completed',
        createdAt: new Date(Date.now() - 7200000) // 2 hours ago
      },
      {
        id: 'call3',
        caller: { username: 'Admin', avatar: null },
        receiver: { username: 'You', avatar: null },
        type: 'video',
        duration: 0,
        status: 'missed',
        createdAt: new Date(Date.now() - 10800000) // 3 hours ago
      }
    ];
    
    res.json({ calls });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create call record
router.post('/', simpleAuth, async (req, res) => {
  try {
    const { receiver, type } = req.body;
    
    const call = {
      id: 'new-call-' + Date.now(),
      caller: req.user._id,
      receiver,
      type,
      status: 'initiated',
      createdAt: new Date()
    };
    
    res.status(201).json({ call });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
