import { forwardRef } from "react";
import { IoSearch, IoCloseCircle } from "react-icons/io5";

const SearchBar = forwardRef(({ value, onChange }, ref) => {
  return (
    <div className="relative px-2 mb-4 group">
      <div className="absolute inset-y-0 left-0 flex items-center pl-5 pointer-events-none">
        <IoSearch className="text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={16} />
      </div>
      <input 
        ref={ref} type="text" value={value} onChange={(e) => onChange(e.target.value)} 
        className="w-full bg-slate-950/50 text-white text-sm rounded-xl pl-10 pr-16 py-2.5 border border-slate-800 focus:border-indigo-500/50 focus:bg-slate-900 outline-none transition-all shadow-inner placeholder-slate-600" 
        placeholder="Search..." 
      />
      <div className="absolute inset-y-0 right-0 flex items-center pr-4">
        {value ? (
           <button onClick={() => onChange("")} className="text-slate-500 hover:text-white mr-2 transition-colors"><IoCloseCircle size={14}/></button>
        ) : (
           <span className="text-[10px] text-slate-500 font-mono border border-slate-700 bg-slate-800 px-1.5 py-0.5 rounded opacity-70 pointer-events-none">⌘K</span>
        )}
      </div>
    </div>
  );
});

SearchBar.displayName = "SearchBar";
export default SearchBar;