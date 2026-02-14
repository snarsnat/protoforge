import { AIProvider } from '../types';
import { Check, OpenAI, Brain, Bot } from 'lucide-react';

interface ProviderSelectorProps {
  onSelect: (provider: AIProvider) => void;
  selectedProvider: AIProvider | null;
}

const providers: AIProvider[] = [
  {
    id: 'openai',
    name: 'OpenAI',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/4/4d/OpenAI_Logo.svg',
    apiKeyPlaceholder: 'sk-...',
    baseUrl: 'https://api.openai.com/v1/chat/completions',
    models: ['gpt-4o', 'gpt-4-turbo', 'gpt-3.5-turbo'],
  },
  {
    id: 'anthropic',
    name: 'Anthropic',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/7/78/Anthropic_Logo.svg',
    apiKeyPlaceholder: 'sk-ant-...',
    baseUrl: 'https://api.anthropic.com/v1/messages',
    models: ['claude-3-5-sonnet', 'claude-3-opus', 'claude-3-haiku'],
  },
  {
    id: 'google',
    name: 'Google AI',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg',
    apiKeyPlaceholder: 'AIza...',
    baseUrl: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent',
    models: ['gemini-pro', 'gemini-pro-vision'],
  },
  {
    id: 'ollama',
    name: 'Ollama',
    logo: '',
    apiKeyPlaceholder: 'any',
    baseUrl: 'http://localhost:11434',
    models: ['llama2', 'codellama', 'mistral', 'neural'],
  },
  {
    id: 'deepseek',
    name: 'DeepSeek',
    logo: '',
    apiKeyPlaceholder: 'sk-...',
    baseUrl: 'https://api.deepseek.com/v1/chat/completions',
    models: ['deepseek-chat', 'deepseek-coder'],
  },
  {
    id: 'xai',
    name: 'xAI',
    logo: '',
    apiKeyPlaceholder: 'xai-...',
    baseUrl: 'https://api.x.ai/v1/chat/completions',
    models: ['grok-beta'],
  },
];

export function ProviderSelector({ onSelect, selectedProvider }: ProviderSelectorProps) {
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-dark-800 rounded-2xl p-8 max-w-2xl w-full mx-4 shadow-2xl border border-dark-700">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent">
            Welcome to ProtoForge
          </h1>
          <p className="text-dark-400 mt-2">
            Select your AI provider to get started
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {providers.map((provider) => {
            const isSelected = selectedProvider?.id === provider.id;
            
            return (
              <button
                key={provider.id}
                onClick={() => onSelect(provider)}
                className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-200 text-left
                  ${isSelected 
                    ? 'border-primary-500 bg-primary-500/10' 
                    : 'border-dark-600 hover:border-dark-500 hover:bg-dark-700/50'
                  }`}
              >
                <div className="w-12 h-12 rounded-lg bg-dark-600 flex items-center justify-center">
                  {provider.id === 'openai' && <OpenAI className="w-6 h-6 text-white" />}
                  {provider.id === 'anthropic' && <Brain className="w-6 h-6 text-white" />}
                  {provider.id === 'google' && <Bot className="w-6 h-6 text-white" />}
                  {provider.id === 'ollama' && <span className="text-primary-400 font-bold text-xl">O</span>}
                  {provider.id === 'deepseek' && <span className="text-primary-400 font-bold text-xl">D</span>}
                  {provider.id === 'xai' && <span className="text-primary-400 font-bold text-xl">X</span>}
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-white">{provider.name}</div>
                  <div className="text-sm text-dark-400">
                    {provider.models[0]}
                  </div>
                </div>
                {isSelected && (
                  <Check className="w-6 h-6 text-primary-500" />
                )}
              </button>
            );
          })}
        </div>

        <div className="mt-6 p-4 bg-dark-700/50 rounded-lg">
          <p className="text-sm text-dark-400">
            <span className="text-primary-400 font-medium">🔒 Your API key stays local</span>
            <br />
            Keys are stored in your browser's localStorage and never sent to any server except the AI provider's API directly.
          </p>
        </div>
      </div>
    </div>
  );
}

export { providers };
