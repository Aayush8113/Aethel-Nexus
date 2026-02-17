import { IoClose, IoVolumeHigh, IoConstruct } from "react-icons/io5";
import { useState } from "react";

const VoiceSettings = ({ isOpen, onClose, voices, activeVoice, onVoiceChange, isAutoRead, onToggleAutoRead }) => {
  const [activeTab, setActiveTab] = useState("voice");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm animate-fade-in p-4" onClick={onClose}>
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md p-6 shadow-2xl relative" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white"><IoClose size={24} /></button>
        
        <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
          {activeTab === "voice" ? <IoVolumeHigh className="text-indigo-400"/> : <IoConstruct className="text-indigo-400"/>}
          Settings
        </h2>

        {/* Tabs */}
        <div className="flex gap-1 bg-slate-950/50 p-1 rounded-lg mb-6">
           <button 
             onClick={() => setActiveTab("voice")} 
             className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${activeTab === "voice" ? "bg-slate-800 text-white shadow" : "text-slate-500 hover:text-slate-300"}`}
           >
             Voice & Audio
           </button>
           <button 
             onClick={() => setActiveTab("system")} 
             className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${activeTab === "system" ? "bg-slate-800 text-white shadow" : "text-slate-500 hover:text-slate-300"}`}
           >
             System Info
           </button>
        </div>

        {activeTab === "voice" ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between p-3 bg-slate-800 rounded-xl border border-slate-700">
              <div>
                <p className="font-bold text-sm text-white">Auto-Read Responses</p>
                <p className="text-xs text-slate-400">Speak AI replies automatically</p>
              </div>
              <button 
                onClick={onToggleAutoRead}
                className={`w-12 h-6 rounded-full p-1 transition-colors ${isAutoRead ? "bg-indigo-600" : "bg-slate-600"}`}
              >
                <div className={`w-4 h-4 rounded-full bg-white transform transition-transform ${isAutoRead ? "translate-x-6" : "translate-x-0"}`} />
              </button>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">AI Voice Model</label>
              <select 
                value={activeVoice?.name || ""}
                onChange={(e) => {
                  const selected = voices.find(v => v.name === e.target.value);
                  onVoiceChange(selected);
                }}
                className="w-full bg-slate-800 text-white p-3 rounded-xl border border-slate-700 focus:border-indigo-500 outline-none text-sm appearance-none"
              >
                {voices.map((voice) => (
                  <option key={voice.name} value={voice.name}>
                    {voice.name} ({voice.lang})
                  </option>
                ))}
              </select>
            </div>
          </div>
        ) : (
          <div className="space-y-4 animate-fade-in">
             <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/50 border-dashed text-center py-8">
                <IoConstruct size={32} className="mx-auto text-slate-600 mb-2" />
                <p className="text-sm text-slate-300 font-bold">Managed by Personas</p>
                <p className="text-xs text-slate-500 mt-1 max-w-[200px] mx-auto">
                  System instructions are currently locked to your active Persona to ensure consistency.
                </p>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VoiceSettings;