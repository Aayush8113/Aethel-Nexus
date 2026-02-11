const { GoogleGenerativeAI } = require("@google/generative-ai");
const Chat = require("../models/Chat");
const dotenv = require("dotenv");

dotenv.config();

if (!process.env.GEMINI_API_KEY) {
  console.error("❌ ERROR: GEMINI_API_KEY is missing.");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Use Gemini 1.5 Flash or 2.0 Flash (Both support System Instructions)
const MODEL_NAME = "gemini-2.0-flash";

const generateResponse = async (req, res) => {
  try {
    const { message, history, chatId, systemInstruction } = req.body; // New Param
    const imageFile = req.file;

    if (!message && !imageFile) {
      return res.status(400).json({ error: "Message or Image required" });
    }

    // 1. Configure Model with Persona
    const model = genAI.getGenerativeModel({
      model: MODEL_NAME,
      systemInstruction: systemInstruction || "You are a helpful AI assistant.",
    });

    // 2. Prepare Content
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

    // 3. Generate
    const result = await model.generateContent(promptParts);
    const response = await result.response;
    const text = response.text();

    // 4. Save to DB
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
        messages: [
          { role: "user", content: userContent },
          { role: "model", content: text },
        ],
      });
    }

    res.status(200).json({ reply: text, chatId: chatDoc._id });
  } catch (error) {
    console.error("🔥 AI ERROR:", error.message);
    res
      .status(500)
      .json({ error: "AI Processing Failed", details: error.message });
  }
};

const getAllChats = async (req, res) => {
  try {
    const chats = await Chat.find().sort({ createdAt: -1 });
    res.status(200).json(chats);
  } catch (e) {
    res.status(500).json({ error: "Error" });
  }
};
const getSingleChat = async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.id);
    if (!chat) return res.status(404).json({ error: "Not found" });
    res.status(200).json(chat);
  } catch (e) {
    res.status(500).json({ error: "Error" });
  }
};
const deleteChat = async (req, res) => {
  try {
    await Chat.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Deleted" });
  } catch (e) {
    res.status(500).json({ error: "Error" });
  }
};

module.exports = { generateResponse, getAllChats, getSingleChat, deleteChat };
