import { useState, useEffect } from 'react';

export const usePing = () => {
  const [ping, setPing] = useState(0);

  useEffect(() => {
    const checkPing = async () => {
      const start = Date.now();
      try {
        await fetch('/', { method: 'HEAD', cache: 'no-cache' });
        setPing(Date.now() - start);
      } catch (e) {
        setPing(-1); 
      }
    };

    checkPing(); 
    const interval = setInterval(checkPing, 10000); 
    return () => clearInterval(interval);
  }, []);

  return ping;
};