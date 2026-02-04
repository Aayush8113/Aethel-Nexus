import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

const CodeBlock = ({ language, value }) => {
  return (
    <div className="relative group rounded-lg overflow-hidden my-4">
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