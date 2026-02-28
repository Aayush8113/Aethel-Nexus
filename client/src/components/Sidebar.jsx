import { useState, useRef, useEffect } from "react";
import { IoChatboxOutline, IoAdd, IoCubeOutline, IoTrashOutline, IoSettingsOutline, IoHappyOutline, IoPin, IoCalendarOutline, IoCheckmarkOutline, IoCloseOutline } from "react-icons/io5";
import SearchBar from "./SearchBar";
import { useTouchSwipe } from "../hooks/useTouchSwipe";
import PingIndicator from "./PingIndicator"; 
import { categorizeChatsByDate } from "../utils/dateUtils"; 

// FIX: Added `isDesktopSidebarOpen` as a prop
const Sidebar = ({ chats, activeChatId, onSelectChat, onNewChat, onDeleteChat, onTogglePin, onRenameChat, onClearAll, onOpenSettings, onOpenPersonas, isOpen, onClose, isLoading, isInstallable, installApp, isDesktopSidebarOpen }) => {
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const searchInputRef = useRef(null);
  const editInputRef = useRef(null);

  const swipeHandlers = useTouchSwipe({ onSwipeLeft: () => { if (isOpen && onClose) onClose(); } });

  useEffect(() => {
    const handleKeyDown = (e) => { if (e.key === "/" && !e.ctrlKey && !e.metaKey && !e.altKey && !editingId) { e.preventDefault(); searchInputRef.current?.focus(); } };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [editingId]);

  useEffect(() => { if (editingId && editInputRef.current) editInputRef.current.focus(); }, [editingId]);

  const handleSaveRename = (id) => {
    if (editTitle.trim() && onRenameChat) onRenameChat(id, editTitle.trim());
    setEditingId(null);
  };

  const filteredChats = chats.filter(chat => chat.title.toLowerCase().includes(search.toLowerCase()));
  const pinnedChats = filteredChats.filter(chat => chat.isPinned);
  const unpinnedChats = filteredChats.filter(chat => !chat.isPinned);
  const { today, week, older } = categorizeChatsByDate(unpinnedChats);

  const renderChatList = (list, title, icon) => {
    if (list.length === 0) return null;
    return (
      <div className="mb-6">
        <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 px-2 flex items-center gap-2">{icon} {title}</h3>
        <div className="space-y-1">
          {list.map((chat) => (
            <div key={chat._id} className="relative group">
              {editingId === chat._id ? (
                 <div className="w-full flex items-center bg-slate-800 rounded-lg p-1 border border-indigo-500 shadow-lg z-20 relative">
                    <input ref={editInputRef} type="text" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} onKeyDown={(e) => { if(e.key==='Enter') handleSaveRename(chat._id); if(e.key==='Escape') setEditingId(null); }} className="w-full bg-transparent text-white text-sm outline-none px-2 py-1" />
                    <button onClick={() => handleSaveRename(chat._id)} className="p-1 text-green-400 hover:text-green-300"><IoCheckmarkOutline size={16}/></button>
                    <button onClick={() => setEditingId(null)} className="p-1 text-slate-400 hover:text-red-400"><IoCloseOutline size={16}/></button>
                 </div>
              ) : (
                <button onClick={() => onSelectChat(chat._id)} onDoubleClick={() => { setEditingId(chat._id); setEditTitle(chat.title); }} className={`w-full text-left px-3 py-2.5 rounded-lg flex items-center gap-3 transition-all ${activeChatId === chat._id ? "bg-slate-800 text-indigo-300 border border-slate-700 shadow-sm" : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"}`}>
                  <div className={`transition-colors ${chat.isPinned ? "text-indigo-400" : "text-slate-500"}`}>{chat.isPinned ? <IoPin size={14} /> : <IoChatboxOutline size={16} />}</div>
                  <span className="pr-12 text-sm font-medium truncate select-none">{chat.title}</span>
                </button>
              )}
              {!editingId && (
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all z-10 bg-slate-900/90 backdrop-blur rounded px-1 py-0.5 border border-slate-800">
                  <button onClick={(e) => { e.stopPropagation(); onTogglePin(chat._id); }} className="p-1.5 text-slate-500 hover:text-indigo-400" title={chat.isPinned ? "Unpin" : "Pin"}><IoPin size={13} /></button>
                  <button onClick={(e) => { e.stopPropagation(); onDeleteChat(chat._id); }} className="p-1.5 text-slate-500 hover:text-red-400" title="Delete"><IoTrashOutline size={13} /></button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div {...swipeHandlers} className={`fixed inset-y-0 left-0 z-30 w-72 bg-slate-900/95 backdrop-blur-2xl border-r border-slate-800 transform transition-transform duration-300 ease-in-out print:hidden ${isOpen ? "translate-x-0" : "-translate-x-full"} md:relative ${isDesktopSidebarOpen !== false ? "md:translate-x-0" : "md:-translate-x-full"} flex flex-col h-full`}>
      <div className="flex flex-col h-full p-4">
        <div className="flex items-center gap-3 mb-6 px-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20"><IoCubeOutline size={20} className="text-white" /></div>
          <h1 className="text-xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">Aethel</h1>
        </div>
        <SearchBar ref={searchInputRef} value={search} onChange={setSearch} />
        <button onClick={onNewChat} className="flex items-center justify-center gap-2 w-full px-4 py-2.5 mb-6 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition-all shadow-lg font-medium text-sm"><IoAdd size={18} /><span>New Chat</span></button>
        <div className="flex-1 pr-1 -mr-2 overflow-y-auto custom-scrollbar">
          {isLoading ? (<div className="px-2 mt-2 space-y-3"><div className="w-full h-10 rounded-lg bg-slate-800/50 animate-pulse"></div></div>) : chats.length === 0 ? (<div className="flex flex-col items-center justify-center h-40 px-4 mt-8 text-center opacity-50"><IoChatboxOutline size={32} className="mb-2 text-slate-600" /><p className="text-sm italic text-slate-500 mt-2">No history found.</p></div>) : (
            <> {renderChatList(pinnedChats, "Pinned", <IoPin className="text-indigo-400" size={10} />)} {search ? renderChatList(filteredChats, "Search Results", <IoSearch size={10} />) : (<>{renderChatList(today, "Today", <IoCalendarOutline size={10} />)}{renderChatList(week, "Previous 7 Days", <IoCalendarOutline size={10} />)}{renderChatList(older, "Older", <IoCalendarOutline size={10} />)}</>)}</>
          )}
        </div>
        <div className="pt-4 mt-4 space-y-1 border-t border-slate-800/50">
          {isInstallable && (<button onClick={installApp} className="flex items-center justify-center gap-2 w-full px-4 py-2 mb-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 text-white rounded-lg shadow-lg font-bold text-xs transition-all"><IoCubeOutline /><span>Install App</span></button>)}
          {chats.length > 0 && (<button onClick={onClearAll} className="flex items-center w-full gap-3 p-2 px-3 mb-2 transition-colors border border-transparent rounded-lg hover:bg-red-500/10 group"><div className="text-slate-500 group-hover:text-red-400"><IoTrashOutline size={16} /></div><span className="text-xs font-medium text-slate-500 group-hover:text-red-400">Clear History</span></button>)}
          <button onClick={onOpenPersonas} className="flex items-center w-full gap-3 p-2 px-2 transition-colors rounded-lg hover:bg-slate-800 group"><div className="p-1.5 bg-slate-800 group-hover:bg-slate-700 rounded-lg text-slate-400 group-hover:text-indigo-400 transition-colors"><IoHappyOutline size={16} /></div><div className="text-left"><p className="text-xs font-medium text-slate-300 group-hover:text-white transition-colors">Persona</p></div></button>
          <button onClick={onOpenSettings} className="flex items-center w-full gap-3 p-2 px-2 transition-colors rounded-lg hover:bg-slate-800 group"><div className="p-1.5 bg-slate-800 group-hover:bg-slate-700 rounded-lg text-slate-400 group-hover:text-indigo-400 transition-colors"><IoSettingsOutline size={16} /></div><div className="text-left"><p className="text-xs font-medium text-slate-300 group-hover:text-white transition-colors">Settings</p></div></button>
          <div className="px-3 pt-2 mt-1 border-t border-slate-800/50"><PingIndicator /></div>
        </div>
      </div>
    </div>
  );
};
export default Sidebar;