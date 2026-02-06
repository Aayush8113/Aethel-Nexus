import { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { IoCheckmark, IoCopyOutline } from "react-icons/io5";
import { useNotify } from "../hooks/useNotify";

const CodeBlock = ({ language, value }) => {
  const [isCopied, setIsCopied] = useState(false);
  const { success } = useNotify();

  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    setIsCopied(true);
    success("Code copied to clipboard");
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="relative my-4 overflow-hidden border rounded-lg shadow-lg group border-slate-700">
      <div className="flex items-center justify-between px-4 py-2 border-b bg-slate-800 border-slate-700">
        <span className="font-mono text-xs lowercase text-slate-400">{language}</span>
        <button 
          onClick={handleCopy}
          className="flex items-center gap-2 text-xs transition-colors text-slate-400 hover:text-white"
        >
          {isCopied ? <IoCheckmark className="text-green-400" /> : <IoCopyOutline />}
          <span>{isCopied ? "Copied!" : "Copy"}</span>
        </button>
      </div>
      <SyntaxHighlighter 
        language={language || 'text'} 
        style={vscDarkPlus}
        customStyle={{ margin: 0, padding: '1.5rem', fontSize: '0.875rem', backgroundColor: '#0f172a' }}
      >
        {value}
      </SyntaxHighlighter>
    </div>
  );
};

export default CodeBlock;