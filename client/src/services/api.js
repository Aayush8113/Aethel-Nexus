const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const fetchAllChats = async () => { const res = await fetch(`${API_URL}/chats`); return res.json(); };
export const fetchChatById = async (id) => { const res = await fetch(`${API_URL}/chats/${id}`); return res.json(); };
export const deleteChat = async (id) => { await fetch(`${API_URL}/chats/${id}`, { method: 'DELETE' }); return true; };
export const deleteAllChats = async () => { await fetch(`${API_URL}/chats`, { method: 'DELETE' }); return true; };
export const togglePinChat = async (id) => { const res = await fetch(`${API_URL}/chats/${id}/pin`, { method: 'PUT' }); return res.json(); };
export const updateChatTitle = async (id, title) => {
  const res = await fetch(`${API_URL}/chats/${id}/title`, {
    method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title })
  });
  return res.json();
};

export const sendMessageToAI = async (message, history, chatId, attachedFile, systemInstruction) => {
  const formData = new FormData();
  formData.append('message', message);
  formData.append('history', JSON.stringify(history));
  if (chatId) formData.append('chatId', chatId);
  if (attachedFile) formData.append('file', attachedFile); // <-- Upgraded to generic 'file'
  if (systemInstruction) formData.append('systemInstruction', systemInstruction);

  const res = await fetch(`${API_URL}/chat`, { method: 'POST', body: formData });
  if (!res.ok) throw new Error("API Error");
  return res.json();
};