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
    reportCount: {
        type: Number,
        default: 0,
        validate: {
            validator: function (value) {
                return value >= 0;
            }
        },
    },
    pendingFollowers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    pendingFollowing: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }], 
    followers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    following: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
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
