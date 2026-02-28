import { useLocalStorage } from "./useLocalStorage";

export const useCodeTheme = () => {
  const [activeThemeId, setActiveThemeId] = useLocalStorage("aethel_code_theme", "oneDark");

  const themes = [
    { id: "oneDark", name: "One Dark" },
    { id: "dracula", name: "Dracula" },
    { id: "materialDark", name: "Material Dark" },
    { id: "atomDark", name: "Atom Dark" }
  ];

  return { themes, activeThemeId, setActiveThemeId };
};