import { IoClose, IoCodeSlash, IoCopyOutline, IoDownloadOutline } from "react-icons/io5";
import CodeEditorWindow from "./CodeEditorWindow";
import { useNotify } from "../hooks/useNotify";

const ArtifactPanel = ({ isOpen, onClose, code, language, onChange }) => {
  const { success } = useNotify();

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    success("Code copied to clipboard!");
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([code], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `code.${language === "javascript" ? "js" : language}`;
    document.body.appendChild(element);
    element.click();
    success("File downloaded!");
  };

  return (
    <div className={`fixed inset-y-0 right-0 w-full md:w-[50%] bg-slate-900 border-l border-slate-700 shadow-2xl transform transition-transform duration-300 z-40 flex flex-col ${isOpen ? "translate-x-0" : "translate-x-full"}`}>
      
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-700 bg-slate-800">
        <div className="flex items-center gap-2 text-indigo-400">
          <IoCodeSlash size={20} />
          <h2 className="font-bold text-white">Code Artifact</h2>
          <span className="text-xs bg-slate-700 text-slate-300 px-2 py-0.5 rounded uppercase">{language}</span>
        </div>
        
        <div className="flex items-center gap-2">
          <button onClick={handleCopy} className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors" title="Copy">
            <IoCopyOutline size={18} />
          </button>
          <button onClick={handleDownload} className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors" title="Download">
            <IoDownloadOutline size={18} />
          </button>
          <div className="w-px h-6 bg-slate-600 mx-1"></div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors">
            <IoClose size={20} />
          </button>
        </div>
      </div>

      {/* Editor Body */}
      <div className="flex-1 p-0 overflow-hidden">
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