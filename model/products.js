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
  coverImage: {
    type: Buffer,
  },
  coverImageType: {
    type: String,
  },
});

//for image post
productSchema.virtual('coverImagePath').get(function() {
  if (this.coverImage != null && this.coverImageType != null) {
    return `data:${this.coverImageType};charset=utf-8;base64,${this.coverImage.toString('base64')}`
  }
})

module.exports = mongoose.model("products", productSchema);
