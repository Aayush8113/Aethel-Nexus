import { IoArrowUp, IoArrowDown } from "react-icons/io5";

const ScrollFab = ({ showBottom, showTop, onScrollToBottom, onScrollToTop, isAutoScrollPaused, isLoading, hasUnread }) => {
  return (
    <div className="fixed bottom-24 right-8 z-20 flex flex-col gap-3 print:hidden">
      {showTop && (
        <button onClick={onScrollToTop} className="p-3 bg-slate-800/90 backdrop-blur text-slate-400 rounded-full shadow-xl border border-slate-700 hover:bg-slate-700 hover:text-white transition-all animate-fade-in-up" title="Scroll to Top">
          <IoArrowUp size={20} />
        </button>
      )}
      {showBottom && (
        <div className="relative animate-fade-in-up">
          <button onClick={() => onScrollToBottom(true)} className={`p-3 backdrop-blur text-white rounded-full shadow-xl border transition-all ${isAutoScrollPaused && isLoading ? "bg-red-600/90 border-red-500 hover:bg-red-500 animate-pulse" : "bg-indigo-600/90 border-indigo-500 hover:bg-indigo-500"}`} title="Scroll to Bottom">
            <IoArrowDown size={20} />
          </button>
          {hasUnread && !isLoading && (
             <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 border-2 border-slate-950 rounded-full animate-pop-in shadow-[0_0_8px_rgba(239,68,68,0.8)]"></div>
          )}
        </div>
      )}
    </div>
  );
};
export default ScrollFab;