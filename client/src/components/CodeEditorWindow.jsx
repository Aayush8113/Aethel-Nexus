import Editor from "@monaco-editor/react";

const CodeEditorWindow = ({ code, language, onChange, theme = "vs-dark" }) => {
  const handleEditorChange = (value) => {
    onChange(value);
  };

  return (
    <div className="h-full w-full overflow-hidden rounded-xl border border-slate-700 bg-[#1e1e1e] shadow-2xl">
      <Editor
        height="100%"
        width="100%"
        language={language}
        value={code}
        theme={theme}
        onChange={handleEditorChange}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          wordWrap: "on",
          scrollBeyondLastLine: false,
          padding: { top: 16, bottom: 16 },
          fontFamily: "'Fira Code', 'Cascadia Code', Consolas, monospace",
        }}
      />
    </div>
  );
};

export default CodeEditorWindow;