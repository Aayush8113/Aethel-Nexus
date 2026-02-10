import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Updated to accept imageFile
export const sendMessageToAI = async (message, history, chatId, imageFile) => {
  try {
    const formData = new FormData();
    formData.append("message", message || ""); // Allow empty message if image exists
    
    if (chatId) formData.append("chatId", chatId);
    
    // FormData requires string values
    formData.append("history", JSON.stringify(history));

    if (imageFile) {
      formData.append("image", imageFile);
    }

    // Axios automatically sets Content-Type to multipart/form-data when data is FormData
    const response = await API.post('/chat', formData);
    return response.data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

export const fetchAllChats = async () => {
  try {
    const response = await API.get('/chat');
    return response.data;
  } catch (error) {
    return [];
  }
};

export const fetchChatById = async (id) => {
  try {
    const response = await API.get(`/chat/${id}`);
    return response.data;
  } catch (error) {
    return null;
  }
};

export const deleteChat = async (id) => {
  try {
    await API.delete(`/chat/${id}`);
    return true;
  } catch (error) {
    return false;
  }
};