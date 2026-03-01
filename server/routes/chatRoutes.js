const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const upload = multer({ dest: 'uploads/' });

// Upgraded from upload.single('image') to upload.single('file')
router.post('/chat', upload.single('file'), chatController.handleChat);

router.get('/chats', chatController.getAllChats);
router.get('/chats/:id', chatController.getChatById);
router.delete('/chats/:id', chatController.deleteChat);
router.delete('/chats', chatController.deleteAllChats);
router.put('/chats/:id/pin', chatController.togglePinChat);
router.put('/chats/:id/title', chatController.updateChatTitle);

module.exports = router;