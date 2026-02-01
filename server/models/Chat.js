const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
  // The title of the conversation (e.g., "React Help")
  title: {
    type: String,
    default: "New Conversation",
    trim: true
  },
  // An array that holds every message in this specific chat session
  messages: [
    {
      role: {
        type: String,
        required: true,
        enum: ['user', 'model'] // Only allows 'user' or 'model' (like Gemini API)
      },
      content: {
        type: String,
        required: true
      },
      timestamp: {
        type: Date,
        default: Date.now
      }
    }
  ]
}, { timestamps: true }); // Automatically creates 'createdAt' and 'updatedAt' fields

module.exports = mongoose.model('Chat', chatSchema);