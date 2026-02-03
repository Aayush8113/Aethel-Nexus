import { useState, useRef, useEffect } from "react";
import { sendMessageToAI, fetchChatById } from "../services/api";
import { IoSend, IoPerson } from "react-icons/io5";
import { SiGooglebard } from "react-icons/si";
import ReactMarkdown from "react-markdown";

const ChatInterface = ({ activeChatId, onChatUpdated }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => { scrollToBottom(); }, [messages]);

  useEffect(() => {
    const loadChat = async () => {
      if (activeChatId) {
        setIsLoading(true);
        const data = await fetchChatById(activeChatId);
        if (data) setMessages(data.messages);
        setIsLoading(false);
      } else {
        setMessages([{ role: "model", content: "Hello! I am Aethel-Nexus. How can I help you code today?" }]);
      }
    };
    loadChat();
  }, [activeChatId]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await sendMessageToAI(input, messages, activeChatId);
      const botMessage = { role: "model", content: response.reply };
      setMessages((prev) => [...prev, botMessage]);

      if (!activeChatId && response.chatId) {
        onChatUpdated();
      }
    } catch (error) {
      setMessages((prev) => [...prev, { role: "model", content: "Error: Could not connect." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-900 text-gray-100">
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.map((msg, index) => (
          <div key={index} className={`flex gap-4 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            {msg.role === "model" && (
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center mt-1">
                <SiGooglebard className="text-white text-sm" />
              </div>
            )}
            <div className={`max-w-[80%] rounded-2xl p-4 ${
              msg.role === "user" ? "bg-blue-600 text-white" : "bg-gray-800 text-gray-100 border border-gray-700"
            }`}>
              <ReactMarkdown className="prose prose-invert max-w-none text-sm leading-relaxed">{msg.content}</ReactMarkdown>
            </div>
          </div>
        ))}
        {isLoading && <div className="text-gray-500 text-sm animate-pulse ml-12">Aethel is thinking...</div>}
        <div ref={messagesEndRef} />
      </div>

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
          <button type="submit" disabled={isLoading || !input.trim()} className="absolute right-2 p-2 bg-blue-600 rounded-full hover:bg-blue-500">
            <IoSend className="text-white" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;