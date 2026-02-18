import { IoSquare } from "react-icons/io5";

const StopButton = ({ isGenerating, onStop }) => {
  if (!isGenerating) return null;

  return (
    <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-30 animate-fade-in-up">
      <button 
        onClick={onStop}
        className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white border border-slate-700 rounded-full shadow-xl hover:bg-slate-800 transition-colors"
      >
        <IoSquare className="text-red-500 animate-pulse" size={12} />
        <span className="text-xs font-bold uppercase tracking-wider">Stop Generating</span>
      </button>
    </div>
  );
};

export default StopButton;