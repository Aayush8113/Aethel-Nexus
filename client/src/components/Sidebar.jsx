import { useState, useRef, useEffect } from "react";
import { IoChatboxOutline, IoAdd, IoCubeOutline, IoTrashOutline, IoSettingsOutline, IoHappyOutline, IoPin, IoPinOutline } from "react-icons/io5";
import SearchBar from "./SearchBar";
import { useTouchSwipe } from "../hooks/useTouchSwipe"; // New Hook

const Sidebar = ({ chats, activeChatId, onSelectChat, onNewChat, onDeleteChat, onTogglePin, onClearAll, onOpenSettings, onOpenPersonas, isOpen, onClose, isLoading, isInstallable, installApp }) => {
  const [search, setSearch] = useState("");
  const searchInputRef = useRef(null);

  // Swipe Logic
  const swipeHandlers = useTouchSwipe({
    onSwipeLeft: () => {
      if (isOpen && onClose) onClose();
    }
  });

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "/" && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const filteredChats = chats.filter(chat => 
    chat.title.toLowerCase().includes(search.toLowerCase())
  );

  const pinnedChats = filteredChats.filter(chat => chat.isPinned);
  const recentChats = filteredChats.filter(chat => !chat.isPinned);

  const renderChatList = (list, title) => {
    if (list.length === 0) return null;
    return (
      <div className="mb-6">
        <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 px-2 flex items-center gap-2">
           {title === "Pinned" && <IoPin className="text-indigo-400" size={10} />}
           {title}
        </h3>
        <div className="space-y-1">
          {list.map((chat) => (
            <div key={chat._id} className="relative group">
              <button
                onClick={() => onSelectChat(chat._id)}
                className={`w-full text-left px-3 py-2.5 rounded-lg flex items-center gap-3 transition-all ${
                  activeChatId === chat._id 
                    ? "bg-slate-800 text-indigo-300 border border-slate-700 shadow-sm ring-1 ring-slate-700/50" 
                    : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 border border-transparent"
                }`}
              >
                <div className={`transition-colors ${chat.isPinned ? "text-indigo-400" : "text-slate-500 group-hover:text-slate-400"}`}>
                  {chat.isPinned ? <IoPin size={14} /> : <IoChatboxOutline size={16} />}
                </div>
                <span className="pr-12 text-sm font-medium truncate">{chat.title}</span>
              </button>
              
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all z-10 bg-slate-900/90 backdrop-blur rounded px-1 py-0.5 border border-slate-800 shadow-lg">
                 <button onClick={(e) => { e.stopPropagation(); onTogglePin(chat._id); }} className="p-1.5 text-slate-500 hover:text-indigo-400 hover:bg-slate-800 rounded transition-colors">
                    {chat.isPinned ? <IoPin size={13} /> : <IoPinOutline size={13} />}
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); onDeleteChat(chat._id); }} className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-slate-800 rounded transition-colors">
                    <IoTrashOutline size={13} />
                  </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div 
      {...swipeHandlers}
      className={`
      fixed inset-y-0 left-0 z-30 w-72 bg-slate-900/95 backdrop-blur-2xl border-r border-slate-800 transform transition-transform duration-300 ease-in-out
      ${isOpen ? "translate-x-0" : "-translate-x-full"}
      md:relative md:translate-x-0 flex flex-col h-full
    `}>
      <div className="flex flex-col h-full p-4">
        <div className="flex items-center gap-3 mb-6 px-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <IoCubeOutline size={20} className="text-white" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">Aethel</h1>
        </div>

        <SearchBar ref={searchInputRef} value={search} onChange={setSearch} />

        <button onClick={onNewChat} className="flex items-center justify-center gap-2 w-full px-4 py-2.5 mb-6 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition-all shadow-lg shadow-indigo-500/20 font-medium text-sm border border-indigo-500/50 hover:border-indigo-400">
          <IoAdd size={18} /><span>New Chat</span>
        </button>

        <div className="flex-1 pr-1 -mr-2 overflow-y-auto custom-scrollbar">
          {isLoading ? (
            <div className="px-2 mt-2 space-y-3">
              <div className="w-full h-10 rounded-lg bg-slate-800/50 animate-pulse"></div>
            </div>
          ) : chats.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 px-4 mt-8 text-center opacity-50">
               <IoChatboxOutline size={32} className="mb-2 text-slate-600" />
               <p className="text-sm italic text-slate-500">No history found.</p>
            </div>
          ) : (
            <> {renderChatList(pinnedChats, "Pinned")} {renderChatList(recentChats, "Recent")} </>
          )}
        </div>
        
        <div className="pt-4 mt-4 space-y-1 border-t border-slate-800/50">
          {isInstallable && (
            <button onClick={installApp} className="flex items-center justify-center gap-2 w-full px-4 py-2 mb-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-lg transition-all shadow-lg font-bold text-xs">
              <IoCubeOutline /><span>Install App</span>
            </button>
          )}

          {chats.length > 0 && (
            <button onClick={onClearAll} className="flex items-center w-full gap-3 p-2 px-3 mb-2 transition-colors border border-transparent rounded-lg hover:bg-red-500/10 group hover:border-red-500/20">
               <div className="transition-colors text-slate-500 group-hover:text-red-400"><IoTrashOutline size={16} /></div>
               <span className="text-xs font-medium text-slate-500 group-hover:text-red-400">Clear History</span>
            </button>
          )}
          
          <button onClick={onOpenPersonas} className="flex items-center w-full gap-3 p-2 px-2 transition-colors rounded-lg hover:bg-slate-800 group">
            <div className="p-1.5 bg-slate-800 group-hover:bg-slate-700 rounded-lg text-slate-400 group-hover:text-indigo-400 border border-slate-700 group-hover:border-slate-600 transition-all"><IoHappyOutline size={16} /></div>
            <div className="text-left"><p className="text-xs font-medium transition-colors text-slate-300 group-hover:text-white">Persona</p></div>
          </button>

          <button onClick={onOpenSettings} className="flex items-center w-full gap-3 p-2 px-2 transition-colors rounded-lg hover:bg-slate-800 group">
            <div className="p-1.5 bg-slate-800 group-hover:bg-slate-700 rounded-lg text-slate-400 group-hover:text-indigo-400 border border-slate-700 group-hover:border-slate-600 transition-all"><IoSettingsOutline size={16} /></div>
            <div className="text-left"><p className="text-xs font-medium transition-colors text-slate-300 group-hover:text-white">Settings</p></div>
          </button>
          
          <div className="flex items-center gap-2 px-3 py-1 mt-2 group cursor-help relative" title="Gemini 2.0 Flash Active">
             <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.6)]"></div>
             <span className="text-[10px] text-slate-500 font-mono uppercase tracking-widest group-hover:text-emerald-400 transition-colors">
               Model Online
             </span>
             <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max px-2 py-1 bg-slate-800 text-[10px] text-slate-300 rounded border border-slate-700 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                Gemini 2.0 Flash
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;