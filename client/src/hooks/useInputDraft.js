import { useState, useEffect } from 'react';

export const useInputDraft = (chatId) => {
  const key = `aethel_draft_${chatId || 'new_chat'}`;
  
  const [draft, setDraft] = useState(() => {
    try { return localStorage.getItem(key) || ""; } 
    catch { return ""; }
  });

  // Load draft when chat changes
  useEffect(() => {
    try {
      const saved = localStorage.getItem(key) || "";
      setDraft(saved);
    } catch { setDraft(""); }
  }, [chatId, key]);

  // Save draft on change
  const updateDraft = (val) => {
    setDraft(val);
    try {
      if (val.trim()) localStorage.setItem(key, val);
      else localStorage.removeItem(key);
    } catch {}
  };

  return [draft, updateDraft];
};