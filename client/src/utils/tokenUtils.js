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
  if (percentage < 50) return "bg-emerald-500";
  if (percentage < 80) return "bg-yellow-500";
  return "bg-red-500";
};