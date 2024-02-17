const mongoose = require('mongoose');

const reportedCommentSchema = new mongoose.Schema({
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user',
            required: true,
        },
        reportReason: [{
            type: String,
            enum: [
                "It's spam",
                'Nudity or sexual activity',
                'Hate speech or symbols',
                'Violence or dangerous organizations',
                'Sale of illegal or regulated goods',
                'Bullying or harassment',
                'Intellectual property violation',
                'False information',
                'Suicide, self-injury or eating disorders',
                "I just don't like it",
            ],
            required: true,
        }],
        parentComment: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'comments',
            required: true,
        },
}, { timestamps: true });

const ReportedComments = mongoose.model('Reportedcomments', reportedCommentSchema);

module.exports = ReportedComments;
