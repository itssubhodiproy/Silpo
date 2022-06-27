const mongoose = require('mongoose')

//designing a product model
const orderSchema = new mongoose.Schema({
    customer_name: {
        type: String,
        required: true,
    },
    customer_address: {
        type: String,
        required: true,
    },
    contact_number: {
        type: String,
        required: true
    },
    order_time: {
        type: Date,
        default: Date.now
    },
    product_name: {
        type: String,
        required: true
    },
    product_price: {
        type: String,
        required: true
    },
    order_status: {
        type: String,
        default: "ordered"
    },
    admin: {
        type: String,
    },
    driver: {
        type: String,
    },

}
)
module.exports = mongoose.model('orders', orderSchema)