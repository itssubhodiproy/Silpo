const express = require('express')
const route = express.Router()
const { authRole, checkAuthenticated } = require('../roleAuth')
const ROLE = require('../roles')
const Product = require('../model/products')
const Order = require('../model/orders')
const Users = require('../model/users')

//giving admin all the listed product
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

        if (order.order_status === 'delivered') {
            const userid = req.user._id
            await Users.findByIdAndUpdate(userid, {
                status: "free"
            })
            return res.redirect('/driver')
        }
        res.redirect('/driver')
    } catch (error) {
        res.send("You're facing error")
    }
})

//driver history

route.get('/history', checkAuthenticated, authRole(ROLE.DRIVER), async(req, res) => {
    try {
        const history = req.user.orders
        const temp = [];
        for (var i = 0; i < history.length; i++) {
            const order = await Order.findById(history[i]);
            temp.push(order)
        }
        res.render('driverHistory', { orders: temp })
    } catch (error) {
        res.send("You're facing error")
    }

})

module.exports = route