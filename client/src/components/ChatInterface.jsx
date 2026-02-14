import { useState, useRef, useEffect } from "react";
import { sendMessageToAI, fetchChatById } from "../services/api";
import { IoPerson, IoFlash, IoArrowDown } from "react-icons/io5";
import ReactMarkdown from "react-markdown";

// Markdown Plugins
import remarkGfm from "remark-gfm"; // Tables
import remarkMath from "remark-math"; // Math Parsing
import rehypeKatex from "rehype-katex"; // Math Rendering
import rehypeRaw from "rehype-raw"; // HTML Support

import CodeBlock from "./CodeBlock";
import TypingIndicator from "./TypingIndicator";
import MessageInput from "./MessageInput";
import SpeakerButton from "./SpeakerButton";
import ChatHeader from "./ChatHeader"; // Header

import { useNotify } from "../hooks/useNotify";
import { useSpeechRecognition } from "../hooks/useSpeechRecognition";
import { downloadChatAsMarkdown, downloadChatAsJSON } from "../utils/exportUtils";

const ChatInterface = ({ activeChatId, onChatUpdated, speak, stop, isSpeaking, isAutoRead, systemInstruction, currentPersona, onOpenArtifact }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [readingMsgId, setReadingMsgId] = useState(null);
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  
  // Toggle for Raw Markdown View (Double Click)
  const [rawViewId, setRawViewId] = useState(null); 
  
  const { error: notifyError, success } = useNotify();
  const { isListening, transcript, startListening, resetTranscript } = useSpeechRecognition();
  const messagesEndRef = useRef(null);

  // Auto-Read Logic
  useEffect(() => {
    if (isAutoRead && !isLoading && messages.length > 0) {
      const lastMsg = messages[messages.length - 1];
      if (lastMsg.role === "model" && !isSpeaking) {
         setTimeout(() => { speak(lastMsg.content); setReadingMsgId(messages.length - 1); }, 500);
      }
    }
  }, [messages, isLoading, isAutoRead]);

  // Voice Input Logic
  useEffect(() => {
    if (transcript) { setInput((prev) => prev + (prev ? " " : "") + transcript); resetTranscript(); }
  }, [transcript, resetTranscript]);

  const scrollToBottom = () => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); };
  useEffect(() => { scrollToBottom(); }, [messages, isLoading]);

  // Load Chat Logic
  useEffect(() => {
    const loadChat = async () => {
      if (activeChatId) {
        setIsLoading(true);
        const data = await fetchChatById(activeChatId);
        if (data && data.messages) setMessages(data.messages);
        setIsLoading(false);
      } else {
        setMessages([{ role: "model", content: `Hello! I am **${currentPersona.name}**.  \nReady to solve complex problems. What are we building?` }]);
      }
    };
    loadChat();
  }, [activeChatId, currentPersona]);

  // --- Handlers ---
  const handleExportMarkdown = () => downloadChatAsMarkdown("Aethel_Chat", messages);
  const handleExportJSON = () => downloadChatAsJSON("Aethel_Chat", messages);
  
  const handleCopyAll = () => {
    const text = messages.map(m => `${m.role.toUpperCase()}:\n${m.content}`).join("\n\n---\n\n");
    navigator.clipboard.writeText(text);
    success("Entire conversation copied to clipboard!");
  };

  const handleSend = async (e) => {
    e?.preventDefault();
    if ((!input.trim() && !image) || isLoading) return;

    stop(); 
    const userMessage = { role: "user", content: input, image: image ? URL.createObjectURL(image) : null };
    setMessages((prev) => [...prev, userMessage]);
    
    const textToSend = input;
    const imageToSend = image;

    setInput("");
    setImage(null);
    setIsLoading(true);

    try {
      const response = await sendMessageToAI(textToSend, messages, activeChatId, imageToSend, systemInstruction);
      const botMessage = { role: "model", content: response.reply };
      setMessages((prev) => [...prev, botMessage]);
      if (!activeChatId && response.chatId) onChatUpdated();
    } catch (err) {
      notifyError("Failed to connect to AI Brain");
      setMessages((prev) => [...prev, { role: "model", content: "⚠️ **Connection Error**: I couldn't reach the backend." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex flex-col w-full h-full bg-slate-950 text-slate-100">
      
      {/* Header */}
      <ChatHeader 
        currentPersona={currentPersona}
        onExportMarkdown={handleExportMarkdown}
        onExportJSON={handleExportJSON}
        onCopyAll={handleCopyAll}
      />

      <div 
        className="flex-1 w-full p-4 pt-16 space-y-8 overflow-y-auto md:p-8 scroll-smooth" 
        onScroll={(e) => {
          const bottom = e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
          setShowScrollBtn(!bottom);
        }}
      >
        {messages.map((msg, index) => (
          <div key={index} className={`flex gap-4 animate-fade-in ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            {msg.role === "model" && (
              <div className="flex flex-col items-center gap-1 mt-1">
                <div className={`w-8 h-8 rounded-lg bg-indigo-600 flex-shrink-0 flex items-center justify-center shadow-lg shadow-indigo-500/30 transition-all ${
                  readingMsgId === index && isSpeaking ? "animate-speaking" : ""
                }`}>
                  <IoFlash className="text-sm text-white" />
                </div>
                <SpeakerButton 
                  isActive={readingMsgId === index && isSpeaking} 
                  onClick={() => {
                    if (readingMsgId === index && isSpeaking) { stop(); setReadingMsgId(null); } 
                    else { speak(msg.content); setReadingMsgId(index); }
                  }} 
                />
              </div>
            )}
            
            <div className={`max-w-[85%] md:max-w-[85%] rounded-2xl p-4 shadow-sm group ${
              msg.role === "user" 
                ? "bg-slate-800 text-white border border-slate-700 rounded-tr-sm" 
                : "bg-transparent text-slate-200 border border-slate-800/50 rounded-tl-sm w-full"
            }`}>
              {msg.image && (
                <div className="mb-3 overflow-hidden border rounded-lg border-slate-700">
                  <img src={msg.image} alt="User Upload" className="object-contain w-auto max-h-60 bg-black/20" />
                </div>
              )}
              
              {/* Double Click to Toggle Raw View */}
              <div 
                className="text-sm leading-7 prose prose-invert max-w-none"
                onDoubleClick={() => setRawViewId(rawViewId === index ? null : index)}
                title="Double-click to toggle raw markdown"
              >
                {rawViewId === index ? (
                   <pre className="p-2 overflow-x-auto font-mono text-xs whitespace-pre-wrap border rounded text-slate-500 bg-black/30 border-slate-700/50">
                     {msg.content}
                   </pre>
                ) : (
                  <ReactMarkdown 
                    remarkPlugins={[remarkGfm, remarkMath]}
                    rehypePlugins={[rehypeKatex, rehypeRaw]}
                    components={{
                      code({node, className, children, ...props}) {
                        const match = /language-(\w+)/.exec(className || '');
                        return match ? (
                          <CodeBlock 
                            language={match[1]} 
                            value={String(children).replace(/\n$/, '')} 
                            onOpenArtifact={onOpenArtifact}
                          />
                        ) : (
                          <code className="bg-slate-800 text-indigo-300 px-1.5 py-0.5 rounded text-xs font-mono" {...props}>{children}</code>
                        )
                      },
                      blockquote: ({node, ...props}) => <blockquote className="py-2 pl-4 my-4 italic border-l-4 border-indigo-500 rounded-r text-slate-400 bg-slate-800/30" {...props} />
                    }}
                  >
                    {msg.content}
                  </ReactMarkdown>
                )}
              </div>
            </div>
            
            {msg.role === "user" && (
              <div className="flex items-center justify-center flex-shrink-0 w-8 h-8 mt-1 rounded-lg bg-slate-700">
                <IoPerson className="text-sm text-slate-400" />
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start gap-4 animate-fade-in">
             <div className="flex items-center justify-center flex-shrink-0 w-8 h-8 mt-1 bg-indigo-600 rounded-lg">
                <IoFlash className="text-sm text-white animate-pulse" />
             </div>
             <TypingIndicator />
          </div>
        )}
        
        {showScrollBtn && (
          <button
            onClick={scrollToBottom}
            className="fixed z-20 p-3 text-indigo-400 transition-all border rounded-full shadow-xl bottom-24 right-8 bg-slate-800 border-slate-700 hover:bg-slate-700 animate-bounce"
          >
            <IoArrowDown size={20} />
          </button>
        )}
        <div ref={messagesEndRef} className="h-4" />
      </div>

      <div className="sticky bottom-0 z-10 w-full p-4 border-t md:p-6 bg-slate-950/80 backdrop-blur-md border-slate-800">
        <MessageInput 
          input={input}
          setInput={setInput}
          image={image}
          setImage={setImage}
          isListening={isListening}
          startListening={startListening}
          isLoading={isLoading}
          handleSend={handleSend}
          isSpeaking={isSpeaking}
          stopSpeaking={stop}
        />
        <p className="mt-3 text-xs font-medium text-center text-slate-600">
          Aethel-Nexus v1.2 • AI can make mistakes.
        </p>
      </div>
    </div>
  );
};

export default ChatInterface;