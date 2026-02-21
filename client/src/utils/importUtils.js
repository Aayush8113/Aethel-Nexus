export const importChatFromJSON = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        if (!data.messages || !Array.isArray(data.messages)) {
          throw new Error("Invalid Aethel chat format.");
        }
        resolve(data.messages);
      } catch (err) {
        reject(err);
      }
    };
    
    reader.onerror = (err) => reject(err);
    reader.readAsText(file);
  });
};