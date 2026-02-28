const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const upload = require('../middleware/upload');

// Main AI Generation Route (handles text and single image)
router.post('/chat', upload.single('image'), chatController.handleChat);

// Database Interaction Routes
router.get('/chats', chatController.getAllChats);
router.get('/chats/:id', chatController.getChatById);
router.delete('/chats/:id', chatController.deleteChat);
router.delete('/chats', chatController.deleteAllChats);
router.put('/chats/:id/pin', chatController.togglePin);
router.put('/chats/:id/title', chatController.renameChat); // Day 28

module.exports = router;