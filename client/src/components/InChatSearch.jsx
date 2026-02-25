import { IoSearch, IoClose } from "react-icons/io5";
import { useEffect, useRef } from "react";

const InChatSearch = ({ isOpen, query, setQuery, onClose, matchCount }) => {
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="absolute top-16 left-0 right-0 z-20 px-4 py-2 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 animate-fade-in-up flex items-center justify-center shadow-lg">
      <div className="w-full max-w-2xl relative flex items-center">
        <IoSearch className="absolute left-3 text-indigo-400" size={18} />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search this conversation..."
          className="w-full bg-slate-800 text-white pl-10 pr-24 py-2 rounded-lg border border-indigo-500/50 focus:border-indigo-400 outline-none text-sm transition-all"
        />
        <div className="absolute right-1 flex items-center gap-2">
          {query && (
            <span className="text-[10px] text-slate-400 font-mono">
              {matchCount} matches
            </span>
          )}
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded transition-colors">
            <IoClose size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default InChatSearch;