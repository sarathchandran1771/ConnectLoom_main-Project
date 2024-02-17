const mongoose = require('mongoose');

const likesSchema = new mongoose.Schema({
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
    likes: {
        type: Map,
        of: Boolean,
        default: {},
    },
});

likesSchema.index({ user: 1, post: 1 }, { unique: true });

const Likes = mongoose.model('Likes', likesSchema);

module.exports = Likes;
