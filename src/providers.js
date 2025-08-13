const LLM_PROVIDERS = {
  'OpenAI': {
    name: 'OpenAI',
    baseUrl: 'https://api.openai.com/v1',
    keyFormat: /^sk-[A-Za-z0-9_-]+$/,
    description: 'GPT-4, GPT-3.5, DALL-E, Whisper, Embeddings',
    envVar: 'OPENAI_API_KEY',
    docs: 'https://platform.openai.com/docs/api-reference/authentication',
    category: 'Major Providers'
  },
  
  'Anthropic': {
    name: 'Anthropic',
    baseUrl: 'https://api.anthropic.com',
    keyFormat: /^sk-ant-api\d{2}-[A-Za-z0-9_-]+$/,
    description: 'Claude 3 (Opus, Sonnet, Haiku)',
    envVar: 'ANTHROPIC_API_KEY',
    docs: 'https://docs.anthropic.com/claude/reference/getting-started-with-the-api',
    category: 'Major Providers'
  },
  
  'Google AI': {
    name: 'Google AI',
    baseUrl: 'https://generativelanguage.googleapis.com/v1',
    keyFormat: /^AIza[A-Za-z0-9_-]+$/,
    description: 'Gemini Pro, Gemini Vision, PaLM 2',
    envVar: 'GOOGLE_AI_API_KEY',
    docs: 'https://ai.google.dev/docs',
    category: 'Major Providers'
  },

  'Azure OpenAI': {
    name: 'Azure OpenAI',
    baseUrl: 'https://{resource}.openai.azure.com',
    keyFormat: /^[A-Za-z0-9]{32}$/,
    description: 'Enterprise OpenAI via Microsoft Azure',
    envVar: 'AZURE_OPENAI_API_KEY',
    docs: 'https://learn.microsoft.com/en-us/azure/ai-services/openai/',
    category: 'Major Providers'
  },

  'AWS Bedrock': {
    name: 'AWS Bedrock',
    baseUrl: 'https://bedrock.{region}.amazonaws.com',
    keyFormat: /^AKIA[A-Z0-9]{16}$/,
    description: 'Claude, Llama, Titan models via AWS',
    envVar: 'AWS_ACCESS_KEY_ID',
    docs: 'https://docs.aws.amazon.com/bedrock/',
    category: 'Major Providers'
  },
  
  'Cohere': {
    name: 'Cohere',
    baseUrl: 'https://api.cohere.ai',
    keyFormat: /^[A-Za-z0-9]{40}$/,
    description: 'Command R+, Embed, Rerank models',
    envVar: 'COHERE_API_KEY',
    docs: 'https://docs.cohere.ai/reference/about',
    category: 'Specialized Models'
  },

  'Mistral AI': {
    name: 'Mistral AI',
    baseUrl: 'https://api.mistral.ai',
    keyFormat: /^[A-Za-z0-9]{32}$/,
    description: 'Mistral 7B, Mixtral 8x7B, Codestral',
    envVar: 'MISTRAL_API_KEY',
    docs: 'https://docs.mistral.ai/',
    category: 'Open Source'
  },

  'Perplexity': {
    name: 'Perplexity',
    baseUrl: 'https://api.perplexity.ai',
    keyFormat: /^pplx-[A-Za-z0-9]{32}$/,
    description: 'Online LLMs with real-time search',
    envVar: 'PERPLEXITY_API_KEY',
    docs: 'https://docs.perplexity.ai/',
    category: 'Specialized Models'
  },

  'Groq': {
    name: 'Groq',
    baseUrl: 'https://api.groq.com/openai/v1',
    keyFormat: /^gsk_[A-Za-z0-9]{52}$/,
    description: 'Ultra-fast LLM inference (Llama, Mixtral)',
    envVar: 'GROQ_API_KEY',
    docs: 'https://console.groq.com/docs/quickstart',
    category: 'High Performance'
  },

  'Together AI': {
    name: 'Together AI',
    baseUrl: 'https://api.together.xyz/v1',
    keyFormat: /^[A-Za-z0-9]{64}$/,
    description: 'Fast inference for open-source models',
    envVar: 'TOGETHER_API_KEY',
    docs: 'https://docs.together.ai/docs/quickstart',
    category: 'Open Source'
  },

  'Anyscale': {
    name: 'Anyscale',
    baseUrl: 'https://api.endpoints.anyscale.com/v1',
    keyFormat: /^esecret_[A-Za-z0-9]{32}$/,
    description: 'Ray-powered LLM serving (Llama, Mistral)',
    envVar: 'ANYSCALE_API_KEY',
    docs: 'https://docs.anyscale.com/endpoints/',
    category: 'Open Source'
  },
  
  'Hugging Face': {
    name: 'Hugging Face',
    baseUrl: 'https://api-inference.huggingface.co',
    keyFormat: /^hf_[A-Za-z0-9]{34}$/,
    description: 'Access to 500,000+ models',
    envVar: 'HUGGINGFACE_API_KEY',
    docs: 'https://huggingface.co/docs/api-inference/index',
    category: 'Open Source'
  },
  
  'Replicate': {
    name: 'Replicate',
    baseUrl: 'https://api.replicate.com/v1',
    keyFormat: /^r8_[A-Za-z0-9]{24}$/,
    description: 'Run any open-source model',
    envVar: 'REPLICATE_API_TOKEN',
    docs: 'https://replicate.com/docs/reference/http',
    category: 'Open Source'
  },

  'Fireworks AI': {
    name: 'Fireworks AI',
    baseUrl: 'https://api.fireworks.ai/inference/v1',
    keyFormat: /^fw_[A-Za-z0-9]{32}$/,
    description: 'Fast and cost-effective LLM APIs',
    envVar: 'FIREWORKS_API_KEY',
    docs: 'https://readme.fireworks.ai/',
    category: 'High Performance'
  },

  'DeepInfra': {
    name: 'DeepInfra',
    baseUrl: 'https://api.deepinfra.com/v1/openai',
    keyFormat: /^[A-Za-z0-9]{32}$/,
    description: 'Serverless inference for popular models',
    envVar: 'DEEPINFRA_API_KEY',
    docs: 'https://deepinfra.com/docs',
    category: 'Open Source'
  },

  'AI21 Studio': {
    name: 'AI21 Studio',
    baseUrl: 'https://api.ai21.com/studio/v1',
    keyFormat: /^[A-Za-z0-9]{32}$/,
    description: 'Jurassic-2 language models',
    envVar: 'AI21_API_KEY',
    docs: 'https://docs.ai21.com/',
    category: 'Specialized Models'
  },

  'Writer': {
    name: 'Writer',
    baseUrl: 'https://enterprise-api.writer.com',
    keyFormat: /^[A-Za-z0-9]{40}$/,
    description: 'Enterprise writing and content generation',
    envVar: 'WRITER_API_KEY',
    docs: 'https://dev.writer.com/',
    category: 'Enterprise'
  },

  'Voyage AI': {
    name: 'Voyage AI',
    baseUrl: 'https://api.voyageai.com/v1',
    keyFormat: /^pa-[A-Za-z0-9]{32}$/,
    description: 'High-quality text embeddings',
    envVar: 'VOYAGE_API_KEY',
    docs: 'https://docs.voyageai.com/',
    category: 'Embeddings'
  },

  'Jina AI': {
    name: 'Jina AI',
    baseUrl: 'https://api.jina.ai/v1',
    keyFormat: /^jina_[A-Za-z0-9]{32}$/,
    description: 'Multimodal AI and embeddings',
    envVar: 'JINA_API_KEY',
    docs: 'https://jina.ai/embeddings/',
    category: 'Embeddings'
  },

  'OpenRouter': {
    name: 'OpenRouter',
    baseUrl: 'https://openrouter.ai/api/v1',
    keyFormat: /^sk-or-[A-Za-z0-9\-_]{43}$/,
    description: 'Unified API for 100+ LLMs',
    envVar: 'OPENROUTER_API_KEY',
    docs: 'https://openrouter.ai/docs',
    category: 'Aggregators'
  },

  'Poe by Quora': {
    name: 'Poe by Quora',
    baseUrl: 'https://api.poe.com',
    keyFormat: /^[A-Za-z0-9]{32}$/,
    description: 'Access multiple AI assistants',
    envVar: 'POE_API_KEY',
    docs: 'https://developer.poe.com/',
    category: 'Aggregators'
  },
  
  'Other': {
    name: 'Other/Custom',
    baseUrl: 'Custom',
    keyFormat: null,
    description: 'Custom or other API providers',
    envVar: 'CUSTOM_API_KEY',
    docs: null,
    category: 'Custom'
  }
};

