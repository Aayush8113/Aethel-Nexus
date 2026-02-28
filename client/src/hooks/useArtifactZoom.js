import { useLocalStorage } from "./useLocalStorage";

export const useArtifactZoom = () => {
  const [fontSize, setFontSize] = useLocalStorage("aethel_artifact_fontsize", 14);

  const zoomIn = () => setFontSize((prev) => Math.min(prev + 2, 28));
  const zoomOut = () => setFontSize((prev) => Math.max(prev - 2, 10));

  return { fontSize, zoomIn, zoomOut };
};