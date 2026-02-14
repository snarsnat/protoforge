import { GeneratedFile } from '../types';
import { FolderTree, FileCode, FileJson, FileText, Download, ChevronRight, Folder } from 'lucide-react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

interface SidebarProps {
  currentFiles: GeneratedFile[];
  selectedFile: GeneratedFile | null;
  onFileSelect: (file: GeneratedFile) => void;
}

export function Sidebar({ currentFiles, selectedFile, onFileSelect }: SidebarProps) {
  const handleDownload = async () => {
    if (currentFiles.length === 0) return;

    const zip = new JSZip();
    
    currentFiles.forEach((file) => {
      zip.file(file.name, file.content);
    });

    const content = await zip.generateAsync({ type: 'blob' });
    saveAs(content, 'protoforge_project.zip');
  };

  const handleDownloadFile = (file: GeneratedFile) => {
    const blob = new Blob([file.content], { type: 'text/plain;charset=utf-8' });
    saveAs(blob, file.name);
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'code':
        return <FileCode className="w-4 h-4 text-primary-400" />;
      case 'diagram':
        return <FileJson className="w-4 h-4 text-green-400" />;
      case 'model3d':
        return <Folder className="w-4 h-4 text-purple-400" />;
      default:
        return <FileText className="w-4 h-4 text-dark-400" />;
    }
  };

  // Group files by type
  const codeFiles = currentFiles.filter(f => f.type === 'code');
  const diagramFiles = currentFiles.filter(f => f.type === 'diagram');
  const modelFiles = currentFiles.filter(f => f.type === 'model3d');
  const textFiles = currentFiles.filter(f => f.type === 'text');

  return (
    <div className="w-64 bg-dark-800 border-r border-dark-700 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-dark-700">
        <div className="flex items-center gap-2">
          <FolderTree className="w-5 h-5 text-primary-500" />
          <span className="font-semibold text-white">Project Files</span>
        </div>
      </div>

      {/* File Tree */}
      <div className="flex-1 overflow-y-auto p-2">
        {currentFiles.length === 0 ? (
          <div className="text-center py-8 px-4">
            <FolderTree className="w-12 h-12 text-dark-600 mx-auto mb-3" />
            <p className="text-dark-400 text-sm">
              Your generated files will appear here
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {codeFiles.length > 0 && (
              <div>
                <div className="text-xs font-medium text-dark-500 uppercase tracking-wider px-2 mb-1">
                  Code
                </div>
                {codeFiles.map((file) => (
                  <button
                    key={file.id}
                    onClick={() => onFileSelect(file)}
                    className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-sm transition-colors
                      ${selectedFile?.id === file.id 
                        ? 'bg-primary-500/20 text-primary-400' 
                        : 'text-dark-300 hover:bg-dark-700'
                      }`}
                  >
                    {getFileIcon(file.type)}
                    <span className="truncate flex-1 text-left">{file.name}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDownloadFile(file);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1 hover:bg-dark-600 rounded"
                    >
                      <Download className="w-3 h-3" />
                    </button>
                  </button>
                ))}
              </div>
            )}

            {diagramFiles.length > 0 && (
              <div>
                <div className="text-xs font-medium text-dark-500 uppercase tracking-wider px-2 mb-1">
                  Diagrams
                </div>
                {diagramFiles.map((file) => (
                  <button
                    key={file.id}
                    onClick={() => onFileSelect(file)}
                    className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-sm transition-colors
                      ${selectedFile?.id === file.id 
                        ? 'bg-primary-500/20 text-primary-400' 
                        : 'text-dark-300 hover:bg-dark-700'
                      }`}
                  >
                    {getFileIcon(file.type)}
                    <span className="truncate flex-1 text-left">{file.name}</span>
                  </button>
                ))}
              </div>
            )}

            {modelFiles.length > 0 && (
              <div>
                <div className="text-xs font-medium text-dark-500 uppercase tracking-wider px-2 mb-1">
                  3D Models
                </div>
                {modelFiles.map((file) => (
                  <button
                    key={file.id}
                    onClick={() => onFileSelect(file)}
                    className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-sm transition-colors
                      ${selectedFile?.id === file.id 
                        ? 'bg-primary-500/20 text-primary-400' 
                        : 'text-dark-300 hover:bg-dark-700'
                      }`}
                  >
                    {getFileIcon(file.type)}
                    <span className="truncate flex-1 text-left">{file.name}</span>
                  </button>
                ))}
              </div>
            )}

            {textFiles.length > 0 && (
              <div>
                <div className="text-xs font-medium text-dark-500 uppercase tracking-wider px-2 mb-1">
                  Documentation
                </div>
                {textFiles.map((file) => (
                  <button
                    key={file.id}
                    onClick={() => onFileSelect(file)}
                    className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-sm transition-colors
                      ${selectedFile?.id === file.id 
                        ? 'bg-primary-500/20 text-primary-400' 
                        : 'text-dark-300 hover:bg-dark-700'
                      }`}
                  >
                    {getFileIcon(file.type)}
                    <span className="truncate flex-1 text-left">{file.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Download All */}
      {currentFiles.length > 0 && (
        <div className="p-4 border-t border-dark-700">
          <button
            onClick={handleDownload}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 
                     bg-primary-600 hover:bg-primary-500 text-white rounded-lg 
                     transition-colors text-sm font-medium"
          >
            <Download className="w-4 h-4" />
            Download All
          </button>
        </div>
      )}
    </div>
  );
}
