import { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { IoCheckmark, IoCopyOutline } from "react-icons/io5";

const CodeBlock = ({ language, value }) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="relative group rounded-lg overflow-hidden my-4 border border-gray-700">
      <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
        <span className="text-xs text-gray-400 lowercase">{language}</span>
        <button 
          onClick={handleCopy}
          className="flex items-center gap-2 text-xs text-gray-400 hover:text-white transition-colors"
        >
          {isCopied ? <IoCheckmark className="text-green-400" /> : <IoCopyOutline />}
          <span>{isCopied ? "Copied!" : "Copy code"}</span>
        </button>
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