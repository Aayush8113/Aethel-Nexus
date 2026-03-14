import { useState, useEffect } from 'react';

export const useInputDraft = (chatId) => {
  const draftKey = `aethel_draft_${chatId || 'new'}`;
  
  // Initialize state from local storage if a draft exists
  const [input, setInput] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(draftKey);
      if (saved) return saved;
    }
    return "";
  });

  // Save to local storage whenever input changes
  useEffect(() => {
    if (input.trim() === "") {
      localStorage.removeItem(draftKey);
    } else {
      localStorage.setItem(draftKey, input);
    }
  }, [input, draftKey]);

  // If the chatId changes, load the draft for the new chat
  useEffect(() => {
    const saved = localStorage.getItem(draftKey);
    setInput(saved || "");
  }, [chatId, draftKey]);

  return [input, setInput];
};