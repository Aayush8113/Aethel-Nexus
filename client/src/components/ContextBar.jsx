import { calculateChatTokens, MAX_CONTEXT_TOKENS, getTokenColor } from "../utils/tokenUtils";

const ContextBar = ({ messages }) => {
  const tokenCount = calculateChatTokens(messages);
  const percentage = Math.min((tokenCount / MAX_CONTEXT_TOKENS) * 100, 100);
  const colorClass = getTokenColor(tokenCount);

  return (
    <div className="w-full h-0.5 bg-slate-900 absolute top-0 left-0 right-0 z-10 group cursor-help">
      <div 
        className={`h-full transition-all duration-500 shadow-[0_0_10px_currentColor] ${colorClass}`} 
        style={{ width: `${percentage}%` }}
      />
      {/* Tooltip on Hover */}
      <div className="absolute top-1 left-1/2 -translate-x-1/2 bg-slate-800 text-[10px] text-slate-300 px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border border-slate-700 whitespace-nowrap">
         Memory Usage: {tokenCount.toLocaleString()} / {MAX_CONTEXT_TOKENS.toLocaleString()} tokens
      </div>
    </div>
  );
};

export default ContextBar;