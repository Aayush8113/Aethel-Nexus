import { IoChatboxOutline, IoAdd } from "react-icons/io5";

const Sidebar = ({ chats, activeChatId, onSelectChat, onNewChat, isOpen }) => {
  return (
    <div className={`
      fixed inset-y-0 left-0 z-20 w-64 bg-gray-900 border-r border-gray-800 transform transition-transform duration-300 ease-in-out
      ${isOpen ? "translate-x-0" : "-translate-x-full"}
      md:relative md:translate-x-0
    `}>
      <div className="p-4 flex flex-col h-full">
         {/* Content will go here */}
      </div>
    </div>
  );
};

export default Sidebar;