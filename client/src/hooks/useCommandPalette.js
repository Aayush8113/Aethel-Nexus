import { useState } from 'react';

export const useCommandPalette = () => {
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);
  
  const togglePalette = () => setIsPaletteOpen(prev => !prev);
  const openPalette = () => setIsPaletteOpen(true);
  const closePalette = () => setIsPaletteOpen(false);

  return { isPaletteOpen, togglePalette, openPalette, closePalette };
};