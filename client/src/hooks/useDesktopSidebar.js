import { useLocalStorage } from "./useLocalStorage";

export const useDesktopSidebar = () => {
  const [isDesktopSidebarOpen, setIsDesktopSidebarOpen] = useLocalStorage("aethel_desktop_sidebar", true);

  const toggleDesktopSidebar = () => setIsDesktopSidebarOpen((prev) => !prev);

  return { isDesktopSidebarOpen, toggleDesktopSidebar, setIsDesktopSidebarOpen };
};