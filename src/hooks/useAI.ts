import { useCallback, useState } from 'react';
import { AIProvider, Message, GeneratedFile } from '../types';
import { generateDiagram } from '../utils/diagramGenerator';
import { generate3DModel } from '../utils/threeDGenerator';
import { generateProjectFiles } from '../utils/fileGenerator';

interface AIResponse {
  content: string;
  files: GeneratedFile[];
}

export function useAI(provider: AIProvider | null, apiKey: string) {
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = useCallback(async (
    userMessage: string,
    history: Message[]
  ): Promise<AIResponse> => {
    if (!provider || !apiKey) {
      throw new Error('Please set up your AI provider and API key');
    }

    setIsLoading(true);

    try {
      const messages = [
        {
          role: 'system',
          content: `You are ProtoForge, an AI product prototyping assistant. 
You help users create product prototypes including:
- Software code and architecture
- Hardware circuit diagrams  
- 3D models for visualization
- Complete project files

When users describe a product idea, analyze what they need and generate appropriate:
1. Code files (if software/hybrid)
2. Diagrams (circuit, architecture, flowchart)
3. 3D model descriptions
4. Clear instructions

Format your response with clear sections. Include actual code, diagrams (as mermaid syntax), and 3D model parameters.`
        },
        ...history.map(m => ({ role: m.role, content: m.content })),
        { role: 'user', content: userMessage }
      ];

      let responseContent = '';
      let generatedFiles: GeneratedFile[] = [];

      if (provider.id === 'openai') {
        const result = await callOpenAI(apiKey, messages, provider.baseUrl);
        responseContent = result.content;
        generatedFiles = result.files;
      } else if (provider.id === 'anthropic') {
        const result = await callAnthropic(apiKey, messages, provider.baseUrl);
        responseContent = result.content;
        generatedFiles = result.files;
      } else if (provider.id === 'google') {
        const result = await callGoogle(apiKey, messages, provider.baseUrl);
        responseContent = result.content;
        generatedFiles = result.files;
      } else if (provider.id === 'ollama') {
        const result = await callOllama(apiKey, messages, provider.baseUrl || 'http://localhost:11434');
        responseContent = result.content;
        generatedFiles = result.files;
      } else {
        // Generic API call for other providers
        const result = await callGenericAPI(apiKey, messages, provider);
        responseContent = result.content;
        generatedFiles = result.files;
      }

      // Parse and generate additional files
      if (generatedFiles.length === 0) {
        generatedFiles = parseAIResponse(responseContent, userMessage);
      }

      return { content: responseContent, files: generatedFiles };
    } finally {
      setIsLoading(false);
    }
  }, [provider, apiKey]);

  return { sendMessage, isLoading };
}

async function callOpenAI(apiKey: string, messages: any[], baseUrl?: string): Promise<AIResponse> {
  const url = baseUrl || 'https://api.openai.com/v1/chat/completions';
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'OpenAI API error');
  }

  const data = await response.json();
  const content = data.choices[0].message.content;
  
  return { content, files: parseAIResponse(content, '') };
}

async function callAnthropic(apiKey: string, messages: any[], baseUrl?: string): Promise<AIResponse> {
  const url = baseUrl || 'https://api.anthropic.com/v1/messages';
  
  const systemMessage = messages.find(m => m.role === 'system')?.content || '';
  const filteredMessages = messages.filter(m => m.role !== 'system');

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 4096,
      system: systemMessage,
      messages: filteredMessages,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'Anthropic API error');
  }

  const data = await response.json();
  const content = data.content[0].text;
  
  return { content, files: parseAIResponse(content, '') };
}

async function callGoogle(apiKey: string, messages: any[], baseUrl?: string): Promise<AIResponse> {
  const url = baseUrl || `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`;
  
  const systemMessage = messages.find(m => m.role === 'system')?.content || '';
  const filteredMessages = messages.filter(m => m.role !== 'system');

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: filteredMessages.map(m => ({ role: m.role, parts: [{ text: m.content }] })),
      systemInstruction: { parts: [{ text: systemMessage }] },
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 4096,
      },
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'Google API error');
  }

  const data = await response.json();
  const content = data.candidates[0].content.parts[0].text;
  
  return { content, files: parseAIResponse(content, '') };
}

async function callOllama(apiKey: string, messages: any[], baseUrl: string): Promise<AIResponse> {
  const response = await fetch(`${baseUrl}/api/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'llama2',
      messages,
      stream: false,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || 'Ollama API error');
  }

  const data = await response.json();
  const content = data.message.content;
  
  return { content, files: parseAIResponse(content, '') };
}

async function callGenericAPI(apiKey: string, messages: any[], provider: AIProvider): Promise<AIResponse> {
  const url = provider.baseUrl || '';
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      messages,
    }),
  });

  if (!response.ok) {
    throw new Error('API request failed');
  }

  const data = await response.json();
  // Extract content based on common response patterns
  const content = data.choices?.[0]?.message?.content || data.content || JSON.stringify(data);
  
  return { content, files: parseAIResponse(content, '') };
}

function parseAIResponse(content: string, userPrompt: string): GeneratedFile[] {
  const files: GeneratedFile[] = [];
  
  // Extract code blocks
  const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
  let match;
  
  while ((match = codeBlockRegex.exec(content)) !== null) {
    const language = match[1] || 'text';
    const code = match[2].trim();
    
    if (code.length > 50) {
      files.push({
        id: Date.now().toString() + Math.random(),
        name: `file_${files.length + 1}.${getExtension(language)}`,
        type: 'code',
        content: code,
        language,
      });
    }
  }

  // Extract mermaid diagrams
  const mermaidRegex = /```mermaid\n([\s\S]*?)```/g;
  while ((match = mermaidRegex.exec(content)) !== null) {
    files.push({
      id: Date.now().toString() + Math.random(),
      name: `diagram_${files.length + 1}.mmd`,
      type: 'diagram',
      content: match[1].trim(),
    });
  }

  // Check if this is a hardware/product idea that needs 3D
  const hardwareKeywords = ['hardware', 'device', 'circuit', 'physical', 'robot', 'sensor', 'gadget', 'product', 'prototype'];
  const isHardware = hardwareKeywords.some(kw => 
    content.toLowerCase().includes(kw) || userPrompt.toLowerCase().includes(kw)
  );

  if (isHardware && files.length > 0) {
    files.push({
      id: Date.now().toString() + Math.random(),
      name: '3d_model.json',
      type: 'model3d',
      content: JSON.stringify(generate3DModel(userPrompt), null, 2),
    });
  }

  return files;
}

function getExtension(language: string): string {
  const extensions: Record<string, string> = {
    javascript: 'js',
    js: 'js',
    typescript: 'ts',
    ts: 'ts',
    python: 'py',
    py: 'py',
    html: 'html',
    css: 'css',
    json: 'json',
    markdown: 'md',
    md: 'md',
    sql: 'sql',
    bash: 'sh',
    sh: 'sh',
    shell: 'sh',
  };
  return extensions[language.toLowerCase()] || 'txt';
}
