import { useState, useEffect } from "react";
import ChatInterface from "./components/ChatInterface";
import Sidebar from "./components/Sidebar";
import { fetchAllChats } from "./services/api";
import { IoMenu } from "react-icons/io5";

function App() {
  const [chats, setChats] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const loadChats = async () => {
    const data = await fetchAllChats();
    setChats(data);
  };

  useEffect(() => {
    loadChats();
  }, [activeChatId]);

  return (
    <div className="flex h-screen bg-black text-white overflow-hidden">
      <button 
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="md:hidden fixed top-4 left-4 z-30 p-2 bg-gray-800 rounded-md"
      >
        <IoMenu />
      </button>

      <Sidebar 
        chats={chats} 
        activeChatId={activeChatId}
        isOpen={isSidebarOpen}
        onSelectChat={(id) => {
          setActiveChatId(id);
          setIsSidebarOpen(false);
        }} 
        onNewChat={() => {
          setActiveChatId(null);
          setIsSidebarOpen(false);
        }}
      />

      <div className="flex-1 relative h-full">
        <ChatInterface 
          activeChatId={activeChatId} 
          onChatUpdated={loadChats} 
        />
      </div>
    </div>
  );
}

export default App;