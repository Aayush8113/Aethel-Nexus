import { calculateChatTokens, MAX_CONTEXT_TOKENS, getTokenMetrics } from "../utils/tokenUtils";
import { IoHardwareChipOutline } from "react-icons/io5";

const ContextBar = ({ messages = [] }) => {
  // 1. Calculate tokens safely
  const currentTokens = calculateChatTokens(messages);
  const { textColor } = getTokenMetrics(currentTokens);
  
  // 2. Safe math to prevent the .toFixed() crash
  const maxTokens = MAX_CONTEXT_TOKENS || 1048576; 
  let rawPercentage = (currentTokens / maxTokens) * 100;
  
  // Safeguard against NaN or Infinity
  if (isNaN(rawPercentage) || !isFinite(rawPercentage)) {
    rawPercentage = 0;
  }
  
  // Cap at 100% for the visual bar
  const visualPercentage = Math.min(rawPercentage, 100);
  const displayPct = rawPercentage.toFixed(2);

  return (
    <div className="flex items-center justify-between px-4 py-2 bg-slate-900/50 border-b border-slate-800/50 backdrop-blur-sm text-xs select-none">
      <div className="flex items-center gap-2 text-slate-400 font-mono">
        <IoHardwareChipOutline size={14} className={textColor} />
        <span className="hidden sm:inline">Context Window Usage</span>
        <span className="sm:hidden">Context</span>
      </div>
      
      <div className="flex items-center gap-3 w-1/2 max-w-sm">
        <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
          <div 
            className={`h-full transition-all duration-500 rounded-full ${rawPercentage > 80 ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]' : 'bg-indigo-500'}`}
            style={{ width: `${visualPercentage}%` }}
          />
        </div>
        <span className={`font-mono ${textColor} min-w-[100px] text-right tracking-tight`}>
          {currentTokens.toLocaleString()} <span className="text-slate-600 hidden md:inline">/ {maxTokens.toLocaleString()}</span> ({displayPct}%)
        </span>
      </div>
    </div>
  );
};

export default ContextBar;