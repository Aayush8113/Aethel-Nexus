import { useEffect } from "react";
import { IoClose, IoDownloadOutline } from "react-icons/io5";

const Lightbox = ({ src, isOpen, onClose }) => {
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen || !src) return null;

  return (
    <div 
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/95 animate-fade-in backdrop-blur-sm"
      onClick={onClose}
    >
      {/* Toolbar */}
      <div className="absolute top-4 right-4 flex gap-4">
        <a 
          href={src} 
          download="aethel_image" 
          onClick={(e) => e.stopPropagation()}
          className="p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
          title="Download"
        >
          <IoDownloadOutline size={24} />
        </a>
        <button 
          onClick={onClose}
          className="p-3 bg-white/10 hover:bg-red-500/50 rounded-full text-white transition-colors"
        >
          <IoClose size={24} />
        </button>
      </div>

      {/* Image */}
      <img 
        src={src} 
        alt="Full View" 
        className="max-h-[90vh] max-w-[90vw] object-contain rounded-lg shadow-2xl animate-zoom-in"
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  );
};

export default Lightbox;