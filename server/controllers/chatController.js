const { GoogleGenerativeAI } = require("@google/generative-ai");
const Chat = require("../models/Chat"); // Import our DB Model
const dotenv = require("dotenv");

dotenv.config();

// Initialize Gemini with your API Key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

// @desc    Send message & get response
// @route   POST /api/chat
// @access  Public
const generateResponse = async (req, res) => {
  const { message, history } = req.body; // We expect the user's message and past history

  try {
    // 1. Construct the history format Gemini expects
    // Gemini expects an array of objects: { role: "user" | "model", parts: [{ text: "..." }] }
    const chatHistory = history ? history.map((msg) => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.content }],
    })) : [];

    // 2. Start the chat session with history
    const chat = model.startChat({
      history: chatHistory,
    });

    // 3. Send the new message to Gemini
    const result = await chat.sendMessage(message);
    const response = await result.response;
    const text = response.text();

    // 4. Return the answer to the frontend
    res.status(200).json({ reply: text });

  } catch (error) {
    console.error("Gemini API Error:", error);
    res.status(500).json({ error: "Failed to generate response" });
  }
};

module.exports = { generateResponse };