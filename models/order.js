import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    paymentsId: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'failed', 'placed', 'completed', 'rejected'],
        default: 'pending'
    },
    cart: [],
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);

export default Order;