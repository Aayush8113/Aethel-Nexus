import { IoWarning } from "react-icons/io5";

const OfflineBanner = () => {
  return (
    <div className="z-50 flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-white shadow-lg bg-red-600/90 backdrop-blur-sm animate-fade-in">
      <IoWarning size={18} />
      <span>You are currently offline. AI features may be unavailable.</span>
    </div>
  );
};

export default OfflineBanner;