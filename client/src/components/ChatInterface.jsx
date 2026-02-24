import { useState, useRef, useEffect } from "react";
import { sendMessageToAI, fetchChatById } from "../services/api";
import { IoPerson, IoFlash, IoThumbsUpOutline, IoThumbsDownOutline, IoRefresh, IoPencil, IoCheckmark, IoClose, IoCopyOutline } from "react-icons/io5";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm"; 
import remarkMath from "remark-math"; 
import rehypeKatex from "rehype-katex"; 
import rehypeRaw from "rehype-raw"; 

import CodeBlock from "./CodeBlock";
import TypingIndicator from "./TypingIndicator";
import MessageInput from "./MessageInput";
import SpeakerButton from "./SpeakerButton";
import ChatHeader from "./ChatHeader"; 
import ContextBar from "./ContextBar"; 
import Lightbox from "./Lightbox"; 
import StopButton from "./StopButton"; 
import ScrollFab from "./ScrollFab"; 
import DragOverlay from "./DragOverlay"; 

import { useNotify } from "../hooks/useNotify";
import { useSpeechRecognition } from "../hooks/useSpeechRecognition";
import { downloadChatAsMarkdown, downloadChatAsJSON } from "../utils/exportUtils";
import { importChatFromJSON } from "../utils/importUtils"; 
import { useDragDrop } from "../hooks/useDragDrop"; 
import { useSmartScroll } from "../hooks/useSmartScroll"; 

