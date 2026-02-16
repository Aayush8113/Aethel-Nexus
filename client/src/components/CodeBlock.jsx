import { IoCopyOutline, IoCheckmarkOutline, IoResize } from "react-icons/io5";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useState } from "react";

const CodeBlock = ({ language, value, onOpenArtifact }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group rounded-lg overflow-hidden my-4 border border-slate-700 bg-[#282c34] shadow-md">
      {/* Mac-style Header */}
      <div className="flex justify-between items-center px-4 py-2 bg-[#1e222a] border-b border-slate-700/50 text-xs text-slate-400 select-none">
        <div className="flex gap-1.5">
           <div className="w-2.5 h-2.5 rounded-full bg-red-500/20 group-hover:bg-red-500/80 transition-colors"></div>
           <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20 group-hover:bg-yellow-500/80 transition-colors"></div>
           <div className="w-2.5 h-2.5 rounded-full bg-green-500/20 group-hover:bg-green-500/80 transition-colors"></div>
           <span className="ml-2 font-mono text-slate-500 uppercase opacity-50">{language}</span>
        </div>
        
        <div className="flex items-center gap-3">
           {/* Open Editor Button */}
           {onOpenArtifact && (
             <button 
               onClick={() => onOpenArtifact(value, language)}
               className="flex items-center gap-1.5 text-indigo-400 hover:text-indigo-300 transition-colors opacity-0 group-hover:opacity-100"
               title="Open in Full Screen Editor"
             >
               <IoResize size={14} />
               <span className="hidden sm:inline text-[10px]">Open Editor</span>
             </button>
           )}

           <button 
             onClick={handleCopy} 
             className="flex items-center gap-1.5 hover:text-white transition-colors"
           >
             {copied ? <IoCheckmarkOutline size={14} className="text-green-400" /> : <IoCopyOutline size={14} />}
           </button>
        </div>
      </div>
      
      <div className="overflow-x-auto custom-scrollbar">
        <SyntaxHighlighter
          language={language}
          style={oneDark}
          customStyle={{ margin: 0, padding: '1.5rem', fontSize: '0.9rem', lineHeight: '1.5' }}
          showLineNumbers={true}
          wrapLongLines={true}
        >
          {value}
        </SyntaxHighlighter>
      </div>
    </div>
  );
};

export default CodeBlock;