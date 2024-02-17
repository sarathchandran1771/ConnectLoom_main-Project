const mongoose = require('mongoose');

const chatRoomSchema = new mongoose.Schema({
  userIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true
  }],
  receiver:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  messages: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chat',
  }],
  // Add other fields as needed
}, { timestamps: true });

const ChatRoom = mongoose.model('ChatRoom', chatRoomSchema);

module.exports = ChatRoom;  