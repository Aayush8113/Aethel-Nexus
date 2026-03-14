import { IoClose, IoBarChartOutline, IoTimeOutline, IoChatbubblesOutline, IoDocumentTextOutline } from "react-icons/io5";

const ChatAnalyticsModal = ({ isOpen, onClose, metrics }) => {
  if (!isOpen || !metrics) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in p-4" onClick={onClose}>
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
        
        <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-950">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <IoBarChartOutline className="text-indigo-400"/> Workspace Analytics
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors"><IoClose size={24} /></button>
        </div>
        
        <div className="p-6 grid grid-cols-2 gap-4">
          
          <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50 flex flex-col items-center text-center shadow-inner">
            <IoChatbubblesOutline size={24} className="text-blue-400 mb-2"/>
            <span className="text-3xl font-bold text-white">{metrics.totalMessages}</span>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider mt-1">Total Messages</span>
          </div>
          
          <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50 flex flex-col items-center text-center shadow-inner">
            <IoDocumentTextOutline size={24} className="text-emerald-400 mb-2"/>
            <span className="text-3xl font-bold text-white">{metrics.totalWords.toLocaleString()}</span>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider mt-1">Total Words</span>
          </div>
          
          <div className="bg-indigo-600/10 p-4 rounded-xl border border-indigo-500/20 flex flex-col items-center text-center col-span-2 shadow-inner">
            <IoTimeOutline size={24} className="text-indigo-400 mb-2"/>
            <span className="text-3xl font-bold text-white">{metrics.estimatedReadTime} <span className="text-lg font-normal text-slate-400">min</span></span>
            <span className="text-[10px] text-indigo-300 uppercase tracking-wider mt-1">Estimated Reading Time</span>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default ChatAnalyticsModal;