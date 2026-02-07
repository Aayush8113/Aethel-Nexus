const express = require('express');
const { generateResponse, getAllChats, getSingleChat, deleteChat } = require('../controllers/chatController');

const router = express.Router();

router.post('/', generateResponse);
router.get('/', getAllChats);
router.get('/:id', getSingleChat);
router.delete('/:id', deleteChat); // <--- New Route

module.exports = router;