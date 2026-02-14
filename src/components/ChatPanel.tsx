import { useState, useRef, useEffect } from 'react';
import { Message } from '../types';
import { Send, Trash2, Loader2, Bot, User } from 'lucide-react';

interface ChatPanelProps {
  messages: Message[];
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  onClearChat: () => void;
}

export function ChatPanel({ messages, onSendMessage, isLoading, onClearChat }: ChatPanelProps) {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    onSendMessage(input.trim());
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-dark-800/50 border-l border-dark-700 min-w-0">
      {/* Header */}
      <div className="p-4 border-b border-dark-700 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="font-semibold text-white">ProtoForge AI</h2>
            <p className="text-xs text-dark-400">Describe your product idea</p>
          </div>
        </div>
        <button
          onClick={onClearChat}
          className="p-2 text-dark-400 hover:text-white hover:bg-dark-700 rounded-lg transition-colors"
          title="Clear chat"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-4">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-500/20 to-primary-700/20 flex items-center justify-center mb-4">
              <Bot className="w-10 h-10 text-primary-500" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              Describe Your Product Idea
            </h3>
            <p className="text-dark-400 max-w-md">
              Tell me about any product you want to build - hardware, software, or both. 
              I'll generate code, diagrams, and 3D models to help you prototype it.
            </p>
            <div className="mt-6 flex flex-wrap gap-2 justify-center">
              {[
                'Smart home device',
                'Mobile app',
                'IoT sensor',
                'Robot',
                'Web dashboard',
              ].map((example) => (
                <button
                  key={example}
                  onClick={() => onSendMessage(`Create a ${example.toLowerCase()}`)}
                  className="px-3 py-1.5 text-sm bg-dark-700 hover:bg-dark-600 
                           text-dark-300 rounded-full transition-colors"
                >
                  {example}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0
                ${message.role === 'user' 
                  ? 'bg-dark-600' 
                  : 'bg-gradient-to-br from-primary-500 to-primary-700'
                }`}>
                {message.role === 'user' ? (
                  <User className="w-4 h-4 text-white" />
                ) : (
                  <Bot className="w-4 h-4 text-white" />
                )}
              </div>
              <div className={`flex-1 min-w-0 ${message.role === 'user' ? 'text-right' : ''}`}>
                <div className={`inline-block max-w-[85%] p-4 rounded-2xl text-sm whitespace-pre-wrap
                  ${message.role === 'user' 
                    ? 'bg-primary-600 text-white' 
                    : 'bg-dark-700 text-dark-100'
                  }`}>
                  {message.content}
                </div>
                {message.files && message.files.length > 0 && (
                  <div className="mt-2 text-xs text-dark-400">
                    {message.files.length} file(s) generated
                  </div>
                )}
              </div>
            </div>
          ))
        )}
        
        {isLoading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="bg-dark-700 rounded-2xl p-4">
              <div className="flex items-center gap-2 text-dark-400">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm">Generating...</span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-dark-700">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Describe your product idea..."
            disabled={isLoading}
            className="flex-1 px-4 py-3 bg-dark-900 border border-dark-600 rounded-xl 
                     text-white placeholder-dark-500 focus:outline-none focus:border-primary-500
                     transition-colors disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="px-4 py-3 bg-primary-600 hover:bg-primary-500 disabled:bg-dark-600 
                     disabled:text-dark-500 text-white rounded-xl transition-colors
                     focus:outline-none focus:ring-2 focus:ring-primary-500/50"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
}
