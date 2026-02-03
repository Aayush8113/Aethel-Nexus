import { IoChatboxOutline, IoAdd } from "react-icons/io5";

const Sidebar = ({ chats, activeChatId, onSelectChat, onNewChat, isOpen }) => {
  return (
    <div className={`
      fixed inset-y-0 left-0 z-20 w-64 bg-gray-900 border-r border-gray-800 transform transition-transform duration-300 ease-in-out
      ${isOpen ? "translate-x-0" : "-translate-x-full"}
      md:relative md:translate-x-0
    `}>
      <div className="p-4 flex flex-col h-full">
      <button 
          onClick={onNewChat}
          className="flex items-center gap-3 w-full px-4 py-3 mb-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition-all shadow-lg hover:shadow-blue-500/20"
        >
          <IoAdd size={20} />
          <span className="font-semibold">New Chat</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;