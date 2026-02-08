import { IoMic, IoMicOff } from "react-icons/io5";

const VoiceInput = ({ isListening, onToggle }) => {
  return (
    <button
      type="button" // Important: prevents form submission
      onClick={onToggle}
      className={`
        p-3 rounded-full transition-all duration-300 flex items-center justify-center relative
        ${isListening 
          ? "bg-red-500/20 text-red-400 shadow-[0_0_15px_rgba(239,68,68,0.5)]" 
          : "text-slate-400 hover:text-indigo-400 hover:bg-slate-800"
        }
      `}
      title={isListening ? "Stop Listening" : "Start Voice Input"}
    >
      {/* Pulsing Ring Effect when listening */}
      {isListening && (
        <span className="absolute inset-0 border border-red-500 rounded-full opacity-75 animate-ping"></span>
      )}
      
      {isListening ? <IoMicOff size={20} /> : <IoMic size={20} />}
    </button>
  );
};

export default VoiceInput;