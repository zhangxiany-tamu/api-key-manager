const express = require('express');
const cors = require('cors');
const path = require('path');
const StorageManager = require('./storage');
const { ProviderManager } = require('./providers');

class APIKeyServer {
  constructor(port = 3000) {
    this.app = express();
    this.port = port;
    this.storage = new StorageManager();
    this.activeSessions = new Map(); // Simple in-memory session store
    
    this.setupMiddleware();
    this.setupRoutes();
  }

  setupMiddleware() {
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(express.static(path.join(__dirname, '../public')));
  }

  generateSessionToken() {
    return require('crypto').randomBytes(32).toString('hex');
  }

  requireAuth(req, res, next) {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token || !this.activeSessions.has(token)) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    req.masterPassword = this.activeSessions.get(token);
    next();
  }

  setupRoutes() {
    // Authentication
    this.app.post('/api/auth/login', (req, res) => {
      try {
        const { masterPassword } = req.body;
        
        // Test if password is correct by trying to load data
        this.storage.loadData(masterPassword);
        
        const token = this.generateSessionToken();
        this.activeSessions.set(token, masterPassword);
        
        // Auto-expire session after 1 hour
        setTimeout(() => {
          this.activeSessions.delete(token);
        }, 60 * 60 * 1000);
        
        res.json({ token, message: 'Authenticated successfully' });
      } catch (error) {
        res.status(401).json({ error: 'Invalid master password' });
      }
    });

    this.app.post('/api/auth/logout', this.requireAuth.bind(this), (req, res) => {
      const token = req.headers.authorization?.replace('Bearer ', '');
      this.activeSessions.delete(token);
      res.json({ message: 'Logged out successfully' });
    });

    // Key management
    this.app.get('/api/keys', this.requireAuth.bind(this), (req, res) => {
      try {
        const keys = this.storage.listKeys(req.masterPassword);
        res.json({ keys });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    this.app.post('/api/keys', this.requireAuth.bind(this), (req, res) => {
      try {
        const { provider, keyName, apiKey, metadata } = req.body;
        
        if (!provider || !keyName || !apiKey) {
          return res.status(400).json({ error: 'Provider, keyName, and apiKey are required' });
        }

        // Validate key format if possible
        if (!ProviderManager.validateKeyFormat(provider, apiKey)) {
          return res.status(400).json({ 
            error: `Invalid API key format for ${provider}`
          });
        }

        this.storage.addKey(provider, keyName, apiKey, req.masterPassword, metadata || {});
        res.json({ message: 'API key added successfully' });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    this.app.get('/api/keys/:provider/:keyName', this.requireAuth.bind(this), (req, res) => {
      try {
        const { provider, keyName } = req.params;
        const apiKey = this.storage.getKey(provider, keyName, req.masterPassword);
        
        if (!apiKey) {
          return res.status(404).json({ error: 'API key not found' });
        }
        
        res.json({ apiKey });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    this.app.delete('/api/keys/:provider/:keyName', this.requireAuth.bind(this), (req, res) => {
      try {
        const { provider, keyName } = req.params;
        const deleted = this.storage.deleteKey(provider, keyName, req.masterPassword);
        
        if (deleted) {
          res.json({ message: 'API key deleted successfully' });
        } else {
          res.status(404).json({ error: 'API key not found' });
        }
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    // Providers info
    this.app.get('/api/providers', (req, res) => {
      const providers = ProviderManager.getProviders().map(name => 
        ProviderManager.generateKeyTemplate(name)
      );
      res.json({ providers });
    });

    // API Key validation endpoint
    this.app.post('/api/validate-key', (req, res) => {
      try {
        const { provider, apiKey } = req.body;
        
        if (!provider || !apiKey) {
          return res.status(400).json({ error: 'Provider and apiKey are required' });
        }

        // Basic checks only - just make sure it's not empty and has reasonable length
        if (apiKey.trim().length < 10) {
          return res.json({ 
            valid: false, 
            reason: 'Too short (minimum 10 characters)'
          });
        }

        if (apiKey.trim().length > 500) {
          return res.json({ 
            valid: false, 
            reason: 'Too long (maximum 500 characters)'
          });
        }

        // Always return valid for reasonable length keys
        res.json({ 
          valid: true, 
          reason: 'Valid'
        });
      } catch (error) {
        console.error('Validation error:', error);
        res.status(500).json({ error: error.message });
      }
    });

    // Export functionality
    this.app.get('/api/export/shell', this.requireAuth.bind(this), (req, res) => {
      try {
        const shellScript = ProviderManager.exportForShell(this.storage, req.masterPassword);
        
        res.setHeader('Content-Type', 'application/x-sh');
        res.setHeader('Content-Disposition', 'attachment; filename="api_keys.sh"');
        res.send(shellScript);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    // Health check
    this.app.get('/api/health', (req, res) => {
      res.json({ 
        status: 'healthy', 
        vault_exists: this.storage.fileExists(),
        active_sessions: this.activeSessions.size,
        timestamp: new Date().toISOString()
      });
    });

    // Serve the main page
    this.app.get('/', (req, res) => {
      res.sendFile(path.join(__dirname, '../public/index.html'));
    });
  }

  start() {
    this.app.listen(this.port, () => {
      console.log(`🌐 API Key Manager Web UI running at http://localhost:${this.port}`);
      console.log(`🔐 Vault exists: ${this.storage.fileExists()}`);
    });
  }
}

if (require.main === module) {
  const server = new APIKeyServer(process.env.PORT || 3000);
  server.start();
}

module.exports = APIKeyServer;