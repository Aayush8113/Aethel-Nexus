const TypingIndicator = () => {
  return (
    <div className="flex items-center gap-1.5 p-4 bg-transparent rounded-2xl h-12">
      <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full wave-dot"></div>
      <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full wave-dot"></div>
      <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full wave-dot"></div>
    </div>
  );
};
export default TypingIndicator;