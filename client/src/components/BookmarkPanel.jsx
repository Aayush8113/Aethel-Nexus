import { IoClose, IoTrashOutline, IoBookmark, IoCopyOutline } from "react-icons/io5";
import { useNotify } from "../hooks/useNotify";

const BookmarkPanel = ({ isOpen, onClose, bookmarks, clearBookmarks }) => {
  const { success } = useNotify();

  if (!isOpen) return null;

  const handleCopy = (content) => {
    navigator.clipboard.writeText(content);
    success("Bookmark copied!");
  };

  return (
    <div className="fixed inset-0 z-[60] flex justify-end bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div 
        className="w-full max-w-md h-full bg-slate-900 border-l border-slate-700 shadow-2xl flex flex-col animate-slide-in-right"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-950/50">
          <div className="flex items-center gap-2 text-amber-400">
            <IoBookmark size={20} />
            <h2 className="font-bold">Saved Bookmarks</h2>
            <span className="bg-amber-500/20 text-amber-500 text-[10px] px-2 py-0.5 rounded-full">{bookmarks.length}</span>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white transition-colors"><IoClose size={20} /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
          {bookmarks.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-slate-500">
              <IoBookmark size={32} className="mb-2 opacity-50" />
              <p className="text-sm">No bookmarks saved yet.</p>
              <p className="text-xs opacity-70 mt-1">Star messages in chat to save them here.</p>
            </div>
          ) : (
            bookmarks.map((b) => (
              <div key={b.id} className="bg-slate-800 rounded-xl p-3 border border-slate-700 relative group">
                <p className="text-xs text-slate-300 line-clamp-4 font-mono whitespace-pre-wrap">{b.content}</p>
                <div className="mt-3 pt-2 border-t border-slate-700/50 flex justify-between items-center">
                  <span className="text-[9px] text-slate-500">{new Date(b.timestamp).toLocaleString()}</span>
                  <button onClick={() => handleCopy(b.content)} className="flex items-center gap-1 text-[10px] text-indigo-400 hover:text-indigo-300"><IoCopyOutline /> Copy</button>
                </div>
              </div>
            ))
          )}
        </div>

        {bookmarks.length > 0 && (
          <div className="p-4 border-t border-slate-800 bg-slate-950/50">
            <button onClick={() => { if(confirm("Clear all bookmarks?")) clearBookmarks(); }} className="w-full flex items-center justify-center gap-2 py-2.5 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-xl transition-colors text-sm font-bold">
              <IoTrashOutline size={16} /> Clear All
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
export default BookmarkPanel;