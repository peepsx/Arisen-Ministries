const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const oneTimePaymentSchema = new Schema({
    amount: {
        type: Number,
        required: true,
        trim: true
    },
    subscriptionId: {
        type: String,
        required: true,
        trim: true
    },
    transectionId: {
        type: String,
        required: true,
        trim: true
    },
    paid: {
        type: Boolean,
        trim: true
    },
    paymentStatus: {
        type: String,
        trim: true
    },
    fname: {
        type: String,
        required: true,
        trim: true
    },
    lname: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true
    },
    addressOne: {
        type: String,
        required: true,
        trim: true
    },
    addressTwo: {
        type: String,
        required: true,
        trim: true
    },
    city: {
        type: String,
        required: true,
        trim: true
    },
    state: {
        type: String,
        required: true,
        trim: true
    },
    zipcode: {
        type: Number,
        required: true,
        trim: true
    },
    country: {
        type: String,
        required: true,
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
})


module.exports = mongoose.model('Onetimepayment', oneTimePaymentSchema)