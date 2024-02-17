//userSchema
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    emailId: {
        type: String,
        required: true,
        unique: true,
    },
    privatePublic: {
        type: Boolean,
        default: false,
    },
    profilename: {
        type: String,
    },
    mobileNumber: {
        type: Number,
        unique: true,
    },
    profilePic: {
        type: String,
    },
    Bio: {
        type: String,
    },
    paymentStatus: {
        type: Boolean,
        default: false,
      },
    isPremium: {
        type: Boolean,
        default: false,
      },
    isVerified:{
        type: Boolean,
        default:false
    },
    emailToken:{type:String},
    account: [{
        followersCount: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Friendrequest',
            default: 0,
        },
        followingCount: {
            type: mongoose.Schema.Types.ObjectId,
            default: 0,
        },
    }],
    isReported: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ReportedUsers', 
    }],
    isRestrict: [{
        restricted: {
            type: Boolean,
            default: false,
        },
        restrictedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user',
        },
    }],
    isLiked:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post', 
    }],
    isSaved:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post', 
    }],
    pendingFollowers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
    }],
    pendingFollowing: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
    }], 
    followers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
    }],
    following: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
    }],
    account: {
        followersCount: {
            type: Number,
            min: 0,
        },
        followingCount: {
            type: Number,
            min: 0,
        },
    },   
}, { timestamps: true });


// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
    const isMatch = await bcrypt.compare(enteredPassword, this.password);
    return isMatch;
  };
  
const User = mongoose.model('user', userSchema);

module.exports = User;
