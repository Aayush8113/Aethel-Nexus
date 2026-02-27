import React, { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';
import { IoWarningOutline } from 'react-icons/io5';

mermaid.initialize({
  startOnLoad: true,
  theme: 'dark',
  securityLevel: 'loose',
  fontFamily: 'Inter, sans-serif'
});

const MermaidViewer = ({ chart }) => {
  const ref = useRef(null);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (ref.current && chart) {
      setHasError(false);
      try {
        mermaid.render(`mermaid-${Date.now()}`, chart)
          .then(({ svg }) => {
            if (ref.current) ref.current.innerHTML = svg;
          })
          .catch((e) => {
            setHasError(true);
            console.error("Mermaid Render Error:", e);
          });
      } catch (error) {
        setHasError(true);
      }
    }
  }, [chart]);

  if (hasError) {
    return (
      <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl flex items-center gap-3 text-sm my-4 font-mono">
        <IoWarningOutline size={20} />
        <span>Diagram Syntax Error. The AI generated invalid Mermaid code.</span>
      </div>
    );
  }

  return (
    <div className="my-6 bg-slate-900/50 border border-slate-700/50 rounded-xl p-6 flex justify-center overflow-x-auto custom-scrollbar shadow-inner">
      <div ref={ref} className="mermaid-diagram-container" />
    </div>
  );
};

export default MermaidViewer;