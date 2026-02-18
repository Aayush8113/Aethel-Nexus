import { useState } from "react";
import { IoEllipsisVertical } from "react-icons/io5";
import ExportMenu from "./ExportMenu";
import PersonaBadge from "./PersonaBadge";
import FocusToggle from "./FocusToggle"; // New

const ChatHeader = ({ currentPersona, onExportMarkdown, onExportJSON, onCopyAll, isFocusMode, onToggleFocus }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className={`absolute top-0 left-0 right-0 p-4 flex justify-between items-start pointer-events-none z-20 transition-all duration-500 ${isFocusMode ? "-translate-y-full opacity-0" : "translate-y-0 opacity-100"}`}>
      {/* Left: Persona Badge */}
      <div className="pointer-events-auto">
         <PersonaBadge persona={currentPersona} />
      </div>

      {/* Right: Actions */}
      <div className="pointer-events-auto flex items-center gap-2">
        {/* Focus Toggle */}
        <FocusToggle isFocusMode={isFocusMode} onToggle={onToggleFocus} />

        {/* Export Menu */}
        <div className="relative">
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`p-2 backdrop-blur-md border rounded-full transition-all shadow-lg ${
               isMenuOpen 
               ? "bg-slate-800 text-white border-slate-600" 
               : "bg-slate-900/80 text-slate-400 border-slate-700 hover:text-white hover:bg-slate-800"
            }`}
          >
            <IoEllipsisVertical size={20} />
          </button>
          
          <ExportMenu 
            isOpen={isMenuOpen} 
            onExportMarkdown={() => { onExportMarkdown(); setIsMenuOpen(false); }}
            onExportJSON={() => { onExportJSON(); setIsMenuOpen(false); }}
            onCopyAll={() => { onCopyAll(); setIsMenuOpen(false); }}
          />
          
          {isMenuOpen && (
            <div className="fixed inset-0 z-40 bg-transparent" onClick={() => setIsMenuOpen(false)} />
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;