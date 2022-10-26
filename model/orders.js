const mongoose = require('mongoose')

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
    allProducts: {
        type: Array,
        required: true
    },
    totalPrice: {
        type: String,
        required: true
    },
    order_status: {
        type: String,
        default: "ordered"
    },
    customerid: {
        type: String,
    },
    admin: {
        type: String,
        default: "not yet"
    },
    adminid: {
        type: String,
    },
    driverid: {
        type: String,
    },
    driver: {
        type: String,
        default: "not yet"
    }
}
)
module.exports = mongoose.model('orders', orderSchema)