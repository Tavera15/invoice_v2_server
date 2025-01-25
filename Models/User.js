const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
    name: {
        type: String,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        required: 'Email address is required',
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    password: {
        type: String,
        required: true,
    },
    businesses: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Business"
        }
    ],
    invoiceBooks: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "InvoiceBook"
        }
    ],
})

const validateEmail = (email) => {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email)
};

const User = mongoose.model("User", UserSchema);
module.exports = User;