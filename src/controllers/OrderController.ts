// src/controllers/OrderController.ts
import { Request, Response } from 'express';
import { OrderModel } from '../models/Order';
import { UserModel } from '../models/User';

export const createOrder = async (req: Request, res: Response) => {
    try {
        // const userId = req.user?.userId;
        const userId = (req as any).user.userId; // Type assertion

        // Find the user and populate the cart
        const user = await UserModel.findById(userId).populate('cart.product');
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return
        }

        // Calculate the total amount
        const totalAmount = user.cart.reduce(
            (total, item) => total + (item.product as any).price * item.quantity,
            0
        );

        // Create the order
        const order = new OrderModel({
            user: userId,
            products: user.cart,
            totalAmount,
        });

        await order.save();

        // Clear the user's cart
        // user.cart = [];
        // await user.save();

        user.cart.splice(0, user.cart.length); // Clears the array while preserving DocumentArray type
        await user.save();


        res.status(201).json({ message: 'Order created successfully', order });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err });
    }
};


export const getOrderHistory = async (req: Request, res: Response) => {
    try {
        //   const userId = req.user?.userId;
        const userId = (req as any).user.userId; // Type assertion

        // Find all orders for the user
        const orders = await OrderModel.find({ user: userId }).populate('products.product');
        res.status(200).json({ orders });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err });
    }
};