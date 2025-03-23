import { Router } from "express";
import {
    changePasswordController,
    confirmLoginController, getAllUsersController,
    loginService,
    signupController, tokenRefreshController, userStatusChangeController,
} from "../controllers/user.controller";
import authMiddleware from "../middlewares/auth.middleware";
import { USER_ROLES } from "../constants/settings";

const userRoute = Router();

userRoute.post("/signup",authMiddleware([USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN, USER_ROLES.OWNER]), signupController);
userRoute.post("/super-admin-register", signupController);
userRoute.post("/login", loginService);
userRoute.get("/confirm-login", authMiddleware([]), confirmLoginController);
userRoute.post("/token-refresh", tokenRefreshController);
userRoute.post("/change-password",authMiddleware([]), changePasswordController);
userRoute.post("/users",authMiddleware([USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN]), getAllUsersController);
userRoute.put("/change-status/:id", authMiddleware([USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN, USER_ROLES.OWNER]), userStatusChangeController)

export default userRoute;
