import { Router } from "express";
import { createOrder, getOrderHistory } from "../controllers/OrderController";
import { UserAuth } from "../middlewares/auth";

export const OrderRouter = Router();

OrderRouter.post('/create', UserAuth, createOrder);
OrderRouter.get('/get-order', UserAuth, getOrderHistory);