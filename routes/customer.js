const express = require('express')
const route = express.Router()
const { authRole, checkAuthenticated } = require('../roleAuth')
const ROLE = require('../roles')
const Product = require('../model/products')
const Order = require('../model/orders')


//giving customer all the listed product
route.get('/', checkAuthenticated, authRole(ROLE.CUSTOMER), async (req, res) => {
    try {
        const products = await Product.find();
        res.render('customer.ejs', { products: products })
    } catch (error) {
        res.send("you're facing error")
    }
})
/// render order form with individual product
route.get('/order/:id', checkAuthenticated, authRole(ROLE.CUSTOMER), async (req, res) => {
    try {
        const productid = req.params.id
        const product = await Product.findById(productid)
        const user = req.user
        res.render('customerOrder.ejs', { product: product, user: user })
    } catch (error) {
        res.send("you're facing error")
    }

})
//customer is placing order
route.post('/order/:id', checkAuthenticated, authRole(ROLE.CUSTOMER), async (req, res) => {
    const productid = req.params.id
    const customer_id = req.user._id
    try {
        const product = await Product.findById(productid)
        await Order.create({
            customer_name: req.user.name,
            customer_address: req.body.address,
            contact_number: req.body.number,
            product_name: product.title,
            product_price: product.price,
            customer_id: customer_id
        })
        res.redirect('/customer/status')
    } catch (error) {
        res.status(400).send("You're facing error")
    }
})
//your all current and past orders
route.get('/status', checkAuthenticated, authRole(ROLE.CUSTOMER), async (req, res) => {
    const id = req.user._id
    try {
        const allOrders = await Order.find({ customer_id: id })
        res.render("customerStatus.ejs", { orders: allOrders })
    } catch (error) {
        res.send("you're facing error")
    }

})

module.exports = route