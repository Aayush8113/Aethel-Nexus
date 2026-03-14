import { IoClose, IoAddCircleOutline, IoTrashOutline, IoPersonOutline } from "react-icons/io5";
import { useState } from "react";
import { PERSONAS } from "../data/personas";

const PersonaModal = ({ isOpen, onClose, currentPersona, onSelect, customPersonas, onAddCustom, onDeleteCustom }) => {
  const [isCreating, setIsCreating] = useState(false);
  const [newPersona, setNewPersona] = useState({ name: "", role: "", instruction: "" });

  if (!isOpen) return null;

  const handleSave = () => {
    if (newPersona.name && newPersona.instruction) {
      onAddCustom({ ...newPersona, id: `custom_${Date.now()}` });
      setIsCreating(false);
      setNewPersona({ name: "", role: "", instruction: "" });
    }
  };

  const allPersonas = [...PERSONAS, ...(customPersonas || [])];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm animate-fade-in p-4" onClick={onClose}>
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl flex flex-col shadow-2xl overflow-hidden max-h-[90vh]" onClick={e => e.stopPropagation()}>
        
        <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-950">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <IoPersonOutline className="text-indigo-400"/> AI Persona Engine
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors"><IoClose size={24} /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 md:p-6 custom-scrollbar flex flex-col md:flex-row gap-6">
          
          {/* List of Personas */}
          <div className="flex-1 space-y-3">
             <div className="flex justify-between items-end mb-4">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Available Personas</h3>
                <button onClick={() => setIsCreating(true)} className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
                  <IoAddCircleOutline size={16}/> Build Custom
                </button>
             </div>
             
             {allPersonas.map((p) => (
                <div key={p.id} className={`p-4 rounded-xl border transition-all cursor-pointer relative group ${currentPersona?.id === p.id ? "bg-indigo-600/20 border-indigo-500 shadow-inner" : "bg-slate-800 border-slate-700 hover:border-slate-500"}`} onClick={() => { onSelect(p); onClose(); }}>
                  <h4 className="font-bold text-white text-sm">{p.name}</h4>
                  <p className="text-xs text-indigo-300 mb-2">{p.role}</p>
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">{p.instruction}</p>
                  
                  {p.id.startsWith('custom_') && (
                     <button onClick={(e) => { e.stopPropagation(); onDeleteCustom(p.id); }} className="absolute top-3 right-3 text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">
                       <IoTrashOutline size={16}/>
                     </button>
                  )}
                </div>
             ))}
          </div>

          {/* Creation Form */}
          {isCreating && (
            <div className="flex-1 flex flex-col gap-4 animate-fade-in border-t md:border-t-0 md:border-l border-slate-800 pt-6 md:pt-0 md:pl-6">
               <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2">Build New Persona</h3>
               
               <input type="text" placeholder="Persona Name (e.g., Code Reviewer)" value={newPersona.name} onChange={e => setNewPersona({...newPersona, name: e.target.value})} className="w-full bg-slate-800 text-white p-3 rounded-lg border border-slate-700 focus:border-indigo-500 outline-none text-sm" />
               <input type="text" placeholder="Role/Tagline" value={newPersona.role} onChange={e => setNewPersona({...newPersona, role: e.target.value})} className="w-full bg-slate-800 text-white p-3 rounded-lg border border-slate-700 focus:border-indigo-500 outline-none text-sm" />
               
               <textarea placeholder="System Instructions (Define rules, tone, constraints...)" value={newPersona.instruction} onChange={e => setNewPersona({...newPersona, instruction: e.target.value})} className="w-full bg-slate-800 text-white p-3 rounded-lg border border-slate-700 focus:border-indigo-500 outline-none text-sm resize-none h-48 custom-scrollbar" />
               
               <div className="flex gap-2 mt-auto">
                 <button onClick={() => setIsCreating(false)} className="flex-1 py-2.5 rounded-lg text-sm font-bold text-slate-400 hover:bg-slate-800 transition-colors">Cancel</button>
                 <button onClick={handleSave} disabled={!newPersona.name || !newPersona.instruction} className="flex-1 py-2.5 rounded-lg text-sm font-bold bg-indigo-600 text-white hover:bg-indigo-500 disabled:opacity-50 transition-colors shadow-lg">Save Persona</button>
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PersonaModal;