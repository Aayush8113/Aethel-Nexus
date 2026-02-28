const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  role: { type: String, required: true, enum: ['user', 'model'] },
  content: { type: String, required: true },
  image: { type: String, default: null }, // Base64 or URL
  createdAt: { type: Date, default: Date.now }
});

const chatSchema = new mongoose.Schema({
  title: { type: String, default: 'New Conversation' },
  messages: [messageSchema],
  isPinned: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Chat', chatSchema);