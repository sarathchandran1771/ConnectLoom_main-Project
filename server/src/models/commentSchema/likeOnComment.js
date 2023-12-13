const mongoose = require('mongoose');

const likeOnCommentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    },
}, { timestamps: true });

const LikeOnComment = mongoose.model('LikeOnComment', likeOnCommentSchema);

module.exports = LikeOnComment;
