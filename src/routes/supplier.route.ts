import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware";
import {
    changeStatusSupplierController,
    createSupplierController, getSupplierController,
    getSuppliersController, updateSupplierController,
} from "../controllers/supplier.controller";

const supplierRoute = Router();

supplierRoute.post("/supplier", authMiddleware, createSupplierController);
supplierRoute.post("/suppliers", authMiddleware, getSuppliersController);
supplierRoute.get("/supplier/:id", authMiddleware, getSupplierController);
supplierRoute.put("/supplier/:id", authMiddleware, updateSupplierController);
supplierRoute.put("/change-status/:id", authMiddleware, changeStatusSupplierController);


export default supplierRoute;
