const crypto = require('crypto');

class CryptoManager {
  constructor() {
    this.algorithm = 'aes-256-cbc';
    this.keyLength = 32;
    this.ivLength = 16;
  }

  deriveKey(password, salt) {
    return crypto.pbkdf2Sync(password, salt, 100000, this.keyLength, 'sha256');
  }

  encrypt(text, password) {
    const salt = crypto.randomBytes(32);
    const iv = crypto.randomBytes(this.ivLength);
    const key = this.deriveKey(password, salt);
    
    const cipher = crypto.createCipheriv(this.algorithm, key, iv);
    
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    return {
      encrypted,
      salt: salt.toString('hex'),
      iv: iv.toString('hex')
    };
  }

  decrypt(encryptedData, password) {
    const { encrypted, salt, iv } = encryptedData;
    const key = this.deriveKey(password, Buffer.from(salt, 'hex'));
    
    const decipher = crypto.createDecipheriv(this.algorithm, key, Buffer.from(iv, 'hex'));
    
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  }

  generateSecureKey(length = 64) {
    return crypto.randomBytes(length).toString('hex');
  }
}

module.exports = CryptoManager;