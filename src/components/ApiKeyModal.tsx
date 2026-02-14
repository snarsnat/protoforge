import { useState } from 'react';
import { AIProvider } from '../types';
import { Eye, EyeOff, Key, AlertCircle } from 'lucide-react';

interface ApiKeyModalProps {
  provider: AIProvider;
  onSubmit: (apiKey: string) => void;
}

export function ApiKeyModal({ provider, onSubmit }: ApiKeyModalProps) {
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!apiKey.trim()) {
      setError('Please enter an API key');
      return;
    }

    if (apiKey.length < 10) {
      setError('API key seems too short. Please check.');
      return;
    }

    onSubmit(apiKey);
  };

  const getHelpUrl = () => {
    const urls: Record<string, string> = {
      openai: 'https://platform.openai.com/api-keys',
      anthropic: 'https://console.anthropic.com/settings/keys',
      google: 'https://aistudio.google.com/app/apikey',
      deepseek: 'https://platform.deepseek.com/',
      xai: 'https://x.ai/',
      ollama: 'https://github.com/jmorganca/ollama',
    };
    return urls[provider.id] || '';
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-dark-800 rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl border border-dark-700">
        <div className="text-center mb-6">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary-500/20 flex items-center justify-center">
            <Key className="w-8 h-8 text-primary-500" />
          </div>
          <h2 className="text-2xl font-bold text-white">
            Enter {provider.name} API Key
          </h2>
          <p className="text-dark-400 mt-2 text-sm">
            Your key is stored locally and never leaves your browser
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-dark-300 mb-2">
              API Key
            </label>
            <div className="relative">
              <input
                type={showKey ? 'text' : 'password'}
                value={apiKey}
                onChange={(e) => {
                  setApiKey(e.target.value);
                  setError('');
                }}
                placeholder={provider.apiKeyPlaceholder}
                className="w-full px-4 py-3 bg-dark-900 border border-dark-600 rounded-lg 
                         text-white placeholder-dark-500 focus:outline-none focus:border-primary-500
                         transition-colors"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-400 hover:text-dark-300"
              >
                {showKey ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {error && (
              <p className="mt-2 text-sm text-red-400 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {error}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-primary-600 hover:bg-primary-500 
                     text-white font-semibold rounded-lg transition-colors
                     focus:outline-none focus:ring-2 focus:ring-primary-500/50"
          >
            Save & Continue
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-dark-700">
          <p className="text-sm text-dark-400">
            Don't have an API key?{' '}
            <a
              href={getHelpUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-400 hover:text-primary-300 underline"
            >
              Get one from {provider.name}
            </a>
          </p>
        </div>

        <div className="mt-4 p-3 bg-dark-700/50 rounded-lg">
          <p className="text-xs text-dark-400">
            <strong>Note for Ollama:</strong> Make sure Ollama is running locally.
            No API key required - it runs on your machine.
          </p>
        </div>
      </div>
    </div>
  );
}
