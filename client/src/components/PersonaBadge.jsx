import { IoSparkles, IoCodeSlash, IoCreate, IoPersonOutline } from "react-icons/io5";

const PersonaBadge = ({ persona }) => {
  if (!persona) return null;

  const getIcon = () => {
    if (persona.isCustom) return <IoPersonOutline size={14} />;
    switch (persona.id) {
      case 'developer': return <IoCodeSlash size={14} />;
      case 'writer': return <IoCreate size={14} />;
      default: return <IoSparkles size={14} />;
    }
  };

  const getColor = () => {
    if (persona.isCustom) return "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";
    switch (persona.id) {
      case 'developer': return "text-blue-400 bg-blue-500/10 border-blue-500/20";
      case 'writer': return "text-purple-400 bg-purple-500/10 border-purple-500/20";
      default: return "text-indigo-400 bg-indigo-500/10 border-indigo-500/20";
    }
  };

  return (
    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border shadow-sm backdrop-blur select-none ${getColor()}`}>
      {getIcon()}
      <span className="text-xs font-bold tracking-wide">{persona.name}</span>
    </div>
  );
};

export default PersonaBadge;