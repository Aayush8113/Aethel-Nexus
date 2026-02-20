export const getCharCount = (text) => {
  return text ? text.length : 0;
};

export const getWordCount = (text) => {
  if (!text) return 0;
  return text.trim().split(/\s+/).filter(word => word.length > 0).length;
};