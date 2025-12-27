const crypto = require('crypto');
const bcrypt = require('bcryptjs');

class EncryptionService {
  constructor() {
    this.algorithm = 'aes-256-gcm';
    this.keyLength = 32;
    this.ivLength = 16;
    this.tagLength = 16;
    this.saltRounds = 12;
  }

  // Generate secure random key
  generateKey() {
    return crypto.randomBytes(this.keyLength);
  }

  // Generate secure random IV
  generateIV() {
    return crypto.randomBytes(this.ivLength);
  }

  // Encrypt data with AES-256-GCM
  encrypt(data, key) {
    try {
      const iv = this.generateIV();
      const cipher = crypto.createCipher(this.algorithm, key, iv);
      
      let encrypted = cipher.update(JSON.stringify(data), 'utf8', 'hex');
      encrypted += cipher.final('hex');
      
      const tag = cipher.getAuthTag();
      
      return {
        encrypted,
        iv: iv.toString('hex'),
        tag: tag.toString('hex')
      };
    } catch (error) {
      console.error('Encryption error:', error);
      throw new Error('Encryption failed');
    }
  }

  // Decrypt data with AES-256-GCM
  decrypt(encryptedData, key) {
    try {
      const { encrypted, iv, tag } = encryptedData;
      const decipher = crypto.createDecipher(this.algorithm, key, Buffer.from(iv, 'hex'));
      
      decipher.setAuthTag(Buffer.from(tag, 'hex'));
      
      let decrypted = decipher.update(encrypted, 'hex', 'utf8');
      decrypted += decipher.final('utf8');
      
      return JSON.parse(decrypted);
    } catch (error) {
      console.error('Decryption error:', error);
      throw new Error('Decryption failed');
    }
  }

  // Hash password with bcrypt
  async hashPassword(password) {
    try {
      const salt = await bcrypt.genSalt(this.saltRounds);
      return await bcrypt.hash(password, salt);
    } catch (error) {
      console.error('Password hashing error:', error);
      throw new Error('Password hashing failed');
    }
  }

  // Verify password with bcrypt
  async verifyPassword(password, hashedPassword) {
    try {
      return await bcrypt.compare(password, hashedPassword);
    } catch (error) {
      console.error('Password verification error:', error);
      return false;
    }
  }

  // Generate secure OTP
  generateOTP(length = 6) {
    const digits = '0123456789';
    let otp = '';
    
    for (let i = 0; i < length; i++) {
      const randomIndex = crypto.randomInt(0, digits.length);
      otp += digits[randomIndex];
    }
    
    return otp;
  }

  // Generate secure token
  generateSecureToken(length = 32) {
    return crypto.randomBytes(length).toString('hex');
  }

  // Hash data with SHA-256
  hashData(data) {
    return crypto.createHash('sha256').update(data).digest('hex');
  }

  // Generate HMAC signature
  generateHMAC(data, secret) {
    return crypto.createHmac('sha256', secret).update(data).digest('hex');
  }

  // Verify HMAC signature
  verifyHMAC(data, signature, secret) {
    const expectedSignature = this.generateHMAC(data, secret);
    return crypto.timingSafeEqual(
      Buffer.from(signature, 'hex'),
      Buffer.from(expectedSignature, 'hex')
    );
  }

  // Encrypt sensitive user data
  encryptUserData(userData, userKey) {
    const sensitiveFields = ['phone', 'email', 'location'];
    const encrypted = { ...userData };
    
    sensitiveFields.forEach(field => {
      if (userData[field]) {
        encrypted[field] = this.encrypt(userData[field], userKey);
      }
    });
    
    return encrypted;
  }

  // Decrypt sensitive user data
  decryptUserData(encryptedData, userKey) {
    const sensitiveFields = ['phone', 'email', 'location'];
    const decrypted = { ...encryptedData };
    
    sensitiveFields.forEach(field => {
      if (encryptedData[field] && typeof encryptedData[field] === 'object') {
        try {
          decrypted[field] = this.decrypt(encryptedData[field], userKey);
        } catch (error) {
          console.error(`Failed to decrypt ${field}:`, error);
          decrypted[field] = null;
        }
      }
    });
    
    return decrypted;
  }

  // Generate key derivation from password
  deriveKey(password, salt) {
    return crypto.pbkdf2Sync(password, salt, 100000, this.keyLength, 'sha256');
  }

  // Secure random string generation
  generateSecureId(length = 16) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    
    for (let i = 0; i < length; i++) {
      const randomIndex = crypto.randomInt(0, chars.length);
      result += chars[randomIndex];
    }
    
    return result;
  }
}

module.exports = new EncryptionService();