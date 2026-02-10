import { IoCloseCircle } from "react-icons/io5";

const ImagePreview = ({ file, onRemove }) => {
  if (!file) return null;

  return (
    <div className="relative inline-block mb-2 group animate-fade-in">
      <div className="relative overflow-hidden border shadow-lg rounded-xl border-indigo-500/50">
        <img 
          src={URL.createObjectURL(file)} 
          alt="Upload Preview" 
          className="object-cover w-auto h-24 opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
      </div>
      
      <button 
        type="button"
        onClick={onRemove}
        className="absolute text-red-400 transition-colors rounded-full shadow-sm -top-2 -right-2 bg-slate-900 hover:text-red-300"
      >
        <IoCloseCircle size={24} />
      </button>
    </div>
  );
};

export default ImagePreview;