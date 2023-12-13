const mongoose = require('mongoose');

const savedPostSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // passing for to save different users post with their id. 
        required: true,
    },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'post', // passing for to fect the post details 
        required: true,
    },
    isDelete: {
        type: Boolean,
    }
});

savedPostSchema.index({ user: 1, post: 1 }, { unique: true });
const SavedPost = mongoose.model('SavedPost', savedPostSchema);
module.exports = SavedPost;
