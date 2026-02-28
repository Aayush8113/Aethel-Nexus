export const exportAppBackup = () => {
  const backupData = {
    version: "1.0",
    exportDate: new Date().toISOString(),
    storage: {
      aethel_custom_personas: localStorage.getItem("aethel_custom_personas"),
      aethel_voice_name: localStorage.getItem("aethel_voice_name"),
      aethel_code_theme: localStorage.getItem("aethel_code_theme"),
      aethel_code_lines: localStorage.getItem("aethel_code_lines"),
      aethel_code_wrap: localStorage.getItem("aethel_code_wrap"),
      aethel_custom_prompt: localStorage.getItem("aethel_custom_prompt"),
      aethel_voice_rate: localStorage.getItem("aethel_voice_rate"),
      aethel_voice_pitch: localStorage.getItem("aethel_voice_pitch"),
    }
  };
  const element = document.createElement("a");
  const file = new Blob([JSON.stringify(backupData, null, 2)], { type: "application/json" });
  element.href = URL.createObjectURL(file);
  element.download = `Aethel_System_Backup_${Date.now()}.json`;
  document.body.appendChild(element); element.click(); document.body.removeChild(element);
};

export const importAppBackup = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        if (!data.storage) throw new Error("Invalid Aethel Backup format.");
        Object.keys(data.storage).forEach(key => {
          if (data.storage[key] !== null) localStorage.setItem(key, data.storage[key]);
        });
        resolve();
      } catch (err) { reject(err); }
    };
    reader.onerror = (err) => reject(err);
    reader.readAsText(file);
  });
};