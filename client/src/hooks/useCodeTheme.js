import { useLocalStorage } from "./useLocalStorage";

export const THEMES = [
  { id: "oneDark", name: "One Dark (Default)" },
  { id: "dracula", name: "Dracula" },
  { id: "materialDark", name: "Material Dark" },
  { id: "atomDark", name: "Atom Dark" }
];

export const useCodeTheme = () => {
  const [activeThemeId, setActiveThemeId] = useLocalStorage("aethel_code_theme", "oneDark");
  
  return {
    themes: THEMES,
    activeThemeId,
    setActiveThemeId
  };
};