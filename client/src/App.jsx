import { useState, useEffect } from "react";
import ChatInterface from "./components/ChatInterface";
import Sidebar from "./components/Sidebar";
import { fetchAllChats } from "./services/api";
import { IoMenu } from "react-icons/io5";

function App() {
  const [chats, setChats] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isChatsLoading, setIsChatsLoading] = useState(true);

  const loadChats = async () => {
    setIsChatsLoading(true);
    try {
      const data = await fetchAllChats();
      setChats(data || []);
    } catch (error) {
      console.error("Failed to fetch chats:", error);
    } finally {
      setIsChatsLoading(false);
    }
  };

  useEffect(() => {
    loadChats();
  }, [activeChatId]);

  return (
    <div className="flex h-screen overflow-hidden text-white bg-black">
      <button 
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="fixed z-30 p-2 bg-gray-800 rounded-md md:hidden top-4 left-4"
      >
        <IoMenu />
      </button>

      <Sidebar 
        chats={chats} 
        activeChatId={activeChatId}
        isOpen={isSidebarOpen}
        isLoading={isChatsLoading}
        onSelectChat={(id) => {
          setActiveChatId(id);
          setIsSidebarOpen(false);
        }} 
        onNewChat={() => {
          setActiveChatId(null);
          setIsSidebarOpen(false);
        }}
      />

      <div className="relative flex-1 h-full">
        <ChatInterface 
          activeChatId={activeChatId} 
          onChatUpdated={loadChats} 
        />
      </div>
    </div>
  );
}

export default App;