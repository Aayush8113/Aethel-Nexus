import { IoDownloadOutline, IoCopyOutline, IoSettingsOutline, IoMenuOutline, IoCodeSlash, IoSearchOutline, IoBookmarkOutline } from "react-icons/io5";

// 🟢 DAY 35: Available Models Map
const AVAILABLE_MODELS = [
  { id: 'gemini-2.0-flash', label: 'Gemini 2.0 Flash (Fast)' },
  { id: 'gemini-1.5-pro', label: 'Gemini 1.5 Pro (Reasoning)' },
  { id: 'gemini-1.5-flash', label: 'Gemini 1.5 Flash (Legacy)' }
];

const ChatHeader = ({ currentPersona, onExportMarkdown, onExportJSON, onCopyAll, onImportJSON, onImportBackup, onOpenAnalytics, isFocusMode, onToggleFocus, hasCustomPrompt, onToggleSearch, isSearchOpen, onToggleBookmarks, onToggleDesktopSidebar, activeModel, setActiveModel }) => {
  return (
    <div className={`p-4 flex justify-between items-center border-b border-slate-800/50 bg-slate-950/80 backdrop-blur-md sticky top-0 z-20 transition-all duration-300 print:hidden ${isFocusMode ? "-translate-y-full opacity-0 pointer-events-none absolute w-full" : "translate-y-0 opacity-100"}`}>
      
      <div className="flex items-center gap-3">
        <button onClick={onToggleDesktopSidebar} className="hidden md:flex p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"><IoMenuOutline size={20} /></button>
        <div className="flex flex-col">
          <h1 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 drop-shadow-sm flex items-center gap-2">
            {currentPersona.name} {hasCustomPrompt && <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" title="Custom System Prompt Active" />}
          </h1>
          
          {/* 🟢 DAY 35: The Model Selector Dropdown */}
          <select 
            value={activeModel} 
            onChange={(e) => setActiveModel(e.target.value)}
            className="text-[10px] text-slate-400 bg-transparent outline-none cursor-pointer hover:text-indigo-400 transition-colors uppercase tracking-wider font-bold appearance-none"
          >
            {AVAILABLE_MODELS.map(m => <option key={m.id} value={m.id} className="bg-slate-900 text-white">{m.label}</option>)}
          </select>
        </div>
      </div>

      <div className="flex gap-1 md:gap-2">
        <button onClick={onToggleSearch} className={`p-2 rounded-xl transition-all ${isSearchOpen ? "bg-indigo-600/20 text-indigo-400 border border-indigo-500/30" : "text-slate-400 hover:text-white hover:bg-slate-800 border border-transparent"}`} title="Search Chat"><IoSearchOutline size={18} /></button>
        <button onClick={onToggleBookmarks} className="hidden sm:block p-2 text-slate-400 hover:text-amber-400 hover:bg-slate-800 rounded-xl transition-colors" title="Bookmarks"><IoBookmarkOutline size={18} /></button>
        <button onClick={onCopyAll} className="hidden sm:block p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors" title="Copy All"><IoCopyOutline size={18} /></button>
        
        <div className="relative group">
          <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"><IoDownloadOutline size={18} /></button>
          <div className="absolute right-0 mt-1 w-32 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 flex flex-col py-1">
            <button onClick={onExportMarkdown} className="text-left px-4 py-2 text-xs text-slate-300 hover:bg-indigo-600 hover:text-white flex items-center gap-2"><IoCodeSlash size={14}/> Export .MD</button>
            <button onClick={onExportJSON} className="text-left px-4 py-2 text-xs text-slate-300 hover:bg-indigo-600 hover:text-white flex items-center gap-2"><IoCodeSlash size={14}/> Export JSON</button>
          </div>
        </div>

        <button onClick={onToggleFocus} className="hidden sm:block p-2 text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-xl transition-colors" title="Focus Mode"><IoCodeSlash size={18} /></button>
      </div>
    </div>
  );
};

export default ChatHeader;