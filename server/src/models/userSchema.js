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
    },
    profilePic: {
        type: String,
    },
    Bio: {
        type: String,
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
        },
        followingCount: {
            type: mongoose.Schema.Types.ObjectId,
        },
    }],
    chat: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'chat',
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
}, { timestamps: true });


// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
    console.log("Entered Password:", enteredPassword);
    console.log("Stored Hashed Password:", this.password);
  
    const isMatch = await bcrypt.compare(enteredPassword, this.password);
    console.log("Is Password Match?", isMatch);
  
    return isMatch;
  };
  
  
  // Encrypt password using bcrypt
//   userSchema.pre('save', async function (next) {
//     if (!this.isModified('password')) {
//       next();
//     }
  
//     const salt = await bcrypt.genSalt(10);
//     this.password = await bcrypt.hash(this.password, salt);
//   });

const User = mongoose.model('user', userSchema);

module.exports = User;
