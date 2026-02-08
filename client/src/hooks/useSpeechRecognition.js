import { useState, useEffect, useCallback } from "react";
import { useNotify } from "./useNotify";

export const useSpeechRecognition = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const { error } = useNotify();

  // Browser Compatibility Check
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

  const startListening = useCallback(() => {
    if (!SpeechRecognition) {
      error("Voice input is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onstart = () => setIsListening(true);
    
    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript;
      setTranscript(text);
      setIsListening(false);
    };

    recognition.onerror = (event) => {
      console.error("Speech Error:", event.error);
      setIsListening(false);
      if (event.error === 'not-allowed') {
        error("Microphone access denied.");
      }
    };

    recognition.onend = () => setIsListening(false);

    recognition.start();
  }, [SpeechRecognition, error]);

  const stopListening = useCallback(() => {
    setIsListening(false);
  }, []);

  const resetTranscript = () => setTranscript("");

  return { isListening, transcript, startListening, stopListening, resetTranscript };
};