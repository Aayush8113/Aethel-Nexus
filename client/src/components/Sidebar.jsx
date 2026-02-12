import { useState } from "react";
import { IoChatboxOutline, IoAdd, IoCubeOutline, IoTrashOutline, IoSettingsOutline, IoHappyOutline, IoPushPin, IoPushPinOutline } from "react-icons/io5";
import SearchBar from "./SearchBar";

const Sidebar = ({ chats, activeChatId, onSelectChat, onNewChat, onDeleteChat, onTogglePin, onClearAll, onOpenSettings, onOpenPersonas, isOpen, isLoading }) => {
  const [search, setSearch] = useState("");

  const filteredChats = chats.filter(chat => 
    chat.title.toLowerCase().includes(search.toLowerCase())
  );

  const pinnedChats = filteredChats.filter(chat => chat.isPinned);
  const recentChats = filteredChats.filter(chat => !chat.isPinned);

  const renderChatList = (list, title) => {
    if (list.length === 0) return null;
    return (
      <div className="mb-4">
        <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 px-2 flex items-center gap-2">
           {title === "Pinned" && <IoPushPin className="text-indigo-400" size={10} />}
           {title}
        </h3>
        {list.map((chat) => (
          <div key={chat._id} className="relative mb-1 group">
            <button
              onClick={() => onSelectChat(chat._id)}
              className={`w-full text-left px-3 py-2.5 rounded-lg flex items-center gap-3 transition-all ${
                activeChatId === chat._id 
                  ? "bg-slate-800 text-indigo-300 border border-slate-700 shadow-sm" 
                  : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 border border-transparent"
              }`}
            >
              <div className={chat.isPinned ? "text-indigo-400" : "text-slate-500"}>
                {chat.isPinned ? <IoPushPin size={14} /> : <IoChatboxOutline size={16} />}
              </div>
              <span className="pr-12 text-sm font-medium truncate">{chat.title}</span>
            </button>
            
            <div className="absolute z-10 flex items-center gap-1 px-1 transition-all -translate-y-1/2 rounded opacity-0 right-2 top-1/2 group-hover:opacity-100 bg-slate-900/80">
               <button
                  onClick={(e) => { e.stopPropagation(); onTogglePin(chat._id); }}
                  className="p-1 transition-colors rounded text-slate-500 hover:text-indigo-400 hover:bg-slate-700"
                  title={chat.isPinned ? "Unpin" : "Pin"}
                >
                  {chat.isPinned ? <IoPushPin size={14} /> : <IoPushPinOutline size={14} />}
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); onDeleteChat(chat._id); }}
                  className="p-1 transition-colors rounded text-slate-500 hover:text-red-400 hover:bg-slate-700"
                  title="Delete"
                >
                  <IoTrashOutline size={14} />
                </button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className={`
      fixed inset-y-0 left-0 z-30 w-72 bg-slate-900/95 backdrop-blur-xl border-r border-slate-800 transform transition-transform duration-300 ease-in-out
      ${isOpen ? "translate-x-0" : "-translate-x-full"}
      md:relative md:translate-x-0
    `}>
      <div className="flex flex-col h-full p-4">
        <div className="flex items-center gap-2 px-2 mb-6 text-indigo-400">
          <IoCubeOutline size={24} />
          <h1 className="text-xl font-bold tracking-tight text-white">Aethel Nexus</h1>
        </div>

        <SearchBar value={search} onChange={setSearch} />

        <button onClick={onNewChat} className="flex items-center justify-center gap-2 w-full px-4 py-2.5 mb-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-all shadow-lg shadow-indigo-500/20 font-medium text-sm">
          <IoAdd size={18} />
          <span>New Chat</span>
        </button>

        <div className="flex-1 pr-1 space-y-1 overflow-y-auto custom-scrollbar">
          {isLoading ? (
            <div className="px-2 space-y-2">
              <div className="w-full h-10 rounded-lg bg-slate-800/50 animate-pulse"></div>
              <div className="w-full h-10 rounded-lg bg-slate-800/50 animate-pulse"></div>
            </div>
          ) : chats.length === 0 ? (
            <div className="mt-10 text-center">
               <p className="text-sm italic text-slate-600">No history found.</p>
            </div>
          ) : (
            <>
              {renderChatList(pinnedChats, "Pinned")}
              {renderChatList(recentChats, "Recent")}
            </>
          )}
        </div>
        
        <div className="pt-4 mt-4 space-y-1 border-t border-slate-800">
          {chats.length > 0 && (
            <button onClick={onClearAll} className="flex items-center w-full gap-3 p-2 px-2 mb-2 transition-colors rounded-lg hover:bg-red-500/10 group">
               <div className="p-1.5 rounded-lg text-slate-500 group-hover:text-red-400"><IoTrashOutline size={18} /></div>
               <span className="text-xs font-medium text-slate-500 group-hover:text-red-400">Clear All History</span>
            </button>
          )}
          
          <button onClick={onOpenPersonas} className="flex items-center w-full gap-3 p-2 px-2 transition-colors rounded-lg hover:bg-slate-800 group">
            <div className="p-1.5 bg-slate-800 group-hover:bg-slate-700 rounded-lg text-slate-400 group-hover:text-indigo-400"><IoHappyOutline size={18} /></div>
            <div className="text-left"><p className="text-xs font-medium text-slate-300">Persona</p></div>
          </button>

          <button onClick={onOpenSettings} className="flex items-center w-full gap-3 p-2 px-2 transition-colors rounded-lg hover:bg-slate-800 group">
            <div className="p-1.5 bg-slate-800 group-hover:bg-slate-700 rounded-lg text-slate-400 group-hover:text-indigo-400"><IoSettingsOutline size={18} /></div>
            <div className="text-left"><p className="text-xs font-medium text-slate-300">Settings</p></div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;