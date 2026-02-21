export const downloadChatAsMarkdown = (title, messages) => {
  let content = `# Aethel-Nexus Chat Export\n\n`;
  content += `**Export Date:** ${new Date().toLocaleString()}\n\n---\n\n`;

  messages.forEach((msg) => {
    content += `### ${msg.role === 'user' ? 'User' : 'Aethel'}\n`;
    content += `${msg.content}\n\n`;
    if (msg.image) {
      content += `*[Image Attached]*\n\n`;
    }
  });

  const element = document.createElement("a");
  const file = new Blob([content], { type: "text/markdown" });
  element.href = URL.createObjectURL(file);
  element.download = `${title.replace(/\s+/g, '_')}_${Date.now()}.md`;
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
};

export const downloadChatAsJSON = (title, messages) => {
  const exportData = {
    app: "Aethel-Nexus",
    exportDate: new Date().toISOString(),
    messages: messages
  };

  const element = document.createElement("a");
  const file = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
  element.href = URL.createObjectURL(file);
  element.download = `${title.replace(/\s+/g, '_')}_${Date.now()}.json`;
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
};