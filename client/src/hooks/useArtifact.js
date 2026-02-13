import { useState, useCallback } from "react";

export const useArtifact = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeCode, setActiveCode] = useState("");
  const [activeLanguage, setActiveLanguage] = useState("javascript");

  const openArtifact = useCallback((code, language) => {
    setActiveCode(code);
    setActiveLanguage(language || "javascript");
    setIsVisible(true);
  }, []);

  const closeArtifact = useCallback(() => {
    setIsVisible(false);
  }, []);

  return { 
    isVisible, 
    activeCode, 
    activeLanguage, 
    openArtifact, 
    closeArtifact, 
    setActiveCode 
  };
};