const mongoose = require('mongoose');

const likesSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },  
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        required: true,
    },
    likes: [{
        user: {
            type: [],
            ref: 'User',
        },
        islike: Boolean,
    }],
});

const Likes = mongoose.model('Likes', likesSchema);

module.exports = Likes;
