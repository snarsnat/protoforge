export interface AIProvider {
  id: string;
  name: string;
  logo: string;
  apiKeyPlaceholder: string;
  baseUrl?: string;
  models: string[];
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  files?: GeneratedFile[];
}

export interface GeneratedFile {
  id: string;
  name: string;
  type: 'code' | 'diagram' | 'model3d' | 'text';
  content: string;
  language?: string;
}

export interface ProjectState {
  provider: AIProvider | null;
  apiKey: string;
  messages: Message[];
  currentFiles: GeneratedFile[];
  activeTab: '3d' | 'diagram' | 'code' | 'instructions';
  selectedFile: GeneratedFile | null;
  isLoading: boolean;
  showProviderModal: boolean;
}

export type TabType = '3d' | 'diagram' | 'code' | 'instructions';

export interface ThreeDModelData {
  type: string;
  parameters: Record<string, number | string>;
}

export interface DiagramData {
  type: 'circuit' | 'architecture' | 'flowchart' | 'uml';
  content: string;
}
