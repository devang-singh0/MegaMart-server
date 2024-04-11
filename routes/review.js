import express from "express";
import Review from "../models/review.js";
let Router = express.Router();

Router.post('/:productId', async (req, res) => {
    try{
        await Review.create({
            content: req.body.content,
            user: req.user._id,
            product: req.params.productId,
            rating: req.body.rating
        }).then(()=>{
            res.send('success');
        })
    }catch(err){
        console.log(err)
    }
});

export default Router;