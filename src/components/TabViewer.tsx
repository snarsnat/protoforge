import { TabType, GeneratedFile } from '../types';
import { Box, GitBranch, Code, BookOpen } from 'lucide-react';
import { ThreeDViewer } from './ThreeDViewer';
import { DiagramViewer } from './DiagramViewer';
import { FileViewer } from './FileViewer';
import { CodeEditor } from './CodeEditor';
import { InstructionsTab } from './InstructionsTab';

interface TabViewerProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  files: GeneratedFile[];
  selectedFile: GeneratedFile | null;
}

const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
  { id: '3d', label: '3D Model', icon: <Box className="w-4 h-4" /> },
  { id: 'diagram', label: 'Diagrams', icon: <GitBranch className="w-4 h-4" /> },
  { id: 'code', label: 'Code', icon: <Code className="w-4 h-4" /> },
  { id: 'instructions', label: 'Help', icon: <BookOpen className="w-4 h-4" /> },
];

export function TabViewer({ activeTab, onTabChange, files, selectedFile }: TabViewerProps) {
  const diagramFiles = files.filter(f => f.type === 'diagram');
  const codeFiles = files.filter(f => f.type === 'code');
  const modelFiles = files.filter(f => f.type === 'model3d');

  const renderContent = () => {
    switch (activeTab) {
      case '3d':
        return modelFiles.length > 0 ? (
          <ThreeDViewer files={modelFiles} />
        ) : (
          <div className="flex items-center justify-center h-full text-dark-400">
            <div className="text-center">
              <Box className="w-16 h-16 mx-auto mb-4 opacity-30" />
              <p>No 3D models generated yet</p>
              <p className="text-sm mt-2">Describe a hardware product to generate a 3D model</p>
            </div>
          </div>
        );

      case 'diagram':
        return diagramFiles.length > 0 ? (
          <DiagramViewer files={diagramFiles} />
        ) : (
          <div className="flex items-center justify-center h-full text-dark-400">
            <div className="text-center">
              <GitBranch className="w-16 h-16 mx-auto mb-4 opacity-30" />
              <p>No diagrams generated yet</p>
              <p className="text-sm mt-2">Describe a system architecture or circuit to generate diagrams</p>
            </div>
          </div>
        );

      case 'code':
        return codeFiles.length > 0 ? (
          <div className="h-full flex flex-col">
            <FileViewer files={codeFiles} selectedFile={selectedFile} />
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-dark-400">
            <div className="text-center">
              <Code className="w-16 h-16 mx-auto mb-4 opacity-30" />
              <p>No code files generated yet</p>
              <p className="text-sm mt-2">Describe a software project to generate code</p>
            </div>
          </div>
        );

      case 'instructions':
        return <InstructionsTab />;

      default:
        return null;
    }
  };

  return (
    <div className="w-96 bg-dark-800 border-l border-dark-700 flex flex-col">
      {/* Tab Bar */}
      <div className="flex border-b border-dark-700">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-2 text-sm font-medium
              transition-colors relative
              ${activeTab === tab.id 
                ? 'text-primary-400' 
                : 'text-dark-400 hover:text-dark-300'
              }`}
          >
            {tab.icon}
            <span className="hidden lg:inline">{tab.label}</span>
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-500" />
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {renderContent()}
      </div>
    </div>
  );
}
