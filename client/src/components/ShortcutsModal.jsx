import { IoClose, IoKey } from "react-icons/io5";

const ShortcutsModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const shortcuts = [
    { key: "/", desc: "Search History" },
    { key: "n", desc: "New Chat" },
    { key: "s", desc: "Open Settings" },
    { key: "p", desc: "Change Persona" },
    { key: "Esc", desc: "Close Panels" },
    { key: "?", desc: "Show Shortcuts" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm animate-fade-in p-4" onClick={onClose}>
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-sm p-6 shadow-2xl relative" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6 border-b border-slate-800 pb-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <IoKey className="text-indigo-400"/> Keyboard Shortcuts
          </h2>
          <button onClick={onClose}><IoClose size={24} className="text-slate-400 hover:text-white"/></button>
        </div>
        <div className="space-y-3">
          {shortcuts.map((s) => (
            <div key={s.key} className="flex justify-between items-center text-sm group">
              <span className="text-slate-300 group-hover:text-white transition-colors">{s.desc}</span>
              <kbd className="bg-slate-800 border border-slate-700 px-2 py-1 rounded text-slate-400 font-mono font-bold min-w-[30px] text-center shadow-sm group-hover:border-indigo-500/50 transition-colors">
                {s.key}
              </kbd>
            </div>
          ))}
        </div>
        <div className="mt-6 text-center text-xs text-slate-600">
           Press <span className="font-mono text-indigo-400">?</span> anytime to see this menu.
        </div>
      </div>
    </div>
  );
};

export default ShortcutsModal;