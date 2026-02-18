import { IoContract } from "react-icons/io5";

const FloatingControls = ({ isFocusMode, onExitFocus }) => {
  if (!isFocusMode) return null;

  return (
    <div className="absolute top-4 right-4 z-50 animate-fade-in">
      <button
        onClick={onExitFocus}
        className="p-3 bg-indigo-600/90 hover:bg-indigo-500 backdrop-blur text-white rounded-full shadow-lg shadow-indigo-500/30 transition-all hover:scale-105"
        title="Exit Zen Mode"
      >
        <IoContract size={20} />
      </button>
    </div>
  );
};

export default FloatingControls;