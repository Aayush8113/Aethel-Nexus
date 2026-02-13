export const getExtension = (lang) => {
  const map = {
    javascript: "js",
    js: "js",
    jsx: "jsx",
    typescript: "ts",
    ts: "ts",
    tsx: "tsx",
    python: "py",
    py: "py",
    html: "html",
    css: "css",
    java: "java",
    cpp: "cpp",
    c: "c",
    csharp: "cs",
    json: "json",
    markdown: "md",
    sql: "sql",
    bash: "sh",
    shell: "sh"
  };
  return map[lang.toLowerCase()] || "txt";
};