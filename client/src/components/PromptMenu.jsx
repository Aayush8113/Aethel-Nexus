const PromptMenu = ({ isOpen, filteredPrompts, onSelect, activeIndex }) => {
  if (!isOpen || filteredPrompts.length === 0) return null;

  return (
    <div className="absolute bottom-full left-0 mb-2 w-64 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden z-50 animate-fade-in flex flex-col">
      <div className="px-3 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider bg-slate-950/50 border-b border-slate-800">
        Slash Commands
      </div>
      <div className="max-h-48 overflow-y-auto custom-scrollbar">
        {filteredPrompts.map((prompt, index) => (
          <button
            key={prompt.id}
            onClick={() => onSelect(prompt)}
            className={`w-full text-left px-3 py-2 text-sm transition-colors flex flex-col gap-0.5 ${
              index === activeIndex 
                ? "bg-indigo-600 text-white" 
                : "text-slate-300 hover:bg-slate-800"
            }`}
          >
            <span className="font-mono font-bold text-xs">{prompt.label}</span>
            <span className={`truncate text-[10px] ${index === activeIndex ? "text-indigo-200" : "text-slate-500"}`}>
              {prompt.text}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default PromptMenu;