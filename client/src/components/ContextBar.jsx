import { calculateChatTokens, MAX_CONTEXT_TOKENS, getTokenMetrics } from "../utils/tokenUtils";
import { IoHardwareChipOutline } from "react-icons/io5";

const ContextBar = ({ messages }) => {
  if (!messages || messages.length === 0) return null;

  const usedTokens = calculateChatTokens(messages);
  const { percentage, color, textColor, status } = getTokenMetrics(usedTokens);

  return (
    <div className="absolute top-16 left-1/2 -translate-x-1/2 w-full max-w-sm px-4 z-10 pointer-events-none transition-all duration-500">
      <div className="bg-slate-900/80 backdrop-blur-md border border-slate-700/50 rounded-full p-1.5 flex items-center gap-3 shadow-lg group pointer-events-auto cursor-help">
        
        <div className={`p-1.5 rounded-full bg-slate-800 ${textColor}`}>
           <IoHardwareChipOutline size={14} />
        </div>

        <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
          <div 
            className={`h-full ${color} transition-all duration-1000 ease-out`} 
            style={{ width: `${percentage}%` }}
          />
        </div>
        
        <div className="pr-3 text-[10px] font-mono text-slate-400 flex items-center gap-2">
           <span className="hidden sm:inline">Context:</span> 
           <span className={`font-bold ${textColor}`}>{usedTokens.toLocaleString()}</span>
           <span className="opacity-50">/ {MAX_CONTEXT_TOKENS.toLocaleString()}</span>
        </div>

        {/* Hover Tooltip */}
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity text-[10px] text-slate-300 w-48 text-center pointer-events-none">
          Context Memory is <strong>{percentage.toFixed(1)}%</strong> full. 
          Status: <span className={`font-bold ${textColor}`}>{status}</span>.
        </div>
      </div>
    </div>
  );
};
export default ContextBar;