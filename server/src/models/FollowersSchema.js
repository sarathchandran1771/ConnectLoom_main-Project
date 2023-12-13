const mongoose = require('mongoose');

const FriendrequestSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // passing for to fetch the details of the user 
        required: true,
    },
    acceptFollow: {
        type: Boolean,
    },
    restrict: {
        type: Boolean,
    },
    isReport: {
        type: Boolean,
    }
}, { timestamps: true });

FriendrequestSchema.index({ user: 1, acceptFollow: 1 }, { unique: true });
const Friendrequest = mongoose.model('Friendrequest', FriendrequestSchema);
module.exports = Friendrequest;

