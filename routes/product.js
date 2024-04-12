import express from "express";
import Product from "../models/products.js";
import Review from "../models/review.js";
import { allProducts } from "../controllers/product.js";
const Router = express.Router();

Router.route('/id/:id')
    .get(async(req, res) => {
        console.log('id', req.params.id);
        try{
            let product = await Product.findOne({ _id: String(req.params.id)});
            console.log('before reviews', product);
            let reviews = await Review.find({product: req.params.id}).populate('user', 'fullName profileImgURL');
            product = product.toObject();
            product.reviews = reviews;
            console.log('with reviews', product);
            res.send(product);
        } catch(err){
            console.log(err);
        }
    });

Router.route('/category/:category').get(async(req, res) => {
    try{
        let products = await Product.find({category: req.params.category}).select('title price discountPercentage thumbnail rating _id');
        res.send(products);
    } catch(err){
        console.log(err);
    }
});

Router.route('/')
    .get(allProducts);
export default Router;