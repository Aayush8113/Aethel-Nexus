const { GoogleGenerativeAI } = require("@google/generative-ai");
const Chat = require("../models/Chat");
const dotenv = require("dotenv");

dotenv.config();

if (!process.env.GEMINI_API_KEY) console.error("❌ ERROR: GEMINI_API_KEY missing.");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Use a model that supports vision (Gemini 1.5/2.0 Flash is best for this)
const MODEL_NAME = "gemini-2.0-flash";

const generateResponse = async (req, res) => {
  try {
    const { message, history, chatId } = req.body;
    const imageFile = req.file; // From Multer

    if (!message && !imageFile) return res.status(400).json({ error: "Message or Image required" });

    // 1. Prepare Prompt Parts
    let promptParts = [];
    
    // Add text
    if (message) promptParts.push(message);

    // Add Image (if exists)
    if (imageFile) {
      promptParts.push({
        inlineData: {
          data: imageFile.buffer.toString("base64"),
          mimeType: imageFile.mimetype,
        },
      });
      console.log("📸 Image received:", imageFile.mimetype);
    }

    // 2. Prepare History (Text only for now as context)
    let chatHistory = [];
    if (history && Array.isArray(history)) {
       // ... (Keep your existing history cleaning logic here if you want)
       // Simplified for brevity:
       try {
         chatHistory = JSON.parse(history); // Frontend sends history as JSON string with FormData
       } catch (e) { chatHistory = []; }
    }

    // 3. Connect to Gemini
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });
    
    // Note: 'generateContent' is better for single-turn vision than 'startChat'
    // But for consistency, we use generateContent directly for vision calls
    const result = await model.generateContent(promptParts);
    const response = await result.response;
    const text = response.text();

    // 4. Save to DB (We won't save the base64 image to DB to save space, just a marker)
    let chatDoc;
    if (chatId) chatDoc = await Chat.findById(chatId);

    const userContent = imageFile ? `[Image Upload] ${message}` : message;

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

const getAllChats = async (req, res) => { /* Keep existing */ 
  try { const chats = await Chat.find().sort({ createdAt: -1 }); res.json(chats); } catch(e) { res.status(500).json({error:"Error"}); }
};
const getSingleChat = async (req, res) => { /* Keep existing */
  try { const chat = await Chat.findById(req.params.id); if(!chat) return res.status(404).json({error:"404"}); res.json(chat); } catch(e) { res.status(500).json({error:"Error"}); }
};
const deleteChat = async (req, res) => { /* Keep existing */
  try { await Chat.findByIdAndDelete(req.params.id); res.json({msg:"Deleted"}); } catch(e) { res.status(500).json({error:"Error"}); }
};

module.exports = { generateResponse, getAllChats, getSingleChat, deleteChat };