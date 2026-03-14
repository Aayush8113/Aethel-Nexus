const { GoogleGenerativeAI } = require('@google/generative-ai');
const Chat = require('../models/Chat');
const fs = require('fs');
const pdf = require('pdf-parse'); 

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const fileToGenerativePart = (path, mimeType) => {
  return {
    inlineData: { data: Buffer.from(fs.readFileSync(path)).toString("base64"), mimeType }
  };
};

exports.handleChat = async (req, res) => {
  try {
    const { message, chatId, systemInstruction, useWebSearch } = req.body;
    let history = req.body.history ? JSON.parse(req.body.history) : [];

    const tools = [];
    if (useWebSearch === 'true') tools.push({ googleSearch: {} }); 

    const modelOptions = { 
      model: "gemini-2.0-flash", 
      systemInstruction: systemInstruction ? { role: "system", parts: [{ text: systemInstruction }] } : undefined,
      tools: tools.length > 0 ? tools : undefined
    };
    
    const model = genAI.getGenerativeModel(modelOptions);

    let formattedHistory = history.map(msg => ({
      role: msg.role === 'model' ? 'model' : 'user',
      parts: [{ text: msg.content }]
    }));

    if (formattedHistory.length > 10) formattedHistory = formattedHistory.slice(-10);
    while (formattedHistory.length > 0 && formattedHistory[0].role !== 'user') formattedHistory.shift(); 

    const chatSession = model.startChat({ history: formattedHistory });

    let result;
    let finalUserMessage = message;
    let imageUrlForDb = null;

    if (req.file) {
      const mime = req.file.mimetype;
      const filePath = req.file.path;
      const fileName = req.file.originalname;

      if (mime.startsWith('image/')) {
        const imagePart = fileToGenerativePart(filePath, mime);
        result = await chatSession.sendMessage([finalUserMessage, imagePart]);
        imageUrlForDb = `/uploads/${req.file.filename}`; 
      } else {
        let extractedText = "";
        if (mime === 'application/pdf') {
          const dataBuffer = fs.readFileSync(filePath);
          const pdfData = await pdf(dataBuffer);
          extractedText = pdfData.text;
        } else if (mime === 'text/csv' || mime === 'text/plain') {
          extractedText = fs.readFileSync(filePath, 'utf8');
        }

        const augmentedPrompt = `${finalUserMessage}\n\n[CONTEXT FROM ATTACHED FILE: ${fileName}]\n${extractedText}`;
        result = await chatSession.sendMessage(augmentedPrompt);
        finalUserMessage = `${message}\n\n*(📎 Attached: ${fileName})*`; 
      }
      fs.unlinkSync(filePath);
    } else {
      result = await chatSession.sendMessage(finalUserMessage);
    }

    const reply = result.response.text();

    let chat;
    if (chatId) {
      chat = await Chat.findById(chatId);
      chat.messages.push({ role: 'user', content: finalUserMessage, image: imageUrlForDb, createdAt: Date.now() });
      chat.messages.push({ role: 'model', content: reply, createdAt: Date.now() });
      chat.updatedAt = Date.now();
      await chat.save();
    } else {
      const title = message.split(' ').slice(0, 5).join(' ') + '...';
      chat = new Chat({
        title, isPinned: false,
        messages: [
          { role: 'user', content: finalUserMessage, image: imageUrlForDb, createdAt: Date.now() },
          { role: 'model', content: reply, createdAt: Date.now() }
        ]
      });
      await chat.save();
    }

    res.json({ reply, chatId: chat._id });

  } catch (error) {
    console.error("AI Generation Error:", error);
    if (!res.headersSent) {
      if (error.status === 429 || (error.message && error.message.includes('429'))) {
          return res.status(429).json({ error: "Google Quota Exceeded. Please wait 15 seconds." });
      }
      return res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
  }
};

exports.getAllChats = async (req, res) => { try { const chats = await Chat.find().sort({ updatedAt: -1 }); res.json(chats); } catch (err) { res.status(500).json({ error: 'Failed' }); } };
exports.getChatById = async (req, res) => { try { const chat = await Chat.findById(req.params.id); res.json(chat); } catch (err) { res.status(500).json({ error: 'Failed' }); } };
exports.deleteChat = async (req, res) => { try { await Chat.findByIdAndDelete(req.params.id); res.json({ success: true }); } catch (err) { res.status(500).json({ error: 'Failed' }); } };
exports.deleteAllChats = async (req, res) => { try { await Chat.deleteMany({}); res.json({ success: true }); } catch (err) { res.status(500).json({ error: 'Failed' }); } };
exports.togglePinChat = async (req, res) => { try { const chat = await Chat.findById(req.params.id); chat.isPinned = !chat.isPinned; await chat.save(); res.json(chat); } catch (err) { res.status(500).json({ error: 'Failed' }); } };
exports.updateChatTitle = async (req, res) => { try { const { title } = req.body; const chat = await Chat.findById(req.params.id); chat.title = title; await chat.save(); res.json(chat); } catch (err) { res.status(500).json({ error: 'Failed' }); } };

exports.searchAllChats = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.json([]);
    const chats = await Chat.find({
      $or: [
        { title: { $regex: q, $options: 'i' } },
        { 'messages.content': { $regex: q, $options: 'i' } }
      ]
    }).sort({ updatedAt: -1 }).limit(15);
    res.json(chats);
  } catch (err) {
    res.status(500).json({ error: 'Failed to search database' });
  }
};

// 🟢 DAY 34: Chat Forking Logic
exports.forkChat = async (req, res) => {
  try {
    const originalChat = await Chat.findById(req.params.id);
    if (!originalChat) return res.status(404).json({ error: 'Chat not found' });

    const newChat = new Chat({
      title: `${originalChat.title} (Fork)`,
      isPinned: false,
      messages: originalChat.messages
    });

    await newChat.save();
    res.json(newChat);
  } catch (err) {
    console.error("Fork Error:", err);
    res.status(500).json({ error: 'Failed to fork workspace' });
  }
};