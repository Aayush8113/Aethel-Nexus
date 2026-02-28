const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

// Ensure the uploads directory exists for images
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Set up Multer for handling image uploads
const upload = multer({ dest: 'uploads/' });

// ==========================================
// API Routes
// ==========================================

// Main AI Generation Route (handles text and image)
router.post('/chat', upload.single('image'), chatController.handleChat);

// Database Management Routes
router.get('/chats', chatController.getAllChats);
router.get('/chats/:id', chatController.getChatById);
router.delete('/chats/:id', chatController.deleteChat);
router.delete('/chats', chatController.deleteAllChats);
router.put('/chats/:id/pin', chatController.togglePinChat);
router.put('/chats/:id/title', chatController.updateChatTitle);

module.exports = router;