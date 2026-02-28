import { useState, useEffect } from "react";

export const useDragDrop = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [droppedImage, setDroppedImage] = useState(null);
  const [droppedText, setDroppedText] = useState(null);

  useEffect(() => {
    let dragCounter = 0;

    const handleDragEnter = (e) => {
      e.preventDefault(); e.stopPropagation();
      dragCounter++;
      if (e.dataTransfer.items && e.dataTransfer.items.length > 0) setIsDragging(true);
    };

    const handleDragLeave = (e) => {
      e.preventDefault(); e.stopPropagation();
      dragCounter--;
      if (dragCounter === 0) setIsDragging(false);
    };

    const handleDragOver = (e) => { e.preventDefault(); e.stopPropagation(); };

    const handleDrop = async (e) => {
      e.preventDefault(); e.stopPropagation();
      setIsDragging(false);
      dragCounter = 0;

      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        const file = e.dataTransfer.files[0];
        
        if (file.type.startsWith('image/')) {
          setDroppedImage(file);
        } else if (file.type === 'text/plain' || file.name.match(/\.(js|jsx|ts|tsx|py|html|css|json|md|cpp|c|java|go|rs|rb|php|sh|env)$/i)) {
          try {
            const text = await file.text();
            const ext = file.name.split('.').pop();
            setDroppedText({ name: file.name, ext, content: text });
          } catch (err) {
            console.error("Failed to read dropped text file", err);
          }
        }
      }
    };

    window.addEventListener("dragenter", handleDragEnter);
    window.addEventListener("dragleave", handleDragLeave);
    window.addEventListener("dragover", handleDragOver);
    window.addEventListener("drop", handleDrop);

    return () => {
      window.removeEventListener("dragenter", handleDragEnter);
      window.removeEventListener("dragleave", handleDragLeave);
      window.removeEventListener("dragover", handleDragOver);
      window.removeEventListener("drop", handleDrop);
    };
  }, []);

  return { isDragging, droppedImage, droppedText, clearDroppedFiles: () => { setDroppedImage(null); setDroppedText(null); } };
};