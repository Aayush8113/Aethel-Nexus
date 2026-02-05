const { GoogleGenerativeAI } = require("@google/generative-ai");
const Chat = require("../models/Chat");
const dotenv = require("dotenv");

dotenv.config();

// Initialize Gemini (Using the latest stable model)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// @desc    Handle Chat & Save to DB
// @route   POST /api/chat
const generateResponse = async (req, res) => {
  const { message, history, chatId } = req.body;

  try {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("API Key missing in server environment");
    }

    // --- SENIOR FIX: HISTORY SYNCHRONIZATION ---
    // Gemini API RULES:
    // 1. History cannot be empty if provided.
    // 2. The FIRST message in history MUST be from the 'user'.
    // We filter out the initial "Hello" bot message to prevent crashing.
    let validHistory = [];
    if (history && Array.isArray(history)) {
      const firstUserIndex = history.findIndex(msg => msg.role === "user");
      
      if (firstUserIndex !== -1) {
        // Only keep messages starting from the first USER message
        const rawHistory = history.slice(firstUserIndex);
        
        validHistory = rawHistory.map(msg => ({
          role: msg.role === "user" ? "user" : "model",
          parts: [{ text: msg.content }]
        }));
      }
    }

    // 2. Start Chat with Clean History
    const chatSession = model.startChat({
      history: validHistory,
    });

    // 3. Send Message
    const result = await chatSession.sendMessage(message);
    const response = await result.response;
    const text = response.text();

    // 4. Database Persistence
    let chatDoc;
    
    if (chatId) {
      chatDoc = await Chat.findById(chatId);
    }

    if (chatDoc) {
      // Append to existing chat
      chatDoc.messages.push({ role: "user", content: message });
      chatDoc.messages.push({ role: "model", content: text });
      await chatDoc.save();
    } else {
      // Create new chat
      chatDoc = await Chat.create({
        title: message.substring(0, 40) + "...", // Smart title truncation
        messages: [
          { role: "user", content: message },
          { role: "model", content: text }
        ]
      });
    }

    // 5. Return Success
    res.status(200).json({ reply: text, chatId: chatDoc._id });

  } catch (error) {
    console.error("❌ Gemini API Error:", error.message);
    // Return a clean error to frontend, don't crash the server
    res.status(500).json({ 
      error: "AI Brain Connection Failed", 
      details: error.message 
    });
  }
};

// @desc    Get all chats
// @route   GET /api/chat
const getAllChats = async (req, res) => {
  try {
    const chats = await Chat.find().select("title createdAt").sort({ createdAt: -1 });
    res.status(200).json(chats);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch history" });
  }
};

// @desc    Get single chat
// @route   GET /api/chat/:id
const getSingleChat = async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.id);
    if (!chat) return res.status(404).json({ error: "Chat not found" });
    res.status(200).json(chat);
  } catch (error) {
    res.status(500).json({ error: "Failed to load chat" });
  }
};

module.exports = { generateResponse, getAllChats, getSingleChat };