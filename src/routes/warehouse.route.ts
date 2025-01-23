import authMiddleware from "../middlewares/auth.middleware";
import { Router } from "express";
import { createWarehouseController, warehouseStatusChangeController } from "../controllers/warehouse.controller";

const warehouseRoute = Router();

warehouseRoute.post("/warehouse", createWarehouseController);
warehouseRoute.put("/change-status/:id", authMiddleware, warehouseStatusChangeController)

export default warehouseRoute;
