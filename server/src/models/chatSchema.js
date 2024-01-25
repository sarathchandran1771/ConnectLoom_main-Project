const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    }, 
    users: [
        { 
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user',
            required: true,
        }
    ],
    content: {
        text:{
            type: String,  
            required: true,
        }
    },
    chatRoom: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ChatRoom',
        required: true,
    },
}, { timestamps: true });

const chatMessage = mongoose.model('Chat', chatSchema);
module.exports = chatMessage;

