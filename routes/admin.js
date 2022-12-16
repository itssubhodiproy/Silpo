const express = require("express");
const route = express.Router();
const { authRole, checkAuthenticated } = require("../roleAuth");
const ROLE = require("../roles");
const Product = require("../model/products");
const Order = require("../model/orders");
const Users = require("../model/users");
const imageMimeTypes = ['image/jpeg', 'image/png', 'images/jpg']


//giving admin all the listed product
route.get("/", checkAuthenticated, authRole(ROLE.ADMIN), async (req, res) => {
  try {
    const products = await Product.find();
    res.status(201).render("admin/tempAdmin", { products: products , user: req.user});
  } catch (error) {
    res.status(401).send("You're facing error");
  }
});
//to listing new product
route.post(
  "/",
  checkAuthenticated,
  authRole(ROLE.ADMIN),
  async (req, res, next) => {
    const product = await Product.findOne({ title: req.body.title });
    if (product) return res.status(400).send("Product Already Exists");
    req.product = new Product();
    next();
  },
  saveProductAndRedirect()
);

//pending and confirm orders
route.get(
  "/status",
  checkAuthenticated,
  authRole(ROLE.ADMIN),
  async (req, res) => {
    try {
      const allOrders = await Order.find();
      const allUsers = await Users.find();
      // extracting and classifying all order status
      const pendingOrders = [];
      const confirmOrders = [];

      for (let i = 0; i < allOrders.length; i++) {
        if (allOrders[i].order_status === "ordered") {
          pendingOrders.push(allOrders[i]);
        } else {
          confirmOrders.push(allOrders[i]);
        }
      }
      //extracting available drivers
      const availableDrivers = [];
      for (let i = 0; i < allUsers.length; i++) {
        if (allUsers[i].role === "driver" && allUsers[i].status === "free") {
          availableDrivers.push(allUsers[i]);
        }
      }
      // console.log(pendingOrders);
      console.log(confirmOrders);
      res.status(201).render("admin/tempManage.ejs", {
        pendingOrders: pendingOrders,
        confirmOrders: confirmOrders,
        availableDrivers: availableDrivers,
        user: req.user
      });
    } catch (error) {
      res.status(401).send("you're facing error");
    }
  }
);

//managing order as a admin
route.post(
  "/confirmOrder",
  checkAuthenticated,
  authRole(ROLE.ADMIN),
  async (req, res) => {
    const orderid = req.body.orderid;
    const driverid = req.body.driverid;
    const adminid = req.user._id.toString();
    const driver = await Users.findById(driverid);
    //update product status
    await Order.findByIdAndUpdate(orderid, {
      order_status: "dispatched",
      admin: req.user.name,
      driver: driver.name,
      adminid: adminid,
      driverid: driverid,
    });
    // added to driver history
    await Users.findByIdAndUpdate(driverid, { $push: { orders: [orderid] } });
    //updating driver status
    await Users.findByIdAndUpdate(driverid, { status: "not free" });
    //added to admin history
    await Users.findByIdAndUpdate(adminid, { $push: { orders: [orderid] } });
    res.status(201).redirect("/admin/status");
  }
);
//to delete listed products
route.get(
  "/delete/:id",
  checkAuthenticated,
  authRole(ROLE.ADMIN),
  async (req, res) => {
    const id = req.params.id;
    try {
      const product = await Product.findById(id);
      if (product == null) {
        res.status(404).send({ message: "Product is not present in the list" });
      } else {
        await Product.findByIdAndDelete(id);
        res.status(200).redirect("/admin");
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);
route.get(
  "/history",
  checkAuthenticated,
  authRole(ROLE.ADMIN),
  async (req, res) => {
    try {
      const history = req.user.orders;
      const temp = [];
      // console.log(history.length)
      for (var i = 0; i < history.length; i++) {
        const order = await Order.findById(history[i]);
        if (order !== null) {
          temp.push(order);
        }
      }
      res.render("admin/adminHistory", { orders: temp });
    } catch (error) {
      res.send("You're facing error");
    }
  }
);

//save product and redirect
function saveProductAndRedirect() {
  return async (req, res) => {
    let product = req.product;
    product.title = req.body.title;
    product.product_type = req.body.product_type;
    product.price = req.body.price;
    saveCover(product, req.body.cover);
    try {
      product = await product.save();
      res.redirect(`/admin`);
    } catch (error) {
      res.send("Errrrorrrr");
    }
  };
}
//save cover as buffer
function saveCover(product, coverEncoded) {
//   console.log("hi");
  if (coverEncoded == null) return;
  const cover = JSON.parse(coverEncoded);
  if (cover != null && imageMimeTypes.includes(cover.type)) {
    product.coverImage = new Buffer.from(cover.data, "base64");
    product.coverImageType = cover.type;
  }
}

module.exports = route;
