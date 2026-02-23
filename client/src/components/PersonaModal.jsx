import { IoClose, IoSparkles, IoCodeSlash, IoCreate, IoPersonOutline, IoTrashOutline, IoAddCircleOutline } from "react-icons/io5";
import { PERSONAS } from "../data/personas";
import { useState } from "react";

const PersonaModal = ({ isOpen, onClose, currentPersona, onSelect, customPersonas, onAddCustom, onDeleteCustom }) => {
  const [activeTab, setActiveTab] = useState("select");
  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newInst, setNewInst] = useState("");

  if (!isOpen) return null;

  const handleCreate = (e) => {
    e.preventDefault();
    if (!newName.trim() || !newInst.trim()) return;
    const newP = onAddCustom(newName, newDesc, newInst);
    onSelect(newP);
    setNewName(""); setNewDesc(""); setNewInst("");
    setActiveTab("select");
    onClose();
  };

  const allPersonas = [...PERSONAS, ...(customPersonas || [])];

  const getIcon = (id, isCustom) => {
    if (isCustom) return <IoPersonOutline size={24} className="text-emerald-400" />;
    if (id === 'developer') return <IoCodeSlash size={24} className="text-blue-400" />;
    if (id === 'writer') return <IoCreate size={24} className="text-purple-400" />;
    return <IoSparkles size={24} className="text-indigo-400" />;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm animate-fade-in p-4" onClick={onClose}>
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl p-6 shadow-2xl relative flex flex-col max-h-[80vh]" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white"><IoClose size={24} /></button>
        
        <h2 className="text-xl font-bold text-white mb-6">AI Personas</h2>

        <div className="flex gap-1 bg-slate-950/50 p-1 rounded-lg mb-6">
           <button onClick={() => setActiveTab("select")} className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${activeTab === "select" ? "bg-slate-800 text-white shadow" : "text-slate-500 hover:text-slate-300"}`}>Select Active</button>
           <button onClick={() => setActiveTab("create")} className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all flex justify-center items-center gap-2 ${activeTab === "create" ? "bg-slate-800 text-emerald-400 shadow" : "text-slate-500 hover:text-slate-300"}`}>
             <IoAddCircleOutline size={16}/> Create Custom
           </button>
        </div>

        {activeTab === "select" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 overflow-y-auto custom-scrollbar pr-2 pb-4">
            {allPersonas.map((persona) => (
              <div 
                key={persona.id} 
                onClick={() => { onSelect(persona); onClose(); }}
                className={`relative p-4 rounded-xl border transition-all cursor-pointer group ${currentPersona.id === persona.id ? "bg-indigo-600/10 border-indigo-500 shadow-[0_0_15px_rgba(79,70,229,0.15)]" : "bg-slate-800 border-slate-700 hover:border-indigo-400 hover:bg-slate-800/80"}`}
              >
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-slate-900 rounded-lg shadow-inner">{getIcon(persona.id, persona.isCustom)}</div>
                  <div className="flex-1">
                    <h3 className={`font-bold text-sm ${currentPersona.id === persona.id ? "text-indigo-400" : "text-slate-200"}`}>
                      {persona.name}
                      {persona.isCustom && <span className="ml-2 text-[9px] px-1.5 py-0.5 bg-emerald-500/20 text-emerald-400 rounded border border-emerald-500/30 uppercase tracking-widest">Custom</span>}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2">{persona.description}</p>
                  </div>
                </div>
                {persona.isCustom && (
                  <button onClick={(e) => { e.stopPropagation(); onDeleteCustom(persona.id); }} className="absolute top-2 right-2 p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors opacity-0 group-hover:opacity-100" title="Delete Persona">
                    <IoTrashOutline size={16} />
                  </button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <form onSubmit={handleCreate} className="space-y-4 animate-fade-in overflow-y-auto custom-scrollbar pr-2">
             <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Persona Name</label>
                <input required type="text" value={newName} onChange={(e)=>setNewName(e.target.value)} placeholder="e.g. Grumpy Code Reviewer" className="w-full bg-slate-800 text-white p-3 rounded-xl border border-slate-700 focus:border-emerald-500 outline-none text-sm" />
             </div>
             <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Short Description</label>
                <input type="text" value={newDesc} onChange={(e)=>setNewDesc(e.target.value)} placeholder="e.g. Highly critical but helpful." className="w-full bg-slate-800 text-white p-3 rounded-xl border border-slate-700 focus:border-emerald-500 outline-none text-sm" />
             </div>
             <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">System Instructions (The Brain)</label>
                <textarea required value={newInst} onChange={(e)=>setNewInst(e.target.value)} placeholder="You are an expert reviewer. Always point out flaws brutally but provide the perfect fix..." rows={5} className="w-full bg-slate-800 text-white p-3 rounded-xl border border-slate-700 focus:border-emerald-500 outline-none text-sm resize-none custom-scrollbar" />
             </div>
             <button type="submit" className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold shadow-lg transition-colors mt-4">
                Save & Activate Persona
             </button>
          </form>
        )}
      </div>
    </div>
  );
};
export default PersonaModal;