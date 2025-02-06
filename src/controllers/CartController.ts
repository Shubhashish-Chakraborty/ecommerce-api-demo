// src/controllers/CartController.ts
import { Request, Response } from 'express';
import { UserModel } from '../models/User';
import { ProductModel } from '../models/Product';
import mongoose from 'mongoose';

export const addToCart = async (req: Request, res: Response) => {
    try {
        const { productId, quantity } = req.body;
        // const userId = req.user?.userId;
        const userId = (req as any).user.userId; // Type assertion


        // Find the user
        const user = await UserModel.findById(userId);
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return
        }

        // Find the product
        const product = await ProductModel.findById(productId);
        if (!product) {
            res.status(404).json({ message: 'Product not found' });
            return
        }

        // Check if the product is already in the cart
        const cartItem = user.cart.find((item: any) => item.product.toString() === productId);
        if (cartItem) {
            cartItem.quantity += quantity; // Update quantity if already in cart
        } else {
            user.cart.push({ product: productId, quantity }); // Add new item to cart
        }

        await user.save();
        res.status(200).json({ message: 'Product added to cart', cart: user.cart });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err });
    }
};

export const getCart = async (req: Request, res: Response) => {
    try {
        //   const userId = req.user?.userId;
        const userId = (req as any).user.userId; // Type assertion

        // Find the user and populate the cart items
        const user = await UserModel.findById(userId).populate('cart.product');
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return
        }

        res.status(200).json({ cart: user.cart });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err });
    }
};

export const removeFromCart = async (req: Request, res: Response) => {
    try {
        const { productId } = req.body;
        //   const userId = req.user?.userId;
        const userId = (req as any).user.userId; // Type assertion


        // Find the user
        const user = await UserModel.findById(userId);
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return
        }

        // Remove the product from the cart
        // user.cart = user.cart.filter((item: any) => item.product.toString() !== productId);
        // await user.save();

        user.cart = new mongoose.Types.DocumentArray(
            user.cart.filter((item: any) => item.product?.toString() !== productId)
        );
        await user.save();

        res.status(200).json({ message: 'Product removed from cart', cart: user.cart });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err });
    }
};