#!/usr/bin/env node

const inquirer = require('inquirer').default;
const StorageManager = require('./storage');

class APIKeyManagerCLI {
  constructor() {
    this.storage = new StorageManager();
    this.masterPassword = null;
  }

  async promptMasterPassword(isNew = false) {
    const message = isNew ? 'Create master password:' : 'Enter master password:';
    const { password } = await inquirer.prompt([
      {
        type: 'password',
        name: 'password',
        message: message,
        mask: '*',
        validate: (input) => input.length >= 8 || 'Password must be at least 8 characters long'
      }
    ]);
    
    if (isNew) {
      const { confirmPassword } = await inquirer.prompt([
        {
          type: 'password',
          name: 'confirmPassword',
          message: 'Confirm master password:',
          mask: '*',
          validate: (input) => input === password || 'Passwords do not match'
        }
      ]);
    }
    
    return password;
  }

  async initializeVault() {
    console.log('🔐 Welcome to API Key Manager');
    
    if (!this.storage.fileExists()) {
      console.log('🆕 No vault found. Creating new vault...');
      this.masterPassword = await this.promptMasterPassword(true);
      this.storage.saveData({ keys: {}, metadata: { created: new Date().toISOString() } }, this.masterPassword);
      console.log('✅ Vault created successfully!');
    } else {
      console.log('🔓 Vault found. Please enter your master password.');
      this.masterPassword = await this.promptMasterPassword();
      
      try {
        this.storage.loadData(this.masterPassword);
        console.log('✅ Vault unlocked successfully!');
      } catch (error) {
        console.log('❌ Invalid master password. Exiting...');
        process.exit(1);
      }
    }
  }

  async mainMenu() {
    const { action } = await inquirer.prompt([
      {
        type: 'list',
        name: 'action',
        message: 'What would you like to do?',
        choices: [
          { name: '🔑 Add API Key', value: 'add' },
          { name: '📋 List API Keys', value: 'list' },
          { name: '🔍 Get API Key', value: 'get' },
          { name: '🗑️  Delete API Key', value: 'delete' },
          { name: '🔄 Change Master Password', value: 'change-password' },
          { name: '🚪 Exit', value: 'exit' }
        ]
      }
    ]);

    switch (action) {
      case 'add':
        await this.addKey();
        break;
      case 'list':
        await this.listKeys();
        break;
      case 'get':
        await this.getKey();
        break;
      case 'delete':
        await this.deleteKey();
        break;
      case 'change-password':
        await this.changePassword();
        break;
      case 'exit':
        console.log('👋 Goodbye!');
        process.exit(0);
    }

    await this.mainMenu();
  }

  async addKey() {
    const { provider, keyName, apiKey } = await inquirer.prompt([
      {
        type: 'list',
        name: 'provider',
        message: 'Select LLM Provider:',
        choices: ['OpenAI', 'Anthropic', 'Google', 'Cohere', 'Hugging Face', 'Other']
      },
      {
        type: 'input',
        name: 'keyName',
        message: 'Key name/description:',
        validate: (input) => input.length > 0 || 'Key name cannot be empty'
      },
      {
        type: 'password',
        name: 'apiKey',
        message: 'API Key:',
        mask: '*',
        validate: (input) => input.length > 0 || 'API Key cannot be empty'
      }
    ]);

    try {
      this.storage.addKey(provider, keyName, apiKey, this.masterPassword);
      console.log(`✅ API Key "${keyName}" added for ${provider}`);
    } catch (error) {
      console.log(`❌ Error adding key: ${error.message}`);
    }
  }

  async listKeys() {
    try {
      const keys = this.storage.listKeys(this.masterPassword);
      
      if (Object.keys(keys).length === 0) {
        console.log('📭 No API keys stored yet.');
        return;
      }

      console.log('\n📋 Your API Keys:');
      for (const [provider, providerKeys] of Object.entries(keys)) {
        console.log(`\n🏢 ${provider}:`);
        providerKeys.forEach(key => {
          console.log(`  🔑 ${key.name}`);
          console.log(`     Created: ${new Date(key.created).toLocaleString()}`);
          console.log(`     Last Used: ${key.lastUsed ? new Date(key.lastUsed).toLocaleString() : 'Never'}`);
        });
      }
    } catch (error) {
      console.log(`❌ Error listing keys: ${error.message}`);
    }
  }

