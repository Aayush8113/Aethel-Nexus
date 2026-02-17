// Gemini 2.0 Flash has a huge window, but let's visualize a safe "active memory" chunk (e.g., 32k for fast processing)
export const MAX_CONTEXT_TOKENS = 32000; 

export const estimateTokens = (text) => {
  if (!text) return 0;
  return Math.ceil(text.trim().split(/\s+/).length * 1.3);
};

export const calculateChatTokens = (messages) => {
  return messages.reduce((acc, msg) => acc + estimateTokens(msg.content), 0);
};

export const getTokenColor = (count) => {
  const percentage = (count / MAX_CONTEXT_TOKENS) * 100;
  if (percentage < 50) return "bg-green-500";
  if (percentage < 80) return "bg-yellow-500";
  return "bg-red-500";
};