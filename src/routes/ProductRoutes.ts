import { Router } from "express";
import { createProduct, getProductById, getProducts } from "../controllers/ProductController";


export const ProductRouter = Router();

ProductRouter.get('/get-all' , getProducts);
ProductRouter.get('/:id' , getProductById);
ProductRouter.post('/add-product' , createProduct);