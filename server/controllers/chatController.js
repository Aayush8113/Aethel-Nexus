const { GoogleGenerativeAI } = require("@google/generative-ai");
const Chat = require("../models/Chat");
const dotenv = require("dotenv");

dotenv.config();

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

// @desc    Send message & Save to DB
// @route   POST /api/chat
const generateResponse = async (req, res) => {
  const { message, history, chatId } = req.body;

  try {
    // 1. Prepare History for Gemini
    const chatHistory = history ? history.map((msg) => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.content }],
    })) : [];

    // 2. Get AI Response
    const chatSession = model.startChat({ history: chatHistory });
    const result = await chatSession.sendMessage(message);
    const response = await result.response;
    const text = response.text();

    // 3. DATABASE LOGIC
    let chatDoc;

    if (chatId) {
      // CASE A: Existing Conversation -> Find and Update
      chatDoc = await Chat.findById(chatId);
      if (chatDoc) {
        chatDoc.messages.push({ role: "user", content: message });
        chatDoc.messages.push({ role: "model", content: text });
        await chatDoc.save();
      }
    } else {
      // CASE B: New Conversation -> Create New
      chatDoc = await Chat.create({
        title: message.substring(0, 30) + "...", // Use first 30 chars as title
        messages: [
          { role: "user", content: message },
          { role: "model", content: text }
        ]
      });
    }

    // 4. Return the Reply AND the chatId
    res.status(200).json({ 
      reply: text, 
      chatId: chatDoc ? chatDoc._id : null 
    });

  } catch (error) {
    console.error("Gemini/DB Error:", error);
    res.status(500).json({ error: "Failed to process chat" });
  }
};


// @desc    Get all chat titles
// @route   GET /api/chat
const getAllChats = async (req, res) => {
  try {
    const chats = await Chat.find().select("_id title createdAt").sort({ createdAt: -1 });
    res.status(200).json(chats);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch history" });
  }
};

const getSingleChat = async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.id);
    if (!chat) return res.status(404).json({ error: "Chat not found" });
    res.status(200).json(chat);
  } catch (error) {
    res.status(500).json({ error: "Failed to load chat" });
  }
};

// UPDATE THIS LINE AT THE BOTTOM:
module.exports = { generateResponse, getAllChats, getSingleChat };