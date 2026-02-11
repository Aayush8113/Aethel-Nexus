const PersonaBadge = ({ persona }) => {
  return (
    <div className="absolute top-4 right-4 z-20 bg-slate-900/80 backdrop-blur border border-slate-700 px-3 py-1.5 rounded-full flex items-center gap-2 shadow-lg animate-fade-in pointer-events-none">
      <span className="text-lg">{persona.icon}</span>
      <span className="text-xs font-bold tracking-wide uppercase text-slate-300">{persona.name}</span>
    </div>
  );
};

export default PersonaBadge;