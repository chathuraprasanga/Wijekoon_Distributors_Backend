import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware";
import {
    changeStatusSupplierController,
    createSupplierController, getPagedSuppliersController, getSupplierController,
    getSuppliersController, updateSupplierController,
} from "../controllers/supplier.controller";


const supplierRoute = Router();

supplierRoute.post("/supplier", authMiddleware([]), createSupplierController);
supplierRoute.post("/suppliers", authMiddleware([]), getSuppliersController);
supplierRoute.post("/paged-suppliers", authMiddleware([]), getPagedSuppliersController);
supplierRoute.get("/supplier/:id", authMiddleware([]), getSupplierController);
supplierRoute.put("/supplier/:id", authMiddleware([]), updateSupplierController);
supplierRoute.put("/change-status/:id", authMiddleware([]), changeStatusSupplierController);



export default supplierRoute;
