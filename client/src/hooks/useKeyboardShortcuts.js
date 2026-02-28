import { useEffect } from 'react';

export const useKeyboardShortcuts = (shortcuts) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Allow default behavior in inputs/textareas unless explicitly handled
      const isInput = e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA';

      // Global Command Palette (Cmd/Ctrl + K)
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (shortcuts['k']) shortcuts['k']();
        return;
      }

      // Escape key (always works)
      if (e.key === 'Escape') {
        if (shortcuts['Escape']) shortcuts['Escape']();
        return;
      }

      // If we are typing in an input, don't trigger single-letter shortcuts
      if (isInput) return;

      // Single letter shortcuts
      const key = e.key.toLowerCase();
      if (shortcuts[key]) {
        e.preventDefault();
        shortcuts[key]();
      } else if (shortcuts[e.key]) { // Support for '?'
        e.preventDefault();
        shortcuts[e.key]();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts]);
};