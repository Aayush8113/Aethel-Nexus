import { IoCloudUploadOutline } from "react-icons/io5";

const DragOverlay = ({ isDragging }) => {
  if (!isDragging) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in pointer-events-none">
      <div className="border-4 border-dashed border-indigo-500 rounded-3xl p-16 flex flex-col items-center justify-center bg-indigo-500/10 animate-pulse">
        <IoCloudUploadOutline size={80} className="text-indigo-400 mb-6" />
        <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">Drop Image Here</h2>
        <p className="text-slate-400 text-lg">Release to attach to your active conversation</p>
      </div>
    </div>
  );
};

export default DragOverlay;