import { IoArrowUp, IoArrowDown } from "react-icons/io5";

const ScrollFab = ({ showBottom, showTop, onScrollToBottom, onScrollToTop }) => {
  return (
    <div className="fixed bottom-24 right-8 z-20 flex flex-col gap-2">
      {showTop && (
        <button
          onClick={onScrollToTop}
          className="p-3 bg-slate-800 text-slate-400 rounded-full shadow-xl border border-slate-700 hover:bg-slate-700 hover:text-white transition-all animate-fade-in"
          title="Scroll to Top"
        >
          <IoArrowUp size={20} />
        </button>
      )}
      
      {showBottom && (
        <button
          onClick={onScrollToBottom}
          className="p-3 bg-slate-800 text-indigo-400 rounded-full shadow-xl border border-slate-700 hover:bg-slate-700 hover:text-indigo-300 transition-all animate-fade-in"
          title="Scroll to Bottom"
        >
          <IoArrowDown size={20} />
        </button>
      )}
    </div>
  );
};

export default ScrollFab;