import { usePing } from '../hooks/usePing';

const PingIndicator = () => {
  const ping = usePing();
  
  const color = ping === -1 ? 'bg-red-500' 
              : ping < 150 ? 'bg-emerald-500' 
              : ping < 400 ? 'bg-yellow-500' 
              : 'bg-orange-500';

  return (
    <div className="flex items-center gap-2 group cursor-help relative" title="Network Latency (RTT)">
      <div className={`w-1.5 h-1.5 rounded-full ${color} animate-pulse shadow-[0_0_8px_currentColor]`}></div>
      <span className="text-[10px] text-slate-500 font-mono uppercase tracking-widest group-hover:text-slate-300 transition-colors">
        {ping === -1 ? 'Offline' : `${ping} ms`}
      </span>
    </div>
  );
};

export default PingIndicator;