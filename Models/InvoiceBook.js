const mongoose = require("mongoose");

const InvoiceBookSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
    },
    name: {
        type: String,
        required: true
    },
    startingNumber:{
        type: Number,
        min: 0,
    },
    invoices: [
        {
            type: mongoose.Schema.Types.ObjectId, 
            ref: "Invoice"
        }
    ],
    logo: {
        type: String
    }
})

const InvoiceBook = mongoose.model("InvoiceBook", InvoiceBookSchema);
module.exports = InvoiceBook;