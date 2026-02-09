import { useState, useEffect } from "react";
import { Toaster } from 'react-hot-toast';
import ChatInterface from "./components/ChatInterface";
import Sidebar from "./components/Sidebar";
import OfflineBanner from "./components/OfflineBanner";
import VoiceSettings from "./components/VoiceSettings"; // New
import { fetchAllChats, deleteChat } from "./services/api";
import { IoMenu } from "react-icons/io5";
import { useOnlineStatus } from "./hooks/useOnlineStatus";
import { useNotify } from "./hooks/useNotify";
import { useTextToSpeech } from "./hooks/useTextToSpeech"; // Global Hook

function App() {
  const [chats, setChats] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isChatsLoading, setIsChatsLoading] = useState(true);
  
  // Settings State
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAutoRead, setIsAutoRead] = useState(false);
  
  const isOnline = useOnlineStatus();
  const { success, error: notifyError } = useNotify();
  const { voices, activeVoice, setActiveVoice, speak, stop, isSpeaking } = useTextToSpeech();

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
    if (confirm("Delete this chat permanently?")) {
      const isDeleted = await deleteChat(id);
      if (isDeleted) {
        setChats(prev => prev.filter(chat => chat._id !== id));
        if (activeChatId === id) setActiveChatId(null);
        success("Chat deleted");
      } else {
        notifyError("Failed to delete");
      }
    }
  };

  useEffect(() => { loadChats(); }, [activeChatId]);

  return (
    <div className="flex flex-col h-screen overflow-hidden text-white bg-black">
      <Toaster position="top-center" />
      {!isOnline && <OfflineBanner />}

      {/* Voice Settings Modal */}
      <VoiceSettings 
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        voices={voices}
        activeVoice={activeVoice}
        onVoiceChange={setActiveVoice}
        isAutoRead={isAutoRead}
        onToggleAutoRead={() => setIsAutoRead(!isAutoRead)}
      />

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
          onSelectChat={(id) => { setActiveChatId(id); setIsSidebarOpen(false); }} 
          onNewChat={() => { setActiveChatId(null); setIsSidebarOpen(false); success("New conversation"); }}
          onDeleteChat={handleDeleteChat}
          onOpenSettings={() => setIsSettingsOpen(true)} // Pass handler
        />

        <div className="relative flex-1 h-full">
          <ChatInterface 
            activeChatId={activeChatId} 
            onChatUpdated={loadChats}
            // Pass Audio Props
            speak={speak}
            stop={stop}
            isSpeaking={isSpeaking}
            isAutoRead={isAutoRead}
          />
        </div>
      </div>
    </div>
  );
}

export default App;