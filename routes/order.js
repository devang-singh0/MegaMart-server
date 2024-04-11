import express from 'express';
import Razorpay from 'razorpay';
import dotenv from 'dotenv';
import crypto from 'crypto';
import Order from '../models/order.js';
import {User} from '../models/user.js';
dotenv.config();
const Router = express.Router();

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});
Router.route('/create').post(async (req, res) => {
    try {
        const options = {
            amount: req.body.amount,
            currency: "INR",
        };
        const response = await razorpay.orders.create(options);
        await Order.create({
            user: req.user._id,
            paymentsId: response.id,
            status: 'pending',
            cart: req.body.products,
        }).then((order) => {
            response.orderId = order._id;
        });
        res.send(response);
    } catch (err) {
        console.log(err);
    }
});

Router.route('/validate').post(async (req, res) => {
    try {
        const { orderId, paymentId, signature } = req.body;
        const shasum = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET).update(`${orderId}|${paymentId}`).digest('hex');
        if (shasum === signature) {
            let order = await Order.findOne({ paymentsId: orderId });
            order.status = 'placed';
            await order.save();
            res.send({ message: "Payment is valid" });
        } else {
            let order = await Order.findOne({ paymentsId: orderId });
            order.status = 'failed';
            await order.save();
            res.status(400).send({ message: "Payment is not valid" });
        }
    } catch (err) {
        console.log(err);
    }
});

Router.route('/new').post(async (req, res) => {
    try {
        const { amount, currency, receipt, payment_capture } = req.body;
        const options = {
            amount,
            currency,
            receipt,
            payment_capture
        };
        const response = await razorpay.orders.create(options);
        res.send(response);
    } catch (err) {
        console.log(err);
    }
});

Router.route('/').get(async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id });
        res.send(orders);
    } catch (err) {
        console.log(err);
    }
});

export default Router;