import { useState, useEffect } from "react";
import { IoAdd, IoChatbubbleOutline, IoSettingsOutline, IoTrashOutline, IoPinOutline, IoPin, IoPeopleOutline, IoSearchOutline, IoClose, IoCopyOutline } from "react-icons/io5";
import { searchGlobalChats, forkChat } from "../services/api"; 
import { useNotify } from "../hooks/useNotify"; 

const Sidebar = ({ chats, activeChatId, onSelectChat, onNewChat, isOpen, onClose, onDeleteChat, onTogglePin, onClearAll, onRenameChat, onOpenSettings, onOpenPersonas, isInstallable, installApp, isDesktopSidebarOpen, reloadChats }) => {
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const { success, error: notifyError } = useNotify();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const handleSearch = async () => {
      if (searchQuery.length > 2) {
        setIsSearching(true);
        const results = await searchGlobalChats(searchQuery);
        setSearchResults(results);
        setIsSearching(false);
      } else {
        setSearchResults([]);
      }
    };
    const timeoutId = setTimeout(handleSearch, 400); 
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const displayChats = searchQuery.length > 2 ? searchResults : chats;
  const pinnedChats = displayChats.filter(c => c.isPinned);
  const unpinnedChats = displayChats.filter(c => !c.isPinned);

  const startEdit = (e, chat) => { e.stopPropagation(); setEditingId(chat._id); setEditTitle(chat.title); };
  
  const submitEdit = (e, id) => {
    e.preventDefault(); e.stopPropagation();
    if (editTitle.trim()) { onRenameChat(id, editTitle.trim()); }
    setEditingId(null);
  };

  // 🟢 DAY 34: The Fork Handler
  const handleFork = async (e, id) => {
    e.stopPropagation();
    try {
      const newChat = await forkChat(id);
      success("Workspace duplicated!");
      if (reloadChats) reloadChats(); 
      onSelectChat(newChat._id); 
    } catch (err) {
      notifyError("Failed to duplicate workspace.");
    }
  };

  const renderChatItem = (chat) => (
    <div key={chat._id} className={`group flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all duration-200 ${activeChatId === chat._id ? "bg-indigo-600/20 text-indigo-400 border border-indigo-500/30" : "hover:bg-slate-800 text-slate-300 border border-transparent"}`} onClick={() => onSelectChat(chat._id)}>
      <div className="flex items-center gap-3 overflow-hidden flex-1">
        <IoChatbubbleOutline className={`flex-shrink-0 ${activeChatId === chat._id ? "text-indigo-400" : "text-slate-500"}`} size={18} />
        {editingId === chat._id ? (
          <form onSubmit={(e) => submitEdit(e, chat._id)} className="w-full">
            <input autoFocus type="text" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} onBlur={(e) => submitEdit(e, chat._id)} onClick={(e) => e.stopPropagation()} className="w-full bg-slate-900 text-white px-2 py-1 rounded text-sm border border-indigo-500 outline-none" />
          </form>
        ) : (
          <span className="truncate text-sm font-medium">{chat.title}</span>
        )}
      </div>
      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity ml-2">
        {!searchQuery && <button onClick={(e) => { e.stopPropagation(); onTogglePin(chat._id); }} className="p-1.5 text-slate-400 hover:text-amber-400 hover:bg-slate-700 rounded-lg transition-colors" title="Pin">{chat.isPinned ? <IoPin size={14} className="text-amber-400"/> : <IoPinOutline size={14}/>}</button>}
        
        {/* 🟢 DAY 34: Fork Action Button */}
        <button onClick={(e) => handleFork(e, chat._id)} className="p-1.5 text-slate-400 hover:text-emerald-400 hover:bg-slate-700 rounded-lg transition-colors" title="Duplicate Workspace"><IoCopyOutline size={14} /></button>
        
        <button onClick={(e) => startEdit(e, chat)} className="p-1.5 text-slate-400 hover:text-blue-400 hover:bg-slate-700 rounded-lg transition-colors" title="Rename"><IoChatbubbleOutline size={14} /></button>
        <button onClick={(e) => { e.stopPropagation(); onDeleteChat(chat._id); }} className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-700 rounded-lg transition-colors" title="Delete"><IoTrashOutline size={14} /></button>
      </div>
    </div>
  );

  return (
    <>
      <div className={`fixed inset-y-0 left-0 w-72 bg-slate-950/95 backdrop-blur-xl border-r border-slate-800/50 transform transition-transform duration-300 ease-in-out z-40 flex flex-col shadow-2xl ${isOpen || isDesktopSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}>
        <div className="p-4 flex flex-col gap-3 border-b border-slate-800/50">
          <button onClick={onNewChat} className="flex items-center justify-center gap-2 w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold transition-all shadow-lg hover:shadow-indigo-500/25 active:scale-95">
            <IoAdd size={20} /> New Workspace
          </button>

          <div className="relative">
            <IoSearchOutline className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
            <input type="text" placeholder="Search all conversations..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-slate-900 border border-slate-800 text-slate-200 text-sm rounded-lg pl-9 pr-8 py-2 outline-none focus:border-indigo-500 transition-colors" />
            {searchQuery && <button onClick={() => setSearchQuery("")} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"><IoClose size={16}/></button>}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-6 custom-scrollbar">
          {searchQuery && (
            <div>
               <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 px-2 flex justify-between">Search Results {isSearching && <span className="animate-pulse">...</span>}</h3>
               {searchResults.length === 0 && !isSearching ? <p className="text-xs text-slate-500 px-2 italic">No matches found.</p> : searchResults.map(renderChatItem)}
            </div>
          )}

          {!searchQuery && pinnedChats.length > 0 && (
            <div>
              <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 px-2">Pinned Workspaces</h3>
              <div className="space-y-1">{pinnedChats.map(renderChatItem)}</div>
            </div>
          )}
          
          {!searchQuery && (
            <div>
              <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 px-2">Recent History</h3>
              {unpinnedChats.length === 0 ? <p className="text-xs text-slate-500 px-2 italic">No recent chats.</p> : <div className="space-y-1">{unpinnedChats.map(renderChatItem)}</div>}
            </div>
          )}
        </div>

        <div className="p-4 border-t border-slate-800/50 bg-slate-900/30 flex flex-col gap-2">
          {isInstallable && (<button onClick={installApp} className="w-full py-2.5 bg-blue-600/20 text-blue-400 hover:bg-blue-600 hover:text-white rounded-xl text-sm font-bold transition-all border border-blue-500/30">Install App</button>)}
          <div className="flex gap-2">
            <button onClick={onOpenPersonas} className="flex-1 py-2.5 flex items-center justify-center gap-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors border border-slate-800"><IoPeopleOutline size={18} /> Personas</button>
            <button onClick={onOpenSettings} className="flex-1 py-2.5 flex items-center justify-center gap-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors border border-slate-800"><IoSettingsOutline size={18} /> Settings</button>
          </div>
          <button onClick={onClearAll} className="flex items-center justify-center gap-2 w-full py-2 text-red-400/70 hover:text-red-400 hover:bg-red-500/10 rounded-xl text-xs font-bold transition-colors mt-2"><IoTrashOutline size={16} /> Clear All History</button>
        </div>
      </div>
      {isOpen && !isDesktopSidebarOpen && <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 md:hidden animate-fade-in" onClick={onClose} />}
    </>
  );
};

export default Sidebar;