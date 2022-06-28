const express = require('express')
const route = express.Router()
const { authRole, checkAuthenticated } = require('../roleAuth')
const ROLE = require('../roles')
const Product = require('../model/products')
const Order = require('../model/orders')
const Users = require('../model/users')

//giving driver current order if have it
route.get('/', checkAuthenticated, authRole(ROLE.DRIVER), async (req, res) => {
    try {
        const orderlen = req.user.orders.length
        const orderid = req.user.orders[orderlen - 1]
        if (orderid !== undefined && req.user.status === 'not free') {
            const curr_order = await Order.findById(orderid);
            return res.render("driver.ejs", { orders: curr_order })
        }
        res.render("driver", { orders: {} })
    } catch (error) {
        res.send("You're facing error")
    }
})
//to listing new product
route.post('/updateStatus', checkAuthenticated, authRole(ROLE.DRIVER), async (req, res) => {
    const id = req.body.orderid;
    //update order status
    try {
        await Order.findByIdAndUpdate(id, {
            order_status: req.body.status
        })
        const order = await Order.findById(id);
        //if order is delivered, driver is free
        if (order.order_status === 'delivered') {
            const userid = req.user._id
            await Users.findByIdAndUpdate(userid, {
                status: "free"
            })
        }
        res.redirect('/driver')
    } catch (error) {
        res.send("You're facing error")
    }
})

//driver history

route.get('/history', checkAuthenticated, authRole(ROLE.DRIVER), async (req, res) => {
    try {
        const history = req.user.orders
        const temp = [];
        for (var i = 0; i < history.length; i++) {
            const order = await Order.findById(history[i]);
            if (order !== null) {
                temp.push(order)
            }
        }
        res.render('driverHistory', { orders: temp })
    } catch (error) {
        res.send("You're facing error")
    }

})

module.exports = route