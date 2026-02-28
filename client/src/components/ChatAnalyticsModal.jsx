import {
  IoChatbubblesOutline,
  IoClose,
  IoCodeSlash,
  IoDocumentTextOutline,
  IoPieChartOutline,
} from "react-icons/io5";

const ChatAnalyticsModal = ({ isOpen, onClose, metrics }) => {
  if (!isOpen || !metrics) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm animate-fade-in p-4"
      onClick={onClose}
    >
      <div
        className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-md p-6 shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white"
        >
          <IoClose size={24} />
        </button>

        <div className="flex items-center gap-3 text-indigo-400 mb-6">
          <IoPieChartOutline size={24} />
          <h2 className="text-lg font-bold text-white tracking-wide">
            Chat Analytics
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-800/50 border border-slate-700 p-4 rounded-2xl flex flex-col items-center text-center">
            <IoChatbubblesOutline size={24} className="text-blue-400 mb-2" />
            <span className="text-2xl font-bold text-white">
              {metrics.totalMessages}
            </span>
            <span className="text-xs text-slate-400 font-medium uppercase tracking-wider mt-1">
              Total Msgs
            </span>
          </div>

          <div className="bg-slate-800/50 border border-slate-700 p-4 rounded-2xl flex flex-col items-center text-center">
            <IoCodeSlash size={24} className="text-emerald-400 mb-2" />
            <span className="text-2xl font-bold text-white">
              {metrics.codeBlocks}
            </span>
            <span className="text-xs text-slate-400 font-medium uppercase tracking-wider mt-1">
              Code Blocks
            </span>
          </div>

          <div className="bg-slate-800/50 border border-slate-700 p-4 rounded-2xl flex flex-col items-center text-center col-span-2">
            <IoDocumentTextOutline size={24} className="text-purple-400 mb-2" />
            <span className="text-3xl font-bold text-white">
              {metrics.totalWords.toLocaleString()}
            </span>
            <span className="text-xs text-slate-400 font-medium uppercase tracking-wider mt-1">
              Total Words Generated
            </span>
          </div>
        </div>

        <div className="mt-6 text-center border-t border-slate-800 pt-4 flex justify-between text-xs text-slate-500 font-mono">
          <span>User: {metrics.userMessages}</span>
          <span>AI: {metrics.aiMessages}</span>
        </div>
      </div>
    </div>
  );
};
export default ChatAnalyticsModal;
