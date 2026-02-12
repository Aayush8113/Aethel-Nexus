import { useState, useEffect } from "react";
import { Toaster } from 'react-hot-toast';
import ChatInterface from "./components/ChatInterface";
import Sidebar from "./components/Sidebar";
import OfflineBanner from "./components/OfflineBanner";
import VoiceSettings from "./components/VoiceSettings";
import PersonaModal from "./components/PersonaModal";
import { fetchAllChats, deleteChat, togglePinChat, deleteAllChats } from "./services/api";
import { IoMenu } from "react-icons/io5";
import { useOnlineStatus } from "./hooks/useOnlineStatus";
import { useNotify } from "./hooks/useNotify";
import { useTextToSpeech } from "./hooks/useTextToSpeech";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { PERSONAS } from "./data/personas";

function App() {
  const [chats, setChats] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isChatsLoading, setIsChatsLoading] = useState(true);
  
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isPersonaOpen, setIsPersonaOpen] = useState(false);
  
  const [isAutoRead, setIsAutoRead] = useLocalStorage("aethel_autoread", false);
  const [currentPersona, setCurrentPersona] = useLocalStorage("aethel_persona", PERSONAS[0]);
  
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
    if (confirm("Delete this chat?")) {
      const isDeleted = await deleteChat(id);
      if (isDeleted) {
        setChats(prev => prev.filter(chat => chat._id !== id));
        if (activeChatId === id) setActiveChatId(null);
        success("Chat deleted");
      }
    }
  };

  // NEW: Toggle Pin
  const handleTogglePin = async (id) => {
    const updatedChat = await togglePinChat(id);
    if (updatedChat) {
      setChats(prev => prev.map(chat => chat._id === id ? { ...chat, isPinned: updatedChat.isPinned } : chat));
    }
  };

  // NEW: Clear All
  const handleClearAll = async () => {
    if (confirm("⚠️ Delete ALL history? This cannot be undone.")) {
      const isCleared = await deleteAllChats();
      if (isCleared) {
        setChats([]);
        setActiveChatId(null);
        success("History cleared");
      }
    }
  };

  useEffect(() => { loadChats(); }, [activeChatId]);

  return (
    <div className="flex flex-col h-screen overflow-hidden text-white bg-black">
      <Toaster position="top-center" />
      {!isOnline && <OfflineBanner />}

      <VoiceSettings 
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        voices={voices}
        activeVoice={activeVoice}
        onVoiceChange={setActiveVoice}
        isAutoRead={isAutoRead}
        onToggleAutoRead={() => setIsAutoRead(!isAutoRead)}
      />

      <PersonaModal 
        isOpen={isPersonaOpen}
        onClose={() => setIsPersonaOpen(false)}
        currentPersona={currentPersona}
        onSelect={setCurrentPersona}
      />

      <div className="relative flex flex-1 overflow-hidden">
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="fixed z-30 p-2 bg-gray-800 rounded-md md:hidden top-4 left-4">
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
          onTogglePin={handleTogglePin} // Pass Pin Handler
          onClearAll={handleClearAll}   // Pass Clear Handler
          onOpenSettings={() => setIsSettingsOpen(true)}
          onOpenPersonas={() => setIsPersonaOpen(true)}
        />

        <div className="relative flex-1 h-full">
          <ChatInterface 
            activeChatId={activeChatId} 
            onChatUpdated={loadChats}
            speak={speak}
            stop={stop}
            isSpeaking={isSpeaking}
            isAutoRead={isAutoRead}
            systemInstruction={currentPersona.instruction}
            currentPersona={currentPersona}
          />
        </div>
      </div>
    </div>
  );
}

export default App;