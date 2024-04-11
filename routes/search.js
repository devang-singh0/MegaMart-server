import express from 'express';
import Product from '../models/products.js';
let Router = express.Router();

Router.get('/', async(req, res) => {
    try{
        let products = await Product.find({title: {$regex: req.query.query, $options: 'i'}}, {thumbnail: 1, title: 1, price: 1});
        res.send(products);
    } catch(err){
        console.log(err);
    }
});

export default Router;