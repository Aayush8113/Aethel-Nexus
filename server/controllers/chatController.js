const { GoogleGenerativeAI } = require("@google/generative-ai");
const Chat = require("../models/Chat");
const dotenv = require("dotenv");

dotenv.config();

if (!process.env.GEMINI_API_KEY) console.error("❌ ERROR: GEMINI_API_KEY missing.");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const MODEL_NAME = "gemini-2.0-flash"; 

const generateResponse = async (req, res) => {
  try {
    const { message, history, chatId, systemInstruction } = req.body;
    const imageFile = req.file;

    if (!message && !imageFile) return res.status(400).json({ error: "Input required" });

    const model = genAI.getGenerativeModel({ 
      model: MODEL_NAME,
      systemInstruction: systemInstruction || "You are a helpful AI assistant."
    });

    let promptParts = [];
    if (message) promptParts.push(message);
    if (imageFile) {
      promptParts.push({
        inlineData: {
          data: imageFile.buffer.toString("base64"),
          mimeType: imageFile.mimetype,
        },
      });
    }

    const result = await model.generateContent(promptParts);
    const response = await result.response;
    const text = response.text();

    let chatDoc;
    if (chatId) chatDoc = await Chat.findById(chatId);

    const userContent = imageFile ? `[Image] ${message}` : message;

    if (chatDoc) {
      chatDoc.messages.push({ role: "user", content: userContent });
      chatDoc.messages.push({ role: "model", content: text });
      await chatDoc.save();
    } else {
      chatDoc = await Chat.create({
        title: message ? message.substring(0, 40) : "New Chat",
        messages: [{ role: "user", content: userContent }, { role: "model", content: text }]
      });
    }

    res.status(200).json({ reply: text, chatId: chatDoc._id });
  } catch (error) {
    console.error("🔥 AI ERROR:", error.message);
    res.status(500).json({ error: "AI Failed", details: error.message });
  }
};

const getAllChats = async (req, res) => {
  try { const chats = await Chat.find().sort({ createdAt: -1 }); res.json(chats); } catch(e) { res.status(500).json({error:"Error"}); }
};

const getSingleChat = async (req, res) => {
  try { const chat = await Chat.findById(req.params.id); if(!chat) return res.status(404).json({error:"404"}); res.json(chat); } catch(e) { res.status(500).json({error:"Error"}); }
};

const deleteChat = async (req, res) => {
  try { await Chat.findByIdAndDelete(req.params.id); res.json({msg:"Deleted"}); } catch(e) { res.status(500).json({error:"Error"}); }
};

// --- NEW FUNCTIONS ---
const togglePinChat = async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.id);
    if (!chat) return res.status(404).json({ error: "Chat not found" });
    chat.isPinned = !chat.isPinned;
    await chat.save();
    res.status(200).json(chat);
  } catch (error) {
    res.status(500).json({ error: "Pin failed" });
  }
};

const deleteAllChats = async (req, res) => {
  try {
    await Chat.deleteMany({});
    res.status(200).json({ message: "All cleared" });
  } catch (error) {
    res.status(500).json({ error: "Clear failed" });
  }
};

module.exports = { generateResponse, getAllChats, getSingleChat, deleteChat, togglePinChat, deleteAllChats };