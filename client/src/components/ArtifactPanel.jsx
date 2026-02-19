import { useEffect } from "react";
import { IoClose, IoCodeSlash, IoCopyOutline, IoDownloadOutline } from "react-icons/io5";
import CodeEditorWindow from "./CodeEditorWindow";
import { useNotify } from "../hooks/useNotify";
import { getExtension } from "../utils/languageMap";

const ArtifactPanel = ({ isOpen, onClose, code, language, onChange }) => {
  const { success } = useNotify();

  // Close on Escape key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    success("Code copied to clipboard!");
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([code], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `artifact_${Date.now()}.${getExtension(language)}`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    success("File downloaded!");
  };

  return (
    <div className="h-full flex flex-col bg-[#1e1e1e] border-l border-slate-700 shadow-2xl animate-slide-in-right">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-slate-700 bg-slate-800">
        <div className="flex items-center gap-3 text-indigo-400">
          <div className="p-1.5 bg-indigo-500/10 rounded-lg">
             <IoCodeSlash size={18} />
          </div>
          <div>
            <h2 className="font-bold text-white text-sm">Code Artifact</h2>
            <p className="text-[10px] text-slate-400 uppercase tracking-wider">{language}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-1">
          <button onClick={handleCopy} className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors" title="Copy Code">
            <IoCopyOutline size={18} />
          </button>
          <button onClick={handleDownload} className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors" title="Download File">
            <IoDownloadOutline size={18} />
          </button>
          <div className="w-px h-6 bg-slate-700 mx-2"></div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors" title="Close Panel">
            <IoClose size={20} />
          </button>
        </div>
      </div>

      {/* Editor Body */}
      <div className="flex-1 overflow-hidden relative">
        <CodeEditorWindow 
          code={code} 
          language={language} 
          onChange={onChange}
        />
      </div>
    </div>
  );
};

export default ArtifactPanel;