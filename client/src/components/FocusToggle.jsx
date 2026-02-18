import { IoExpand, IoContract } from "react-icons/io5";

const FocusToggle = ({ isFocusMode, onToggle }) => {
  return (
    <button
      onClick={onToggle}
      className={`p-2 rounded-full transition-all duration-300 ${
        isFocusMode 
          ? "bg-indigo-600 text-white shadow-lg hover:bg-indigo-500" 
          : "bg-slate-900/50 text-slate-400 hover:text-white hover:bg-slate-800"
      }`}
      title={isFocusMode ? "Exit Zen Mode" : "Enter Zen Mode"}
    >
      {isFocusMode ? <IoContract size={20} /> : <IoExpand size={20} />}
    </button>
  );
};

export default FocusToggle;