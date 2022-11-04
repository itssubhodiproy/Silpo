const express = require("express");
const route = express.Router();
const { authRole, checkAuthenticated } = require("../roleAuth");
const ROLE = require("../roles");
const Product = require("../model/products");
var Order = require("../model/orders");
var Users = require("../model/users");

//giving customer all the listed product
route.get(
  "/",
  checkAuthenticated,
  authRole(ROLE.CUSTOMER),
  async (req, res) => {
    try {
      const products = await Product.find();
      res.render("customer/tempCustomer.ejs", {
        products: products,
        user: req.user,
      });
    } catch (error) {
      throw error;
    }
  }
);

// pushing individual product id to cart
// route.get(
//   "/product/:id",
//   checkAuthenticated,
//   authRole(ROLE.CUSTOMER),
//   async (req, res) => {
//     try {
//       const product = await Product.findById(req.params.id);
//       res.render("customer/productPage.ejs", { product: product ,user: req.user});
//     } catch (error) {
//       console.log(error);
//       res.send(error);
//     }
//   }
// );
// pushing individual product id to cart
route.get(
  "/product/:id",
  checkAuthenticated,
  authRole(ROLE.CUSTOMER),
  async (req, res) => {
    try {
      const product = await Product.findById(req.params.id);
      const Cart = JSON.parse(JSON.stringify(req.user.cart));
      // if product is already in cart, won't add it again
      if (Cart.find((item) => item == product.id)) {
        return res.send("item already in cart");
      }
      // add product to cart
      else {
        await Users.findByIdAndUpdate(req.user.id, {
          $push: {
            cart: [req.params.id],
          },
        }).then(console.log("product added to cart"));
      }
      res.redirect("/customer/cart");
    } catch (error) {
      throw error;
    }
  }
);
route.get(
  "/cart",
  checkAuthenticated,
  authRole(ROLE.CUSTOMER),
  async (req, res) => {
    try {
      let products = [];
      let totalPrice = 0;
      const cartProducts = JSON.parse(JSON.stringify(req.user.cart));
      // console.log(cartProducts);
      for (let i = 0; i < cartProducts.length; i++) {
        const product = await Product.findById(cartProducts[i]);
        products.push(product);
        totalPrice += parseInt(product.price);
      }
      //rendering the cart
      res.render("customer/cart", {
        totalPrice: totalPrice,
        products: products,
        user: req.user,
      });
      // res.json(cart);
    } catch (error) {
      console.log(error);
      res.send(error);
    }
  }
);
//deleting the product from cart
route.get(
  "/cart/:id",
  checkAuthenticated,
  authRole(ROLE.CUSTOMER),
  async (req, res) => {
    try {
      await Users.findByIdAndUpdate(req.user.id, {
        $pull: { cart: req.params.id },
      });
      res.redirect("/customer/cart");
    } catch (error) {
      console.log(error);
      res.send("you're facing error");
    }
  }
);

// passing the cart products to the staging area
route.get(
  "/checkout",
  checkAuthenticated,
  authRole(ROLE.CUSTOMER),
  async (req, res) => {
    try {
      let products = [];
      let totalPrice = 0;
      const cartProducts = JSON.parse(JSON.stringify(req.user.cart));
      for (let i = 0; i < cartProducts.length; i++) {
        const product = await Product.findById(cartProducts[i]);
        products.push(product);
        totalPrice += parseInt(product.price);
      }
      res.render("customer/checkout", {
        products: products,
        totalPrice: totalPrice,
      });
    } catch (error) {
      throw error;
    }
  }
);

//creating a new order from taking assests from re.body
route.post(
  "/checkout",
  checkAuthenticated,
  authRole(ROLE.CUSTOMER),
  async (req, res) => {
    // sum of all the products
    var totalPrice = 0;
    var cartProducts = req.user.cart;

    for (let i = 0; i < cartProducts.length; i++) {
      const product = await Product.findById(cartProducts[i]);
      totalPrice += parseInt(product.price);
    }

    //order create
    try {
      await Order.create({
        customer_name: req.user.name,
        customer_address: req.body.address,
        contact_number: req.body.phone,
        order_time: Date.now(),
        allProducts: cartProducts,
        totalPrice: totalPrice,
        customerid: req.user.id,
      }).then(console.log("order created"));
      await Users.findByIdAndUpdate(req.user.id, {
        $set: { cart: [] },
      }).then(console.log("cart cleared"));
    } catch (error) {
      console.log(error);
      res.send("error");
    }

    // fetching all images with the help of id and passing them for SSR in checkout page

    // redirect to paytm gateway
    res.redirect(`/customer/status`);
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
      res.render("customer/tempOrderStatus.ejs", {
        orders: allOrders,
        user: req.user,
      });
      // res.json(allOrders);
    } catch (error) {
      res.send("you're facing error");
    }
  }
);

//getting single order details
route.get("/order/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const order = await Order.findById(id);
    let products = [];
    for (let i = 0; i < order.allProducts.length; i++) {
      const product = await Product.findById(order.allProducts[i]);
      products.push(product);
    }
    res.render("customer/orderDetails.ejs", { order: order, user: req.user, products: products });
  } catch (error) {
    res.send("you're facing error");
  }
});

module.exports = route;
