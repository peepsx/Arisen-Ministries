const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const paypalpaymentSchema = new Schema({
    orderID: {
        type: String,
        required: true,
        trim: true
    },
    billingToken: {
        type: String,
        required: true,
        trim: true,
    },
    amount: {
        type: Number,
        required: true,
        trim: true
    },
    subscriptionID: {
        type: String,
        required: true,
        trim: true
    },
    facilitatorAccessToken: {
        type: String,
        required: true,
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
})

module.exports = mongoose.model('Paypalpayment', paypalpaymentSchema)