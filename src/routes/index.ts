import { Router } from "express";
import userRoute from "./user.route";
import customerRoute from "./customer.route";

const routes = Router();

routes.use("/users", userRoute);
routes.use("/customers", customerRoute);

export default routes;