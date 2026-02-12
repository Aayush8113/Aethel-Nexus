import { IoSearch, IoClose } from "react-icons/io5"; // Added IoClose
import { forwardRef } from "react"; // Added forwardRef

const SearchBar = forwardRef(({ value, onChange }, ref) => {
  return (
    <div className="relative px-2 mb-4 animate-fade-in group">
      <IoSearch className="absolute transition-colors -translate-y-1/2 left-5 top-1/2 text-slate-500 group-focus-within:text-indigo-400" />
      <input 
        ref={ref} // Attach Ref here
        type="text" 
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search history... (Press '/')"
        className="w-full bg-slate-800 text-white pl-10 pr-8 py-2.5 rounded-xl text-sm border border-transparent focus:border-indigo-500/50 focus:bg-slate-700 outline-none transition-all placeholder-slate-500 shadow-inner"
      />
      
      {/* Clear Button */}
      {value && (
        <button 
          onClick={() => onChange("")}
          className="absolute -translate-y-1/2 right-4 top-1/2 text-slate-500 hover:text-white"
        >
          <IoClose />
        </button>
      )}
    </div>
  );
});

export default SearchBar;