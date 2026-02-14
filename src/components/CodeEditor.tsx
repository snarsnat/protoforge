import { useRef, useEffect } from 'react';

interface CodeEditorProps {
  code: string;
  language: string;
  readOnly?: boolean;
  onChange?: (code: string) => void;
}

export function CodeEditor({ code, language, readOnly = false, onChange }: CodeEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const highlightRef = useRef<HTMLPreElement>(null);

  // Sync scroll between textarea and highlight
  const handleScroll = () => {
    if (textareaRef.current && highlightRef.current) {
      highlightRef.current.scrollTop = textareaRef.current.scrollTop;
      highlightRef.current.scrollLeft = textareaRef.current.scrollLeft;
    }
  };

  // Simple syntax highlighting
  const highlightCode = (text: string, lang: string) => {
    // Basic keyword highlighting
    const keywords: Record<string, string[]> = {
      javascript: ['const', 'let', 'var', 'function', 'return', 'if', 'else', 'for', 'while', 'class', 'import', 'export', 'from', 'async', 'await', 'try', 'catch', 'throw', 'new', 'this', 'typeof', 'instanceof'],
      typescript: ['const', 'let', 'var', 'function', 'return', 'if', 'else', 'for', 'while', 'class', 'import', 'export', 'from', 'async', 'await', 'try', 'catch', 'throw', 'new', 'this', 'typeof', 'interface', 'type', 'enum', 'implements', 'extends', 'public', 'private', 'protected', 'readonly'],
      python: ['def', 'class', 'return', 'if', 'else', 'elif', 'for', 'while', 'import', 'from', 'as', 'try', 'except', 'finally', 'with', 'lambda', 'yield', 'async', 'await', 'pass', 'break', 'continue'],
      html: ['html', 'head', 'body', 'div', 'span', 'p', 'a', 'img', 'script', 'style', 'link', 'meta', 'title', 'header', 'footer', 'nav', 'main', 'section', 'article', 'aside', 'form', 'input', 'button'],
      css: ['color', 'background', 'margin', 'padding', 'border', 'width', 'height', 'display', 'position', 'flex', 'grid', 'font', 'text', 'align', 'justify'],
      json: [],
      yaml: [],
      cpp: ['int', 'void', 'char', 'float', 'double', 'bool', 'class', 'struct', 'public', 'private', 'protected', 'return', 'if', 'else', 'for', 'while', 'include', 'define', 'using', 'namespace', 'std', 'const', 'virtual'],
    };

    let highlighted = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    // Comments
    highlighted = highlighted.replace(/(\/\/.*$|#.*$)/gm, '<span class="text-dark-500">$1</span>');
    highlighted = highlighted.replace(/(\/\*[\s\S]*?\*\/)/g, '<span class="text-dark-500">$1</span>');

    // Strings
    highlighted = highlighted.replace(/("(?:[^"\\]|\\.)*")/g, '<span class="text-green-400">$1</span>');
    highlighted = highlighted.replace(/('(?:[^'\\]|\\.)*')/g, '<span class="text-green-400">$1</span>');
    highlighted = highlighted.replace(/(`(?:[^`\\]|\\.)*`)/g, '<span class="text-green-400">$1</span>');

    // Numbers
    highlighted = highlighted.replace(/\b(\d+\.?\d*)\b/g, '<span class="text-orange-400">$1</span>');

    // Keywords
    const langKeywords = keywords[lang] || [];
    langKeywords.forEach((keyword) => {
      const regex = new RegExp(`\\b(${keyword})\\b`, 'g');
      highlighted = highlighted.replace(regex, '<span class="text-primary-400">$1</span>');
    });

    return highlighted;
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (onChange) {
      onChange(e.target.value);
    }
  };

  return (
    <div className="relative w-full code-editor">
      <div className="absolute top-0 left-0 right-0 bottom-0 overflow-hidden">
        <pre
          ref={highlightRef}
          className="absolute inset-0 p-3 text-sm leading-6 overflow-auto pointer-events-none"
          aria-hidden="true"
        >
          <code
            dangerouslySetInnerHTML={{ __html: highlightCode(code, language) + '\n' }}
          />
        </pre>
        <textarea
          ref={textareaRef}
          value={code}
          onChange={handleChange}
          onScroll={handleScroll}
          readOnly={readOnly}
          spellCheck={false}
          className="absolute inset-0 w-full h-full p-3 text-sm leading-6 bg-transparent 
                   text-transparent caret-white resize-none outline-none font-mono
                   scrollbar-thin"
          style={{ fontFamily: "'Fira Code', 'Monaco', 'Menlo', monospace" }}
        />
      </div>
    </div>
  );
}
