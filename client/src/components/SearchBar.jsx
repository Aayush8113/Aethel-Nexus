import { IoSearch } from "react-icons/io5";

const SearchBar = ({ value, onChange }) => {
  return (
    <div className="relative px-2 mb-4 animate-fade-in">
      <IoSearch className="absolute -translate-y-1/2 left-5 top-1/2 text-slate-500" />
      <input 
        type="text" 
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search history..."
        className="w-full bg-slate-800 text-white pl-10 pr-4 py-2.5 rounded-xl text-sm border border-transparent focus:border-indigo-500/50 focus:bg-slate-700 outline-none transition-all placeholder-slate-500 shadow-inner"
      />
    </div>
  );
};

export default SearchBar;