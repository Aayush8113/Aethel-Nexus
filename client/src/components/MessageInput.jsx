import { useRef, useEffect, useState } from "react";
import { IoCloseCircleOutline, IoImageOutline, IoSend } from "react-icons/io5";
import ImagePreview from "./ImagePreview";
import VoiceInput from "./VoiceInput";
import PromptMenu from "./PromptMenu";
import { PROMPTS } from "../data/prompts";
import { estimateTokens, getTokenMetrics } from "../utils/tokenUtils"; // Day 24
import { getCharCount, getWordCount } from "../utils/textStats";

const MessageInput = ({ input, setInput, isListening, startListening, isLoading, handleSend, isSpeaking, stopSpeaking, image, setImage, notifySuccess }) => {
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);
  
  const [showPrompts, setShowPrompts] = useState(false);
  const [filteredPrompts, setFilteredPrompts] = useState([]);
  const [promptIndex, setPromptIndex] = useState(0);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 250) + "px"; // Cap auto-grow
    }

    if (input.startsWith("/")) {
      const query = input.toLowerCase();
      const matches = PROMPTS.filter(p => p.label.startsWith(query));
      setFilteredPrompts(matches);
      setShowPrompts(matches.length > 0);
      setPromptIndex(0);
    } else {
      setShowPrompts(false);
    }
  }, [input]);

  const handlePromptSelect = (prompt) => {
    setInput(prompt.text + " ");
    setShowPrompts(false);
    textareaRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    if (showPrompts) {
      if (e.key === "ArrowDown") { e.preventDefault(); setPromptIndex(prev => (prev + 1) % filteredPrompts.length); } 
      else if (e.key === "ArrowUp") { e.preventDefault(); setPromptIndex(prev => (prev - 1 + filteredPrompts.length) % filteredPrompts.length); } 
      else if (e.key === "Enter" || e.key === "Tab") { e.preventDefault(); handlePromptSelect(filteredPrompts[promptIndex]); } 
      else if (e.key === "Escape") { setShowPrompts(false); }
      return;
    }

    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(e); }
  };

  // Day 24: Direct Clipboard Paste Support
  const handlePaste = (e) => {
    const items = e.clipboardData?.items;
    if (!items) return;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        e.preventDefault();
        const file = items[i].getAsFile();
        setImage(file);
        if (notifySuccess) notifySuccess("Image pasted from clipboard!");
        break;
      }
    }
  };

  const handleFileSelect = (e) => { if (e.target.files && e.target.files[0]) setImage(e.target.files[0]); };

  const currentTokens = estimateTokens(input);
  const { textColor: tokenColor } = getTokenMetrics(currentTokens);

  return (
    <div className="relative max-w-4xl mx-auto w-full">
      <PromptMenu isOpen={showPrompts} filteredPrompts={filteredPrompts} activeIndex={promptIndex} onSelect={handlePromptSelect} />

      <form onSubmit={handleSend} className="relative group gap-2 bg-slate-900 p-2 rounded-xl border border-slate-800 shadow-2xl flex flex-col z-20">
        
        {isSpeaking && (
          <button type="button" onClick={stopSpeaking} className="absolute -top-12 left-1/2 -translate-x-1/2 bg-indigo-600 text-white px-4 py-1.5 rounded-full text-xs font-bold shadow-lg animate-bounce flex items-center gap-2 hover:bg-indigo-500 z-50 border border-white/20">
            <span>Listening...</span><span className="opacity-75">(Click to Stop)</span>
          </button>
        )}

        {image && (<div className="px-2 pt-2"><ImagePreview file={image} onRemove={() => setImage(null)} /></div>)}

        <div className="flex items-end gap-2 w-full">
          <input type="file" ref={fileInputRef} onChange={handleFileSelect} accept="image/*" className="hidden" />
          <button type="button" onClick={() => fileInputRef.current?.click()} className="mb-1 p-2 text-slate-400 hover:text-indigo-400 transition-colors hover:bg-slate-800 rounded-lg" disabled={isLoading} title="Upload Image">
            <IoImageOutline size={22} />
          </button>

          <div className="flex-shrink-0 mb-1"><VoiceInput isListening={isListening} onToggle={startListening} /></div>

          <div className="relative flex-1">
            <textarea
              ref={textareaRef} value={input} onChange={(e) => setInput(e.target.value)} 
              onKeyDown={handleKeyDown} onPaste={handlePaste} // New
              placeholder={isListening ? "Listening..." : "Type '/' for commands or paste an image..."} rows={1}
              className={`w-full bg-transparent text-white pl-2 pr-10 py-3 resize-none outline-none overflow-y-auto text-sm md:text-base custom-scrollbar ${isListening ? "placeholder-red-400" : "placeholder-slate-500"}`}
              disabled={isLoading}
            />
          </div>

          {input && !isLoading && (
            <button type="button" onClick={() => { setInput(""); setShowPrompts(false); }} className="mb-3 text-slate-500 hover:text-white transition-colors">
              <IoCloseCircleOutline size={20} />
            </button>
          )}

          <button type="submit" disabled={isLoading || (!input.trim() && !image)} className="mb-1 p-2 bg-indigo-600 rounded-lg hover:bg-indigo-500 disabled:opacity-50 disabled:bg-slate-700 transition-all text-white shadow-lg">
            <IoSend size={18} />
          </button>
        </div>
      </form>
      
      <div className="absolute -bottom-6 right-2 text-[10px] text-slate-500 font-mono transition-opacity opacity-0 group-hover:opacity-100 select-none flex gap-3">
        <span>{getCharCount(input)} chars</span>
        <span>{getWordCount(input)} words</span>
        <span className={tokenColor}>{currentTokens} tokens</span>
      </div>
    </div>
  );
};
export default MessageInput;