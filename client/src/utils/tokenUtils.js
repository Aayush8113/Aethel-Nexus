// Simple approximation: 1 word ≈ 1.3 tokens
export const estimateTokens = (text) => {
  if (!text) return 0;
  return Math.ceil(text.trim().split(/\s+/).length * 1.3);
};