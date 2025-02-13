import { Router } from "express";
import {
    changePasswordController,
    confirmLoginController, getAllUsersController,
    loginService,
    signupController, tokenRefreshController, userStatusChangeController,
} from "../controllers/user.controller";
import authMiddleware from "../middlewares/auth.middleware";

const userRoute = Router();

userRoute.post("/signup", signupController);
userRoute.post("/login", loginService);
userRoute.get("/confirm-login", authMiddleware, confirmLoginController);
userRoute.post("/token-refresh", tokenRefreshController);
userRoute.post("/change-password",authMiddleware, changePasswordController);
userRoute.post("/users",authMiddleware, getAllUsersController);
userRoute.put("/change-status/:id", authMiddleware, userStatusChangeController)

export default userRoute;
