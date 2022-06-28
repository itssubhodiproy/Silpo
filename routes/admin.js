const express = require('express')
const route = express.Router()
const { authRole, checkAuthenticated } = require('../roleAuth')
const ROLE = require('../roles')
const Product = require('../model/products')
const Order = require('../model/orders')
const Users = require('../model/users')

//giving admin all the listed product
route.get('/', checkAuthenticated, authRole(ROLE.ADMIN), async (req, res) => {
    try {
        const products = await Product.find();
        res.status(201).render("admin", { products: products })
    } catch (error) {
        res.status(401).send("You're facing error")
    }
})
//to listing new product
route.post('/', checkAuthenticated, authRole(ROLE.ADMIN), async (req, res) => {
    try {
        const product = await Product.findOne({ title: req.body.title })
        if (product) return res.status(400).send("Product Already Exists")
        await Product.create({
            title: req.body.title,
            price: req.body.price,
            product_type: req.body.product_type
        })
        res.status(201).redirect('/admin')
    } catch (error) {
        res.status(401).send("Error")
    }
})

//pending and confirm orders
route.get('/status', checkAuthenticated, authRole(ROLE.ADMIN), async (req, res) => {
    try {
        const allOrders = await Order.find()
        const allUsers = await Users.find()
        // extracting and classifying all order status
        const pendingOrders = [];
        const confirmOrders = [];


        for (var i = 0; i < allOrders.length; i++) {
            if (allOrders[i].order_status === 'ordered') {
                pendingOrders.push(allOrders[i]);
            }
            else {
                confirmOrders.push(allOrders[i]);
            }
        }
        //extracting available drivers
        const availableDrivers = [];
        for (var i = 0; i < allUsers.length; i++) {
            if (allUsers[i].role === 'driver' && allUsers[i].status === 'free') {
                availableDrivers.push(allUsers[i]);
            }
        }
        res.status(201).render("adminStatus.ejs", {
            pendingOrders: pendingOrders,
            confirmOrders: confirmOrders,
            availableDrivers: availableDrivers
        })
    } catch (error) {
        res.status(401).send("you're facing error")
    }

})

//managing order as a admin
route.post('/confirmOrder', checkAuthenticated, authRole(ROLE.ADMIN), async (req, res) => {
        const orderid = req.body.orderid
        const driverid = req.body.driverid
        const adminid = req.user._id.toString()
        const driver = await Users.findById(driverid);
        //update product status
        await Order.findByIdAndUpdate(orderid, {
            order_status: "dispatched",
            admin: req.user.name,
            driver: driver.name,
            adminid: adminid,
            driverid: driverid
        })
        // added to driver history
        await Users.findByIdAndUpdate(driverid,
            { $push: { orders: [orderid] } }
        );
        //updating driver status
        await Users.findByIdAndUpdate(driverid,
            { status: "not free" }
        );
        //added to admin history
        await Users.findByIdAndUpdate(adminid,
            { $push: { orders: [orderid] } }
        );
        res.status(201).redirect('/admin/status')

})
//to delete listed products
route.get('/delete/:id', checkAuthenticated, authRole(ROLE.ADMIN), async (req, res) => {
    const id = req.params.id
    try {
        const product = await Product.findById(id);
        if (product == null) {
            res.status(404).send({ message: "Product is not present in the list" })
        }
        else {
            await Product.findByIdAndDelete(id)
            res.status(200).redirect('/admin')
        }
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})
route.get('/history', checkAuthenticated, authRole(ROLE.ADMIN), async (req, res) => {
    try {
        const history = req.user.orders
        const temp = []
        // console.log(history.length)
        for (var i = 0; i < history.length; i++) {
            const order = await Order.findById(history[i]);
            if (order !== null) {
                temp.push(order);
            }
        }
        res.render('adminHistory', { orders: temp })
    } catch (error) {
        res.send("You're facing error")
    }
})


module.exports = route