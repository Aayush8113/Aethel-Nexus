import { useState, useEffect } from 'react';

export const useInputDraft = (chatId) => {
  const key = `aethel_draft_${chatId || 'new_chat'}`;
  
  const [draft, setDraft] = useState(() => {
    try { return localStorage.getItem(key) || ""; } catch { return ""; }
  });

  useEffect(() => {
    try { setDraft(localStorage.getItem(key) || ""); } catch { setDraft(""); }
  }, [chatId, key]);

  const updateDraft = (val) => {
    setDraft(val);
    try {
      if (val.trim()) localStorage.setItem(key, val);
      else localStorage.removeItem(key);
    } catch {}
  };

  return [draft, updateDraft];
};