export const autoFormatInput = (text) => {
  if (!text || text.trim() === "") return text;
  
  // If it already contains markdown code blocks, leave it alone
  if (text.includes("```")) return text;

  // Heuristics to detect raw code
  const codeKeywords = [
    "function ", "const ", "let ", "var ", "import ", "export ", 
    "class ", "public ", "private ", "if (", "for (", "def ", "console.log"
  ];
  
  const hasKeywords = codeKeywords.some(kw => text.includes(kw));
  const hasBraces = text.includes("{") && text.includes("}");
  const isMultiLine = text.split("\n").length > 2;

  if ((hasKeywords || hasBraces) && isMultiLine) {
    return "```\n" + text.trim() + "\n```";
  }

  return text;
};