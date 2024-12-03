import { Router } from "express";
import {
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

export default customerRoute;
