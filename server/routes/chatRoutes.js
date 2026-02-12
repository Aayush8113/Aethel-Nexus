const express = require('express');
const { generateResponse, getAllChats, getSingleChat, deleteChat, togglePinChat, deleteAllChats } = require('../controllers/chatController');
const upload = require('../middleware/upload');

const router = express.Router();

router.post('/', upload.single("image"), generateResponse);
router.get('/', getAllChats);
router.delete('/all', deleteAllChats); // Must come before /:id
router.get('/:id', getSingleChat);
router.delete('/:id', deleteChat);
router.put('/:id/pin', togglePinChat); // New

module.exports = router;