import { Router } from "express";
import { loginService, signupController } from "../controllers/user.controller";

const userRoute = Router();

userRoute.post("/signup", signupController);
userRoute.post("/login", loginService)

export default userRoute;
