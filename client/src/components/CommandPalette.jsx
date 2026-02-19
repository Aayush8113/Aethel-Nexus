import { useState, useEffect, useRef } from "react";
import { IoSearch, IoChatboxOutline, IoSettingsOutline, IoAdd, IoExpand } from "react-icons/io5";

const CommandPalette = ({ isOpen, onClose, chats, onSelectChat, onNewChat, onOpenSettings, onToggleFocus }) => {
  const [query, setQuery] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const filteredChats = chats.filter(c => c.title.toLowerCase().includes(query.toLowerCase())).slice(0, 5);

  const handleAction = (action) => {
    action();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div 
        className="w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden animate-fade-in-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center px-4 py-3 border-b border-slate-800">
          <IoSearch className="text-slate-400 mr-3" size={20} />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search chats or type a command..."
            className="w-full bg-transparent text-white outline-none placeholder-slate-500 text-lg"
            onKeyDown={(e) => { if (e.key === "Escape") onClose(); }}
          />
          <kbd className="hidden sm:inline-block bg-slate-800 text-slate-400 text-[10px] px-2 py-1 rounded border border-slate-700 font-mono">ESC</kbd>
        </div>

        <div className="max-h-96 overflow-y-auto p-2">
          {/* Actions Section */}
          {!query && (
            <div className="mb-4">
              <div className="px-3 py-1 text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</div>
              <button onClick={() => handleAction(onNewChat)} className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-300 hover:bg-indigo-600 hover:text-white rounded-lg transition-colors text-left">
                <IoAdd /> New Chat
              </button>
              <button onClick={() => handleAction(onToggleFocus)} className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-300 hover:bg-indigo-600 hover:text-white rounded-lg transition-colors text-left">
                <IoExpand /> Toggle Zen Mode
              </button>
              <button onClick={() => handleAction(onOpenSettings)} className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-300 hover:bg-indigo-600 hover:text-white rounded-lg transition-colors text-left">
                <IoSettingsOutline /> Open Settings
              </button>
            </div>
          )}

          {/* Chats Section */}
          <div>
            <div className="px-3 py-1 text-xs font-bold text-slate-500 uppercase tracking-wider">Recent Chats</div>
            {filteredChats.length > 0 ? (
              filteredChats.map(chat => (
                <button 
                  key={chat._id}
                  onClick={() => handleAction(() => onSelectChat(chat._id))}
                  className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-slate-300 hover:bg-slate-800 rounded-lg transition-colors text-left group"
                >
                  <IoChatboxOutline className="text-slate-500 group-hover:text-indigo-400" />
                  <span className="truncate">{chat.title}</span>
                </button>
              ))
            ) : (
              <div className="px-3 py-4 text-center text-sm text-slate-500">No matching chats found.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommandPalette;