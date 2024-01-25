const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    },
    type: {
        type: String,
        enum: ['like', 'followRequest', 'comment', 'replyComment', 'friendRequestAccept'],
        required: true,
    },
    target: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: 'type',
    },
    initiator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    },
    isRead: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;
