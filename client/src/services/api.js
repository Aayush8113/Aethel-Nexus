import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
});

export const sendMessageToAI = async (message, history, chatId) => {
  try {
    // We send history so the AI remembers previous messages
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

export default API;