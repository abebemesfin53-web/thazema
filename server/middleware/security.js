const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const crypto = require('crypto');

// Rate limiting configuration
const createRateLimiter = (windowMs, max, message) => {
  return rateLimit({
    windowMs,
    max,
    message: {
      error: message,
      retryAfter: Math.ceil(windowMs / 1000)
    },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
      console.log(`🚨 Rate limit exceeded for IP: ${req.ip}`);
      res.status(429).json({
        error: message,
        retryAfter: Math.ceil(windowMs / 1000)
      });
    }
  });
};

// Security middleware configuration
const securityMiddleware = {
  // Helmet for security headers
  helmet: helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
        connectSrc: ["'self'", "ws:", "wss:"],
        fontSrc: ["'self'"],
        objectSrc: ["'none'"],
        mediaSrc: ["'self'"],
        frameSrc: ["'none'"]
      }
    },
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true
    }
  }),

  // Rate limiters
  general: createRateLimiter(15 * 60 * 1000, 100, 'Too many requests, please try again later'),
  auth: createRateLimiter(15 * 60 * 1000, 5, 'Too many authentication attempts'),
  otp: createRateLimiter(60 * 1000, 3, 'Too many OTP requests'),

  // Data sanitization
  mongoSanitize: mongoSanitize(),
  xssClean: xss(),
  hpp: hpp(),

  // Custom security middleware
  securityHeaders: (req, res, next) => {
    // Additional security headers
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
    
    // Remove server information
    res.removeHeader('X-Powered-By');
    res.setHeader('Server', 'Thazema-Secure');
    
    next();
  },

  // Request logging for security monitoring
  securityLogger: (req, res, next) => {
    const timestamp = new Date().toISOString();
    const ip = req.ip || req.connection.remoteAddress;
    const userAgent = req.get('User-Agent') || 'Unknown';
    
    // Log security-relevant requests
    if (req.path.includes('/auth') || req.path.includes('/admin')) {
      console.log(`🔒 Security Log: ${timestamp} | ${ip} | ${req.method} ${req.path} | ${userAgent}`);
    }
    
    next();
  },

  // Input validation middleware
  validateInput: (req, res, next) => {
    // Check for common attack patterns
    const suspiciousPatterns = [
      /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
      /javascript:/gi,
      /on\w+\s*=/gi,
      /union\s+select/gi,
      /drop\s+table/gi,
      /insert\s+into/gi,
      /delete\s+from/gi
    ];

    const checkValue = (value) => {
      if (typeof value === 'string') {
        return suspiciousPatterns.some(pattern => pattern.test(value));
      }
      if (typeof value === 'object' && value !== null) {
        return Object.values(value).some(checkValue);
      }
      return false;
    };

    if (checkValue(req.body) || checkValue(req.query) || checkValue(req.params)) {
      console.log(`🚨 Suspicious input detected from IP: ${req.ip}`);
      return res.status(400).json({
        error: 'Invalid input detected',
        code: 'SECURITY_VIOLATION'
      });
    }

    next();
  },

  // Device fingerprinting
  deviceFingerprint: (req, res, next) => {
    const fingerprint = crypto
      .createHash('sha256')
      .update(req.get('User-Agent') + req.ip + req.get('Accept-Language'))
      .digest('hex');
    
    req.deviceFingerprint = fingerprint;
    next();
  }
};

module.exports = securityMiddleware;