const ChatInterface = ({ activeChatId, onChatUpdated, speak, stop, isSpeaking, isAutoRead, systemInstruction, customPrompt, currentPersona, onOpenArtifact, isFocusMode, onToggleFocus }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [readingMsgId, setReadingMsgId] = useState(null);
  
  const [rawViewId, setRawViewId] = useState(null); 
  const [focusedMsgId, setFocusedMsgId] = useState(null); 
  const [editingMsgId, setEditingMsgId] = useState(null);
  const [editText, setEditText] = useState("");
  const [lightboxSrc, setLightboxSrc] = useState(null);

  const { error: notifyError, success } = useNotify();
  const { isListening, transcript, startListening, resetTranscript } = useSpeechRecognition();
  
  // Day 24: New Drag & Drop State
  const { isDragging, droppedImage, droppedText, clearDroppedFiles } = useDragDrop(); 
  
  const { containerRef, messagesEndRef, isAutoScrollEnabled, showScrollBottom, showScrollTop, handleScroll, scrollToBottom, scrollToTop } = useSmartScroll([messages, isLoading]);

  const formatTime = (date) => new Date(date || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const finalSystemInstruction = customPrompt ? `${systemInstruction}\n\nUSER OVERRIDE RULES:\n${customPrompt}` : systemInstruction;

  // Day 24: Handle File Drops intelligently
  useEffect(() => {
    if (droppedImage) { 
      setImage(droppedImage); 
      clearDroppedFiles(); 
      success("Image attached!"); 
    }
    if (droppedText) {
      const codeBlock = `\n\n\`\`\`${droppedText.ext}\n// File: ${droppedText.name}\n${droppedText.content}\n\`\`\`\n`;
      setInput(prev => prev + codeBlock);
      clearDroppedFiles();
      success(`Parsed ${droppedText.name}`);
    }
  }, [droppedImage, droppedText, clearDroppedFiles, success]);

  useEffect(() => {
    if (isAutoRead && !isLoading && messages.length > 0) {
      const lastMsg = messages[messages.length - 1];
      if (lastMsg.role === "model" && !isSpeaking) { setTimeout(() => { speak(lastMsg.content); setReadingMsgId(messages.length - 1); }, 500); }
    }
  }, [messages, isLoading, isAutoRead]);

  useEffect(() => {
    if (transcript) { setInput((prev) => prev + (prev ? " " : "") + transcript); resetTranscript(); }
  }, [transcript, resetTranscript]);

  useEffect(() => {
    const loadChat = async () => {
      if (activeChatId) {
        setIsLoading(true);
        const data = await fetchChatById(activeChatId);
        if (data && data.messages) setMessages(data.messages);
        setIsLoading(false);
      } else {
        setMessages([{ role: "model", content: `Hello! I am **${currentPersona.name}**.  \nReady to solve complex problems. What are we building?`, createdAt: Date.now() }]);
      }
    };
    loadChat();
  }, [activeChatId, currentPersona]);

  useEffect(() => {
    const handleClickOutside = (e) => { if (focusedMsgId !== null && !e.target.closest('.message-bubble')) setFocusedMsgId(null); };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [focusedMsgId]);

  const handleExportMarkdown = () => downloadChatAsMarkdown("Aethel_Chat", messages);
  const handleExportJSON = () => downloadChatAsJSON("Aethel_Chat", messages);
  const handleCopyAll = () => { navigator.clipboard.writeText(messages.map(m => `${m.role.toUpperCase()}:\n${m.content}`).join("\n\n---\n\n")); success("Copied to clipboard!"); };
  const handleCopyMessage = (content) => { navigator.clipboard.writeText(content); success("Message copied!"); };

  const handleImportJSON = async (file) => {
    try {
      const importedMessages = await importChatFromJSON(file);
      setMessages(importedMessages); success("Chat imported successfully! (Unsaved)");
    } catch (err) { notifyError("Failed to import chat. Invalid format."); }
  };

  const handleEditClick = (index, content) => { setEditingMsgId(index); setEditText(content); };

  const submitEdit = async (index) => {
    if (!editText.trim()) return;
    const newHistory = messages.slice(0, index);
    const newMessage = { role: "user", content: editText, createdAt: Date.now() };
    setMessages([...newHistory, newMessage]);
    setEditingMsgId(null); setIsLoading(true);

    try {
      const response = await sendMessageToAI(editText, newHistory, activeChatId, null, finalSystemInstruction);
      setMessages(prev => [...prev, { role: "model", content: response.reply, createdAt: Date.now() }]);
      if (!activeChatId && response.chatId) onChatUpdated();
    } catch (err) { notifyError("Failed to branch conversation."); } finally { setIsLoading(false); }
  };

  const handleRegenerate = async () => {
    if (messages.length === 0 || isLoading) return;
    let lastUserIndex = -1;
    for (let i = messages.length - 1; i >= 0; i--) { if (messages[i].role === 'user') { lastUserIndex = i; break; } }
    if (lastUserIndex === -1) return; 

    const userMessage = messages[lastUserIndex];
    const newHistory = messages.slice(0, lastUserIndex + 1); 
    
    setMessages(newHistory); setIsLoading(true); stop();

    try {
      const response = await sendMessageToAI(userMessage.content, newHistory.slice(0, -1), activeChatId, userMessage.image, finalSystemInstruction);
      setMessages([...newHistory, { role: "model", content: response.reply, createdAt: Date.now() }]);
      if (!activeChatId && response.chatId) onChatUpdated();
    } catch (err) { notifyError("Failed to regenerate response."); } finally { setIsLoading(false); }
  };

  const handleSend = async (e) => {
    e?.preventDefault();
    if ((!input.trim() && !image) || isLoading) return;

    stop(); 
    const userMessage = { role: "user", content: input, image: image ? URL.createObjectURL(image) : null, createdAt: Date.now() };
    setMessages((prev) => [...prev, userMessage]);
    
    const textToSend = input; const imageToSend = image;
    setInput(""); setImage(null); setIsLoading(true);

    try {
      const response = await sendMessageToAI(textToSend, messages, activeChatId, imageToSend, finalSystemInstruction);
      setMessages((prev) => [...prev, { role: "model", content: response.reply, createdAt: Date.now() }]);
      if (!activeChatId && response.chatId) onChatUpdated();
    } catch (err) { notifyError("Connection Error"); } finally { setIsLoading(false); }
  };

  const ThemedInput = () => (
    <MessageInput input={input} setInput={setInput} image={image} setImage={setImage} isListening={isListening} startListening={startListening} isLoading={isLoading} handleSend={handleSend} isSpeaking={isSpeaking} stopSpeaking={stop} notifySuccess={success} />
  );

  return (
    <div className={`flex flex-col h-full bg-slate-950 text-slate-100 relative w-full chat-container ${focusedMsgId !== null ? 'has-focus' : ''}`}>
      
      <DragOverlay isDragging={isDragging} /> 

      <ChatHeader currentPersona={currentPersona} onExportMarkdown={handleExportMarkdown} onExportJSON={handleExportJSON} onCopyAll={handleCopyAll} onImportJSON={handleImportJSON} isFocusMode={isFocusMode} onToggleFocus={onToggleFocus} hasCustomPrompt={!!customPrompt} />
      
      {!isFocusMode && (<div className="relative w-full z-10 transition-all duration-500"><ContextBar messages={messages} /></div>)}

      <Lightbox src={lightboxSrc} isOpen={!!lightboxSrc} onClose={() => setLightboxSrc(null)} />
      <StopButton isGenerating={isLoading} onStop={() => { setIsLoading(false); stop(); }} />
      <ScrollFab showBottom={showScrollBottom} showTop={showScrollTop} onScrollToBottom={scrollToBottom} onScrollToTop={scrollToTop} isAutoScrollPaused={!isAutoScrollEnabled} isLoading={isLoading} />

      <div ref={containerRef} className={`flex-1 overflow-y-auto p-4 md:p-8 space-y-8 scroll-smooth w-full ${isFocusMode ? "pt-4" : "pt-16"} transition-all duration-500`} onScroll={handleScroll}>
        {messages.map((msg, index) => (
          <div key={index} className={`message-bubble flex gap-4 animate-fade-in ${msg.role === "user" ? "justify-end" : "justify-start"} ${focusedMsgId === index ? "is-focused" : ""}`} onDoubleClick={(e) => { e.stopPropagation(); setFocusedMsgId(focusedMsgId === index ? null : index); }}>
            {msg.role === "model" && (
              <div className="flex flex-col items-center gap-1 mt-1">
                <div className={`w-8 h-8 rounded-lg bg-indigo-600 flex-shrink-0 flex items-center justify-center shadow-lg ${readingMsgId === index && isSpeaking ? "animate-speaking" : ""}`}><IoFlash className="text-white text-sm" /></div>
                <SpeakerButton isActive={readingMsgId === index && isSpeaking} onClick={() => { if (readingMsgId === index && isSpeaking) { stop(); setReadingMsgId(null); } else { speak(msg.content); setReadingMsgId(index); } }} />
              </div>
            )}
            
            {msg.role === "user" && editingMsgId === index ? (
              <div className="w-full max-w-[85%] flex flex-col items-end gap-2 animate-fade-in" onClick={e => e.stopPropagation()}>
                <textarea value={editText} onChange={(e) => setEditText(e.target.value)} className="w-full bg-slate-800 text-white p-3 rounded-xl border border-indigo-500 focus:outline-none resize-none shadow-xl" rows={3} autoFocus />
                <div className="flex gap-2">
                  <button onClick={() => setEditingMsgId(null)} className="px-3 py-1.5 rounded-lg text-xs text-slate-300 hover:bg-slate-800 flex items-center gap-1"><IoClose /> Cancel</button>
                  <button onClick={() => submitEdit(index)} className="px-3 py-1.5 rounded-lg text-xs bg-indigo-600 text-white font-bold hover:bg-indigo-500 flex items-center gap-1 shadow-lg"><IoCheckmark /> Save</button>
                </div>
              </div>
            ) : (
              <div className={`max-w-[85%] md:max-w-[85%] rounded-2xl p-4 shadow-sm group relative ${msg.role === "user" ? "bg-slate-800 text-white border border-slate-700 rounded-tr-sm" : "bg-transparent text-slate-200 border border-slate-800/50 rounded-tl-sm w-full"}`}>
                {msg.image && (
                  <div className="mb-3 overflow-hidden rounded-lg border border-slate-700 cursor-zoom-in" onClick={() => setLightboxSrc(msg.image)}>
                    <img src={msg.image} className="max-h-60 w-auto object-contain bg-black/20" />
                  </div>
                )}
                
                <div className="prose prose-invert max-w-none text-sm leading-7">
                  {rawViewId === index ? (
                     <pre className="whitespace-pre-wrap text-xs text-slate-500 font-mono bg-black/30 p-2 rounded border border-slate-700/50 overflow-x-auto" onDoubleClick={() => setRawViewId(null)}>{msg.content}</pre>
                  ) : (
                    <ReactMarkdown 
                      remarkPlugins={[remarkGfm, remarkMath]} rehypePlugins={[rehypeKatex, rehypeRaw]}
                      components={{
                        code({node, className, children, ...props}) {
                          const match = /language-(\w+)/.exec(className || '');
                          return match ? (<CodeBlock language={match[1]} value={String(children).replace(/\n$/, '')} onOpenArtifact={onOpenArtifact} />) : (<code className="bg-slate-800 text-indigo-300 px-1.5 py-0.5 rounded text-xs font-mono" onDoubleClick={() => setRawViewId(index)} {...props}>{children}</code>)
                        },
                        blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-indigo-500 bg-slate-900/50 py-2 px-4 my-4 rounded-r-lg text-slate-300 italic shadow-sm" {...props} />
                      }}
                    >{msg.content}</ReactMarkdown>
                  )}
                </div>

                 {msg.role === "user" && !isLoading && (<button onClick={(e) => { e.stopPropagation(); handleEditClick(index, msg.content); }} className="absolute -left-8 top-2 p-1.5 text-slate-500 hover:text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900/50 rounded-full"><IoPencil size={14} /></button>)}

                 <div className="flex justify-between items-center mt-2 opacity-0 group-hover:opacity-100 transition-opacity select-none">
                    <div className="flex gap-2">
                      <button onClick={(e) => { e.stopPropagation(); handleCopyMessage(msg.content); }} className="text-[10px] text-slate-500 hover:text-indigo-400 transition-colors flex items-center gap-1"><IoCopyOutline /></button>
                      {msg.role === "model" && !isLoading && (
                          <>
                            <button className="text-[10px] text-slate-500 hover:text-green-400"><IoThumbsUpOutline /></button>
                            <button className="text-[10px] text-slate-500 hover:text-red-400"><IoThumbsDownOutline /></button>
                            {index === messages.length - 1 && (
                              <button onClick={handleRegenerate} className="text-[10px] flex items-center gap-1 text-slate-500 hover:text-indigo-400 ml-2 border border-slate-700 hover:border-indigo-500 px-1.5 rounded transition-all">
                                 <IoRefresh /> <span className="hidden sm:inline">Regenerate</span>
                              </button>
                            )}
                          </>
                      )}
                    </div>
                    <div className="text-[10px] text-slate-600 font-mono">{formatTime(msg.createdAt)}</div>
                 </div>
              </div>
            )}
            {msg.role === "user" && (<div className="w-8 h-8 rounded-lg bg-slate-700 flex-shrink-0 flex items-center justify-center mt-1"><IoPerson className="text-slate-400 text-sm" /></div>)}
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-4 justify-start animate-fade-in"><div className="w-8 h-8 rounded-lg bg-indigo-600 flex-shrink-0 flex items-center justify-center mt-1"><IoFlash className="text-white text-sm animate-pulse" /></div><TypingIndicator /></div>
        )}
        <div ref={messagesEndRef} className="h-4" />
      </div>

      <div className={`p-4 md:p-6 bg-slate-950/80 backdrop-blur-md border-t border-slate-800 sticky bottom-0 z-10 w-full transition-all duration-500 ${isFocusMode ? "translate-y-full opacity-0" : "translate-y-0 opacity-100"}`}>
        <ThemedInput />
      </div>

      {isFocusMode && (
         <div className="fixed bottom-0 left-0 right-0 p-6 z-40 flex justify-center bg-gradient-to-t from-black via-black/90 to-transparent pt-20 animate-fade-in-up pointer-events-none">
            <div className="w-full max-w-3xl pointer-events-auto"><ThemedInput /></div>
         </div>
      )}
    </div>
  );
};
export default ChatInterface;