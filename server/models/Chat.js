const mongoose = require('mongoose');

const ChatSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  isPinned: {
    type: Boolean,
    default: false, // New Field
  },
  messages: [
    {
      role: {
        type: String,
        required: true,
      },
      content: {
        type: String,
        required: true,
      },
      image: {
        type: String, // Base64 marker or URL
      }
    }
  ],
}, { timestamps: true });

module.exports = mongoose.model('Chat', ChatSchema);