export const downloadChatAsMarkdown = (title, messages) => {
  const content = messages.map(msg => {
    return `### ${msg.role === "user" ? "User" : "Aethel"}\n\n${msg.content}\n`;
  }).join("\n---\n\n");

  const blob = new Blob([`# ${title}\n\n${content}`], { type: "text/markdown" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${title.replace(/\s+/g, "_")}_chat.md`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

export const downloadChatAsJSON = (title, messages) => {
  const data = JSON.stringify({ title, messages }, null, 2);
  const blob = new Blob([data], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${title.replace(/\s+/g, "_")}_chat.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};