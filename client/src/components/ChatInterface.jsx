import { useState, useRef, useEffect } from "react";
import { sendMessageToAI, fetchChatById } from "../services/api";
import { IoPerson, IoFlash } from "react-icons/io5";
import ReactMarkdown from "react-markdown";
import CodeBlock from "./CodeBlock";
import TypingIndicator from "./TypingIndicator";
import MessageInput from "./MessageInput";
import SpeakerButton from "./SpeakerButton"; // New
import { useNotify } from "../hooks/useNotify";
import { useSpeechRecognition } from "../hooks/useSpeechRecognition";

const ChatInterface = ({ activeChatId, onChatUpdated, speak, stop, isSpeaking, isAutoRead }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [readingMsgId, setReadingMsgId] = useState(null); // Track reading
  
  const { error: notifyError } = useNotify();
  const { isListening, transcript, startListening, resetTranscript } = useSpeechRecognition();
  
  const messagesEndRef = useRef(null);

  // Auto-Read Logic
  useEffect(() => {
    if (isAutoRead && !isLoading && messages.length > 0) {
      const lastMsg = messages[messages.length - 1];
      // Only read if it's a NEW AI message (simple check)
      if (lastMsg.role === "model" && !isSpeaking) {
         // Small delay to let UI render
         setTimeout(() => {
           speak(lastMsg.content);
           setReadingMsgId(messages.length - 1);
         }, 500);
      }
    }
  }, [messages, isLoading, isAutoRead]); // Depend on messages updating

  // Manual Read Logic
  const handleToggleRead = (text, idx) => {
    if (readingMsgId === idx && isSpeaking) {
      stop();
      setReadingMsgId(null);
    } else {
      speak(text);
      setReadingMsgId(idx);
    }
  };

  useEffect(() => {
    if (transcript) {
      setInput((prev) => prev + (prev ? " " : "") + transcript);
      resetTranscript();
    }
  }, [transcript, resetTranscript]);

  const scrollToBottom = () => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); };
  useEffect(() => { scrollToBottom(); }, [messages, isLoading]);

  useEffect(() => {
    const loadChat = async () => {
      if (activeChatId) {
        setIsLoading(true);
        const data = await fetchChatById(activeChatId);
        if (data && data.messages) setMessages(data.messages);
        setIsLoading(false);
      } else {
        setMessages([{ role: "model", content: "Hello! I am **Aethel-Nexus**.  \nReady to solve complex problems. What are we building?" }]);
      }
    };
    loadChat();
  }, [activeChatId]);

  const handleSend = async (e) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    stop(); // Stop speaking if user types
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
    } catch (err) {
      notifyError("Failed to connect to AI Brain");
      setMessages((prev) => [...prev, { role: "model", content: "⚠️ **Connection Error**: I couldn't reach the backend." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex flex-col h-full bg-slate-950 text-slate-100">
      <div className="flex-1 p-4 space-y-8 overflow-y-auto md:p-8 scroll-smooth">
        {messages.map((msg, index) => (
          <div key={index} className={`flex gap-4 animate-fade-in ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            {msg.role === "model" && (
              <div className="flex flex-col items-center gap-1 mt-1">
                <div className="flex items-center justify-center flex-shrink-0 w-8 h-8 bg-indigo-600 rounded-lg shadow-lg shadow-indigo-500/30">
                  <IoFlash className="text-sm text-white" />
                </div>
                {/* Speaker Button */}
                <SpeakerButton 
                  isActive={readingMsgId === index && isSpeaking}
                  onClick={() => handleToggleRead(msg.content, index)}
                />
              </div>
            )}
            <div className={`max-w-[85%] md:max-w-[75%] rounded-2xl p-4 shadow-sm ${
              msg.role === "user" 
                ? "bg-slate-800 text-white border border-slate-700 rounded-tr-sm" 
                : "bg-transparent text-slate-200 border border-slate-800/50 rounded-tl-sm"
            }`}>
              <div className="text-sm leading-7 prose prose-invert max-w-none">
                <ReactMarkdown 
                  components={{
                    code({node, className, children, ...props}) {
                      const match = /language-(\w+)/.exec(className || '');
                      return match ? (
                        <CodeBlock language={match[1]} value={String(children).replace(/\n$/, '')} />
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
        <div ref={messagesEndRef} className="h-4" />
      </div>

      <div className="sticky bottom-0 z-10 p-4 border-t md:p-6 bg-slate-950/80 backdrop-blur-md border-slate-800">
        <MessageInput 
          input={input}
          setInput={setInput}
          isListening={isListening}
          startListening={startListening}
          isLoading={isLoading}
          handleSend={handleSend}
        />
        <p className="mt-3 text-xs font-medium text-center text-slate-600">
          Aethel-Nexus v1.2 • AI can make mistakes.
        </p>
      </div>
    </div>
  );
};

export default ChatInterface;