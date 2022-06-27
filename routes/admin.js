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
        res.render("admin", { products: products })
    } catch (error) {
        res.send("You're facing error")
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
        const busyDrivers = []
        res.render("adminStatus.ejs", {
            pendingOrders: pendingOrders,
            confirmOrders: confirmOrders,
            availableDrivers: availableDrivers
        })
    } catch (error) {
        res.send("you're facing error")
    }

})

//assigning driver to orders
route.post('/confirmOrder', checkAuthenticated, authRole(ROLE.ADMIN), async (req, res) => {
    try {
        const orderid = req.body.orderid
        const driverid = req.body.driverid

        // const product = await Order.findById(Orderid);
        const driver = await Users.findById(driverid);
        //update product status
        await Order.findByIdAndUpdate(orderid, {
            order_status: "dispatched",
            admin: req.user.name,
            driver: driver.name
        })
        //single product
        // uadded to driver history
        await Users.findByIdAndUpdate(driverid,
            { $push: { orders: [orderid] } }
        );
        await Users.findByIdAndUpdate(driverid,
            { status: "not free" }
        );
        //added to admin history
        await Users.findByIdAndUpdate(req.user.id,
            { $push: { orders: orderid } },
        );

        res.redirect('/admin/status')
    } catch (error) {
        res.send("you're facing error")
    }

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




//to update data
// app.get('/admin/update/:id', checkAuthenticated, authRole(ROLE.ADMIN), async (req, res) => {
//     const id = req.params.id
//     try {
//         const product = await Product.findById(id);
//         if (product == null) {
//             res.status(404).send({ message: "Product is not present in the list" })
//         }
//         else {
//             await Product.findByIdAndDelete(id)
//             res.status(200).render('')
//         }
//     } catch (error) {
//         res.status(500).json({ message: error.message })
//     }
// })

module.exports = route