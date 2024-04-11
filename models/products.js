import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String }, 
  discountPercentage: { type: Number },
  rating: {
    rate: { type: Number, default: 0 },
    count: { type: Number, default: 0 }
  },
  brand: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  thumbnail: { type: String },
  imgUrls: [{ type: String }],
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);

export default Product;