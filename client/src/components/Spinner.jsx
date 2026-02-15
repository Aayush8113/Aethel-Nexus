import { IoPlanet } from "react-icons/io5";

const Spinner = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full w-full bg-slate-950 text-indigo-500 gap-4">
      <div className="relative">
        <div className="absolute inset-0 bg-indigo-500 blur-xl opacity-20 animate-pulse"></div>
        <IoPlanet size={48} className="animate-spin-slow relative z-10" />
      </div>
      <p className="text-sm font-mono text-slate-400 animate-pulse">Initializing Aethel...</p>
    </div>
  );
};

export default Spinner;