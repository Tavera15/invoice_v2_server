const mongoose = require("mongoose");

const CustomerSchema = mongoose.Schema({
    Business: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Business',
    },
    name: {
        type: String,
        required: true
    },
    addressLine1: {
        type: String,
    },
    addressLine2: {
        type: String,
    },
    city: {
        type: String,
    },
    state: {
        type: String,
    },
    zip: {
        type: String,
    }
})

const Customer = mongoose.model("Customer", CustomerSchema);
module.exports = Customer;