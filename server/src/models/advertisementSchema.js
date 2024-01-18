// advertisementSchema
const mongoose = require('mongoose');

const advertisementSchema = new mongoose.Schema({
    adName: {
        type: String,
        required: true,
    },
    sponsored: {
        type: String,
        required: true,
    },
    adImage: {
        type: String,
    },
    description: {
        type: String,
    },
    fromDate: {
        type: Date,
        required: true,
    },
    toDate: {
        type: Date,
        required: true,
    },
    isDelete:{
        type:Boolean,
        default:false,
    }
}, { timestamps: true });

const Advertisement = mongoose.model('Ads', advertisementSchema);

module.exports = Advertisement;
