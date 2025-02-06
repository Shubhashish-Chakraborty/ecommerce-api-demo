import { Router } from "express";
import { getUserData, LogIn, SignUp,  } from "../controllers/UserController";
import { auth } from "../middlewares/auth";

export const UserRouter = Router();

UserRouter.post("/signup" , SignUp);
UserRouter.post("/login" , LogIn);
UserRouter.get("/me" , auth , getUserData);