import { IoClose, IoKeyboardOutline, IoFlashOutline } from "react-icons/io5";

const ShortcutsModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const shortcuts = [
    { key: "n", description: "Start new workspace" },
    { key: "f", description: "Toggle Focus Mode (Hide UI)" },
    { key: "s", description: "Open System Settings" },
    { key: "p", description: "Open Persona Builder" },
    { key: "b", description: "Toggle Bookmarks Panel" },
    { key: "?", description: "Open this Shortcuts Menu" },
    { key: "Esc", description: "Close active modal / panel" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in p-4" onClick={onClose}>
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
        
        <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-950">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <IoKeyboardOutline className="text-indigo-400"/> Keyboard Shortcuts
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors"><IoClose size={24} /></button>
        </div>
        
        <div className="p-6">
          <div className="flex items-center gap-3 mb-6 p-3 bg-indigo-600/10 border border-indigo-500/20 rounded-xl text-indigo-300 text-xs leading-relaxed">
            <IoFlashOutline size={20} className="flex-shrink-0 text-indigo-400" />
            Navigate Aethel-Nexus like a power user. Ensure you are not focused inside an input field when using these shortcuts.
          </div>

          <div className="space-y-2">
            {shortcuts.map((shortcut, index) => (
              <div key={index} className="flex justify-between items-center p-3 bg-slate-800/50 rounded-xl border border-slate-700/50 hover:bg-slate-800 transition-colors">
                <span className="text-sm text-slate-300 font-medium">{shortcut.description}</span>
                <kbd className="px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs font-mono text-emerald-400 shadow-inner tracking-widest font-bold">
                  {shortcut.key}
                </kbd>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShortcutsModal;