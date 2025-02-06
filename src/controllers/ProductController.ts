// src/controllers/ProductController.ts
import { Request, Response } from 'express';
import { ProductModel } from '../models/Product';

// Get all products
export const getProducts = async (req: Request, res: Response) => {
    try {
        const products = await ProductModel.find();
        res.json(products);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err });
    }
};

// Get a single product by ID
export const getProductById = async (req: Request, res: Response) => {
    try {
        const product = await ProductModel.findById(req.params.id);
        if (!product) {
            res.status(404).json({ message: 'Product Not Available' });
            return  
        }
        res.json(product);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err });
    }
};

// Create a new product
export const createProduct = async (req: Request, res: Response) => {
    try {
        const product = new ProductModel(req.body);
        await product.save();
        res.status(201).json(product);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err });
    }
};