const fs = require('fs');
const path = require('path');
const CryptoManager = require('./crypto');

class StorageManager {
  constructor() {
    this.crypto = new CryptoManager();
    this.storageFile = path.join(process.cwd(), 'keys.encrypted.json');
  }

  fileExists() {
    return fs.existsSync(this.storageFile);
  }

  loadData(masterPassword) {
    if (!this.fileExists()) {
      return { keys: {}, metadata: { created: new Date().toISOString() } };
    }

    try {
      const encryptedContent = fs.readFileSync(this.storageFile, 'utf8');
      const encryptedData = JSON.parse(encryptedContent);
      const decryptedContent = this.crypto.decrypt(encryptedData, masterPassword);
      return JSON.parse(decryptedContent);
    } catch (error) {
      throw new Error('Failed to decrypt data. Invalid master password or corrupted file.');
    }
  }

  saveData(data, masterPassword) {
    try {
      const jsonContent = JSON.stringify(data, null, 2);
      const encryptedData = this.crypto.encrypt(jsonContent, masterPassword);
      fs.writeFileSync(this.storageFile, JSON.stringify(encryptedData, null, 2));
      return true;
    } catch (error) {
      throw new Error('Failed to save encrypted data: ' + error.message);
    }
  }

  addKey(provider, keyName, apiKey, masterPassword, metadata = {}) {
    const data = this.loadData(masterPassword);
    
    if (!data.keys[provider]) {
      data.keys[provider] = {};
    }
    
    data.keys[provider][keyName] = {
      key: apiKey,
      created: new Date().toISOString(),
      lastUsed: null,
      usageCount: 0,
      expirationDate: metadata.expirationDate || null,
      description: metadata.description || '',
      tags: metadata.tags || [],
      isActive: metadata.isActive !== false,
      environment: metadata.environment || 'development',
      metadata: metadata
    };
    
    data.metadata.modified = new Date().toISOString();
    this.saveData(data, masterPassword);
  }

  getKey(provider, keyName, masterPassword) {
    const data = this.loadData(masterPassword);
    
    if (!data.keys[provider] || !data.keys[provider][keyName]) {
      return null;
    }
    
    const keyData = data.keys[provider][keyName];
    
    // Check if key is expired
    if (keyData.expirationDate && new Date(keyData.expirationDate) < new Date()) {
      throw new Error(`API key "${keyName}" has expired on ${new Date(keyData.expirationDate).toLocaleDateString()}`);
    }
    
    // Check if key is active
    if (!keyData.isActive) {
      throw new Error(`API key "${keyName}" is currently disabled`);
    }
    
    // Update usage tracking
    keyData.lastUsed = new Date().toISOString();
    keyData.usageCount = (keyData.usageCount || 0) + 1;
    this.saveData(data, masterPassword);
    
    return keyData.key;
  }

  listKeys(masterPassword) {
    const data = this.loadData(masterPassword);
    const result = {};
    
    for (const [provider, keys] of Object.entries(data.keys)) {
      result[provider] = Object.keys(keys).map(keyName => ({
        name: keyName,
        created: keys[keyName].created,
        lastUsed: keys[keyName].lastUsed,
        metadata: keys[keyName].metadata
      }));
    }
    
    return result;
  }

  deleteKey(provider, keyName, masterPassword) {
    const data = this.loadData(masterPassword);
    
    if (data.keys[provider] && data.keys[provider][keyName]) {
      delete data.keys[provider][keyName];
      
      if (Object.keys(data.keys[provider]).length === 0) {
        delete data.keys[provider];
      }
      
      data.metadata.modified = new Date().toISOString();
      this.saveData(data, masterPassword);
      return true;
    }
    
    return false;
  }

  changePassword(oldPassword, newPassword) {
    const data = this.loadData(oldPassword);
    this.saveData(data, newPassword);
    return true;
  }
}

module.exports = StorageManager;