const { GoogleGenerativeAI } = require("@google/generative-ai");
const Chat = require("../models/Chat");
const dotenv = require("dotenv");

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
// Fixed: Using the stable model identifier
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); 

const generateResponse = async (req, res) => {
  const { message, history, chatId } = req.body;

  try {
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: "API Key missing in .env" });
    }

    // 1. Prepare and Clean History
    let chatHistory = [];
    if (history && history.length > 0) {
      const mappedHistory = history.map((msg) => ({
        role: msg.role === "user" ? "user" : "model",
        parts: [{ text: msg.content || "" }],
      }));

      // SYNC FIX: Gemini must start with 'user'. Filter out the initial greeting.
      const firstUserIndex = mappedHistory.findIndex(msg => msg.role === "user");
      chatHistory = firstUserIndex !== -1 ? mappedHistory.slice(firstUserIndex) : [];
    }

    // 2. Request response from Google
    const chatSession = model.startChat({ history: chatHistory });
    const result = await chatSession.sendMessage(message);
    const response = await result.response;
    const text = response.text();

    // 3. Database Logic
    let chatDoc;
    const isValidId = chatId && /^[0-9a-fA-F]{24}$/.test(chatId);

    if (isValidId) {
      chatDoc = await Chat.findById(chatId);
    }

    if (chatDoc) {
      chatDoc.messages.push({ role: "user", content: message });
      chatDoc.messages.push({ role: "model", content: text });
      await chatDoc.save();
    } else {
      chatDoc = await Chat.create({
        title: message.substring(0, 30) + (message.length > 30 ? "..." : ""),
        messages: [{ role: "user", content: message }, { role: "model", content: text }]
      });
    }

    res.status(200).json({ reply: text, chatId: chatDoc._id });

  } catch (error) {
    console.error("--- BACKEND ERROR REPORT ---");
    console.error("Reason:", error.message);
    res.status(500).json({ error: "Failed to process chat", details: error.message });
  }
};

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

module.exports = { generateResponse, getAllChats, getSingleChat };