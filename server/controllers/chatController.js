const { GoogleGenerativeAI } = require("@google/generative-ai");
const Chat = require("../models/Chat");
const dotenv = require("dotenv");

dotenv.config();

if (!process.env.GEMINI_API_KEY) {
  console.error("❌ ERROR: GEMINI_API_KEY is missing.");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Use a model capable of Vision (2.0 Flash or 1.5 Flash)
const MODEL_VISION = "gemini-2.0-flash";

const generateResponse = async (req, res) => {
  try {
    const { message, history, chatId } = req.body;
    const imageFile = req.file; // Caught by Multer

    if (!message && !imageFile) {
      return res.status(400).json({ error: "Message or Image required" });
    }

    // 1. Prepare Content for Gemini
    let promptParts = [];
    
    // Add text if exists
    if (message) promptParts.push(message);

    // Add Image if exists
    if (imageFile) {
      promptParts.push({
        inlineData: {
          data: imageFile.buffer.toString("base64"),
          mimeType: imageFile.mimetype,
        },
      });
      console.log(`📸 Processing Image: ${imageFile.originalname}`);
    }

    // 2. Prepare History (Text Context)
    // Note: We only send text history for context to save tokens/complexity
    let chatHistory = [];
    if (history) {
      try {
        const parsedHistory = typeof history === 'string' ? JSON.parse(history) : history;
        if (Array.isArray(parsedHistory)) {
          const firstUserIndex = parsedHistory.findIndex(msg => msg.role === "user");
          if (firstUserIndex !== -1) {
            chatHistory = parsedHistory.slice(firstUserIndex).map(msg => ({
              role: msg.role === "user" ? "user" : "model",
              parts: [{ text: msg.content || "" }] // Only text history
            }));
          }
        }
      } catch (e) {
        console.warn("History parsing failed", e);
      }
    }

    // 3. Send to Google
    const model = genAI.getGenerativeModel({ model: MODEL_VISION });
    
    // For vision, we use generateContent with the image data inline
    // We append the history as context in the prompt if needed, or rely on the single turn for vision
    const result = await model.generateContent([ ...promptParts ]);
    const response = await result.response;
    const text = response.text();

    // 4. Save to Database
    let chatDoc;
    if (chatId) chatDoc = await Chat.findById(chatId);

    // We mark the message as containing an image, but don't save the base64 to DB to avoid size limits
    const userContent = imageFile ? `[Uploaded Image] ${message || ""}` : message;

    if (chatDoc) {
      chatDoc.messages.push({ role: "user", content: userContent });
      chatDoc.messages.push({ role: "model", content: text });
      await chatDoc.save();
    } else {
      chatDoc = await Chat.create({
        title: message ? message.substring(0, 40) : "Image Analysis",
        messages: [{ role: "user", content: userContent }, { role: "model", content: text }]
      });
    }

    res.status(200).json({ reply: text, chatId: chatDoc._id });

  } catch (error) {
    console.error("🔥 VISION ERROR:", error.message);
    res.status(500).json({ error: "Vision Processing Failed", details: error.message });
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

const deleteChat = async (req, res) => {
  try {
    await Chat.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Deleted" });
  } catch (error) {
    res.status(500).json({ error: "Delete failed" });
  }
};

module.exports = { generateResponse, getAllChats, getSingleChat, deleteChat };