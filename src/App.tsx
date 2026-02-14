import { useState, useEffect, useCallback } from 'react';
import { AIProvider, Message, GeneratedFile, TabType, ProjectState } from './types';
import { ChatPanel } from './components/ChatPanel';
import { Sidebar } from './';
import { Tabcomponents/SidebarViewer } from './components/TabViewer';
import { ProviderSelector } from './components/ProviderSelector';
import { ApiKeyModal } from './components/ApiKeyModal';
import { useAI } from './hooks/useAI';

const STORAGE_KEY = 'protoforge_state';

const defaultState: ProjectState = {
  provider: null,
  apiKey: '',
  messages: [],
  currentFiles: [],
  activeTab: 'instructions',
  selectedFile: null,
  isLoading: false,
  showProviderModal: false,
};

function App() {
  const [state, setState] = useState<ProjectState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return { ...defaultState, ...parsed, messages: [], showProviderModal: !parsed.provider };
      }
    } catch (e) {
      console.error('Failed to load saved state:', e);
    }
    return { ...defaultState, showProviderModal: true };
  });

  const { sendMessage, isLoading } = useAI(state.provider, state.apiKey);

  useEffect(() => {
    try {
      const toSave = {
        provider: state.provider,
        apiKey: state.apiKey,
        activeTab: state.activeTab,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
    } catch (e) {
      console.error('Failed to save state:', e);
    }
  }, [state.provider, state.apiKey, state.activeTab]);

  const handleProviderSelect = useCallback((provider: AIProvider) => {
    setState(prev => ({ ...prev, provider, showProviderModal: false }));
  }, []);

  const handleApiKeySubmit = useCallback((apiKey: string) => {
    setState(prev => ({ ...prev, apiKey }));
  }, []);

  const handleSendMessage = useCallback(async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date(),
    };

    setState(prev => ({
      ...prev,
      messages: [...prev.messages, userMessage],
      isLoading: true,
    }));

    try {
      const response = await sendMessage(content, state.messages);
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.content,
        timestamp: new Date(),
        files: response.files,
      };

      setState(prev => ({
        ...prev,
        messages: [...prev.messages, assistantMessage],
        currentFiles: response.files || [],
        isLoading: false,
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        messages: [...prev.messages, {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: `Error: ${error instanceof Error ? error.message : 'Failed to get response'}`,
          timestamp: new Date(),
        }],
      }));
    }
  }, [sendMessage, state.messages]);

  const handleTabChange = useCallback((tab: TabType) => {
    setState(prev => ({ ...prev, activeTab: tab }));
  }, []);

  const handleFileSelect = useCallback((file: GeneratedFile) => {
    setState(prev => ({ ...prev, selectedFile: file }));
  }, []);

  const handleClearChat = useCallback(() => {
    setState(prev => ({ ...prev, messages: [], currentFiles: [] }));
  }, []);

  return (
    <div className="flex h-screen bg-dark-900">
      {state.showProviderModal && (
        <ProviderSelector
          onSelect={handleProviderSelect}
          selectedProvider={state.provider}
        />
      )}
      
      {state.provider && !state.apiKey && (
        <ApiKeyModal
          provider={state.provider}
          onSubmit={handleApiKeySubmit}
        />
      )}

      <Sidebar
        currentFiles={state.currentFiles}
        selectedFile={state.selectedFile}
        onFileSelect={handleFileSelect}
      />
      
      <ChatPanel
        messages={state.messages}
        onSendMessage={handleSendMessage}
        isLoading={state.isLoading}
        onClearChat={handleClearChat}
      />
      
      <TabViewer
        activeTab={state.activeTab}
        onTabChange={handleTabChange}
        files={state.currentFiles}
        selectedFile={state.selectedFile}
      />
    </div>
  );
}

export default App;
