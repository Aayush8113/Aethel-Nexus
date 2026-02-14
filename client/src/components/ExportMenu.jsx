import { IoDownloadOutline, IoDocumentTextOutline, IoCodeSlashOutline, IoCopyOutline } from "react-icons/io5";

const ExportMenu = ({ isOpen, onExportMarkdown, onExportJSON, onCopyAll }) => {
  if (!isOpen) return null;

  return (
    <div className="absolute right-0 z-50 w-56 p-1 origin-top-right border shadow-2xl top-12 bg-slate-900 border-slate-700 rounded-xl animate-fade-in">
      <div className="px-3 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-800 mb-1">
        Export Chat
      </div>
      
      <button 
        onClick={onExportMarkdown}
        className="flex items-center gap-3 w-full px-3 py-2.5 text-sm text-slate-300 hover:bg-slate-800 hover:text-white rounded-lg transition-colors"
      >
        <IoDocumentTextOutline size={16} />
        <span>Markdown (.md)</span>
      </button>
      
      <button 
        onClick={onExportJSON}
        className="flex items-center gap-3 w-full px-3 py-2.5 text-sm text-slate-300 hover:bg-slate-800 hover:text-white rounded-lg transition-colors"
      >
        <IoCodeSlashOutline size={16} />
        <span>JSON Data (.json)</span>
      </button>

      <div className="h-px mx-2 my-1 bg-slate-800"></div>
      
      <button 
        onClick={onCopyAll}
        className="flex items-center gap-3 w-full px-3 py-2.5 text-sm text-indigo-400 hover:bg-slate-800 hover:text-indigo-300 rounded-lg transition-colors font-medium"
      >
        <IoCopyOutline size={16} />
        <span>Copy All to Clipboard</span>
      </button>
    </div>
  );
};

export default ExportMenu;