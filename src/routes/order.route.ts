import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware";
import {
    changeStatusOrderController,
    createOrderController,
    getOrderController,
    getOrdersController,
    getPagedOrdersController, updateOrderController,
} from "../controllers/order.controller";

const orderRoute = Router();

orderRoute.post("/order", authMiddleware, createOrderController);
orderRoute.post("/orders", authMiddleware, getOrdersController);
orderRoute.post("/paged-orders", authMiddleware, getPagedOrdersController);
orderRoute.get("/order/:id", authMiddleware, getOrderController);
orderRoute.put("/order/:id", authMiddleware, updateOrderController);
orderRoute.put("/change-status/:id", authMiddleware, changeStatusOrderController);

export default orderRoute;