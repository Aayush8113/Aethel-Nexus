import { useState, useEffect, useCallback } from "react";

const useLocalVoice = (key, initialValue) => {
  const [value, setValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) { return initialValue; }
  });
  const setValueWrap = (val) => {
    try {
      setValue(val);
      window.localStorage.setItem(key, JSON.stringify(val));
    } catch (error) {}
  };
  return [value, setValueWrap];
};

export const useTextToSpeech = () => {
  const [voices, setVoices] = useState([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  const [savedVoiceName, setSavedVoiceName] = useLocalVoice("aethel_voice_name", "");
  const [rate, setRate] = useLocalVoice("aethel_voice_rate", 1);
  const [pitch, setPitch] = useLocalVoice("aethel_voice_pitch", 1);
  const [activeVoice, setActiveVoice] = useState(null);

  useEffect(() => {
    const loadVoices = () => {
      const available = window.speechSynthesis.getVoices();
      setVoices(available);
      
      if (available.length > 0) {
        let selected = available.find(v => v.name === savedVoiceName);
        if (!selected) {
           selected = available.find(v => v.name.includes("Google US English") || v.name.includes("Zira")) || available[0];
        }
        setActiveVoice(selected);
      }
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, [savedVoiceName]);

  const handleSetVoice = (voice) => {
    if (voice) {
      setActiveVoice(voice);
      setSavedVoiceName(voice.name);
    }
  };

  const speak = useCallback((text) => {
    if (!activeVoice || !text) return;

    window.speechSynthesis.cancel();

    // Strip Markdown
    const cleanText = text
      .replace(/[*_~`#]/g, "") 
      .replace(/```[\s\S]*?```/g, "Code block omitted.")
      .trim();

    // ==========================================
    // MULTILINGUAL AUTO-DETECTION LOGIC
    // ==========================================
    let voiceToUse = activeVoice;
    let langToUse = activeVoice.lang;

    const gujaratiRegex = /[\u0A80-\u0AFF]/; // Detects Gujarati text
    const hindiRegex = /[\u0900-\u097F]/;    // Detects Hindi text

    if (gujaratiRegex.test(cleanText)) {
      // Find a Gujarati voice installed on the OS/Browser
      const guVoice = voices.find(v => v.lang.includes('gu') || v.name.toLowerCase().includes('gujarati'));
      if (guVoice) { voiceToUse = guVoice; langToUse = guVoice.lang; }
    } else if (hindiRegex.test(cleanText)) {
      // Find a Hindi voice installed on the OS/Browser
      const hiVoice = voices.find(v => v.lang.includes('hi') || v.name.toLowerCase().includes('hindi'));
      if (hiVoice) { voiceToUse = hiVoice; langToUse = hiVoice.lang; }
    }

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.voice = voiceToUse;
    utterance.lang = langToUse; 
    utterance.rate = rate; 
    utterance.pitch = pitch; 

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = (e) => {
      console.error("Speech Synthesis Error:", e);
      setIsSpeaking(false);
    };

    setTimeout(() => { window.speechSynthesis.speak(utterance); }, 50);
  }, [activeVoice, rate, pitch, voices]);

  const stop = useCallback(() => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  }, []);

  return { voices, activeVoice, setActiveVoice: handleSetVoice, isSpeaking, speak, stop, rate, setRate, pitch, setPitch };
};