import { useState, useEffect, useCallback } from 'react';

export const useSpeechRecognition = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [recognition, setRecognition] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = 'en-US'; // Default fallback, TTS engine handles the read-back

      rec.onresult = (event) => {
        const text = Array.from(event.results).map(res => res[0].transcript).join('');
        setTranscript(text);
      };

      rec.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
      };

      rec.onend = () => {
        setIsListening(false);
      };

      setRecognition(rec);
    }
  }, []);

  const startListening = useCallback(() => {
    if (recognition) {
      if (isListening) {
        recognition.stop();
        setIsListening(false);
      } else {
        recognition.start();
        setIsListening(true);
        setTranscript('');
      }
    } else {
      console.warn("Speech recognition not supported in this browser.");
    }
  }, [recognition, isListening]);

  const resetTranscript = useCallback(() => setTranscript(''), []);

  return { isListening, transcript, startListening, resetTranscript };
};