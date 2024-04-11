import mongoose from "mongoose";
import Product from "./products.js";

const reviewSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    rating: {
        type: Number,
        required: true
    },
}, { timestamps: true });

reviewSchema.pre('save', async function (next) {
    let product = await Product.findById(this.product);
    let rating = (product.rating.rate * product.rating.count + this.rating) / (product.rating.count + 1);
    product.rating.rate = rating;
    product.rating.count = product.rating.count + 1;
    await product.save();
    next();
})

const Review = mongoose.model('Review', reviewSchema);
export default Review;