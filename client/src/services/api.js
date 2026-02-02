import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Now accepts chatId
export const sendMessageToAI = async (message, history, chatId) => {
  try {
    const response = await API.post('/chat', { message, history, chatId });
    return response.data; // Returns { reply: "...", chatId: "..." }
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

export default API;