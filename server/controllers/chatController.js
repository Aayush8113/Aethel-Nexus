const Chat = require('../models/Chat');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Format file for Gemini Vision
function fileToGenerativePart(buffer, mimeType) {
  return {
    inlineData: {
      data: buffer.toString("base64"),
      mimeType
    },
  };
}

exports.handleChat = async (req, res) => {
  try {
    const { message, history, chatId, systemInstruction } = req.body;
    let parsedHistory = [];
    try { parsedHistory = JSON.parse(history || '[]'); } catch (e) { parsedHistory = []; }

    let chat;
    if (chatId && chatId !== 'null') {
      chat = await Chat.findById(chatId);
      if (!chat) return res.status(404).json({ error: 'Chat not found' });
    } else {
      chat = new Chat({ 
        title: message.substring(0, 30) + (message.length > 30 ? '...' : '') 
      });
    }

    // Save User Message
    const userMessageObj = { role: 'user', content: message };
    
    let imageParts = [];
    if (req.file) {
      const mimeType = req.file.mimetype;
      const base64Data = req.file.buffer.toString("base64");
      userMessageObj.image = `data:${mimeType};base64,${base64Data}`;
      imageParts.push(fileToGenerativePart(req.file.buffer, mimeType));
    }
    
    chat.messages.push(userMessageObj);
    await chat.save();

    // Setup Gemini
    const modelOptions = { model: "gemini-2.0-flash" }; // Use pro for coding/vision
    if (systemInstruction && systemInstruction.trim() !== "") {
      modelOptions.systemInstruction = systemInstruction;
    }
    
    const model = genAI.getGenerativeModel(modelOptions);

    const formattedHistory = parsedHistory.map(msg => ({
      role: msg.role === 'model' ? 'model' : 'user',
      parts: [{ text: msg.content }]
    }));

    const chatSession = model.startChat({ history: formattedHistory });

    const partsToSend = [message, ...imageParts];
    const result = await chatSession.sendMessage(partsToSend);
    const aiResponse = result.response.text();

    // Save AI Message
    chat.messages.push({ role: 'model', content: aiResponse });
    await chat.save();

    res.json({ reply: aiResponse, chatId: chat._id });
  } catch (err) {
    console.error("AI Generation Error:", err);
    res.status(500).json({ error: err.message || "Failed to communicate with AI Engine" });
  }
};

exports.getAllChats = async (req, res) => {
  try {
    const chats = await Chat.find().sort({ updatedAt: -1 }).select('-messages');
    res.json(chats);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.getChatById = async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.id);
    if (!chat) return res.status(404).json({ error: 'Chat not found' });
    res.json(chat);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.deleteChat = async (req, res) => {
  try {
    await Chat.findByIdAndDelete(req.params.id);
    res.json({ message: 'Chat deleted' });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.deleteAllChats = async (req, res) => {
  try {
    await Chat.deleteMany({});
    res.json({ message: 'All chats deleted' });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.togglePin = async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.id);
    chat.isPinned = !chat.isPinned;
    await chat.save();
    res.json(chat);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

// Day 28: Rename Chat
exports.renameChat = async (req, res) => {
  try {
    const { title } = req.body;
    const chat = await Chat.findById(req.params.id);
    if (!chat) return res.status(404).json({ error: 'Chat not found' });
    chat.title = title;
    await chat.save();
    res.json(chat);
  } catch (err) { res.status(500).json({ error: err.message }); }
};