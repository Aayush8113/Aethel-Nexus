/**
 * Utility for estimating LLM token counts based on standard heuristics.
 * Roughly, 1 token ≈ 4 characters or 0.75 words in English.
 */

// Define the maximum context window for the model (Gemini supports up to 1M+)
// We set a high visual threshold for the UI progress bar.
export const MAX_CONTEXT_TOKENS = 1048576; 

export const estimateTokens = (text) => {
  if (!text) return 0;
  // Fallback heuristic: length / 4 is standard for LLM estimation
  return Math.ceil(text.length / 4);
};

export const getTokenMetrics = (tokenCount) => {
  if (tokenCount < 100) return { level: 'low', textColor: 'text-slate-500' };
  if (tokenCount < 1000) return { level: 'medium', textColor: 'text-emerald-500' };
  if (tokenCount < 5000) return { level: 'high', textColor: 'text-amber-500' };
  return { level: 'critical', textColor: 'text-red-500' };
};