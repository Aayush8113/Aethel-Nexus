import { useState, useEffect, useCallback } from 'react';

export const useSpeechRecognition = (sttLang = 'en-US') => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [recognition, setRecognition] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const rec = new SpeechRecognition();
      
      // Changed back to FALSE: It will automatically stop when you stop speaking.
      rec.continuous = false; 
      rec.interimResults = false;
      
      // Uses the language selected in your settings (e.g., 'gu-IN' for Gujarati)
      rec.lang = sttLang; 

      rec.onresult = (event) => {
        let newTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            newTranscript += event.results[i][0].transcript;
          }
        }
        if (newTranscript) {
           setTranscript(newTranscript);
        }
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
  }, [sttLang]); 

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