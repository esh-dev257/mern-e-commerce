const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  image: String, // URL to product image
});

module.exports = mongoose.model("Product", productSchema);
