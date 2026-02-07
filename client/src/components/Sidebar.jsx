import { IoChatboxOutline, IoAdd, IoCubeOutline, IoTrashOutline } from "react-icons/io5";

const Sidebar = ({ chats, activeChatId, onSelectChat, onNewChat, onDeleteChat, isOpen, isLoading }) => {
  return (
    <div className={`
      fixed inset-y-0 left-0 z-30 w-72 bg-slate-900/95 backdrop-blur-xl border-r border-slate-800 transform transition-transform duration-300 ease-in-out
      ${isOpen ? "translate-x-0" : "-translate-x-full"}
      md:relative md:translate-x-0
    `}>
      <div className="flex flex-col h-full p-4">
        <div className="flex items-center gap-2 px-2 mb-8 text-indigo-400">
          <IoCubeOutline size={24} />
          <h1 className="text-xl font-bold tracking-tight text-white">Aethel Nexus</h1>
        </div>

        <button 
          onClick={onNewChat}
          className="flex items-center justify-center w-full gap-2 px-4 py-3 mb-6 font-medium text-white transition-all bg-indigo-600 rounded-lg shadow-lg hover:bg-indigo-500 shadow-indigo-500/20"
        >
          <IoAdd size={20} />
          <span>New Chat</span>
        </button>

        <div className="flex-1 pr-1 space-y-1 overflow-y-auto custom-scrollbar">
          <h3 className="px-2 mb-3 text-xs font-bold tracking-wider uppercase text-slate-500">History</h3>
          
          {isLoading ? (
            <div className="px-2 space-y-2">
              <div className="w-full h-10 rounded-lg bg-slate-800/50 animate-pulse"></div>
              <div className="w-full h-10 rounded-lg bg-slate-800/50 animate-pulse"></div>
              <div className="w-3/4 h-10 rounded-lg bg-slate-800/50 animate-pulse"></div>
            </div>
          ) : chats.length === 0 ? (
            <p className="px-2 text-sm italic text-slate-600">No history yet.</p>
          ) : (
            chats.map((chat) => (
              <div key={chat._id} className="relative group">
                <button
                  onClick={() => onSelectChat(chat._id)}
                  className={`w-full text-left px-3 py-3 rounded-lg flex items-center gap-3 transition-all ${
                    activeChatId === chat._id 
                      ? "bg-slate-800 text-indigo-300 border border-slate-700" 
                      : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
                  }`}
                >
                  <IoChatboxOutline size={16} />
                  <span className="pr-8 text-sm font-medium truncate">{chat.title}</span>
                </button>
                
                {/* Trash Button - Shows on Hover */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteChat(chat._id);
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-slate-500 hover:text-red-400 hover:bg-slate-800 rounded-md opacity-0 group-hover:opacity-100 transition-all z-10"
                  title="Delete Chat"
                >
                  <IoTrashOutline size={16} />
                </button>
              </div>
            ))
          )}
        </div>
        
        <div className="pt-4 mt-4 border-t border-slate-800">
          <div className="flex items-center gap-3 px-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500"></div>
            <div className="text-sm">
              <p className="font-medium text-white">Developer</p>
              <p className="text-xs text-slate-500">Pro Plan</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;