const express = require('express');
const { generateResponse, getAllChats, getSingleChat, deleteChat } = require('../controllers/chatController');
const upload = require('../middleware/upload'); // Import

const router = express.Router();

// Add 'upload.single("image")' middleware
router.post('/', upload.single("image"), generateResponse);

router.get('/', getAllChats);
router.get('/:id', getSingleChat);
router.delete('/:id', deleteChat);

module.exports = router;