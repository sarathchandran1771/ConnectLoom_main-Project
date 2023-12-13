const mongoose = require('mongoose');

const replySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
    }],
    parentComment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment',
        required: true,
    },
}, { timestamps: true });

const ReplyComment = mongoose.model('ReplyComment', replySchema);

module.exports = ReplyComment;