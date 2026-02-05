const SkeletonLoader = ({ className }) => {
  return (
    <div className={`bg-slate-800/50 animate-pulse rounded-md ${className}`}></div>
  );
};

export default SkeletonLoader;