class ProviderManager {
  static getProviders() {
    return Object.keys(LLM_PROVIDERS);
  }
  
  static getProviderInfo(providerName) {
    return LLM_PROVIDERS[providerName] || null;
  }
  
  static validateKeyFormat(providerName, apiKey) {
    const provider = LLM_PROVIDERS[providerName];
    if (!provider || !provider.keyFormat) {
      return true; // Skip validation for unknown providers or those without format
    }
    
    return provider.keyFormat.test(apiKey);
  }
  
  static getEnvVarName(providerName) {
    const provider = LLM_PROVIDERS[providerName];
    return provider ? provider.envVar : null;
  }
  
  static generateKeyTemplate(providerName) {
    const provider = LLM_PROVIDERS[providerName];
    if (!provider) return null;
    
    return {
      provider: providerName,
      name: provider.name,
      baseUrl: provider.baseUrl,
      description: provider.description,
      envVar: provider.envVar,
      docs: provider.docs,
      example: this.getKeyExample(providerName)
    };
  }
  
  static getKeyExample(providerName) {
    const examples = {
      'OpenAI': 'sk-proj-xxxxxxxxxxxxxxxxxxxxxxxx',
      'Anthropic': 'sk-ant-api03-xxxxxxxxxxxxxxxxxxxxxxxx',
      'Google AI': 'AIzaSyxxxxxxxxxxxxxxxxxxxxxxxx',
      'Azure OpenAI': '12345678901234567890123456789012',
      'AWS Bedrock': 'AKIA1234567890ABCDEF',
      'Cohere': 'abcdef1234567890abcdef1234567890abcdef12',
      'Mistral AI': 'abcdef1234567890abcdef1234567890',
      'Perplexity': 'pplx-abcdef1234567890abcdef1234567890',
      'Groq': 'gsk_abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
      'Together AI': 'abcdefghijklmnopqrstuvwxyz1234567890abcdefghijklmnopqrstuvwxyz12',
      'Anyscale': 'esecret_abcdef1234567890abcdef1234567890',
      'Hugging Face': 'hf_abcdefghijklmnopqrstuvwxyz123456789',
      'Replicate': 'r8_abcdefghijklmnopqrstuvwx',
      'Fireworks AI': 'fw_abcdef1234567890abcdef1234567890',
      'DeepInfra': 'abcdef1234567890abcdef1234567890',
      'AI21 Studio': 'abcdef1234567890abcdef1234567890',
      'Writer': 'abcdef1234567890abcdef1234567890abcdef12',
      'Voyage AI': 'pa-abcdef1234567890abcdef1234567890',
      'Jina AI': 'jina_abcdef1234567890abcdef1234567890',
      'OpenRouter': 'sk-or-abcdef1234567890abcdef1234567890abcdef123',
      'Poe by Quora': 'abcdef1234567890abcdef1234567890',
      'Other': 'your-custom-api-key-here'
    };
    
    return examples[providerName] || 'your-api-key-here';
  }
  
  static exportForShell(storageManager, masterPassword) {
    if (!storageManager) {
      const StorageManager = require('./storage');
      storageManager = new StorageManager();
    }
    
    const allKeys = storageManager.listKeys(masterPassword);
    let exportScript = '#!/bin/bash\n\n# API Key Environment Variables\n# Generated by API Key Manager\n\n';
    
    for (const [provider, providerKeys] of Object.entries(allKeys)) {
      const providerInfo = this.getProviderInfo(provider);
      if (providerInfo) {
        exportScript += `# ${providerInfo.description}\n`;
        
        providerKeys.forEach(keyData => {
          const apiKey = storageManager.getKey(provider, keyData.name, masterPassword);
          const envVar = `${providerInfo.envVar}_${keyData.name.toUpperCase().replace(/[^A-Z0-9]/g, '_')}`;
          exportScript += `export ${envVar}="${apiKey}"\n`;
        });
        
        exportScript += '\n';
      }
    }
    
    exportScript += '# Usage: source this file to load API keys into environment\n';
    exportScript += '# Example: source api_keys.sh\n';
    
    return exportScript;
  }
}

module.exports = { LLM_PROVIDERS, ProviderManager };