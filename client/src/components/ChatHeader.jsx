import { useState } from "react";
import { IoEllipsisVertical, IoWarningOutline, IoSearch, IoBookmark, IoMenuOutline } from "react-icons/io5";
import ExportMenu from "./ExportMenu";
import PersonaBadge from "./PersonaBadge";
import FocusToggle from "./FocusToggle";

const ChatHeader = ({ currentPersona, onExportMarkdown, onExportJSON, onCopyAll, onImportJSON, onImportBackup, onOpenAnalytics, isFocusMode, onToggleFocus, hasCustomPrompt, onToggleSearch, isSearchOpen, onToggleBookmarks, onToggleDesktopSidebar }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className={`absolute top-0 left-0 right-0 p-4 flex justify-between items-start pointer-events-none z-30 transition-all duration-500 ${isFocusMode ? "-translate-y-full opacity-0" : "translate-y-0 opacity-100"}`}>
      <div className="pointer-events-auto flex items-center gap-3">
         
         {/* Day 27: Desktop Sidebar Toggle */}
         <button onClick={onToggleDesktopSidebar} className="hidden md:flex p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors border border-transparent hover:border-slate-700 backdrop-blur" title="Toggle Sidebar">
            <IoMenuOutline size={20} />
         </button>

         <PersonaBadge persona={currentPersona} />
         
         {hasCustomPrompt && (
            <div className="flex items-center gap-1 text-[10px] font-bold text-amber-500 bg-amber-500/10 px-2 py-1 rounded-full border border-amber-500/20 shadow-sm backdrop-blur" title="Custom System Prompt Active">
               <IoWarningOutline size={12} /> <span className="hidden sm:inline">Custom Rule</span>
            </div>
         )}
      </div>
      <div className="pointer-events-auto flex items-center gap-2">
        
        <button onClick={onToggleBookmarks} className="p-2 rounded-full transition-all duration-300 bg-slate-900/80 text-amber-400 border border-slate-700 hover:bg-slate-800" title="View Bookmarks"><IoBookmark size={18} /></button>
        <button onClick={onToggleSearch} className={`p-2 rounded-full transition-all duration-300 ${isSearchOpen ? "bg-indigo-600 text-white shadow-lg" : "bg-slate-900/80 text-slate-400 border border-slate-700 hover:text-white hover:bg-slate-800"}`} title="Search Chat"><IoSearch size={18} /></button>
        <FocusToggle isFocusMode={isFocusMode} onToggle={onToggleFocus} />
        
        <div className="relative">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className={`p-2 backdrop-blur-md border rounded-full transition-all shadow-lg ${isMenuOpen ? "bg-slate-800 text-white border-slate-600" : "bg-slate-900/80 text-slate-400 border-slate-700 hover:text-white hover:bg-slate-800"}`}><IoEllipsisVertical size={20} /></button>
          <ExportMenu 
            isOpen={isMenuOpen} onExportMarkdown={() => { onExportMarkdown(); setIsMenuOpen(false); }} onExportJSON={() => { onExportJSON(); setIsMenuOpen(false); }} 
            onCopyAll={() => { onCopyAll(); setIsMenuOpen(false); }} onImportJSON={(file) => { onImportJSON(file); setIsMenuOpen(false); }} 
            onImportBackup={(file) => { onImportBackup(file); setIsMenuOpen(false); }} 
            onOpenAnalytics={() => { onOpenAnalytics(); setIsMenuOpen(false); }} // Day 27
          />
          {isMenuOpen && <div className="fixed inset-0 z-40 bg-transparent" onClick={() => setIsMenuOpen(false)} />}
        </div>
      </div>
    </div>
  );
};
export default ChatHeader;