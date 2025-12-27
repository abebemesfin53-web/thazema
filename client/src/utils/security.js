import CryptoJS from 'crypto-js';
import { Capacitor } from '@capacitor/core';
import { BiometricAuth } from '@capacitor/biometric-auth';

class SecurityService {
  constructor() {
    this.isNative = Capacitor.isNativePlatform();
    this.encryptionKey = null;
  }

  // Initialize security service
  async initialize() {
    try {
      if (this.isNative) {
        await this.initializeBiometrics();
      }
      await this.generateEncryptionKey();
      console.log('🔒 Security service initialized');
    } catch (error) {
      console.error('Security initialization failed:', error);
    }
  }

  // Initialize biometric authentication
  async initializeBiometrics() {
    try {
      const result = await BiometricAuth.checkBiometry();
      if (result.isAvailable) {
        console.log('🔐 Biometric authentication available:', result.biometryType);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Biometric initialization failed:', error);
      return false;
    }
  }

  // Authenticate with biometrics
  async authenticateWithBiometrics(reason = 'Authenticate to access Thazema') {
    try {
      if (!this.isNative) {
        console.log('Biometrics not available on web platform');
        return false;
      }

      const result = await BiometricAuth.authenticate({
        reason,
        title: 'Thazema Authentication',
        subtitle: 'Use your biometric to authenticate',
        description: 'Place your finger on the sensor or look at the camera'
      });

      return result.isAuthenticated;
    } catch (error) {
      console.error('Biometric authentication failed:', error);
      return false;
    }
  }

  // Generate encryption key
  async generateEncryptionKey() {
    try {
      // In production, derive this from user credentials or device keystore
      const deviceId = await this.getDeviceId();
      this.encryptionKey = CryptoJS.SHA256(deviceId + 'thazema-secret').toString();
    } catch (error) {
      console.error('Key generation failed:', error);
      this.encryptionKey = CryptoJS.SHA256('fallback-key').toString();
    }
  }

  // Get device ID
  async getDeviceId() {
    try {
      if (this.isNative) {
        // Use device-specific identifier
        return navigator.userAgent + window.screen.width + window.screen.height;
      }
      return 'web-device-' + Date.now();
    } catch (error) {
      return 'unknown-device';
    }
  }

  // Encrypt sensitive data
  encryptData(data) {
    try {
      if (!this.encryptionKey) {
        throw new Error('Encryption key not available');
      }
      
      const encrypted = CryptoJS.AES.encrypt(
        JSON.stringify(data), 
        this.encryptionKey
      ).toString();
      
      return encrypted;
    } catch (error) {
      console.error('Encryption failed:', error);
      return null;
    }
  }

  // Decrypt sensitive data
  decryptData(encryptedData) {
    try {
      if (!this.encryptionKey) {
        throw new Error('Encryption key not available');
      }
      
      const decrypted = CryptoJS.AES.decrypt(encryptedData, this.encryptionKey);
      const decryptedString = decrypted.toString(CryptoJS.enc.Utf8);
      
      return JSON.parse(decryptedString);
    } catch (error) {
      console.error('Decryption failed:', error);
      return null;
    }
  }

  // Secure storage operations
  async secureStore(key, data) {
    try {
      const encrypted = this.encryptData(data);
      if (encrypted) {
        localStorage.setItem(`secure_${key}`, encrypted);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Secure store failed:', error);
      return false;
    }
  }

  // Secure retrieval operations
  async secureRetrieve(key) {
    try {
      const encrypted = localStorage.getItem(`secure_${key}`);
      if (encrypted) {
        return this.decryptData(encrypted);
      }
      return null;
    } catch (error) {
      console.error('Secure retrieve failed:', error);
      return null;
    }
  }

  // Clear secure storage
  async secureClear(key) {
    try {
      localStorage.removeItem(`secure_${key}`);
      return true;
    } catch (error) {
      console.error('Secure clear failed:', error);
      return false;
    }
  }

  // Generate device fingerprint
  generateDeviceFingerprint() {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    ctx.textBaseline = 'top';
    ctx.font = '14px Arial';
    ctx.fillText('Device fingerprint', 2, 2);
    
    const fingerprint = {
      userAgent: navigator.userAgent,
      language: navigator.language,
      platform: navigator.platform,
      screen: `${screen.width}x${screen.height}`,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      canvas: canvas.toDataURL(),
      webgl: this.getWebGLFingerprint()
    };

    return CryptoJS.SHA256(JSON.stringify(fingerprint)).toString();
  }

  // Get WebGL fingerprint
  getWebGLFingerprint() {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      
      if (!gl) return 'no-webgl';
      
      const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
      return debugInfo ? 
        gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : 'unknown';
    } catch (error) {
      return 'webgl-error';
    }
  }

  // Validate input for security
  validateInput(input, type = 'general') {
    const patterns = {
      phone: /^\+?[1-9]\d{1,14}$/,
      email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      name: /^[a-zA-Z\s]{2,50}$/,
      general: /^[^<>'"&]*$/
    };

    const pattern = patterns[type] || patterns.general;
    return pattern.test(input);
  }

  // Sanitize input
  sanitizeInput(input) {
    if (typeof input !== 'string') return input;
    
    return input
      .replace(/[<>'"&]/g, '')
      .trim()
      .substring(0, 1000); // Limit length
  }

  // Check for security threats
  detectSecurityThreats() {
    const threats = [];

    // Check for developer tools
    if (this.isDevToolsOpen()) {
      threats.push('Developer tools detected');
    }

    // Check for suspicious user agent
    if (this.isSuspiciousUserAgent()) {
      threats.push('Suspicious user agent');
    }

    // Check for automation tools
    if (this.isAutomationDetected()) {
      threats.push('Automation tools detected');
    }

    return threats;
  }

  // Detect developer tools
  isDevToolsOpen() {
    try {
      const threshold = 160;
      return window.outerHeight - window.innerHeight > threshold ||
             window.outerWidth - window.innerWidth > threshold;
    } catch (error) {
      return false;
    }
  }

  // Detect suspicious user agent
  isSuspiciousUserAgent() {
    const suspiciousPatterns = [
      /bot/i, /crawler/i, /spider/i, /scraper/i,
      /headless/i, /phantom/i, /selenium/i
    ];
    
    return suspiciousPatterns.some(pattern => 
      pattern.test(navigator.userAgent)
    );
  }

  // Detect automation tools
  isAutomationDetected() {
    return !!(
      window.webdriver ||
      window.callPhantom ||
      window._phantom ||
      window.Buffer ||
      window.emit ||
      window.spawn
    );
  }

  // Generate secure random string
  generateSecureRandom(length = 32) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    return result;
  }

  // Hash data
  hashData(data) {
    return CryptoJS.SHA256(data).toString();
  }

  // Verify data integrity
  verifyIntegrity(data, expectedHash) {
    const actualHash = this.hashData(data);
    return actualHash === expectedHash;
  }

  // Secure API request wrapper
  async secureRequest(url, options = {}) {
    try {
      // Add security headers
      const secureOptions = {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          'X-Device-Fingerprint': this.generateDeviceFingerprint(),
          'X-Request-ID': this.generateSecureRandom(16),
          ...options.headers
        }
      };

      // Add authentication token if available
      const token = await this.secureRetrieve('authToken');
      if (token) {
        secureOptions.headers.Authorization = `Bearer ${token}`;
      }

      const response = await fetch(url, secureOptions);
      
      // Verify response integrity if needed
      if (response.headers.get('X-Content-Hash')) {
        const contentHash = response.headers.get('X-Content-Hash');
        const responseText = await response.text();
        
        if (!this.verifyIntegrity(responseText, contentHash)) {
          throw new Error('Response integrity check failed');
        }
        
        return JSON.parse(responseText);
      }

      return response;
    } catch (error) {
      console.error('Secure request failed:', error);
      throw error;
    }
  }
}

export default new SecurityService();