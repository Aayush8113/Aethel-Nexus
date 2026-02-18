import { IoContract } from "react-icons/io5";

const FloatingControls = ({ isFocusMode, onExitFocus }) => {
  if (!isFocusMode) return null;

  return (
    <div className="absolute top-4 right-4 z-50 animate-fade-in">
      <button
        onClick={onExitFocus}
        className="p-3 bg-slate-900/80 hover:bg-indigo-600 backdrop-blur text-white rounded-full shadow-lg border border-slate-700 hover:border-indigo-500 transition-all hover:scale-105 group"
        title="Exit Zen Mode"
      >
        <IoContract size={20} className="group-hover:animate-pulse" />
      </button>
    </div>
  );
};

export default FloatingControls;