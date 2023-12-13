//postSchema
const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    },
    image: {
        type: Array,
    },
    description: {
        type: String,
    },
    isReport: {
        type: Boolean,
    },

    isDelete: {
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
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment',
    }],
}, { timestamps: true });

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
