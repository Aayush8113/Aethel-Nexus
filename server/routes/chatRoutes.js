const express = require('express');
const { generateResponse, getAllChats, getSingleChat } = require('../controllers/chatController');

const router = express.Router();

router.post('/', generateResponse);
router.get('/', getAllChats);
router.get('/:id', getSingleChat);

module.exports = router;