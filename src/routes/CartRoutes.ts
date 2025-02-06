import { Router } from "express";
import { addToCart, getCart, removeFromCart } from "../controllers/CartController";
import { UserAuth } from "../middlewares/auth";

export const CartRouter = Router();

CartRouter.post('/add', UserAuth, addToCart);
CartRouter.delete('/remove', UserAuth, removeFromCart);
CartRouter.get('/get-cart', UserAuth, getCart);