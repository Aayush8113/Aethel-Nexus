  import { IoChatboxOutline, IoAdd } from "react-icons/io5";

  const Sidebar = ({ chats, activeChatId, onSelectChat, onNewChat, isOpen }) => {
    return (
      <div className={`
        fixed inset-y-0 left-0 z-20 w-64 bg-gray-900 border-r border-gray-800 transform transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        md:relative md:translate-x-0
      `}>
        <div className="flex flex-col h-full p-4">
        <button 
            onClick={onNewChat}
            className="flex items-center w-full gap-3 px-4 py-3 mb-4 text-white transition-all bg-blue-600 shadow-lg hover:bg-blue-500 rounded-xl hover:shadow-blue-500/20"
          >
            <IoAdd size={20} />
            <span className="font-semibold">New Chat</span>
          </button>

          <div className="flex-1 pr-2 space-y-2 overflow-y-auto">
            <h3 className="mb-2 ml-2 text-xs font-semibold tracking-wider text-gray-500 uppercase">Recent</h3>
            {chats.map((chat) => (
              <button
                key={chat._id}
                onClick={() => onSelectChat(chat._id)}
                className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-colors ${
                  activeChatId === chat._id 
                    ? "bg-gray-800 text-white border border-gray-700" 
                    : "text-gray-400 hover:bg-gray-800/50 hover:text-gray-200"
                }`}
              >
                <IoChatboxOutline />
                <span className="text-sm truncate">{chat.title}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  };

  export default Sidebar;