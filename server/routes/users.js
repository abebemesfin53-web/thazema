const express = require('express');
const User = require('../models/User');

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

// Get all users (for contact list)
router.get('/', simpleAuth, async (req, res) => {
  try {
    // Fallback users for testing
    const users = [
      {
        id: 'user1',
        username: 'John Doe',
        email: 'john@example.com',
        phone: '+251911111111',
        avatar: null,
        status: 'online'
      },
      {
        id: 'user2', 
        username: 'Jane Smith',
        email: 'jane@example.com',
        phone: '+251922222222',
        avatar: null,
        status: 'offline'
      },
      {
        id: 'admin',
        username: 'Admin',
        email: 'abebemesfin53@gmail.com',
        phone: '+251914319514',
        avatar: null,
        status: 'online'
      }
    ];

    res.json({ users });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get nearby users based on location
router.get('/nearby', simpleAuth, async (req, res) => {
  try {
    const { latitude, longitude, radius = 50 } = req.query;
    
    // Return sample nearby users for testing
    const users = [
      {
        id: 'nearby1',
        username: 'Nearby User 1',
        email: 'nearby1@example.com',
        phone: '+251933333333',
        avatar: null,
        status: 'online',
        distance: 2.5
      },
      {
        id: 'nearby2',
        username: 'Nearby User 2', 
        email: 'nearby2@example.com',
        phone: '+251944444444',
        avatar: null,
        status: 'online',
        distance: 5.1
      }
    ];

    res.json({ users });
  } catch (error) {
    console.error('Nearby users error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Search users
router.get('/search', simpleAuth, async (req, res) => {
  try {
    const { q } = req.query;
    
    // Return sample search results
    const users = [
      {
        id: 'search1',
        username: 'Search Result 1',
        email: 'search1@example.com',
        phone: '+251955555555',
        avatar: null,
        status: 'online'
      }
    ];
    
    res.json({ users });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add contact
router.post('/contacts/:userId', simpleAuth, async (req, res) => {
  try {
    const { userId } = req.params;
    res.json({ message: 'Contact added successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update user location
router.put('/location', simpleAuth, async (req, res) => {
  try {
    const { latitude, longitude } = req.body;
    res.json({ message: 'Location updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
