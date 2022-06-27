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

    // console.log(req.user.name)
})
/// render order form with product data and post orderForm with merged data
route.get('/order/:id', checkAuthenticated, authRole(ROLE.CUSTOMER), async (req, res) => {
    try {
        const id = req.params.id
        const product = await Product.findById(id)
        const user = req.user
        res.render('customerOrder.ejs', { product: product, user: user })
    } catch (error) {
        res.send("you're facing error")
    }

})
//customer is placing order
route.post('/order/:id', checkAuthenticated, authRole(ROLE.CUSTOMER), async (req, res) => {
    const id = req.params.id
    //fetch data about customer
    try {
        const product = await Product.findById(id)
        await Order.create({
            customer_name: req.user.name,
            customer_address: req.body.address,
            contact_number: req.body.number,
            product_name: product.title,
            product_price: product.price
        })
        // console.log(product)
        res.redirect('/customer/status')
    } catch (error) {
        res.status(400).send("You're facing error")
    }
})
//your orders
route.get('/status', checkAuthenticated, authRole(ROLE.CUSTOMER), async (req, res) => {
    try {
        const allOrders = await Order.find({ customer_name: req.user.name })
        res.render("customerStatus.ejs", { orders: allOrders })
    } catch (error) {
        res.send("you're facing error")
    }

})

module.exports = route