import { Router } from "express";
import {
    confirmLoginController,
    loginService,
    signupController, tokenRefreshController,
} from "../controllers/user.controller";
import authMiddleware from "../middlewares/auth.middleware";

const userRoute = Router();

userRoute.post("/signup", signupController);
userRoute.post("/login", loginService);
userRoute.get("/confirm-login", authMiddleware, confirmLoginController);
userRoute.post("/token-refresh", tokenRefreshController);

export default userRoute;
