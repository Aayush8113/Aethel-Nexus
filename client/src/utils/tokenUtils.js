/**
 * Utility for estimating LLM token counts based on standard heuristics.
 * Roughly, 1 token ≈ 4 characters or 0.75 words in English.
 */

export const estimateTokens = (text) => {
  if (!text) return 0;
  // Fallback heuristic: length / 4 is standard for Gemini/OpenAI
  return Math.ceil(text.length / 4);
};

export const getTokenMetrics = (tokenCount) => {
  if (tokenCount < 100) return { level: 'low', textColor: 'text-slate-500' };
  if (tokenCount < 500) return { level: 'medium', textColor: 'text-emerald-500' };
  if (tokenCount < 2000) return { level: 'high', textColor: 'text-amber-500' };
  return { level: 'critical', textColor: 'text-red-500' };
};