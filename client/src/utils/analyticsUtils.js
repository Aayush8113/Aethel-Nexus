/**
 * Utility functions for generating text analytics and workspace metrics.
 */

export const getReadTime = (text) => {
  if (!text) return "< 1 min";
  const words = text.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / 200); // Standard 200 WPM reading speed
  return `${minutes} min`;
};

export const generateChatAnalytics = (messages) => {
  if (!messages || messages.length === 0) {
    return { totalMessages: 0, totalWords: 0, estimatedReadTime: 0 };
  }

  const totalMessages = messages.length;
  let totalWords = 0;

  messages.forEach(msg => {
    if (msg.content) {
      totalWords += msg.content.trim().split(/\s+/).length;
    }
  });

  const estimatedReadTime = Math.ceil(totalWords / 200);

  return {
    totalMessages,
    totalWords,
    estimatedReadTime
  };
};