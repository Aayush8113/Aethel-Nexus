export const MAX_CONTEXT_TOKENS = 32000; 

export const estimateTokens = (text) => {
  if (!text) return 0;
  return Math.ceil(text.trim().split(/\s+/).length * 1.3);
};

export const calculateChatTokens = (messages) => {
  return messages.reduce((acc, msg) => acc + estimateTokens(msg.content), 0);
};

export const getTokenMetrics = (count) => {
  const percentage = Math.min((count / MAX_CONTEXT_TOKENS) * 100, 100);
  let color = "bg-emerald-500";
  let textColor = "text-emerald-400";
  let status = "Optimal";

  if (percentage > 85) {
    color = "bg-red-500";
    textColor = "text-red-400";
    status = "Critical";
  } else if (percentage > 60) {
    color = "bg-yellow-500";
    textColor = "text-yellow-400";
    status = "Warning";
  }

  return { percentage, color, textColor, status };
};