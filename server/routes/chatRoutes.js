const express = require('express');
const { generateResponse } = require('../controllers/chatController');

const router = express.Router();

// When someone posts to '/', run the generateResponse function
router.post('/', generateResponse);

module.exports = router;