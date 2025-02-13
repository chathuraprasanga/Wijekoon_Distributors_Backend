import authMiddleware from "../middlewares/auth.middleware";
import { Router } from "express";
import {
    createWarehouseController,
    getAllWarehousesController, getPagedWarehousesController, getWarehouseController, updateStockController,
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
warehouseRoute.post("/paged-warehouses", authMiddleware, getPagedWarehousesController);
warehouseRoute.get("/warehouse/:id", authMiddleware, getWarehouseController);
warehouseRoute.put("/stock-update/:id", authMiddleware, updateStockController);

export default warehouseRoute;
