const mongoose = require('mongoose')

//designing a product model
const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    price: {
        type: String,
        required: true
    },
    product_type: {
        type: String,
        required: true
    }
}
)
module.exports = mongoose.model('products', productSchema)