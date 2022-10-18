const mongoose = require("mongoose");

//designing a product model
const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  price: {
    type: String,
    required: true,
  },
  product_type: {
    type: String,
    required: true,
  },
});

// const cartSchema = new mongoose.Schema({
//   product_array: [productSchema],
// });

module.exports = mongoose.model("products", productSchema);
// const cart = mongoose.model("cart", cartSchema);

// module.exports = {
//   Product: product,
//   Cart: cart,
// };
