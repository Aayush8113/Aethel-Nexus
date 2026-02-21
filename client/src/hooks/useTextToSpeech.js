import { useState, useEffect, useCallback } from "react";

export const useTextToSpeech = () => {
  const [voices, setVoices] = useState([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [activeVoice, setActiveVoice] = useState(null);

  // Load available voices (Chrome loads them asynchronously)
  useEffect(() => {
    const loadVoices = () => {
      const available = window.speechSynthesis.getVoices();
      setVoices(available);
      
      if (available.length > 0) {
        // Prefer a natural sounding "Google" or "Microsoft" voice initially
        const preferred = available.find(v => v.name.includes("Google US English") || v.name.includes("Zira"));
        // Only set the default if one isn't already selected by the user
        setActiveVoice(prev => prev || preferred || available[0]);
      }
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  const speak = useCallback((text) => {
    if (!activeVoice || !text) return;

    // Stop any current speech
    window.speechSynthesis.cancel();

    // Clean up Markdown symbols so the AI doesn't read "asterisk asterisk"
    const cleanText = text
      .replace(/[*_~`#]/g, "") // Remove markdown formatting characters
      .replace(/```[\s\S]*?```/g, "Code block omitted.") // Skip reading long code blocks
      .trim();

    const utterance = new SpeechSynthesisUtterance(cleanText);
    
    // CRITICAL FIX: Set BOTH the voice and the language property
    utterance.voice = activeVoice;
    utterance.lang = activeVoice.lang; // <--- This forces the correct native language engine!
    
    utterance.rate = 1; // Normal speed
    utterance.pitch = 1; // Normal pitch

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = (e) => {
      console.error("Speech Synthesis Error:", e);
      setIsSpeaking(false);
    };

    window.speechSynthesis.speak(utterance);
  }, [activeVoice]);

  const stop = useCallback(() => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  }, []);

  return { voices, activeVoice, setActiveVoice, isSpeaking, speak, stop };
};