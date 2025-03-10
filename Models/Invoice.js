const mongoose = require("mongoose");

const InvoiceSchema = mongoose.Schema({
    invoiceBook: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'InvoiceBook',
    },
    invoiceNumber: {
        type: String,
        required: true
    },
    isFinal: {
        type: Boolean,
        required: true
    },
    logo: {
        type: String
    },
    business: {
        name: {
            type: String,
            required: true
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
    },
    client: {
        name: {
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
    },
    customs: {
        type: String,
        required: true
    },
    subtotal: {
        type: String,
        required: true
    },
    taxes: {
        type: String,
        required: true
    },
    grand_total: {
        type: String,
        required: true
    },
    external_link: {
        type: String,
    }
})

const Invoice = mongoose.model("Invoice", InvoiceSchema);
module.exports = Invoice;