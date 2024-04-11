import Product from "../models/products.js";

export async function allProducts(req, res) {
    let { discount, rating, price, category, limit, page, sort } = req.query;
    try {
        const offset = (page - 1) * limit;
        let sortRef = [{}, {price: 1}, {price: -1}, {rating: 1}, {rating: -1}, {discountPercentage: 1}, {discountPercentage: -1}];
        let query = {};
        if (category != '') query.category = category;
        query.discountPercentage = { $gte: discount };
        query['rating.rate'] = { $gte: rating };
        let [minPrice, maxPrice] = price;
        query.price = { $gte: minPrice, $lte: maxPrice };

        const products = await Product.find(query).sort(sortRef[sort.index]).select('title price discountPercentage thumbnail rating _id').skip(offset).limit(limit);
        const totalCount = await Product.countDocuments(query);
        const totalPages = Math.ceil(totalCount / limit);

        res.json({
            products,
            totalPages,
            currentPage: page,
            limit,
            totalCount
        });
    } catch (err) {
        console.log(err);
        res.send('internal server error')
    }
}