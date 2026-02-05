const { GoogleGenerativeAI } = require("@google/generative-ai");
const Chat = require("../models/Chat");
const dotenv = require("dotenv");

dotenv.config();

// 1. Safety & Key Check
if (!process.env.GEMINI_API_KEY) {
  console.error("❌ ERROR: GEMINI_API_KEY is missing in .env");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// 2. MAX POWER CONFIGURATION
// Using 'gemini-2.5-flash' for maximum speed and intelligence.
const model = genAI.getGenerativeModel({ 
  model: "gemini-2.5-flash",
  generationConfig: {
    temperature: 0.7, // Balance between creativity and precision
    topP: 0.8,
    topK: 40,
    maxOutputTokens: 8192, // Allow long, detailed code responses
  }
});

const generateResponse = async (req, res) => {
  try {
    const { message, history, chatId } = req.body;

    if (!message) return res.status(400).json({ error: "Message required" });

    // 3. Smart History Cleaning
    // Removes the "Hello" greeting to prevent API crashes
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

    // 4. Send to Google's Brain
    const chatSession = model.startChat({ history: chatHistory });
    const result = await chatSession.sendMessage(message);
    const response = await result.response;
    const text = response.text();

    // 5. Save to Long-Term Memory (Database)
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

    // 6. Respond to Frontend
    res.status(200).json({ reply: text, chatId: chatDoc._id });

  } catch (error) {
    console.error("🔥 ERROR LOG:", error.message);
    
    // Fallback: If 2.5 fails, suggest 2.0 (Self-Healing Error Message)
    if (error.message.includes("not found")) {
      res.status(500).json({ error: "Model Update Required", details: "Please switch code to 'gemini-2.0-flash'" });
    } else {
      res.status(500).json({ error: "Brain Connection Failed", details: error.message });
    }
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

module.exports = { generateResponse, getAllChats, getSingleChat };