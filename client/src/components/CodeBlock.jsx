import { IoCopyOutline, IoCheckmarkOutline, IoResize, IoChevronDown, IoChevronUp, IoDownloadOutline, IoMenuOutline } from "react-icons/io5";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark, dracula, materialDark, atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useState } from "react";
import { useCodeTheme } from "../hooks/useCodeTheme";
import { useCodeSettings } from "../hooks/useCodeSettings"; 
import { getExtension } from "../utils/languageMap";
import MermaidViewer from "./MermaidViewer"; // Day 27

const themeMap = { oneDark, dracula, materialDark, atomDark };

const CodeBlock = ({ language, value, onOpenArtifact }) => {
  const [copied, setCopied] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false); 
  
  const { activeThemeId } = useCodeTheme(); 
  const { showLineNumbers, wordWrap: globalWordWrap } = useCodeSettings(); 
  const [localWrap, setLocalWrap] = useState(globalWordWrap);

  // Day 27: Intercept Mermaid Language
  if (language === 'mermaid') {
    return <MermaidViewer chart={value} />;
  }

  const lineCount = value.split('\n').length;
  const isLongCode = lineCount > 15;

  const handleCopy = () => { navigator.clipboard.writeText(value); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  const handleDownload = () => {
    const ext = getExtension(language);
    const element = document.createElement("a");
    const file = new Blob([value], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `snippet_${Date.now()}.${ext}`;
    document.body.appendChild(element); element.click(); document.body.removeChild(element);
  };

  return (
    <div className="relative group rounded-lg overflow-hidden my-4 border border-slate-700 shadow-md bg-[#1e1e1e]">
      <div className="flex justify-between items-center px-4 py-2 bg-[#1e222a] border-b border-black/50 text-xs text-slate-400 select-none">
        <div className="flex gap-1.5 items-center">
           <div className="w-2.5 h-2.5 rounded-full bg-red-500/20 group-hover:bg-red-500/80 transition-colors"></div>
           <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20 group-hover:bg-yellow-500/80 transition-colors"></div>
           <div className="w-2.5 h-2.5 rounded-full bg-green-500/20 group-hover:bg-green-500/80 transition-colors"></div>
           <span className="ml-2 font-mono text-slate-500 uppercase opacity-50">{language}</span>
           {isLongCode && (
              <button onClick={() => setIsCollapsed(!isCollapsed)} className="ml-3 flex items-center gap-1 hover:text-white transition-colors">
                 {isCollapsed ? <><IoChevronDown/> Expand</> : <><IoChevronUp/> Collapse</>}
              </button>
           )}
        </div>
        <div className="flex items-center gap-3">
           <button onClick={() => setLocalWrap(!localWrap)} className={`flex items-center gap-1.5 transition-colors opacity-0 group-hover:opacity-100 ${localWrap ? 'text-indigo-400' : 'hover:text-white'}`} title="Toggle Wrap">
             <IoMenuOutline size={14} />
           </button>
           {onOpenArtifact && (
             <button onClick={() => onOpenArtifact(value, language)} className="flex items-center gap-1.5 text-indigo-400 hover:text-indigo-300 transition-colors opacity-0 group-hover:opacity-100" title="Open in Editor">
               <IoResize size={14} /><span className="hidden sm:inline text-[10px]">Editor</span>
             </button>
           )}
           <button onClick={handleDownload} className="flex items-center gap-1.5 hover:text-white transition-colors opacity-0 group-hover:opacity-100" title="Download Snippet">
             <IoDownloadOutline size={14} />
           </button>
           <button onClick={handleCopy} className="flex items-center gap-1.5 hover:text-white transition-colors" title="Copy">
             {copied ? <IoCheckmarkOutline size={14} className="text-green-400" /> : <IoCopyOutline size={14} />}
           </button>
        </div>
      </div>
      <div className={`overflow-x-auto custom-scrollbar transition-all duration-300 ${isCollapsed ? 'max-h-32' : ''}`}>
        <SyntaxHighlighter
          language={language} style={themeMap[activeThemeId] || oneDark}
          customStyle={{ margin: 0, padding: '1.5rem', fontSize: '0.9rem', lineHeight: '1.5', background: 'transparent' }}
          showLineNumbers={showLineNumbers} wrapLines={localWrap} wrapLongLines={localWrap}
        >
          {value}
        </SyntaxHighlighter>
      </div>
      {isCollapsed && (<div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#1e1e1e] to-transparent pointer-events-none"></div>)}
    </div>
  );
};
export default CodeBlock;