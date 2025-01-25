const mongoose = require("mongoose");

const ProductServiceSchema = mongoose.Schema({
    business: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Business',
    },
    name: {
        type: String,
        required: true
    },
    unitPrice: {
        type: String,
        required: true
    },
    description: {
        type: String
    }
})

const ProductService = mongoose.model("ProductService", ProductServiceSchema);
module.exports = ProductService;