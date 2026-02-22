import { IoClose, IoOptionsOutline, IoConstruct } from "react-icons/io5";
import { useState } from "react";
import { useCodeTheme } from "../hooks/useCodeTheme";
import { useCodeSettings } from "../hooks/useCodeSettings";

const VoiceSettings = ({ isOpen, onClose, voices, activeVoice, onVoiceChange, isAutoRead, onToggleAutoRead, customPrompt, setCustomPrompt, ttsRate, setTtsRate, ttsPitch, setTtsPitch }) => {
  const [activeTab, setActiveTab] = useState("prefs");
  const { themes, activeThemeId, setActiveThemeId } = useCodeTheme();
  const { showLineNumbers, setShowLineNumbers, wordWrap, setWordWrap } = useCodeSettings();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm animate-fade-in p-4" onClick={onClose}>
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto custom-scrollbar" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white"><IoClose size={24} /></button>
        
        <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
          {activeTab === "prefs" ? <IoOptionsOutline className="text-indigo-400"/> : <IoConstruct className="text-indigo-400"/>}
          App Settings
        </h2>

        <div className="flex gap-1 bg-slate-950/50 p-1 rounded-lg mb-6 sticky top-0 z-10">
           <button onClick={() => setActiveTab("prefs")} className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${activeTab === "prefs" ? "bg-slate-800 text-white shadow" : "text-slate-500 hover:text-slate-300"}`}>Preferences</button>
           <button onClick={() => setActiveTab("system")} className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${activeTab === "system" ? "bg-slate-800 text-white shadow" : "text-slate-500 hover:text-slate-300"}`}>System Override</button>
        </div>

        {activeTab === "prefs" ? (
          <div className="space-y-6">
            <div className="space-y-4 border-b border-slate-800 pb-6">
              <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Audio & Voice</h3>
              <div className="flex items-center justify-between p-3 bg-slate-800 rounded-xl border border-slate-700">
                <div><p className="font-bold text-sm text-white">Auto-Read Responses</p><p className="text-xs text-slate-400">Speak AI replies automatically</p></div>
                <button onClick={onToggleAutoRead} className={`w-12 h-6 rounded-full p-1 transition-colors ${isAutoRead ? "bg-indigo-600" : "bg-slate-600"}`}>
                  <div className={`w-4 h-4 rounded-full bg-white transform transition-transform ${isAutoRead ? "translate-x-6" : "translate-x-0"}`} />
                </button>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">AI Voice Model</label>
                <select value={activeVoice?.name || ""} onChange={(e) => onVoiceChange(voices.find(v => v.name === e.target.value))} className="w-full bg-slate-800 text-white p-3 rounded-xl border border-slate-700 focus:border-indigo-500 outline-none text-sm appearance-none cursor-pointer">
                  {voices.map((voice) => (<option key={voice.name} value={voice.name}>{voice.name} ({voice.lang})</option>))}
                </select>
              </div>
              {/* Sliders for Speed & Pitch */}
              <div className="flex gap-4">
                <div className="flex-1 space-y-1">
                  <label className="text-xs font-bold text-slate-500 flex justify-between">Speed <span>{ttsRate}x</span></label>
                  <input type="range" min="0.5" max="2" step="0.1" value={ttsRate} onChange={(e) => setTtsRate(parseFloat(e.target.value))} className="w-full accent-indigo-500" />
                </div>
                <div className="flex-1 space-y-1">
                  <label className="text-xs font-bold text-slate-500 flex justify-between">Pitch <span>{ttsPitch}</span></label>
                  <input type="range" min="0" max="2" step="0.1" value={ttsPitch} onChange={(e) => setTtsPitch(parseFloat(e.target.value))} className="w-full accent-indigo-500" />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Code Appearance</h3>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Syntax Theme</label>
                <select value={activeThemeId} onChange={(e) => setActiveThemeId(e.target.value)} className="w-full bg-slate-800 text-white p-3 rounded-xl border border-slate-700 focus:border-indigo-500 outline-none text-sm appearance-none cursor-pointer">
                  {themes.map((theme) => (<option key={theme.id} value={theme.id}>{theme.name}</option>))}
                </select>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-800 rounded-xl border border-slate-700">
                <div><p className="font-bold text-sm text-white">Line Numbers</p></div>
                <button onClick={() => setShowLineNumbers(!showLineNumbers)} className={`w-12 h-6 rounded-full p-1 transition-colors ${showLineNumbers ? "bg-indigo-600" : "bg-slate-600"}`}><div className={`w-4 h-4 rounded-full bg-white transform transition-transform ${showLineNumbers ? "translate-x-6" : "translate-x-0"}`} /></button>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-800 rounded-xl border border-slate-700">
                <div><p className="font-bold text-sm text-white">Word Wrap (Chat)</p></div>
                <button onClick={() => setWordWrap(!wordWrap)} className={`w-12 h-6 rounded-full p-1 transition-colors ${wordWrap ? "bg-indigo-600" : "bg-slate-600"}`}><div className={`w-4 h-4 rounded-full bg-white transform transition-transform ${wordWrap ? "translate-x-6" : "translate-x-0"}`} /></button>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4 animate-fade-in">
             <div className="space-y-2">
                <label className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-2">Custom System Prompt Override</label>
                <p className="text-[10px] text-slate-400 leading-tight mb-2">This text will be appended to your active Persona's instructions.</p>
                <textarea value={customPrompt} onChange={(e) => setCustomPrompt(e.target.value)} placeholder="e.g. Always write comments..." className="w-full bg-slate-800 text-white p-3 rounded-xl border border-slate-700 focus:border-indigo-500 outline-none text-sm resize-none h-32 custom-scrollbar" />
             </div>
             {customPrompt && (<button onClick={() => setCustomPrompt("")} className="text-xs text-red-400 hover:text-red-300 font-medium">Clear Custom Prompt</button>)}
          </div>
        )}
      </div>
    </div>
  );
};
export default VoiceSettings;