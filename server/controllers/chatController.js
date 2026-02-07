const { GoogleGenerativeAI } = require("@google/generative-ai");
const Chat = require("../models/Chat");
const dotenv = require("dotenv");

dotenv.config();

if (!process.env.GEMINI_API_KEY) {
  console.error("❌ ERROR: GEMINI_API_KEY is missing.");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// STRATEGY: Try Best -> Fallback to Fast -> Fallback to Reliable
const MODEL_TIER_1 = "gemini-3-pro-preview";
const MODEL_TIER_2 = "gemini-2.0-flash";
const MODEL_TIER_3 = "gemini-1.5-flash";

const generateResponse = async (req, res) => {
  const { message, history, chatId } = req.body;

  if (!message) return res.status(400).json({ error: "Message required" });

  let chatHistory = [];
  if (history && Array.isArray(history)) {
    const firstUserIndex = history.findIndex(msg => msg.role === "user");
    if (firstUserIndex !== -1) {
      chatHistory = history.slice(firstUserIndex).map(msg => ({
        role: msg.role === "user" ? "user" : "model",
        parts: [{ text: msg.content }]
      }));
    }
  }

  let text = "";
  let usedModel = "";

  try {
    console.log(`🧠 Trying ${MODEL_TIER_1}...`);
    const model1 = genAI.getGenerativeModel({ model: MODEL_TIER_1 });
    const session1 = model1.startChat({ history: chatHistory });
    const result = await session1.sendMessage(message);
    text = (await result.response).text();
    usedModel = MODEL_TIER_1;

  } catch (err1) {
    console.warn(`⚠️ ${MODEL_TIER_1} failed. Switching to ${MODEL_TIER_2}...`);
    try {
      const model2 = genAI.getGenerativeModel({ model: MODEL_TIER_2 });
      const session2 = model2.startChat({ history: chatHistory });
      const result = await session2.sendMessage(message);
      text = (await result.response).text();
      usedModel = MODEL_TIER_2;
    } catch (err2) {
      console.warn(`⚠️ ${MODEL_TIER_2} failed. Switching to ${MODEL_TIER_3}...`);
      try {
        const model3 = genAI.getGenerativeModel({ model: MODEL_TIER_3 });
        const session3 = model3.startChat({ history: chatHistory });
        const result = await session3.sendMessage(message);
        text = (await result.response).text();
        usedModel = MODEL_TIER_3;
      } catch (err3) {
        console.error("🔥 ALL MODELS FAILED.");
        return res.status(429).json({ error: "System Overload. Please wait 60s." });
      }
    }
  }

  try {
    let chatDoc;
    if (chatId) chatDoc = await Chat.findById(chatId);

    if (chatDoc) {
      chatDoc.messages.push({ role: "user", content: message });
      chatDoc.messages.push({ role: "model", content: text });
      await chatDoc.save();
    } else {
      chatDoc = await Chat.create({
        title: message.substring(0, 40),
        messages: [{ role: "user", content: message }, { role: "model", content: text }]
      });
    }
    res.status(200).json({ reply: text, chatId: chatDoc._id, model: usedModel });
  } catch (dbError) {
    res.status(200).json({ reply: text, chatId: null });
  }
};

const getAllChats = async (req, res) => {
  try {
    const chats = await Chat.find().sort({ createdAt: -1 });
    res.status(200).json(chats);
  } catch (error) {
    res.status(500).json({ error: "Fetch failed" });
  }
};

const getSingleChat = async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.id);
    if (!chat) return res.status(404).json({ error: "Not found" });
    res.status(200).json(chat);
  } catch (error) {
    res.status(500).json({ error: "Load failed" });
  }
};

// --- NEW FUNCTION: DELETE CHAT ---
const deleteChat = async (req, res) => {
  try {
    const chat = await Chat.findByIdAndDelete(req.params.id);
    if (!chat) return res.status(404).json({ error: "Chat not found" });
    res.status(200).json({ message: "Chat deleted" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete chat" });
  }
};

module.exports = { generateResponse, getAllChats, getSingleChat, deleteChat };