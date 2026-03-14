import { useState, useEffect, Suspense, lazy } from "react";
import { Toaster } from 'react-hot-toast';
import ChatInterface from "./components/ChatInterface";
import Sidebar from "./components/Sidebar";
import OfflineBanner from "./components/OfflineBanner";
import Spinner from "./components/Spinner";
import FloatingControls from "./components/FloatingControls"; 
import CommandPalette from "./components/CommandPalette"; 
import BookmarkPanel from "./components/BookmarkPanel"; 

const VoiceSettings = lazy(() => import("./components/VoiceSettings"));
const PersonaModal = lazy(() => import("./components/PersonaModal"));
const ArtifactPanel = lazy(() => import("./components/ArtifactPanel"));
const ShortcutsModal = lazy(() => import("./components/ShortcutsModal"));

import { fetchAllChats, deleteChat, togglePinChat, deleteAllChats, updateChatTitle } from "./services/api";
import { IoMenu } from "react-icons/io5";
import { useOnlineStatus } from "./hooks/useOnlineStatus";
import { useNotify } from "./hooks/useNotify";
import { useTextToSpeech } from "./hooks/useTextToSpeech";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { useArtifact } from "./hooks/useArtifact";
import { usePWA } from "./hooks/usePWA"; 
import { useKeyboardShortcuts } from "./hooks/useKeyboardShortcuts"; 
import { useCommandPalette } from "./hooks/useCommandPalette"; 
import { useCustomPersonas } from "./hooks/useCustomPersonas"; 
import { useBookmarks } from "./hooks/useBookmarks"; 
import { importAppBackup } from "./utils/backupUtils"; 
import { PERSONAS } from "./data/personas";
import { useDesktopSidebar } from "./hooks/useDesktopSidebar"; 
import { useAppTheme } from "./hooks/useAppTheme"; 
import { useSpeechRecognition } from "./hooks/useSpeechRecognition";

