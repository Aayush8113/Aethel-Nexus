import { useState, useRef } from "react";
import { IoRefreshOutline, IoWarningOutline, IoDesktopOutline, IoPhonePortraitOutline, IoTabletPortraitOutline } from "react-icons/io5";

const WebPreview = ({ code, language }) => {
  const iframeRef = useRef(null);
  const [key, setKey] = useState(0);
  const [viewMode, setViewMode] = useState("desktop"); // desktop, tablet, mobile

  // Check if the language is something the browser can physically render
  const isWebRenderable = ['html', 'svg', 'xml'].includes(language?.toLowerCase());

  if (!isWebRenderable) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-[#0d0d0d] text-slate-500 font-mono text-sm p-6 text-center">
        <IoWarningOutline size={48} className="text-amber-500/50 mb-4" />
        <p>Visual Canvas is only available for HTML or SVG documents.</p>
        <p className="text-xs mt-2 opacity-70">Switch back to the Code tab to edit, or run JavaScript in the Console.</p>
      </div>
    );
  }

  // Calculate the width for responsive testing
  const getWidth = () => {
     if (viewMode === 'mobile') return 'w-[375px]';
     if (viewMode === 'tablet') return 'w-[768px]';
     return 'w-full';
  };

  return (
    <div className="flex flex-col h-full bg-[#0d0d0d] relative overflow-hidden animate-fade-in">
      
      {/* Canvas Floating Controls */}
      <div className="absolute top-4 right-4 z-10 flex gap-2 shadow-2xl bg-slate-900/90 backdrop-blur-md rounded-xl p-1.5 border border-slate-700">
         <div className="flex items-center gap-1 bg-black/50 rounded-lg p-1 border border-slate-700/50 mr-2 shadow-inner">
            <button onClick={() => setViewMode('mobile')} className={`p-1.5 rounded-md transition-colors ${viewMode === 'mobile' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`} title="Mobile View">
               <IoPhonePortraitOutline size={16} />
            </button>
            <button onClick={() => setViewMode('tablet')} className={`p-1.5 rounded-md transition-colors ${viewMode === 'tablet' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`} title="Tablet View">
               <IoTabletPortraitOutline size={16} />
            </button>
            <button onClick={() => setViewMode('desktop')} className={`p-1.5 rounded-md transition-colors ${viewMode === 'desktop' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`} title="Desktop View">
               <IoDesktopOutline size={16} />
            </button>
         </div>
         
         <button onClick={() => setKey(prev => prev + 1)} className="px-3 py-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-2 text-xs font-bold" title="Reload Canvas">
           <IoRefreshOutline size={16} /> Reload
         </button>
      </div>

      {/* Rendering Area with Blueprint Background */}
      <div className="flex-1 overflow-auto flex justify-center bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+CjxjaXJjbGUgY3g9IjIiIGN5PSIyIiByPSIxIiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDUpIi8+Cjwvc3ZnPg==')] pt-16 pb-8 px-4 custom-scrollbar">
         <div className={`${getWidth()} h-full min-h-[500px] transition-all duration-500 ease-out bg-white shadow-[0_0_40px_rgba(0,0,0,0.5)] relative rounded-sm overflow-hidden border border-slate-600`}>
            {/* The Sandboxed Iframe */}
            <iframe
              key={key}
              ref={iframeRef}
              title="Web Canvas"
              sandbox="allow-scripts allow-modals allow-forms allow-popups"
              srcDoc={code}
              className="w-full h-full border-none bg-white"
            />
         </div>
      </div>
    </div>
  );
};

export default WebPreview;