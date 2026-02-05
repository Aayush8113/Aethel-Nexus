import { useEffect, useRef, useState } from "react";
import { IoSend } from "react-icons/io5";
import { SiGooglegemini } from "react-icons/si";
import ReactMarkdown from "react-markdown";
import { fetchChatById, sendMessageToAI } from "../services/api";
import CodeBlock from "./CodeBlock";

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
    <div className="flex flex-col h-full text-gray-100 bg-gray-900">
      <div className="flex-1 p-4 space-y-6 overflow-y-auto">
        {messages.map((msg, index) => (
          <div key={index} className={`flex gap-4 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            {msg.role === "model" && (
              <div className="flex items-center justify-center w-8 h-8 mt-1 bg-blue-600 rounded-full">
                <SiGooglegemini className="text-sm text-white" /> 
              </div>
            )}
            <div className={`max-w-[80%] rounded-2xl p-4 ${
              msg.role === "user" ? "bg-blue-600 text-white" : "bg-gray-800 text-gray-100 border border-gray-700"
            }`}>
              {/* STYLING WRAPPER FOR REACT-MARKDOWN V10 */}
              <div className="text-sm leading-relaxed prose prose-invert max-w-none">
                <ReactMarkdown 
                  components={{
                    code({node, className, children, ...props}) {
                      const match = /language-(\w+)/.exec(className || '');
                      // Version 10 uses logic check instead of 'inline' prop
                      return match ? (
                        <CodeBlock language={match[1]} value={String(children).replace(/\n$/, '')} />
                      ) : (
                        <code className="bg-gray-700 rounded px-1 py-0.5" {...props}>{children}</code>
                      )
                    }
                  }}
                >
                  {msg.content}
                </ReactMarkdown>
              </div>
            </div>
          </div>
        ))}
        {isLoading && <div className="ml-12 text-sm text-gray-500 animate-pulse">Aethel is thinking...</div>}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-gray-900 border-t border-gray-800">
        <form onSubmit={handleSend} className="relative flex items-center transition-all bg-gray-800 border border-gray-700 rounded-full focus-within:border-blue-500">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Message Aethel-Nexus..."
            className="w-full px-6 py-4 text-white bg-transparent rounded-full outline-none"
            disabled={isLoading}
          />
          <button type="submit" disabled={isLoading || !input.trim()} className="absolute p-2 bg-blue-600 rounded-full right-2 hover:bg-blue-500">
            <IoSend className="text-white" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;