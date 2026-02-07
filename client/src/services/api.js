import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
});

export const sendMessageToAI = async (message, history, chatId) => {
  try {
    const response = await API.post('/chat', { message, history, chatId });
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
    console.error("Fetch Error:", error);
    return [];
  }
};

export const fetchChatById = async (id) => {
  try {
    const response = await API.get(`/chat/${id}`);
    return response.data;
  } catch (error) {
    console.error("Load Chat Error:", error);
    return null;
  }
};

// --- NEW FUNCTION ---
export const deleteChat = async (id) => {
  try {
    await API.delete(`/chat/${id}`);
    return true;
  } catch (error) {
    console.error("Delete Error:", error);
    return false;
  }
};