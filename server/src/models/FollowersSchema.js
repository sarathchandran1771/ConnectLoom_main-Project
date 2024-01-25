const mongoose = require('mongoose');

const FriendrequestSchema = new mongoose.Schema({
    fromUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    toUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    acceptFollow: {
        type: Boolean,
        default: null,
    },
    restrict: {
        type: Boolean,
        default: false,
    },
    isReport: {
        type: Boolean,
        default: false,
    } 
}, { timestamps: true });

FriendrequestSchema.index(
    { fromUser: 1, toUser: 1, acceptFollow: 1 },
    { unique: true, partialFilterExpression: { acceptFollow: { $ne: null } } }
  );
  
const Friendrequest = mongoose.model('Friendrequest', FriendrequestSchema);
module.exports = Friendrequest;
