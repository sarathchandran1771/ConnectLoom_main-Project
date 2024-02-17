const mongoose = require('mongoose');

const userReportSchema = new mongoose.Schema({
        reportedUser: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user',
            required: true,
        },
        reportedBy: {
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
}, { timestamps: true });

const reportedUsers = mongoose.model('ReportedUsers', userReportSchema);

module.exports = reportedUsers;
