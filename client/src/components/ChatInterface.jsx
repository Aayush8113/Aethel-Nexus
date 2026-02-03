import { useEffect, useRef, useState } from "react";
import { IoPerson, IoSend } from "react-icons/io5";
import { SiGooglebard } from "react-icons/si";
import ReactMarkdown from "react-markdown";
import { sendMessageToAI } from "../services/api";

const ChatInterface = () => {
  const [messages, setMessages] = useState([
    { role: "model", content: "Hello! I am Aethel-Nexus. How can I help you code today?" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [chatId, setChatId] = useState(null); // Holds the DB ID
  
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    // 1. Add User Message to UI
    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // 2. Send to Backend (passing chatId if it exists)
      const response = await sendMessageToAI(input, messages, chatId);
      
      // 3. Add AI Response to UI
      const botMessage = { role: "model", content: response.reply };
      setMessages((prev) => [...prev, botMessage]);

      // 4. Save the Chat ID for the next message
      if (!chatId && response.chatId) {
        setChatId(response.chatId);
      }

    } catch (error) {
      console.error("Failed to send message", error);
      setMessages((prev) => [...prev, { role: "model", content: "Error: Could not connect to the Brain." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-gray-100 max-w-4xl mx-auto border-x border-gray-800 shadow-2xl">
      {/* Header */}
      <div className="p-4 border-b border-gray-800 bg-gray-900/50 backdrop-blur sticky top-0 z-10">
        <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          Aethel-Nexus
        </h1>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.map((msg, index) => (
          <div key={index} className={`flex gap-4 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            
            {msg.role === "model" && (
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center mt-1">
                <SiGooglebard className="text-white text-sm" />
              </div>
            )}

            <div className={`max-w-[80%] rounded-2xl p-4 ${
              msg.role === "user" 
                ? "bg-blue-600 text-white" 
                : "bg-gray-800 text-gray-100 border border-gray-700"
            }`}>
              <ReactMarkdown className="prose prose-invert max-w-none text-sm leading-relaxed">
                {msg.content}
              </ReactMarkdown>
            </div>

            {msg.role === "user" && (
              <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center mt-1">
                <IoPerson className="text-white text-sm" />
              </div>
            )}
          </div>
        ))}
        
        {isLoading && (
          <div className="flex gap-4 animate-pulse">
            <div className="w-8 h-8 rounded-full bg-blue-600/50"></div>
            <div className="bg-gray-800 rounded-2xl p-4 w-32 h-10"></div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-gray-900 border-t border-gray-800">
        <form onSubmit={handleSend} className="relative flex items-center bg-gray-800 rounded-full border border-gray-700 focus-within:border-blue-500 transition-all">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Message Aethel-Nexus..."
            className="w-full bg-transparent text-white px-6 py-4 outline-none rounded-full"
            disabled={isLoading}
          />
          <button 
            type="submit" 
            disabled={isLoading || !input.trim()}
            className="absolute right-2 p-2 bg-blue-600 rounded-full hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <IoSend className="text-white" />
          </button>
        </form>
        <p className="text-center text-xs text-gray-500 mt-2">Aethel-Nexus can make mistakes. Consider checking important information.</p>
      </div>
    </div>
  );
};

export default ChatInterface;