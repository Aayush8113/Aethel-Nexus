import { IoClose, IoPerson, IoCheckmarkCircle } from "react-icons/io5";
import { PERSONAS } from "../data/personas";

const PersonaModal = ({ isOpen, onClose, currentPersona, onSelect }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg p-6 border shadow-2xl bg-slate-900 border-slate-700 rounded-2xl">
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-800">
          <div className="flex items-center gap-2 text-indigo-400">
            <IoPerson size={20} />
            <h2 className="text-lg font-bold text-white">Select AI Persona</h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white"><IoClose size={24} /></button>
        </div>

        <div className="grid grid-cols-1 gap-3 max-h-[60vh] overflow-y-auto custom-scrollbar pr-2">
          {PERSONAS.map((persona) => (
            <button
              key={persona.id}
              onClick={() => { onSelect(persona); onClose(); }}
              className={`flex items-start gap-4 p-4 rounded-xl border text-left transition-all relative group ${
                currentPersona.id === persona.id
                  ? "bg-indigo-600/10 border-indigo-500 ring-1 ring-indigo-500/50"
                  : "bg-slate-800 border-slate-700 hover:bg-slate-700 hover:border-slate-600"
              }`}
            >
              <span className="p-2 text-3xl rounded-lg bg-slate-900">{persona.icon}</span>
              <div className="flex-1">
                <h3 className={`font-bold ${currentPersona.id === persona.id ? "text-indigo-400" : "text-white"}`}>
                  {persona.name}
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-slate-400 line-clamp-2">{persona.instruction}</p>
              </div>
              {currentPersona.id === persona.id && (
                <IoCheckmarkCircle className="absolute text-indigo-500 top-4 right-4" size={20} />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PersonaModal;