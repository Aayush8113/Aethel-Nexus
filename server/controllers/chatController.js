const { GoogleGenerativeAI } = require('@google/generative-ai');
const Chat = require('../models/Chat');
const fs = require('fs');

// Initialize Gemini with your API Key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Helper function to convert uploaded local files to Gemini's format
const fileToGenerativePart = (path, mimeType) => {
  return {
    inlineData: {
      data: Buffer.from(fs.readFileSync(path)).toString("base64"),
      mimeType
    }
  };
};

exports.handleChat = async (req, res) => {
  try {
    const { message, chatId, systemInstruction } = req.body;
    let history = req.body.history ? JSON.parse(req.body.history) : [];

    // 1. Setup Gemini Model (Using your confirmed working model)
    const modelOptions = { 
      model: "gemini-2.0-flash",
      systemInstruction: systemInstruction ? { role: "system", parts: [{ text: systemInstruction }] } : undefined,
    };
    const model = genAI.getGenerativeModel(modelOptions);

    // 2. Format History for Gemini
    let formattedHistory = history.map(msg => ({
      role: msg.role === 'model' ? 'model' : 'user',
      parts: [{ text: msg.content }]
    }));

    // 🟢 THE FIX: Gemini STRICT RULE
    // History must always start with 'user'. If the frontend added an AI greeting, slice it off.
    while (formattedHistory.length > 0 && formattedHistory[0].role !== 'user') {
      formattedHistory.shift(); 
    }

    // 3. Start Chat Session
    const chatSession = model.startChat({
      history: formattedHistory,
    });

    // 4. Send Message (with or without image)
    let result;
    if (req.file) {
      const imagePart = fileToGenerativePart(req.file.path, req.file.mimetype);
      result = await chatSession.sendMessage([message, imagePart]);
      fs.unlinkSync(req.file.path); // Clean up the temp file after sending
    } else {
      result = await chatSession.sendMessage(message);
    }

    const reply = result.response.text();

    // 5. Save to Database
    let chat;
    let imageUrl = req.file ? `/uploads/${req.file.filename}` : null; // Adjust path based on your static serving

    if (chatId) {
      chat = await Chat.findById(chatId);
      chat.messages.push({ role: 'user', content: message, image: imageUrl, createdAt: Date.now() });
      chat.messages.push({ role: 'model', content: reply, createdAt: Date.now() });
      chat.updatedAt = Date.now();
      await chat.save();
    } else {
      const title = message.split(' ').slice(0, 5).join(' ') + '...';
      chat = new Chat({
        title,
        isPinned: false,
        messages: [
          { role: 'user', content: message, image: imageUrl, createdAt: Date.now() },
          { role: 'model', content: reply, createdAt: Date.now() }
        ]
      });
      await chat.save();
    }

    // 6. Return Response
    res.json({ reply, chatId: chat._id });

  } catch (error) {
    console.error("AI Generation Error:", error);
    res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
};

// ==========================================
// Standard Database Routes
// ==========================================

exports.getAllChats = async (req, res) => {
  try {
    const chats = await Chat.find().sort({ updatedAt: -1 });
    res.json(chats);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch chats' });
  }
};

exports.getChatById = async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.id);
    res.json(chat);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch chat' });
  }
};

exports.deleteChat = async (req, res) => {
  try {
    await Chat.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete chat' });
  }
};

exports.deleteAllChats = async (req, res) => {
  try {
    await Chat.deleteMany({});
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to clear history' });
  }
};

exports.togglePinChat = async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.id);
    chat.isPinned = !chat.isPinned;
    await chat.save();
    res.json(chat);
  } catch (err) {
    res.status(500).json({ error: 'Failed to pin chat' });
  }
};

exports.updateChatTitle = async (req, res) => {
  try {
    const { title } = req.body;
    const chat = await Chat.findById(req.params.id);
    chat.title = title;
    await chat.save();
    res.json(chat);
  } catch (err) {
    res.status(500).json({ error: 'Failed to rename chat' });
  }
};