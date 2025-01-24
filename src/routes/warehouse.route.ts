import authMiddleware from "../middlewares/auth.middleware";
import { Router } from "express";
import {
    createWarehouseController,
    getAllWarehousesController,
    warehouseStatusChangeController,
} from "../controllers/warehouse.controller";

const warehouseRoute = Router();

warehouseRoute.post("/warehouse", createWarehouseController);
warehouseRoute.put(
    "/change-status/:id",
    authMiddleware,
    warehouseStatusChangeController
);
warehouseRoute.post("/warehouses", authMiddleware, getAllWarehousesController);

export default warehouseRoute;
