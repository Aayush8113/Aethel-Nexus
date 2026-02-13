import { useState, useEffect } from "react";
import { Toaster } from 'react-hot-toast';
import ChatInterface from "./components/ChatInterface";
import Sidebar from "./components/Sidebar";
import OfflineBanner from "./components/OfflineBanner";
import VoiceSettings from "./components/VoiceSettings";
import PersonaModal from "./components/PersonaModal";
import ArtifactPanel from "./components/ArtifactPanel"; // Day 13 Feature
import { fetchAllChats, deleteChat, togglePinChat, deleteAllChats } from "./services/api";
import { IoMenu } from "react-icons/io5";
import { useOnlineStatus } from "./hooks/useOnlineStatus";
import { useNotify } from "./hooks/useNotify";
import { useTextToSpeech } from "./hooks/useTextToSpeech";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { useArtifact } from "./hooks/useArtifact"; // Day 13 Feature
import { PERSONAS } from "./data/personas";

function App() {
  // --- STATE ---
  const [chats, setChats] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isChatsLoading, setIsChatsLoading] = useState(true);
  
  // Modals
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isPersonaOpen, setIsPersonaOpen] = useState(false);
  
  // Persistent Settings
  const [isAutoRead, setIsAutoRead] = useLocalStorage("aethel_autoread", false);
  const [currentPersona, setCurrentPersona] = useLocalStorage("aethel_persona", PERSONAS[0]);
  
  // Hooks
  const isOnline = useOnlineStatus();
  const { success, error: notifyError } = useNotify();
  const { voices, activeVoice, setActiveVoice, speak, stop, isSpeaking } = useTextToSpeech();
  
  // Artifact State (The Editor)
  const { isVisible: isArtifactOpen, activeCode, activeLanguage, openArtifact, closeArtifact, setActiveCode } = useArtifact();

  // --- ACTIONS ---
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
    if (confirm("Delete this conversation permanently?")) {
      const isDeleted = await deleteChat(id);
      if (isDeleted) {
        setChats(prev => prev.filter(chat => chat._id !== id));
        if (activeChatId === id) setActiveChatId(null);
        success("Chat deleted");
      }
    }
  };

  const handleTogglePin = async (id) => {
    const updatedChat = await togglePinChat(id);
    if (updatedChat) {
      setChats(prev => prev.map(chat => chat._id === id ? { ...chat, isPinned: updatedChat.isPinned } : chat));
    }
  };

  const handleClearAll = async () => {
    if (confirm("⚠️ Delete ALL history? This cannot be undone.")) {
      const isCleared = await deleteAllChats();
      if (isCleared) { setChats([]); setActiveChatId(null); success("History cleared"); }
    }
  };

  useEffect(() => { loadChats(); }, [activeChatId]);

  return (
    <div className="flex h-screen bg-black text-white overflow-hidden flex-col">
      <Toaster position="top-center" />
      {!isOnline && <OfflineBanner />}

      {/* --- MODALS --- */}
      <VoiceSettings 
        isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)}
        voices={voices} activeVoice={activeVoice} onVoiceChange={setActiveVoice}
        isAutoRead={isAutoRead} onToggleAutoRead={() => setIsAutoRead(!isAutoRead)}
      />

      <PersonaModal 
        isOpen={isPersonaOpen} onClose={() => setIsPersonaOpen(false)}
        currentPersona={currentPersona} onSelect={setCurrentPersona}
      />

      {/* --- MAIN LAYOUT --- */}
      <div className="flex flex-1 overflow-hidden relative">
        
        {/* Mobile Menu Toggle */}
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
          className="md:hidden fixed top-4 left-4 z-50 p-2 bg-slate-800/90 backdrop-blur rounded-lg border border-slate-700 shadow-xl text-white"
        >
          <IoMenu size={20} />
        </button>

        <Sidebar 
          chats={chats} activeChatId={activeChatId}
          isOpen={isSidebarOpen} isLoading={isChatsLoading}
          onSelectChat={(id) => { setActiveChatId(id); setIsSidebarOpen(false); }} 
          onNewChat={() => { setActiveChatId(null); setIsSidebarOpen(false); success("New conversation"); }}
          onDeleteChat={handleDeleteChat} onTogglePin={handleTogglePin} onClearAll={handleClearAll}
          onOpenSettings={() => setIsSettingsOpen(true)} onOpenPersonas={() => setIsPersonaOpen(true)}
        />

        {/* --- SPLIT SCREEN CONTAINER --- */}
        <div className="flex-1 relative h-full flex transition-all duration-300 overflow-hidden">
          
          {/* Left: Chat Interface */}
          <div className={`
             relative h-full flex flex-col transition-all duration-500 ease-in-out
             ${isArtifactOpen ? "hidden lg:flex w-full lg:w-1/2 border-r border-slate-800" : "w-full"}
          `}>
            <ChatInterface 
              activeChatId={activeChatId} onChatUpdated={loadChats}
              speak={speak} stop={stop} isSpeaking={isSpeaking} isAutoRead={isAutoRead}
              systemInstruction={currentPersona.instruction} currentPersona={currentPersona}
              onOpenArtifact={openArtifact} // <--- Pass Handler Down
            />
          </div>

          {/* Right: Artifact Panel (Editor) */}
          {/* Mobile: Fixed Overlay | Desktop: Split Column */}
          <div className={`
             bg-slate-900 shadow-2xl transition-all duration-500 ease-in-out
             ${isArtifactOpen 
                ? "fixed inset-0 z-40 lg:static lg:z-0 w-full lg:w-1/2 translate-x-0 opacity-100" 
                : "fixed right-0 w-0 opacity-0 translate-x-full lg:static lg:w-0 overflow-hidden"}
          `}>
             {isArtifactOpen && (
               <ArtifactPanel 
                 isOpen={isArtifactOpen} 
                 onClose={closeArtifact}
                 code={activeCode} 
                 language={activeLanguage} 
                 onChange={setActiveCode}
               />
             )}
          </div>

        </div>
      </div>
    </div>
  );
}

export default App;