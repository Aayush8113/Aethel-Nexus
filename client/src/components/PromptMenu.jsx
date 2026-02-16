const PromptMenu = ({ isOpen, filteredPrompts, onSelect, activeIndex }) => {
  if (!isOpen || filteredPrompts.length === 0) return null;

  return (
    <div className="absolute bottom-16 left-0 w-64 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden z-50 animate-fade-in flex flex-col">
      <div className="px-3 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider bg-slate-950/50">
        Slash Commands
      </div>
      <div className="max-h-48 overflow-y-auto custom-scrollbar">
        {filteredPrompts.map((prompt, index) => (
          <button
            key={prompt.id}
            onClick={() => onSelect(prompt)}
            className={`w-full text-left px-3 py-2 text-sm transition-colors flex items-center gap-2 ${
              index === activeIndex 
                ? "bg-indigo-600 text-white" 
                : "text-slate-300 hover:bg-slate-800"
            }`}
          >
            <span className="font-mono font-bold">{prompt.label}</span>
            <span className="truncate opacity-70 text-xs">{prompt.text}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default PromptMenu;