  async getKey() {
    try {
      const keys = this.storage.listKeys(this.masterPassword);
      
      if (Object.keys(keys).length === 0) {
        console.log('📭 No API keys stored yet.');
        return;
      }

      const choices = [];
      for (const [provider, providerKeys] of Object.entries(keys)) {
        providerKeys.forEach(key => {
          choices.push({
            name: `${provider} - ${key.name}`,
            value: { provider, keyName: key.name }
          });
        });
      }

      const { selectedKey } = await inquirer.prompt([
        {
          type: 'list',
          name: 'selectedKey',
          message: 'Select API key to retrieve:',
          choices: choices
        }
      ]);

      const apiKey = this.storage.getKey(selectedKey.provider, selectedKey.keyName, this.masterPassword);
      console.log(`\n🔑 API Key: ${apiKey}`);
      console.log('⚠️  Key copied to display. Handle securely!');
      
    } catch (error) {
      console.log(`❌ Error retrieving key: ${error.message}`);
    }
  }

  async deleteKey() {
    try {
      const keys = this.storage.listKeys(this.masterPassword);
      
      if (Object.keys(keys).length === 0) {
        console.log('📭 No API keys stored yet.');
        return;
      }

      const choices = [];
      for (const [provider, providerKeys] of Object.entries(keys)) {
        providerKeys.forEach(key => {
          choices.push({
            name: `${provider} - ${key.name}`,
            value: { provider, keyName: key.name }
          });
        });
      }

      const { selectedKey } = await inquirer.prompt([
        {
          type: 'list',
          name: 'selectedKey',
          message: 'Select API key to delete:',
          choices: choices
        }
      ]);

      const { confirm } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'confirm',
          message: `Are you sure you want to delete "${selectedKey.keyName}" from ${selectedKey.provider}?`,
          default: false
        }
      ]);

      if (confirm) {
        const deleted = this.storage.deleteKey(selectedKey.provider, selectedKey.keyName, this.masterPassword);
        if (deleted) {
          console.log('✅ API Key deleted successfully!');
        } else {
          console.log('❌ Key not found.');
        }
      } else {
        console.log('❌ Deletion cancelled.');
      }
      
    } catch (error) {
      console.log(`❌ Error deleting key: ${error.message}`);
    }
  }

  async changePassword() {
    try {
      const { currentPassword, newPassword } = await inquirer.prompt([
        {
          type: 'password',
          name: 'currentPassword',
          message: 'Current master password:',
          mask: '*'
        },
        {
          type: 'password',
          name: 'newPassword',
          message: 'New master password:',
          mask: '*',
          validate: (input) => input.length >= 8 || 'Password must be at least 8 characters long'
        },
        {
          type: 'password',
          name: 'confirmPassword',
          message: 'Confirm new password:',
          mask: '*',
          validate: function(input) {
            if (input !== this.answers.newPassword) {
              return 'Passwords do not match';
            }
            return true;
          }
        }
      ]);

      if (currentPassword !== this.masterPassword) {
        console.log('❌ Current password is incorrect.');
        return;
      }

      this.storage.changePassword(currentPassword, newPassword);
      this.masterPassword = newPassword;
      console.log('✅ Master password changed successfully!');
      
    } catch (error) {
      console.log(`❌ Error changing password: ${error.message}`);
    }
  }

  async run() {
    try {
      await this.initializeVault();
      await this.mainMenu();
    } catch (error) {
      console.log(`❌ An error occurred: ${error.message}`);
      process.exit(1);
    }
  }
}

if (require.main === module) {
  const cli = new APIKeyManagerCLI();
  cli.run();
}

module.exports = APIKeyManagerCLI;