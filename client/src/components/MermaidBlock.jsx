import React, { useEffect, useState } from 'react';
import mermaid from 'mermaid';
import { IoWarningOutline } from 'react-icons/io5';

mermaid.initialize({
  startOnLoad: false,
  theme: 'dark',
  securityLevel: 'loose',
  fontFamily: 'monospace'
});

const MermaidBlock = ({ chart }) => {
  const [svg, setSvg] = useState('');
  const [error, setError] = useState(false);
  const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;

  useEffect(() => {
    const renderChart = async () => {
      try {
        mermaid.mermaidAPI.reset();
        const { svg } = await mermaid.render(id, chart);
        setSvg(svg);
        setError(false);
      } catch (err) {
        console.error("Mermaid parsing error:", err);
        setError(true);
      }
    };
    if (chart) renderChart();
  }, [chart, id]);

  return (
    <div className="my-6 bg-[#0d0d0d] border border-slate-700 rounded-xl p-4 flex justify-center overflow-x-auto relative shadow-lg">
      {error ? (
        <div className="flex items-center gap-2 text-red-400 text-xs font-mono py-4">
          <IoWarningOutline size={16} /> Failed to render diagram. Syntax error in Mermaid code.
        </div>
      ) : (
        <div dangerouslySetInnerHTML={{ __html: svg }} className="mermaid-container" />
      )}
    </div>
  );
};

export default MermaidBlock;