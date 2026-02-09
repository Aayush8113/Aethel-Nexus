import { IoVolumeHigh, IoStopCircle } from "react-icons/io5";

const SpeakerButton = ({ onClick, isActive }) => {
  return (
    <button
      onClick={onClick}
      className={`p-1.5 rounded-lg transition-all ${
        isActive 
          ? "bg-indigo-500/20 text-indigo-400 animate-pulse" 
          : "text-slate-500 hover:text-slate-300 hover:bg-slate-800"
      }`}
      title={isActive ? "Stop Speaking" : "Read Aloud"}
    >
      {isActive ? <IoStopCircle size={18} /> : <IoVolumeHigh size={18} />}
    </button>
  );
};

export default SpeakerButton;