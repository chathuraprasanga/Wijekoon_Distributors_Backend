import { Router } from "express";
import userRoute from "./user.route";

const routes = Router();

routes.use("/users", userRoute);

export default routes;