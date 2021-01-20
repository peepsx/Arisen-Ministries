const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const paymentSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    token: {
        type: String,
        required: true,
        trim: true,
    },
    amount: {
        type: Number,
        required:true,
        trim: true
    },
    subscriptionId: {
        type: String,
        required: true,
        trim: true
    },
    created: {
        type: Number,
        required: true,
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
})


module.exports = mongoose.model('Payment', paymentSchema)