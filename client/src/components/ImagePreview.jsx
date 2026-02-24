import { IoCloseCircle } from "react-icons/io5";

const ImagePreview = ({ file, onRemove }) => {
  if (!file) return null;

  const url = URL.createObjectURL(file);
  const sizeKb = (file.size / 1024).toFixed(1);

  return (
    <div className="relative inline-block group animate-fade-in-up">
      <img 
        src={url} 
        alt="Upload preview" 
        className="h-20 w-auto rounded-lg border border-slate-700 object-cover shadow-md group-hover:opacity-50 transition-opacity" 
      />
      <div className="absolute bottom-1 left-1 right-1 bg-black/80 backdrop-blur rounded px-1.5 py-0.5 text-[8px] text-slate-300 font-mono text-center truncate">
        {sizeKb} KB
      </div>
      <button
        type="button"
        onClick={onRemove}
        className="absolute -top-2 -right-2 text-slate-400 hover:text-red-500 bg-slate-900 rounded-full transition-colors shadow-lg opacity-0 group-hover:opacity-100"
        title="Remove attachment"
      >
        <IoCloseCircle size={20} />
      </button>
    </div>
  );
};

export default ImagePreview;