import { useEffect, useState } from "react";
import { IoClose, IoCodeSlash, IoCopyOutline, IoDownloadOutline, IoTrashOutline, IoMenuOutline, IoAddCircleOutline, IoRemoveCircleOutline, IoPlay } from "react-icons/io5";
import CodeEditorWindow from "./CodeEditorWindow";
import ConsoleOutput from "./ConsoleOutput";
import { useNotify } from "../hooks/useNotify";
import { getExtension } from "../utils/languageMap";
import { useArtifactZoom } from "../hooks/useArtifactZoom"; 

const ArtifactPanel = ({ isOpen, onClose, code, language, onChange }) => {
  const { success, error: notifyError } = useNotify();
  const [wordWrap, setWordWrap] = useState("on");
  const { fontSize, zoomIn, zoomOut } = useArtifactZoom(); 
  
  // New State for the Execution Engine
  const [consoleOutput, setConsoleOutput] = useState(null); 

  useEffect(() => {
    const handleEsc = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  if (!isOpen) return null;

  const handleCopy = () => { navigator.clipboard.writeText(code); success("Code copied to clipboard!"); };
  
  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([code], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `artifact_${Date.now()}.${getExtension(language)}`;
    document.body.appendChild(element); element.click(); document.body.removeChild(element);
    success("File downloaded!");
  };

  // ==========================================
  // IN-BROWSER JAVASCRIPT EXECUTION ENGINE
  // ==========================================
  const handleRunCode = () => {
    const isJS = language.toLowerCase() === 'javascript' || language.toLowerCase() === 'js';
    
    if (!isJS) {
      notifyError("Execution Engine currently only supports JavaScript.");
      setConsoleOutput(["❌ Error: Execution Engine currently only supports JavaScript (Node/Browser)."]);
      return;
    }

    setConsoleOutput([]); // Open the console window
    const logs = [];
    
    // 1. Temporarily hijack the browser's console to capture outputs
    const originalLog = console.log;
    const originalError = console.error;

    console.log = (...args) => {
      logs.push(args.map(a => typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a)).join(' '));
      originalLog(...args); // Keep logging to actual dev tools too
    };

    console.error = (...args) => {
      logs.push("❌ Error: " + args.map(a => typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a)).join(' '));
      originalError(...args);
    };

    // 2. Safely evaluate the code
    try {
      // Using new Function creates a scoped execution environment
      const execute = new Function(code);
      execute();
      
      if (logs.length === 0) {
        logs.push("Execution finished successfully (No console output).");
      }
      success("Code executed successfully!");
    } catch (err) {
      logs.push(`❌ Error: ${err.name} - ${err.message}`);
      notifyError("Execution failed. Check console.");
    } finally {
      // 3. Always restore the original console, even if code crashes
      console.log = originalLog;
      console.error = originalError;
      setConsoleOutput([...logs]);
    }
  };

  return (
    <div className="h-full flex flex-col bg-[#1e1e1e] border-l border-slate-700 shadow-2xl animate-fade-in print:hidden">
      
      {/* Header Toolbar */}
      <div className="flex items-center justify-between p-3 border-b border-black/50 bg-[#252526] overflow-x-auto custom-scrollbar">
        <div className="flex items-center gap-3 text-indigo-400 min-w-max">
          <div className="p-1.5 bg-indigo-500/10 rounded-lg"><IoCodeSlash size={18} /></div>
          <div><h2 className="font-bold text-white text-sm">Code Artifact</h2><p className="text-[10px] text-slate-400 uppercase tracking-wider">{language}</p></div>
        </div>
        
        <div className="flex items-center gap-1 min-w-max pl-4">
          
          {/* NEW: Run Code Button */}
          <button onClick={handleRunCode} className="flex items-center gap-2 px-3 py-1.5 bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600 hover:text-white rounded-lg transition-all border border-emerald-500/30 shadow-sm font-bold text-xs tracking-wide mr-2" title="Execute JavaScript">
            <IoPlay size={14} /> Run Code
          </button>
          
          <span className="text-[10px] text-slate-500 font-mono mr-1">{fontSize}px</span>
          <button onClick={zoomOut} className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors" title="Zoom Out"><IoRemoveCircleOutline size={16} /></button>
          <button onClick={zoomIn} className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors" title="Zoom In"><IoAddCircleOutline size={16} /></button>
          
          <div className="w-px h-6 bg-slate-700 mx-1"></div>
          
          <button onClick={() => setWordWrap(prev => prev === "on" ? "off" : "on")} className={`p-2 rounded-lg transition-colors ${wordWrap === "on" ? "text-indigo-400 bg-indigo-500/10" : "text-slate-400 hover:text-white hover:bg-slate-800"}`} title="Toggle Word Wrap"><IoMenuOutline size={18} /></button>
          <button onClick={() => onChange("")} className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors" title="Clear Editor"><IoTrashOutline size={18} /></button>
          <div className="w-px h-6 bg-slate-700 mx-1"></div>
          <button onClick={handleCopy} className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors" title="Copy Code"><IoCopyOutline size={18} /></button>
          <button onClick={handleDownload} className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors" title="Download"><IoDownloadOutline size={18} /></button>
          <div className="w-px h-6 bg-slate-700 mx-1"></div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors" title="Close"><IoClose size={20} /></button>
        </div>
      </div>

      {/* Editor Area */}
      <div className="flex-1 overflow-hidden relative flex flex-col">
        <div className="flex-1 overflow-hidden">
          <CodeEditorWindow code={code} language={language} onChange={onChange} wordWrap={wordWrap} fontSize={fontSize} />
        </div>
        
        {/* NEW: Dynamic Console Output */}
        <ConsoleOutput 
          output={consoleOutput} 
          onClear={() => setConsoleOutput([])} 
          onClose={() => setConsoleOutput(null)} 
        />
      </div>

    </div>
  );
};

export default ArtifactPanel;