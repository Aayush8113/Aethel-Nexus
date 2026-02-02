import axios from 'axios';

// Create a standalone instance for API calls
const API = axios.create({
  baseURL: 'http://localhost:5000/api', // Pointing to your Node Server
});

// Define the Chat function
export const sendMessageToAI = async (message, history) => {
  try {
    const response = await API.post('/chat', { message, history });
    return response.data; // Returns { reply: "..." }
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

export default API;