const jwt = require('jsonwebtoken');
const User = require('../models/User');
const encryptionService = require('../utils/encryption');

// JWT configuration
const JWT_CONFIG = {
  accessTokenExpiry: '15m',
  refreshTokenExpiry: '7d',
  algorithm: 'HS256'
};

class AuthMiddleware {
  // Generate JWT tokens
  generateTokens(userId, deviceFingerprint) {
    const payload = {
      userId,
      deviceFingerprint,
      type: 'access'
    };

    const accessToken = jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { 
        expiresIn: JWT_CONFIG.accessTokenExpiry,
        algorithm: JWT_CONFIG.algorithm
      }
    );

    const refreshToken = jwt.sign(
      { ...payload, type: 'refresh' },
      process.env.JWT_REFRESH_SECRET,
      { 
        expiresIn: JWT_CONFIG.refreshTokenExpiry,
        algorithm: JWT_CONFIG.algorithm
      }
    );

    return { accessToken, refreshToken };
  }

  // Verify JWT token
  verifyToken(token, secret) {
    try {
      return jwt.verify(token, secret, { algorithm: JWT_CONFIG.algorithm });
    } catch (error) {
      console.error('Token verification failed:', error.message);
      return null;
    }
  }

  // Authentication middleware
  authenticate = async (req, res, next) => {
    try {
      const authHeader = req.headers.authorization;
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
          error: 'Access token required',
          code: 'NO_TOKEN'
        });
      }

      const token = authHeader.substring(7);
      const decoded = this.verifyToken(token, process.env.JWT_SECRET);

      if (!decoded) {
        return res.status(401).json({
          error: 'Invalid or expired token',
          code: 'INVALID_TOKEN'
        });
      }

      // Verify device fingerprint
      if (decoded.deviceFingerprint !== req.deviceFingerprint) {
        console.log(`🚨 Device fingerprint mismatch for user ${decoded.userId}`);
        return res.status(401).json({
          error: 'Device verification failed',
          code: 'DEVICE_MISMATCH'
        });
      }

      // Get user from database
      const user = await User.findById(decoded.userId).select('-password');
      if (!user) {
        return res.status(401).json({
          error: 'User not found',
          code: 'USER_NOT_FOUND'
        });
      }

      // Check if user is active
      if (!user.isActive) {
        return res.status(401).json({
          error: 'Account deactivated',
          code: 'ACCOUNT_DEACTIVATED'
        });
      }

      req.user = user;
      req.tokenPayload = decoded;
      next();
    } catch (error) {
      console.error('Authentication error:', error);
      res.status(500).json({
        error: 'Authentication failed',
        code: 'AUTH_ERROR'
      });
    }
  };

  // Refresh token middleware
  refreshToken = async (req, res, next) => {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        return res.status(401).json({
          error: 'Refresh token required',
          code: 'NO_REFRESH_TOKEN'
        });
      }

      const decoded = this.verifyToken(refreshToken, process.env.JWT_REFRESH_SECRET);

      if (!decoded || decoded.type !== 'refresh') {
        return res.status(401).json({
          error: 'Invalid refresh token',
          code: 'INVALID_REFRESH_TOKEN'
        });
      }

      // Verify device fingerprint
      if (decoded.deviceFingerprint !== req.deviceFingerprint) {
        return res.status(401).json({
          error: 'Device verification failed',
          code: 'DEVICE_MISMATCH'
        });
      }

      // Get user from database
      const user = await User.findById(decoded.userId);
      if (!user || !user.isActive) {
        return res.status(401).json({
          error: 'User not found or inactive',
          code: 'USER_INVALID'
        });
      }

      // Generate new tokens
      const tokens = this.generateTokens(user._id, req.deviceFingerprint);

      res.json({
        success: true,
        message: 'Tokens refreshed successfully',
        ...tokens,
        user: {
          id: user._id,
          phone: user.phone,
          name: user.name,
          avatar: user.avatar
        }
      });
    } catch (error) {
      console.error('Token refresh error:', error);
      res.status(500).json({
        error: 'Token refresh failed',
        code: 'REFRESH_ERROR'
      });
    }
  };

  // Admin authentication middleware
  requireAdmin = async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          error: 'Authentication required',
          code: 'NO_AUTH'
        });
      }

      if (req.user.role !== 'admin') {
        console.log(`🚨 Unauthorized admin access attempt by user ${req.user._id}`);
        return res.status(403).json({
          error: 'Admin access required',
          code: 'INSUFFICIENT_PERMISSIONS'
        });
      }

      next();
    } catch (error) {
      console.error('Admin auth error:', error);
      res.status(500).json({
        error: 'Authorization failed',
        code: 'AUTH_ERROR'
      });
    }
  };

  // OTP verification middleware
  verifyOTP = async (req, res, next) => {
    try {
      const { phone, otp } = req.body;

      if (!phone || !otp) {
        return res.status(400).json({
          error: 'Phone and OTP required',
          code: 'MISSING_CREDENTIALS'
        });
      }

      // Get stored OTP from cache/database
      const storedOTP = await this.getStoredOTP(phone);
      
      if (!storedOTP) {
        return res.status(400).json({
          error: 'OTP expired or not found',
          code: 'OTP_EXPIRED'
        });
      }

      if (storedOTP.otp !== otp) {
        console.log(`🚨 Invalid OTP attempt for phone ${phone}`);
        return res.status(400).json({
          error: 'Invalid OTP',
          code: 'INVALID_OTP'
        });
      }

      // Check OTP expiry
      if (Date.now() > storedOTP.expiresAt) {
        return res.status(400).json({
          error: 'OTP expired',
          code: 'OTP_EXPIRED'
        });
      }

      // Clear used OTP
      await this.clearOTP(phone);

      req.verifiedPhone = phone;
      next();
    } catch (error) {
      console.error('OTP verification error:', error);
      res.status(500).json({
        error: 'OTP verification failed',
        code: 'OTP_ERROR'
      });
    }
  };

  // Store OTP (implement with Redis or database)
  async storeOTP(phone, otp, expiryMinutes = 5) {
    // Implementation depends on your storage choice
    // This is a placeholder - implement with Redis or database
    console.log(`Storing OTP ${otp} for phone ${phone}`);
  }

  // Get stored OTP
  async getStoredOTP(phone) {
    // Implementation depends on your storage choice
    // This is a placeholder - implement with Redis or database
    return null;
  }

  // Clear OTP
  async clearOTP(phone) {
    // Implementation depends on your storage choice
    // This is a placeholder - implement with Redis or database
    console.log(`Clearing OTP for phone ${phone}`);
  }

  // Generate secure session
  generateSession(user, deviceInfo) {
    const sessionId = encryptionService.generateSecureId(32);
    const sessionData = {
      userId: user._id,
      deviceInfo,
      createdAt: new Date(),
      lastActivity: new Date()
    };

    return { sessionId, sessionData };
  }
}

module.exports = new AuthMiddleware();