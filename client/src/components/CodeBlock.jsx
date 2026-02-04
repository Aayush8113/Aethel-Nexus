import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

const CodeBlock = ({ language, value }) => {
  return (
    <div className="relative group rounded-lg overflow-hidden my-4 border border-gray-700">
      <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
        <span className="text-xs text-gray-400 lowercase">{language}</span>
      </div>
      <SyntaxHighlighter 
        language={language || 'text'} 
        style={vscDarkPlus}
        customStyle={{ margin: 0, padding: '1.5rem', fontSize: '0.875rem' }}
      >
        {value}
      </SyntaxHighlighter>
    </div>
  );
};

export default CodeBlock;