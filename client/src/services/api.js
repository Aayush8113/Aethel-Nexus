import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:5000/api" });

export const sendMessageToAI = async (
  message,
  history,
  chatId,
  imageFile,
  systemInstruction,
) => {
  try {
    const formData = new FormData();
    formData.append("message", message || "");
    if (chatId) formData.append("chatId", chatId);
    formData.append("history", JSON.stringify(history));

    // NEW: Append Persona Instruction
    if (systemInstruction) {
      formData.append("systemInstruction", systemInstruction);
    }

    if (imageFile) {
      formData.append("image", imageFile);
    }

    const response = await API.post("/chat", formData);
    return response.data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

// ... Keep other exports (fetchAllChats, etc.) exactly as they were
export const fetchAllChats = async () => {
  try {
    const res = await API.get("/chat");
    return res.data;
  } catch (e) {
    return [];
  }
};
export const fetchChatById = async (id) => {
  try {
    const res = await API.get(`/chat/${id}`);
    return res.data;
  } catch (e) {
    return null;
  }
};
export const deleteChat = async (id) => {
  try {
    await API.delete(`/chat/${id}`);
    return true;
  } catch (e) {
    return false;
  }
};
