import { IoTerminalOutline, IoTrashOutline, IoCloseOutline, IoTimeOutline } from "react-icons/io5";
import { useEffect, useRef } from "react";

const ConsoleOutput = ({ output, onClear, onClose }) => {
  const bottomRef = useRef(null);

  // Auto-scroll to bottom of console when new logs arrive
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [output]);

  if (!output) return null;

  return (
    <div className="h-48 md:h-64 bg-[#0d0d0d] border-t border-black/80 shadow-[0_-10px_20px_rgba(0,0,0,0.3)] flex flex-col font-mono animate-fade-in-up z-20 print:hidden relative">
      <div className="flex items-center justify-between px-4 py-2 bg-[#1a1a1a] border-b border-black">
        <div className="flex items-center gap-2 text-slate-400">
          <IoTerminalOutline size={16} className="text-emerald-500" /> 
          <span className="text-xs font-bold uppercase tracking-widest text-white">Execution Console</span>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={onClear} className="text-slate-500 hover:text-white transition-colors flex items-center gap-1 text-[10px] uppercase tracking-wider font-bold" title="Clear Console History">
            <IoTrashOutline size={14} /> Clear History
          </button>
          <div className="w-px h-4 bg-slate-700"></div>
          <button onClick={onClose} className="text-slate-500 hover:text-red-400 transition-colors" title="Close Console">
            <IoCloseOutline size={18} />
          </button>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-3 space-y-4 custom-scrollbar text-xs md:text-sm">
        {output.length === 0 ? (
          <span className="text-slate-600 italic">Awaiting execution...</span>
        ) : (
          output.map((run, runIndex) => (
            <div key={runIndex} className="space-y-1.5 animate-fade-in">
              <div className="flex items-center gap-2 text-[10px] text-slate-500 border-b border-slate-800/50 pb-1 mb-2">
                 <IoTimeOutline size={12} /> Executed at {run.timestamp}
              </div>
              {run.logs.map((line, i) => (
                <div key={i} className={`whitespace-pre-wrap break-words ${line.startsWith('❌ Error:') ? 'text-red-400 bg-red-500/10 p-1.5 rounded border border-red-500/20' : 'text-emerald-400 leading-relaxed'}`}>
                  <span className="opacity-50 select-none mr-2">❯</span> {line}
                </div>
              ))}
            </div>
          ))
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  );
};

export default ConsoleOutput;