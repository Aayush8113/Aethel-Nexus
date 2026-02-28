import { useEffect } from "react";
import { useLocalStorage } from "./useLocalStorage";

export const useAppTheme = () => {
  const [appTheme, setAppTheme] = useLocalStorage("aethel_app_theme", "system");

  useEffect(() => {
    const root = window.document.documentElement;
    
    const applyTheme = (theme) => {
      if (theme === "dark") {
        root.classList.add("dark");
      } else if (theme === "light") {
        root.classList.remove("dark");
      } else {
        // System Default
        const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        if (systemPrefersDark) {
          root.classList.add("dark");
        } else {
          root.classList.remove("dark");
        }
      }
    };

    applyTheme(appTheme);

    // Listen for OS-level theme changes if set to 'system'
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      if (appTheme === "system") applyTheme("system");
    };
    
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [appTheme]);

  return { appTheme, setAppTheme };
};