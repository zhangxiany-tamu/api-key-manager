# API Key Manager

A simple, secure local storage solution for managing LLM API keys with encryption.

## Overview

This tool provides encrypted local storage for API keys from various LLM providers. All data is stored locally on your machine with AES-256-CBC encryption, requiring a master password for access. No external services or cloud dependencies are used.

## Features

- **Encryption**: AES-256-CBC encryption with PBKDF2 key derivation
- **Provider Support**: Pre-configured for 22+ LLM providers including OpenAI, Anthropic, Google AI, Cohere, Mistral, and others
- **Multiple Interfaces**: Both command-line and web-based interfaces available
- **Local Storage**: All data stored locally in encrypted files
- **Export Options**: Generate shell scripts with environment variables for development use
- **Session Management**: Web interface uses secure session tokens
- **Key Validation**: Basic format validation for different provider key types

## Supported Providers

OpenAI, Anthropic, Google AI, Azure OpenAI, AWS Bedrock, Cohere, Mistral AI, Perplexity, Groq, Together AI, Anyscale, Hugging Face, Replicate, Fireworks AI, DeepInfra, AI21 Studio, Writer, Voyage AI, Jina AI, OpenRouter, Poe by Quora, and custom providers.

## Installation

```bash
git clone https://github.com/zhangxiany-tamu/api-key-manager.git
cd api-key-manager
npm install
```

## Usage

### Command Line Interface

Start the interactive CLI for key management:

```bash
npm start
```

The CLI provides options to add, list, retrieve, and delete API keys through an interactive menu system.

### Web Interface

Launch the web-based interface:

```bash
npm run web
```

Then open `http://localhost:3000` in your browser. The web interface provides a clean UI for managing keys with real-time validation and search capabilities.

### Programmatic Access

External applications can access stored keys through several methods:

**Direct Node.js Integration:**
```javascript
const StorageManager = require('./src/storage');
const storage = new StorageManager();
const apiKey = storage.getKey('OpenAI', 'MyKey', 'masterPassword');
```

**HTTP API:**
```javascript
// Authenticate
const authResponse = await fetch('/api/auth/login', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({masterPassword: 'yourPassword'})
});
const {token} = await authResponse.json();

// Retrieve key
const keyResponse = await fetch('/api/keys/OpenAI/MyKey', {
  headers: {'Authorization': `Bearer ${token}`}
});
const {apiKey} = await keyResponse.json();
```

**Shell Environment:**
```bash
# Export keys to shell script
curl -H "Authorization: Bearer TOKEN" \
     http://localhost:3000/api/export/shell > api_keys.sh

# Source the keys
source api_keys.sh

# Use in applications
curl -H "Authorization: Bearer $OPENAI_API_KEY_MYKEY" \
     https://api.openai.com/v1/models
```

## API Endpoints

- `POST /api/auth/login` - Authenticate with master password
- `POST /api/auth/logout` - End session
- `GET /api/keys` - List all stored keys
- `POST /api/keys` - Add new API key
- `GET /api/keys/:provider/:keyName` - Retrieve specific key
- `DELETE /api/keys/:provider/:keyName` - Delete key
- `GET /api/providers` - Get provider information
- `POST /api/validate-key` - Validate key format
- `GET /api/export/shell` - Export shell script
- `GET /api/health` - Server health check

## Data Storage

Keys are stored in an encrypted JSON file (`keys.encrypted.json`) in the project directory. The file contains:

- Encrypted API keys with metadata (description, environment, tags, creation date)
- Provider-specific organization
- Usage tracking information

## Security

- **Local Storage**: All data remains on your local machine
- **Encryption**: AES-256-CBC encryption with random initialization vectors
- **Key Derivation**: PBKDF2 with 100,000 iterations for master password
- **Session Security**: Web interface uses secure session tokens with automatic expiration
- **No External Dependencies**: No cloud services or external API calls for key storage
- **Validation**: Input validation and sanitization for all operations

## Development

**Project Structure:**
```
src/
  crypto.js       # Encryption/decryption utilities
  storage.js      # Key storage management
  providers.js    # Provider configurations
  server.js       # Web server and API
  cli.js          # Command-line interface
public/
  index.html      # Web interface
```

**Running:**
```bash
# Command line interface
npm start

# Web interface  
npm run web
```

## Configuration

The application supports environment-specific configurations through metadata fields:

- **Environment**: development, staging, production
- **Description**: Custom description for each key
- **Tags**: Comma-separated tags for organization
- **Expiration**: Optional expiration dates

## License

MIT