function App() {
  const [chats, setChats] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); 
  const [isChatsLoading, setIsChatsLoading] = useState(true);
  
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isPersonaOpen, setIsPersonaOpen] = useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
  const [isFocusMode, setIsFocusMode] = useState(false); 
  const [isBookmarksOpen, setIsBookmarksOpen] = useState(false); 
  
  const [isAutoRead, setIsAutoRead] = useLocalStorage("aethel_autoread", false);
  const [currentPersona, setCurrentPersona] = useLocalStorage("aethel_persona", PERSONAS[0]);
  const [customPrompt, setCustomPrompt] = useLocalStorage("aethel_custom_prompt", ""); 
  const [sttLang, setSttLang] = useLocalStorage("aethel_stt_lang", "en-US");
  const [useWebSearch, setUseWebSearch] = useLocalStorage("aethel_websearch", false); 
  
  // 🟢 DAY 35: Global Model State
  const [activeModel, setActiveModel] = useLocalStorage("aethel_model", "gemini-2.0-flash");

  const isOnline = useOnlineStatus();
  const { success, error: notifyError } = useNotify();
  const { voices, activeVoice, setActiveVoice, speak, stop, isSpeaking, rate, setRate, pitch, setPitch } = useTextToSpeech(); 
  const { isVisible: isArtifactOpen, activeCode, activeLanguage, openArtifact, closeArtifact, setActiveCode } = useArtifact();
  const { isInstallable, installApp } = usePWA(); 
  const { isPaletteOpen, closePalette, openPalette } = useCommandPalette(); 
  const { customPersonas, addPersona, deletePersona } = useCustomPersonas(); 
  const { bookmarks, toggleBookmark, isBookmarked, clearBookmarks } = useBookmarks(); 
  const { isDesktopSidebarOpen, toggleDesktopSidebar } = useDesktopSidebar(); 
  const { appTheme, setAppTheme } = useAppTheme(); 

  useKeyboardShortcuts({
    "n": () => { setActiveChatId(null); success("New conversation"); },
    "s": () => setIsSettingsOpen(true),
    "p": () => setIsPersonaOpen(true),
    "b": () => setIsBookmarksOpen(prev => !prev),
    "?": () => setIsShortcutsOpen(true),
    "f": () => setIsFocusMode(prev => !prev),
    "Escape": () => { setIsSettingsOpen(false); setIsPersonaOpen(false); setIsShortcutsOpen(false); setIsSidebarOpen(false); closePalette(); setIsBookmarksOpen(false); }
  });

  const loadChats = async () => {
    setIsChatsLoading(true);
    try {
      const data = await fetchAllChats();
      setChats(data || []);
    } catch (error) { console.error(error); notifyError("Server offline. Please start backend."); } finally { setIsChatsLoading(false); }
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
    if (updatedChat) { setChats(prev => prev.map(chat => chat._id === id ? { ...chat, isPinned: updatedChat.isPinned } : chat)); }
  };

  const handleClearAll = async () => {
    if (confirm("⚠️ Delete ALL history? This cannot be undone.")) {
      const isCleared = await deleteAllChats();
      if (isCleared) { setChats([]); setActiveChatId(null); success("History cleared"); }
    }
  };

  const handleRenameChat = async (id, newTitle) => {
    try {
      const updatedChat = await updateChatTitle(id, newTitle);
      if (updatedChat) {
         setChats(prev => prev.map(chat => chat._id === id ? { ...chat, title: updatedChat.title } : chat));
         success("Chat renamed");
      }
    } catch (err) { notifyError("Failed to rename chat"); }
  };

  const handleRestoreSystem = async (file) => {
    try {
      await importAppBackup(file);
      success("System Restored! Reloading environment...");
      setTimeout(() => window.location.reload(), 1500);
    } catch (err) { notifyError("Failed to restore backup."); }
  };

  useEffect(() => { loadChats(); }, [activeChatId]);

  return (
    <div className="flex h-screen bg-black text-white overflow-hidden flex-col font-sans transition-colors duration-300">
      <Toaster position="top-center" />
      {!isOnline && <OfflineBanner />}

      <CommandPalette isOpen={isPaletteOpen} onClose={closePalette} chats={chats} onSelectChat={setActiveChatId} onNewChat={() => { setActiveChatId(null); success("New conversation"); }} onOpenSettings={() => setIsSettingsOpen(true)} onToggleFocus={() => setIsFocusMode(!isFocusMode)} />

      <BookmarkPanel isOpen={isBookmarksOpen} onClose={() => setIsBookmarksOpen(false)} bookmarks={bookmarks} clearBookmarks={clearBookmarks} />

      <Suspense fallback={null}>
        <VoiceSettings 
          isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} 
          voices={voices} activeVoice={activeVoice} onVoiceChange={setActiveVoice} 
          isAutoRead={isAutoRead} onToggleAutoRead={() => setIsAutoRead(!isAutoRead)} 
          customPrompt={customPrompt} setCustomPrompt={setCustomPrompt}
          ttsRate={rate} setTtsRate={setRate} ttsPitch={pitch} setTtsPitch={setPitch}
          appTheme={appTheme} setAppTheme={setAppTheme} 
          sttLang={sttLang} setSttLang={setSttLang} 
        />
        <PersonaModal 
          isOpen={isPersonaOpen} onClose={() => setIsPersonaOpen(false)} 
          currentPersona={currentPersona} onSelect={setCurrentPersona} 
          customPersonas={customPersonas} onAddCustom={addPersona} onDeleteCustom={deletePersona} 
        />
        <ShortcutsModal isOpen={isShortcutsOpen} onClose={() => setIsShortcutsOpen(false)} />
      </Suspense>

      <div className="flex flex-1 overflow-hidden relative">
        <FloatingControls isFocusMode={isFocusMode} onExitFocus={() => setIsFocusMode(false)} />
        {!isFocusMode && (<button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="md:hidden fixed top-4 left-4 z-50 p-2 bg-slate-800/90 backdrop-blur rounded-lg border border-slate-700 shadow-xl text-white print:hidden"><IoMenu size={20} /></button>)}

        <div className={`
           ${isFocusMode || !isDesktopSidebarOpen ? "md:-translate-x-full md:w-0 md:border-none overflow-hidden" : "md:translate-x-0 md:w-72"} 
           transition-all duration-500 ease-in-out h-full relative z-30 print:hidden
        `}>
           <Sidebar 
             chats={chats} activeChatId={activeChatId} isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} isLoading={isChatsLoading}
             onSelectChat={(id) => { setActiveChatId(id); setIsSidebarOpen(false); }} 
             onNewChat={() => { setActiveChatId(null); setIsSidebarOpen(false); success("New conversation"); }}
             onDeleteChat={handleDeleteChat} onTogglePin={handleTogglePin} onClearAll={handleClearAll}
             onRenameChat={handleRenameChat} 
             onOpenSettings={() => setIsSettingsOpen(true)} onOpenPersonas={() => setIsPersonaOpen(true)}
             isInstallable={isInstallable} installApp={installApp}
             isDesktopSidebarOpen={isDesktopSidebarOpen} 
             reloadChats={loadChats}
           />
        </div>

        <div className="flex-1 relative h-full flex transition-all duration-300 overflow-hidden bg-slate-950">
          <div className={`relative h-full flex flex-col transition-all duration-500 ease-in-out ${isArtifactOpen ? "hidden lg:flex w-full lg:w-1/2 border-r border-slate-800 print:w-full print:border-none" : "w-full"}`}>
            
            {/* 🟢 DAY 35: Passed activeModel state down */}
            <ChatInterface 
              activeChatId={activeChatId} onChatUpdated={loadChats} speak={speak} stop={stop} isSpeaking={isSpeaking} isAutoRead={isAutoRead}
              systemInstruction={currentPersona.instruction} customPrompt={customPrompt} currentPersona={currentPersona}
              onOpenArtifact={openArtifact} isFocusMode={isFocusMode} onToggleFocus={() => setIsFocusMode(!isFocusMode)}
              onImportBackup={handleRestoreSystem} toggleBookmark={toggleBookmark} isBookmarked={isBookmarked} onToggleBookmarks={() => setIsBookmarksOpen(true)}
              onToggleDesktopSidebar={toggleDesktopSidebar} sttLang={sttLang} setSttLang={setSttLang}
              useWebSearch={useWebSearch} setUseWebSearch={setUseWebSearch} 
              activeModel={activeModel} setActiveModel={setActiveModel}
            />
          </div>

          <div className={`bg-slate-900 shadow-2xl transition-all duration-500 ease-in-out print:hidden ${isArtifactOpen ? "fixed inset-0 z-40 lg:static lg:z-0 w-full lg:w-1/2 translate-x-0 opacity-100" : "fixed right-0 w-0 opacity-0 translate-x-full lg:static lg:w-0 overflow-hidden"}`}>
             {isArtifactOpen && (<Suspense fallback={<div className="h-full flex items-center justify-center"><Spinner /></div>}><ArtifactPanel isOpen={isArtifactOpen} onClose={closeArtifact} code={activeCode} language={activeLanguage} onChange={setActiveCode} /></Suspense>)}
          </div>
        </div>
      </div>
    </div>
  );
}
export default App;