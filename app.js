// Description: Main entry point for the server.
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';

// importing routers and middlewares
import userRouter from './routes/user.js';
import categoryRouter from './routes/category.js';
import productRouter from './routes/product.js';
import reviewRouter from './routes/review.js';
import searchRouter from './routes/search.js';
import orderRouter from './routes/order.js';
import { connectDB } from './utils/DB.js';
import { isLoggedIn } from './middlewares/isLoggedin.js';

// setting up environment variables
import dotenv from 'dotenv';
dotenv.config();

// express app and DB connection
const app = express();
const port = process.env.PORT || 8000;
connectDB();

// top level middlewares
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors({
    credentials: true,
    origin: (origin, callback) => {
        callback(null, true);
    }
}));
app.use(cookieParser());
app.use(express.static('public'));
app.use(isLoggedIn);

// router middlewares
app.use('/user', userRouter);
app.use('/categories', categoryRouter);
app.use('/product', productRouter);
app.use('/review', reviewRouter);
app.use('/search', searchRouter);
app.use('/order', orderRouter);

// top level routers
app.get('/', (req, res) => {
    res.send('hello');
});


// starting the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
