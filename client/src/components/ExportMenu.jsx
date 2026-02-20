import { IoDocumentTextOutline, IoCodeSlashOutline, IoCopyOutline, IoPushOutline } from "react-icons/io5";
import { useRef } from "react";

const ExportMenu = ({ isOpen, onExportMarkdown, onExportJSON, onCopyAll, onImportJSON }) => {
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && onImportJSON) onImportJSON(file);
    if (fileInputRef.current) fileInputRef.current.value = ''; // reset
  };

  return (
    <div className="absolute top-12 right-0 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-1 w-56 z-50 animate-fade-in origin-top-right">
      <div className="px-3 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-800 mb-1">
        Data Options
      </div>
      
      <button onClick={onExportMarkdown} className="flex items-center gap-3 w-full px-3 py-2.5 text-sm text-slate-300 hover:bg-slate-800 hover:text-white rounded-lg transition-colors">
        <IoDocumentTextOutline size={16} /><span>Export Markdown</span>
      </button>
      <button onClick={onExportJSON} className="flex items-center gap-3 w-full px-3 py-2.5 text-sm text-slate-300 hover:bg-slate-800 hover:text-white rounded-lg transition-colors">
        <IoCodeSlashOutline size={16} /><span>Export JSON</span>
      </button>

      <div className="h-px bg-slate-800 my-1 mx-2"></div>
      
      {/* Import Button */}
      <input type="file" accept=".json" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
      <button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-3 w-full px-3 py-2.5 text-sm text-emerald-400 hover:bg-slate-800 hover:text-emerald-300 rounded-lg transition-colors font-medium">
        <IoPushOutline size={16} /><span>Import JSON Chat</span>
      </button>

      <div className="h-px bg-slate-800 my-1 mx-2"></div>
      
      <button onClick={onCopyAll} className="flex items-center gap-3 w-full px-3 py-2.5 text-sm text-indigo-400 hover:bg-slate-800 hover:text-indigo-300 rounded-lg transition-colors font-medium">
        <IoCopyOutline size={16} /><span>Copy All to Clipboard</span>
      </button>
    </div>
  );
};

export default ExportMenu;