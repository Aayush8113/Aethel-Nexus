import { useState, useEffect, useCallback } from 'react';

// Passed sttLang as a prop so it can switch between English, Gujarati, Hindi, etc.
export const useSpeechRecognition = (sttLang = 'en-US') => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [recognition, setRecognition] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const rec = new SpeechRecognition();
      
      rec.continuous = true; 
      rec.interimResults = false;
      
      // Update the language dynamically based on user settings
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
  }, [sttLang]); // Re-initialize if language changes

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