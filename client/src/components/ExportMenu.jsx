import { IoDocumentTextOutline, IoCodeSlashOutline, IoCopyOutline, IoPushOutline, IoSaveOutline, IoPieChartOutline, IoPrintOutline } from "react-icons/io5";
import { useRef } from "react";
import { exportAppBackup } from "../utils/backupUtils"; 

const ExportMenu = ({ isOpen, onExportMarkdown, onExportJSON, onCopyAll, onImportJSON, onImportBackup, onOpenAnalytics }) => {
  const fileInputRef = useRef(null);
  const backupInputRef = useRef(null);

  if (!isOpen) return null;

  return (
    <div className="absolute top-12 right-0 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-1 w-64 z-50 animate-fade-in origin-top-right print:hidden">
      <div className="px-3 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-800 mb-1">Current Chat</div>
      <button onClick={onOpenAnalytics} className="flex items-center gap-3 w-full px-3 py-2.5 text-sm text-slate-300 hover:bg-slate-800 hover:text-white rounded-lg transition-colors"><IoPieChartOutline size={16} className="text-purple-400" /><span>View Analytics</span></button>
      <button onClick={() => window.print()} className="flex items-center gap-3 w-full px-3 py-2.5 text-sm text-slate-300 hover:bg-slate-800 hover:text-white rounded-lg transition-colors"><IoPrintOutline size={16} className="text-blue-400"/><span>Print / Save as PDF</span></button>
      <button onClick={onExportMarkdown} className="flex items-center gap-3 w-full px-3 py-2.5 text-sm text-slate-300 hover:bg-slate-800 hover:text-white rounded-lg transition-colors"><IoDocumentTextOutline size={16} /><span>Export Markdown</span></button>
      <button onClick={onExportJSON} className="flex items-center gap-3 w-full px-3 py-2.5 text-sm text-slate-300 hover:bg-slate-800 hover:text-white rounded-lg transition-colors"><IoCodeSlashOutline size={16} /><span>Export JSON</span></button>
      <button onClick={onCopyAll} className="flex items-center gap-3 w-full px-3 py-2.5 text-sm text-indigo-400 hover:bg-slate-800 hover:text-indigo-300 rounded-lg transition-colors font-medium"><IoCopyOutline size={16} /><span>Copy All to Clipboard</span></button>
      
      <div className="h-px bg-slate-800 my-1 mx-2"></div>
      
      <div className="px-3 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-800 mb-1 mt-1">System Data</div>
      <input type="file" accept=".json" ref={fileInputRef} onChange={(e) => { if (e.target.files[0]) onImportJSON(e.target.files[0]); }} className="hidden" />
      <button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-3 w-full px-3 py-2 text-xs text-slate-300 hover:bg-slate-800 hover:text-emerald-300 rounded-lg transition-colors"><IoPushOutline size={14} /><span>Import JSON Chat</span></button>
      <button onClick={exportAppBackup} className="flex items-center gap-3 w-full px-3 py-2 text-xs text-slate-300 hover:bg-slate-800 hover:text-emerald-300 rounded-lg transition-colors"><IoSaveOutline size={14} /><span>Backup Full System</span></button>
      <input type="file" accept=".json" ref={backupInputRef} onChange={(e) => { if (e.target.files[0]) onImportBackup(e.target.files[0]); }} className="hidden" />
      <button onClick={() => backupInputRef.current?.click()} className="flex items-center gap-3 w-full px-3 py-2 text-xs text-slate-300 hover:bg-slate-800 hover:text-red-400 rounded-lg transition-colors"><IoPushOutline size={14} /><span>Restore Full System</span></button>
    </div>
  );
};
export default ExportMenu;