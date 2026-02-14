import { useState } from "react";
import { IoEllipsisVertical } from "react-icons/io5";
import ExportMenu from "./ExportMenu";
import PersonaBadge from "./PersonaBadge";

const ChatHeader = ({ currentPersona, onExportMarkdown, onExportJSON }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="absolute top-0 left-0 right-0 z-20 flex items-start justify-between p-4 pointer-events-none">
      {/* Left: Persona Badge */}
      <div className="pointer-events-auto">
         <PersonaBadge persona={currentPersona} />
      </div>

      {/* Right: Export Menu */}
      <div className="relative pointer-events-auto">
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="p-2 transition-all border rounded-full shadow-lg bg-slate-900/80 backdrop-blur-md border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800"
        >
          <IoEllipsisVertical size={20} />
        </button>
        
        <ExportMenu 
          isOpen={isMenuOpen} 
          onExportMarkdown={() => { onExportMarkdown(); setIsMenuOpen(false); }}
          onExportJSON={() => { onExportJSON(); setIsMenuOpen(false); }}
        />
        
        {/* Backdrop to close menu */}
        {isMenuOpen && (
          <div className="fixed inset-0 z-40 bg-transparent" onClick={() => setIsMenuOpen(false)} />
        )}
      </div>
    </div>
  );
};

export default ChatHeader;