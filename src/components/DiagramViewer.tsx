import { useEffect, useRef, useState } from 'react';
import { GeneratedFile } from '../types';
import mermaid from 'mermaid';
import { GitBranch, Download } from 'lucide-react';
import { saveAs } from 'file-saver';

interface DiagramViewerProps {
  files: GeneratedFile[];
}

export function DiagramViewer({ files }: DiagramViewerProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme: 'dark',
      themeVariables: {
        darkMode: true,
        background: '#1e293b',
        primaryColor: '#0ea5e9',
        primaryTextColor: '#f8fafc',
        primaryBorderColor: '#3b82f6',
        lineColor: '#64748b',
        secondaryColor: '#334155',
        tertiaryColor: '#1e293b',
      },
    });
  }, []);

  useEffect(() => {
    const renderDiagram = async () => {
      if (!containerRef.current || files.length === 0) return;

      containerRef.current.innerHTML = '';
      const file = files[selectedIndex];
      
      try {
        const id = `mermaid-${Date.now()}`;
        const { svg } = await mermaid.render(id, file.content);
        containerRef.current.innerHTML = svg;
      } catch (error) {
        containerRef.current.innerHTML = `
          <div class="text-red-400 p-4">
            <p>Failed to render diagram</p>
            <pre class="mt-2 text-xs text-dark-400">${error instanceof Error ? error.message : 'Unknown error'}</pre>
          </div>
        `;
      }
    };

    renderDiagram();
  }, [files, selectedIndex]);

  const handleDownload = () => {
    if (files.length === 0 || !containerRef.current) return;
    
    const svg = containerRef.current.querySelector('svg');
    if (svg) {
      const svgData = new XMLSerializer().serializeToString(svg);
      const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
      saveAs(blob, `diagram_${selectedIndex + 1}.svg`);
    }
  };

  if (files.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-dark-400">
        <div className="text-center">
          <GitBranch className="w-16 h-16 mx-auto mb-4 opacity-30" />
          <p>No diagrams available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-3 border-b border-dark-700 flex items-center justify-between">
        <div>
          <h3 className="font-medium text-white text-sm">Diagram Viewer</h3>
          <p className="text-xs text-dark-400">
            {files.length > 1 ? `${selectedIndex + 1} of ${files.length}` : 'Mermaid diagram'}
          </p>
        </div>
        <button
          onClick={handleDownload}
          className="p-2 text-dark-400 hover:text-white hover:bg-dark-700 rounded-lg transition-colors"
          title="Download SVG"
        >
          <Download className="w-4 h-4" />
        </button>
      </div>

      {/* Tabs for multiple diagrams */}
      {files.length > 1 && (
        <div className="flex border-b border-dark-700 overflow-x-auto">
          {files.map((file, index) => (
            <button
              key={file.id}
              onClick={() => setSelectedIndex(index)}
              className={`px-3 py-2 text-xs font-medium whitespace-nowrap transition-colors
                ${selectedIndex === index 
                  ? 'text-primary-400 border-b-2 border-primary-500' 
                  : 'text-dark-400 hover:text-dark-300'
                }`}
            >
              {file.name}
            </button>
          ))}
        </div>
      )}

      {/* Diagram */}
      <div className="flex-1 overflow-auto p-4 bg-white/5">
        <div 
          ref={containerRef} 
          className="mermaid-container flex items-center justify-center min-h-[200px]"
        />
      </div>
    </div>
  );
}
