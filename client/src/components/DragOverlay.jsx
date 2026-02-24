import { IoCloudUploadOutline, IoDocumentTextOutline, IoImageOutline } from "react-icons/io5";

const DragOverlay = ({ isDragging }) => {
  if (!isDragging) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in pointer-events-none">
      <div className="border-4 border-dashed border-indigo-500 rounded-3xl p-16 flex flex-col items-center justify-center bg-indigo-500/10 animate-pulse shadow-[0_0_50px_rgba(79,70,229,0.3)]">
        <IoCloudUploadOutline size={80} className="text-indigo-400 mb-6" />
        <h2 className="text-3xl font-bold text-white mb-4 tracking-tight">Drop Files to Attach</h2>
        <div className="flex items-center gap-6 text-slate-400 text-sm font-medium">
           <span className="flex items-center gap-2"><IoImageOutline size={18}/> Images</span>
           <span className="w-1.5 h-1.5 rounded-full bg-slate-600"></span>
           <span className="flex items-center gap-2"><IoDocumentTextOutline size={18}/> Code/Text Files</span>
        </div>
      </div>
    </div>
  );
};
export default DragOverlay;