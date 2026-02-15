import { useEffect } from "react";

export const useKeyboardShortcuts = (shortcuts) => {
  useEffect(() => {
    const handleKeyDown = (event) => {
      // Ignore if user is typing in an input field
      if (['INPUT', 'TEXTAREA'].includes(event.target.tagName)) return;

      Object.keys(shortcuts).forEach((key) => {
        if (event.key.toLowerCase() === key.toLowerCase()) {
          event.preventDefault();
          shortcuts[key]();
        }
      });
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [shortcuts]);
};