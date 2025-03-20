const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  stock: { type: Number, default: 0 },
  image: { type: String }, // Store image URL
}, { timestamps: true });

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
