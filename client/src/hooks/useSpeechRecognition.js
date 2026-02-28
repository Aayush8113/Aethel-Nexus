import { useState, useEffect, useCallback } from 'react';

export const useSpeechRecognition = (sttLang = 'en-US') => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [recognition, setRecognition] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const rec = new SpeechRecognition();
      
      rec.continuous = false; 
      rec.interimResults = false;
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
        console.error('Speech recognition error:', event.error);
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
        try { 
          recognition.stop(); 
        } catch(e) { 
          console.warn("Mic stop safely bypassed", e); 
        }
        setIsListening(false);
      } else {
        try {
          recognition.start();
          setIsListening(true);
          setTranscript('');
        } catch (err) {
          // FIX: If the browser complains it's already listening, catch the error and sync the UI!
          console.warn("Mic is already listening. Syncing state.", err);
          setIsListening(true);
        }
      }
    } else {
      console.warn("Speech recognition not supported in this browser.");
    }
  }, [recognition, isListening]);

  const resetTranscript = useCallback(() => setTranscript(''), []);

  return { isListening, transcript, startListening, resetTranscript };
};