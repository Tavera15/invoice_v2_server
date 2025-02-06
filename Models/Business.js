const mongoose = require("mongoose");

const BusinessSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
    },
    name: {
        type: String,
    },
    email: {
        type: String,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    phone: {
        type: String,
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
    },
    productServices: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'ProductService'
        }
    ],
    customers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Customer'
        }
    ]
})

const Business = mongoose.model("Business", BusinessSchema);
module.exports = Business;