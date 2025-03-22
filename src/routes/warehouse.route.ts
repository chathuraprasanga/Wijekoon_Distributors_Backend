import authMiddleware from "../middlewares/auth.middleware";
import { Router } from "express";
import {
    createWarehouseController,
    getAllWarehousesController,
    getPagedWarehousesController,
    getWarehouseController,
    updateStockController,
    warehouseStatusChangeController,
} from "../controllers/warehouse.controller";
import { USER_ROLES } from "../constants/settings";

const warehouseRoute = Router();

warehouseRoute.post(
    "/warehouse",
    authMiddleware([
        USER_ROLES.SUPER_ADMIN,
        USER_ROLES.OWNER,
        USER_ROLES.ADMIN,
    ]),
    createWarehouseController
);
warehouseRoute.put(
    "/change-status/:id",
    authMiddleware([
        USER_ROLES.SUPER_ADMIN,
        USER_ROLES.ADMIN,
        USER_ROLES.OWNER,
    ]),
    warehouseStatusChangeController
);
warehouseRoute.post(
    "/warehouses",
    authMiddleware([]),
    getAllWarehousesController
);
warehouseRoute.post(
    "/paged-warehouses",
    authMiddleware([
        USER_ROLES.SUPER_ADMIN,
        USER_ROLES.ADMIN,
        USER_ROLES.OWNER,
        USER_ROLES.WAREHOUSE_MANAGER,
        USER_ROLES.STOCK_KEEPER,
        USER_ROLES.SALES_MANAGER,
    ]),
    getPagedWarehousesController
);
warehouseRoute.get(
    "/warehouse/:id",
    authMiddleware([
        USER_ROLES.SUPER_ADMIN,
        USER_ROLES.ADMIN,
        USER_ROLES.OWNER,
        USER_ROLES.WAREHOUSE_MANAGER,
        USER_ROLES.STOCK_KEEPER,
        USER_ROLES.SALES_MANAGER,
    ]),
    getWarehouseController
);
warehouseRoute.put(
    "/stock-update/:id",
    authMiddleware([
        USER_ROLES.SUPER_ADMIN,
        USER_ROLES.ADMIN,
        USER_ROLES.OWNER,
        USER_ROLES.WAREHOUSE_MANAGER,
        USER_ROLES.STOCK_KEEPER,
    ]),
    updateStockController
);

export default warehouseRoute;
