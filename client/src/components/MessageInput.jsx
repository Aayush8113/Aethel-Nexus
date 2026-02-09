import { useRef, useEffect } from "react";
import { IoSend, IoCloseCircleOutline } from "react-icons/io5";
import VoiceInput from "./VoiceInput";

const MessageInput = ({ input, setInput, isListening, startListening, isLoading, handleSend, isSpeaking, stopSpeaking }) => {
  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
    }
  }, [input]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend(e);
    }
  };

  return (
    <form onSubmit={handleSend} className="relative flex items-end max-w-4xl gap-2 p-2 mx-auto border shadow-xl group bg-slate-900 rounded-xl border-slate-800">
      
      {/* Floating Stop Button (Only when speaking) */}
      {isSpeaking && (
        <button
          type="button"
          onClick={stopSpeaking}
          className="absolute -top-12 left-1/2 -translate-x-1/2 bg-indigo-600 text-white px-4 py-1.5 rounded-full text-xs font-bold shadow-lg animate-bounce flex items-center gap-2 hover:bg-indigo-500 z-50 border border-white/20"
        >
          <span>Listening...</span> 
          <span className="opacity-75">(Click to Stop)</span>
        </button>
      )}

      <div className="flex-shrink-0 mb-1">
         <VoiceInput isListening={isListening} onToggle={startListening} />
      </div>

      <div className="relative flex-1">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={isListening ? "Listening..." : "Ask Aethel anything..."}
          rows={1}
          className={`w-full bg-transparent text-white pl-2 pr-10 py-3 resize-none outline-none max-h-48 overflow-y-auto
            ${isListening ? "placeholder-red-400" : "placeholder-slate-500"}
          `}
          disabled={isLoading}
        />
      </div>

      {input && !isLoading && (
        <button type="button" onClick={() => setInput("")} className="mb-3 transition-colors text-slate-500 hover:text-white">
          <IoCloseCircleOutline size={20} />
        </button>
      )}

      <button 
        type="submit" 
        disabled={isLoading || !input.trim()}
        className="p-2 mb-1 text-white transition-all bg-indigo-600 rounded-lg shadow-lg hover:bg-indigo-500 disabled:opacity-50 disabled:bg-slate-700"
      >
        <IoSend size={18} />
      </button>
    </form>
  );
};

export default MessageInput;