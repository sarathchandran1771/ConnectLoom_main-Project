const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    taggedUsers: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user',
            required: true,
        },
        initiator: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user',
            required: true,
        },
    }],
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
    }],
    replies: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ReplyComment',
    }],
    isReport: {
        type: Boolean,
    },
    reportCount: {
        type: Number,
        default: 0,
        validate: {
            validator: function (value) {
                return value >= 0;
            }
        },
    },
}, { timestamps: true });


const Comments = mongoose.model('comments', commentSchema);

module.exports = Comments;