import Editor from "@monaco-editor/react";

const CodeEditorWindow = ({ code, language, onChange, theme = "vs-dark", wordWrap = "on" }) => {
  const handleEditorChange = (value) => { onChange(value || ""); };

  return (
    <div className="h-full w-full overflow-hidden bg-[#1e1e1e]">
      <Editor
        height="100%" width="100%"
        language={language === "c++" ? "cpp" : language}
        value={code} theme={theme} onChange={handleEditorChange}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          wordWrap: wordWrap, // Dynamic Wrap
          scrollBeyondLastLine: false,
          padding: { top: 16, bottom: 16 },
          fontFamily: "'JetBrains Mono', 'Fira Code', Consolas, monospace",
          fontLigatures: true, smoothScrolling: true, cursorBlinking: "smooth", formatOnPaste: true,
        }}
      />
    </div>
  );
};
export default CodeEditorWindow;