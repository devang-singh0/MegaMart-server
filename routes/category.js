import express from "express";
import Product from "../models/products.js";
export const Router = express.Router();

Router.route('/')
    .get(async (req, res) => {
        try {
            const categories = await Product.aggregate([
                { $group: { _id: "$category", count: { $sum: 1 } } },
                { $sort: { count: -1 } },
                { $limit: 10 }
            ]);

            res.send(categories);
        } catch (error) {
            res.status(500).json({ error: "Failed to fetch categories" });
        }
    });

export default Router;