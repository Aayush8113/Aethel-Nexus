import { useState, useEffect } from "react";
import { Toaster } from 'react-hot-toast';
import ChatInterface from "./components/ChatInterface";
import Sidebar from "./components/Sidebar";
import OfflineBanner from "./components/OfflineBanner";
import { fetchAllChats, deleteChat } from "./services/api";
import { IoMenu } from "react-icons/io5";
import { useOnlineStatus } from "./hooks/useOnlineStatus";
import { useNotify } from "./hooks/useNotify";

function App() {
  const [chats, setChats] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isChatsLoading, setIsChatsLoading] = useState(true);
  
  const isOnline = useOnlineStatus();
  const { success, error: notifyError } = useNotify();

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

  const handleDeleteChat = async (id) => {
    if (confirm("Are you sure you want to delete this chat permanently?")) {
      const isDeleted = await deleteChat(id);
      if (isDeleted) {
        setChats(prev => prev.filter(chat => chat._id !== id));
        if (activeChatId === id) setActiveChatId(null);
        success("Chat deleted successfully");
      } else {
        notifyError("Failed to delete chat");
      }
    }
  };

  useEffect(() => {
    loadChats();
  }, [activeChatId]);

  return (
    <div className="flex flex-col h-screen overflow-hidden text-white bg-black">
      <Toaster position="top-center" />
      {!isOnline && <OfflineBanner />}

      <div className="relative flex flex-1 overflow-hidden">
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
            success("Started a new conversation");
          }}
          onDeleteChat={handleDeleteChat}
        />

        <div className="relative flex-1 h-full">
          <ChatInterface 
            activeChatId={activeChatId} 
            onChatUpdated={loadChats} 
          />
        </div>
      </div>
    </div>
  );
}

export default App;