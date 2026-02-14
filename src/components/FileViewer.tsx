import { useState } from 'react';
import { GeneratedFile } from '../types';
import { FileCode, FileJson, FileText, ChevronRight, File } from 'lucide-react';
import { CodeEditor } from './CodeEditor';

interface FileViewerProps {
  files: GeneratedFile[];
  selectedFile: GeneratedFile | null;
}

export function FileViewer({ files, selectedFile }: FileViewerProps) {
  const [expandedFiles, setExpandedFiles] = useState<Set<string>>(new Set());

  const toggleExpand = (fileId: string) => {
    setExpandedFiles((prev) => {
      const next = new Set(prev);
      if (next.has(fileId)) {
        next.delete(fileId);
      } else {
        next.add(fileId);
      }
      return next;
    });
  };

  const getFileIcon = (file: GeneratedFile) => {
    switch (file.type) {
      case 'code':
        return <FileCode className="w-4 h-4 text-primary-400" />;
      case 'diagram':
        return <FileJson className="w-4 h-4 text-green-400" />;
      case 'text':
        return <FileText className="w-4 h-4 text-yellow-400" />;
      default:
        return <File className="w-4 h-4 text-dark-400" />;
    }
  };

  const getLanguageLabel = (file: GeneratedFile) => {
    if (file.language) return file.language;
    const ext = file.name.split('.').pop()?.toLowerCase();
    const langMap: Record<string, string> = {
      js: 'javascript',
      ts: 'typescript',
      py: 'python',
      json: 'json',
      md: 'markdown',
      html: 'html',
      css: 'css',
      yaml: 'yaml',
      yml: 'yaml',
      cpp: 'cpp',
      c: 'c',
      sh: 'bash',
    };
    return langMap[ext || ''] || 'text';
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-3 border-b border-dark-700">
        <h3 className="font-medium text-white text-sm">Code Files</h3>
        <p className="text-xs text-dark-400">{files.length} file(s)</p>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {files.map((file) => {
          const isExpanded = expandedFiles.has(file.id);
          const isSelected = selectedFile?.id === file.id;

          return (
            <div key={file.id} className="border-b border-dark-700/50">
              <button
                onClick={() => toggleExpand(file.id)}
                className={`w-full flex items-center gap-2 px-3 py-2 text-left transition-colors
                  ${isSelected 
                    ? 'bg-primary-500/10' 
                    : 'hover:bg-dark-700/50'
                  }`}
              >
                <ChevronRight 
                  className={`w-4 h-4 text-dark-400 transition-transform ${isExpanded ? 'rotate-90' : ''}`} 
                />
                {getFileIcon(file)}
                <span className="flex-1 text-sm text-dark-200 truncate">{file.name}</span>
                <span className="text-xs text-dark-500 px-2 py-0.5 bg-dark-800 rounded">
                  {getLanguageLabel(file)}
                </span>
              </button>
              
              {isExpanded && (
                <div className="border-t border-dark-700/50">
                  <CodeEditor 
                    code={file.content} 
                    language={getLanguageLabel(file)}
                    readOnly
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
