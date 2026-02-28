import { useState, useEffect } from "react";

export function useLocalStorage(key, initialValue) {
  // 1. Get initial value
  const [storedValue, setStoredValue] = useState(() => {
    if (typeof window === "undefined") return initialValue;
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  // 2. Wrap the setter to dispatch a custom event
  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
        // FIRE A GLOBAL EVENT SO ALL COMPONENTS UPDATE INSTANTLY
        window.dispatchEvent(new Event(`local-storage-${key}`));
      }
    } catch (error) {
      console.error(error);
    }
  };

  // 3. Listen for the custom event from other components
  useEffect(() => {
    const handleStorageChange = () => {
      try {
        const item = window.localStorage.getItem(key);
        setStoredValue(item ? JSON.parse(item) : initialValue);
      } catch (error) {
        console.error(error);
      }
    };

    window.addEventListener(`local-storage-${key}`, handleStorageChange);
    return () => window.removeEventListener(`local-storage-${key}`, handleStorageChange);
  }, [key, initialValue]);

  return [storedValue, setValue];
}