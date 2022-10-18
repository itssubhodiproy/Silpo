const express = require("express");
const route = express.Router();
const { authRole, checkAuthenticated } = require("../roleAuth");
const ROLE = require("../roles");
const Product = require("../model/products");
const Order = require("../model/orders");
var Users = require("../model/users");

//giving customer all the listed product
route.get(
  "/",
  checkAuthenticated,
  authRole(ROLE.CUSTOMER),
  async (req, res) => {
    try {
      const products = await Product.find();
      // console.log(req.user.cart)
      res.render("customer/customer.ejs", { products: products });
    } catch (error) {
      throw error;
      res.error(500).send("Server Error");
    }
  }
);
// pushing the indiidual product into cart
route.get(
  "/product/:id",
  checkAuthenticated,
  authRole(ROLE.CUSTOMER),
  async (req, res) => {
    try {
      // push the product to cart
      const product = await Product.findById(req.params.id);
      const Cart = JSON.parse(JSON.stringify(req.user.cart));
      // if product is already in cart, won't add it again
      if (Cart.find((item) => item._id == product.id)) {
        return res.send("item already in cart");
      }
      // add product to cart
      else {
        await Users.findByIdAndUpdate(req.user.id, {
          $push: {
            cart: [product],
          },
        }).then(console.log("product added to cart"));
      }
      res.redirect("/customer");
    } catch (error) {
      throw error;
      res.error(500).send("Server Error");
    }
  }
);
route.get(
  "/cart",
  checkAuthenticated,
  authRole(ROLE.CUSTOMER),
  async (req, res) => {
    try {
      //rendering the cart
      res.render("customer/cart", { cart: req.user.cart });
      // res.json(cart);
    } catch (error) {
      res.send("you're facing error");
    }
  }
);

route.post("/cart", async (req, res) => {
  try {
    const order = await Order.create({
      customer_name: req.user.name,
      customer_address: req.body.address,
      contact_number: req.body.number,
      order_time: Date.now().toLocaleString(),
      // allProducts: cartProducts,
      totalPrice: totalPrice,
      customer_id: customer_id,
      allProducts: req.user.cart,
    });
    await Users.findByIdAndUpdate(req.user.id, {
      $set: { cart: [] },
    });
    res.redirect("/orders");
  } catch (error) {
    res.send("you're facing error");
  }
});

//customer is placing order
route.post(
  "/order/:id",
  checkAuthenticated,
  authRole(ROLE.CUSTOMER),
  async (req, res) => {
    const cartId = req.params.id;
    const customer_id = req.user._id;
    try {
      const cartProducts = await Cart.findById(cartId);
      //sum of all the products
      var totalPrice = 0;
      cartProducts.array.forEach((element) => {
        totalPrice += element.price;
      });
      //creating order
      await Order.create({
        customer_name: req.user.name,
        customer_address: req.body.address,
        contact_number: req.body.number,
        order_time: Date.now().toLocaleString(),
        allProducts: cartProducts,
        totalPrice: totalPrice,
        customer_id: customer_id,
      });
      res.redirect("/customer/status");
    } catch (error) {
      res.status(400).send("You're facing error");
    }
  }
);
//your all current and past orders
route.get(
  "/status",
  checkAuthenticated,
  authRole(ROLE.CUSTOMER),
  async (req, res) => {
    const id = req.user._id;
    try {
      const allOrders = await Order.find({ customer_id: id });
      res.render("customer/customerStatus.ejs", { orders: allOrders });
    } catch (error) {
      res.send("you're facing error");
    }
  }
);

module.exports = route;
