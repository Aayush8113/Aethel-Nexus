import { IoClose, IoSettingsOutline } from "react-icons/io5";

const VoiceSettings = ({ isOpen, onClose, voices, activeVoice, onVoiceChange, isAutoRead, onToggleAutoRead }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md p-6 border shadow-2xl bg-slate-900 border-slate-700 rounded-2xl">
        
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-800">
          <div className="flex items-center gap-2 text-indigo-400">
            <IoSettingsOutline size={20} />
            <h2 className="text-lg font-bold text-white">Audio Settings</h2>
          </div>
          <button onClick={onClose} className="transition-colors text-slate-400 hover:text-white">
            <IoClose size={24} />
          </button>
        </div>

        <div className="space-y-6">
          {/* Voice Selection */}
          <div>
            <label className="block mb-2 text-sm font-medium text-slate-400">AI Voice Persona</label>
            <select 
              value={activeVoice?.name || ""}
              onChange={(e) => {
                const selected = voices.find(v => v.name === e.target.value);
                onVoiceChange(selected);
              }}
              className="w-full p-3 text-white transition-colors border rounded-lg outline-none appearance-none cursor-pointer bg-slate-800 border-slate-700 focus:border-indigo-500 hover:border-slate-600"
            >
              {voices.map(v => (
                <option key={v.name} value={v.name}>
                  {v.name.replace("Google", "").replace("Microsoft", "").trim().slice(0, 35)}
                </option>
              ))}
            </select>
          </div>

          {/* Auto-Read Toggle */}
          <div className="flex items-center justify-between p-4 border bg-slate-800/50 rounded-xl border-slate-800">
            <div>
              <span className="block text-sm font-medium text-white">Auto-Read Responses</span>
              <span className="text-xs text-slate-500">Read AI messages automatically</span>
            </div>
            <button 
              onClick={onToggleAutoRead}
              className={`w-12 h-6 rounded-full relative transition-colors duration-300 ${isAutoRead ? "bg-indigo-600" : "bg-slate-600"}`}
            >
              <span className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform duration-300 shadow-sm ${isAutoRead ? "translate-x-6" : "translate-x-0"}`} />
            </button>
          </div>
        </div>

        <button 
          onClick={onClose} 
          className="w-full py-3 mt-8 font-medium text-white transition-all bg-indigo-600 shadow-lg hover:bg-indigo-500 rounded-xl shadow-indigo-500/20"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default VoiceSettings;