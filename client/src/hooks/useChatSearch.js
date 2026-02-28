import { useState } from "react";

export const useChatSearch = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const toggleSearch = () => {
    setIsSearchOpen(prev => !prev);
    if (isSearchOpen) setSearchQuery(""); 
  };

  return { isSearchOpen, searchQuery, setSearchQuery, toggleSearch };
};