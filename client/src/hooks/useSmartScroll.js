import { useState, useCallback, useRef, useEffect } from "react";

export const useSmartScroll = (dependencies = []) => {
  const [isAutoScrollEnabled, setIsAutoScrollEnabled] = useState(true);
  const [showScrollBottom, setShowScrollBottom] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  
  const messagesEndRef = useRef(null);
  const containerRef = useRef(null);

  const handleScroll = useCallback((e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    const isAtBottom = scrollHeight - scrollTop - clientHeight < 150;
    
    setShowScrollBottom(!isAtBottom);
    setShowScrollTop(scrollTop > 400);

    // Lock scrolling if the user manually scrolls up
    if (!isAtBottom) {
      setIsAutoScrollEnabled(false);
    } else {
      setIsAutoScrollEnabled(true);
    }
  }, []);

  const scrollToBottom = useCallback((force = false) => {
    if (isAutoScrollEnabled || force) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      if (force) setIsAutoScrollEnabled(true);
    }
  }, [isAutoScrollEnabled]);

  const scrollToTop = useCallback(() => {
    containerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [...dependencies, scrollToBottom]);

  return {
    containerRef,
    messagesEndRef,
    isAutoScrollEnabled,
    showScrollBottom,
    showScrollTop,
    handleScroll,
    scrollToBottom,
    scrollToTop
  };
};