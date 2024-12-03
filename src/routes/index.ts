import { Router } from "express";
import userRoute from "./user.route";
import customerRoute from "./customer.route";
import productRoute from "./product.route";

const routes = Router();

routes.use("/users", userRoute);
routes.use("/customers", customerRoute);
routes.use("/products", productRoute)

export default routes;