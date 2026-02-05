const TypingIndicator = () => {
  return (
    <div className="flex items-center gap-1 p-4 border rounded-tl-sm shadow-sm bg-slate-800 rounded-2xl w-fit border-slate-700">
      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
      <div className="w-2 h-2 rounded-full bg-slate-400 animate-bounce"></div>
    </div>
  );
};

export default TypingIndicator;