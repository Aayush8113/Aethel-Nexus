export const getReadTime = (text) => {
  if (!text) return '1 min read';
  const words = text.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / 200); // Average read speed
  return minutes <= 1 ? '1 min read' : `${minutes} min read`;
};

export const generateChatAnalytics = (messages) => {
  let totalWords = 0;
  let userMessages = 0;
  let aiMessages = 0;
  let codeBlocks = 0;

  messages.forEach(msg => {
    const content = msg.content || "";
    totalWords += content.trim().split(/\s+/).length;
    
    if (msg.role === 'user') userMessages++;
    if (msg.role === 'model') aiMessages++;
    
    // Count Markdown code blocks
    const blocks = content.match(/```/g);
    if (blocks) {
      codeBlocks += Math.floor(blocks.length / 2);
    }
  });

  return {
    totalMessages: messages.length,
    totalWords,
    userMessages,
    aiMessages,
    codeBlocks
  };
};