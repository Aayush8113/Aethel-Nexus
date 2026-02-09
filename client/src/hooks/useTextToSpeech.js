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
      
      // Prefer a natural sounding "Google" or "Microsoft" voice
      const preferred = available.find(v => v.name.includes("Google US English") || v.name.includes("Zira"));
      setActiveVoice(preferred || available[0]);
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  const speak = useCallback((text) => {
    if (!activeVoice) return;

    // Stop any current speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = activeVoice;
    utterance.rate = 1; // Normal speed
    utterance.pitch = 1; // Normal pitch

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  }, [activeVoice]);

  const stop = useCallback(() => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  }, []);

  return { voices, activeVoice, setActiveVoice, isSpeaking, speak, stop };
};