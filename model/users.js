const mongoose = require("mongoose");
//push this array into user order

//designing a friend model
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: "free",
  },
  orders: {
    type: [
      {
        type: String,
        required: true,
      },
    ],
  },
  cart: {
    //array of products
    type: [
      {
        type: String,
        required: true,
      },
    ],
  },
});

// UserSchema.virtual('coverImagePath').get(function() {
//   if (this.cart.coverImage != null && this.cart.coverImageType != null) {
//     return `data:${this.cart.coverImageType};charset=utf-8;base64,${this.cart.coverImage.toString('base64')}`
//   }
// })

module.exports = mongoose.model("users", UserSchema);
