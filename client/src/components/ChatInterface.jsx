import { useState, useRef, useEffect } from "react";
import { sendMessageToAI, fetchChatById } from "../services/api";
import { IoPerson, IoFlash, IoArrowDown } from "react-icons/io5";
import ReactMarkdown from "react-markdown";
import CodeBlock from "./CodeBlock";
import TypingIndicator from "./TypingIndicator";
import MessageInput from "./MessageInput";
import SpeakerButton from "./SpeakerButton";
import PersonaBadge from "./PersonaBadge";
import { useNotify } from "../hooks/useNotify";
import { useSpeechRecognition } from "../hooks/useSpeechRecognition";

const ChatInterface = ({ activeChatId, onChatUpdated, speak, stop, isSpeaking, isAutoRead, systemInstruction, currentPersona, onOpenArtifact }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [readingMsgId, setReadingMsgId] = useState(null);
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  
  const { error: notifyError } = useNotify();
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

  // Load Chat
  useEffect(() => {
    const loadChat = async () => {
      if (activeChatId) {
        setIsLoading(true);
        const data = await fetchChatById(activeChatId);
        if (data && data.messages) setMessages(data.messages);
        setIsLoading(false);
      } else {
        setMessages([{ role: "model", content: `Hello! I am **${currentPersona.name}**.  \nReady to build. What's on your mind?` }]);
      }
    };
    loadChat();
  }, [activeChatId, currentPersona]);

  const handleSend = async (e) => {
    e?.preventDefault();
    if ((!input.trim() && !image) || isLoading) return;

    stop(); // Stop speaking
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
    <div className="flex flex-col h-full bg-slate-950 text-slate-100 relative w-full">
      {/* Persona Badge */}
      <PersonaBadge persona={currentPersona} />

      <div 
        className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8 scroll-smooth w-full"
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
                  <IoFlash className="text-white text-sm" />
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
            
            <div className={`max-w-[85%] md:max-w-[85%] rounded-2xl p-4 shadow-sm ${
              msg.role === "user" 
                ? "bg-slate-800 text-white border border-slate-700 rounded-tr-sm" 
                : "bg-transparent text-slate-200 border border-slate-800/50 rounded-tl-sm w-full"
            }`}>
              {msg.image && (
                <div className="mb-3 overflow-hidden rounded-lg border border-slate-700">
                  <img src={msg.image} alt="User Upload" className="max-h-60 w-auto object-contain bg-black/20" />
                </div>
              )}
              <div className="prose prose-invert max-w-none text-sm leading-7">
                <ReactMarkdown 
                  components={{
                    code({node, className, children, ...props}) {
                      const match = /language-(\w+)/.exec(className || '');
                      return match ? (
                        <CodeBlock 
                          language={match[1]} 
                          value={String(children).replace(/\n$/, '')} 
                          onOpenArtifact={onOpenArtifact} // <--- Connected Handler
                        />
                      ) : (
                        <code className="bg-slate-800 text-indigo-300 px-1.5 py-0.5 rounded text-xs font-mono" {...props}>{children}</code>
                      )
                    }
                  }}
                >
                  {msg.content}
                </ReactMarkdown>
              </div>
            </div>
            
            {msg.role === "user" && (
              <div className="w-8 h-8 rounded-lg bg-slate-700 flex-shrink-0 flex items-center justify-center mt-1">
                <IoPerson className="text-slate-400 text-sm" />
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-4 justify-start animate-fade-in">
             <div className="w-8 h-8 rounded-lg bg-indigo-600 flex-shrink-0 flex items-center justify-center mt-1">
                <IoFlash className="text-white text-sm animate-pulse" />
             </div>
             <TypingIndicator />
          </div>
        )}
        
        {/* Scroll To Bottom Button */}
        {showScrollBtn && (
          <button
            onClick={scrollToBottom}
            className="fixed bottom-24 right-8 p-3 bg-slate-800 text-indigo-400 rounded-full shadow-xl border border-slate-700 hover:bg-slate-700 transition-all animate-bounce z-20"
          >
            <IoArrowDown size={20} />
          </button>
        )}
        <div ref={messagesEndRef} className="h-4" />
      </div>

      <div className="p-4 md:p-6 bg-slate-950/80 backdrop-blur-md border-t border-slate-800 sticky bottom-0 z-10 w-full">
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
        <p className="text-center text-xs text-slate-600 mt-3 font-medium">
          Aethel-Nexus v1.2 • AI can make mistakes.
        </p>
      </div>
    </div>
  );
};

export default ChatInterface;