import { useState } from 'react';

export const useArtifact = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeCode, setActiveCode] = useState("");
  const [activeLanguage, setActiveLanguage] = useState("javascript");

  const openArtifact = (code, language) => {
    setActiveCode(code);
    setActiveLanguage(language);
    setIsVisible(true);
  };

  const closeArtifact = () => {
    setIsVisible(false);
  };

  return { isVisible, activeCode, activeLanguage, openArtifact, closeArtifact, setActiveCode };
};