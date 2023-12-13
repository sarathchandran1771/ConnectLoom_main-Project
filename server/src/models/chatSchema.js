const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // passing for to send the message user wise 
        required: true,
    },
    message: {
        type: String,
    },
    isDelete: {
        type: Boolean,
    }
}, { timestamps: true });

const chat = mongoose.model('Chat', chatSchema);
module.exports = chat;

