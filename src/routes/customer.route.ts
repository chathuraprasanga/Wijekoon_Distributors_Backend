import { Router } from "express";
import {
    changeStatusCustomerController,
    createCustomerController,
    getAllCustomersController,
    getCustomerController,
    updateCustomerController,
} from "../controllers/customer.controller";
import authMiddleware from "../middlewares/auth.middleware";

const customerRoute = Router();

customerRoute.post("/customer", authMiddleware, createCustomerController);
customerRoute.post("/customers", authMiddleware, getAllCustomersController);
customerRoute.get("/customer/:id", authMiddleware, getCustomerController);
customerRoute.put("/customer/:id", authMiddleware, updateCustomerController);
customerRoute.put("/change-status/:id", authMiddleware, changeStatusCustomerController);

export default customerRoute;
