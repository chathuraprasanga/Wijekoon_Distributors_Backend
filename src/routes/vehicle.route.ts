import authMiddleware from "../middlewares/auth.middleware";
import { Router } from "express";
import { USER_ROLES } from "../constants/settings";
import {
    createVehicleController,
    getAllVehicleController,
    getPagedVehicleController,
    getVehicleController,
    updateVehicleController,
} from "../controllers/vehicle.controller";

const vehicleRoute = Router();

vehicleRoute.post(
    "/vehicle",
    authMiddleware([
        USER_ROLES.SUPER_ADMIN,
        USER_ROLES.OWNER,
        USER_ROLES.ADMIN,
    ]),
    createVehicleController
);
vehicleRoute.put(
    "/vehicle/:id",
    authMiddleware([
        USER_ROLES.SUPER_ADMIN,
        USER_ROLES.ADMIN,
        USER_ROLES.OWNER,
    ]),
    updateVehicleController
);
vehicleRoute.post("/vehicles", authMiddleware([]), getAllVehicleController);

vehicleRoute.post(
    "/paged-vehicles",
    authMiddleware([
        USER_ROLES.SUPER_ADMIN,
        USER_ROLES.ADMIN,
        USER_ROLES.OWNER,
        USER_ROLES.WAREHOUSE_MANAGER,
        USER_ROLES.STOCK_KEEPER,
        USER_ROLES.SALES_MANAGER,
    ]),
    getPagedVehicleController
);

vehicleRoute.get(
    "/vehicle/:id",
    authMiddleware([
        USER_ROLES.SUPER_ADMIN,
        USER_ROLES.ADMIN,
        USER_ROLES.OWNER,
        USER_ROLES.WAREHOUSE_MANAGER,
        USER_ROLES.STOCK_KEEPER,
        USER_ROLES.SALES_MANAGER,
    ]),
    getVehicleController
);

export default vehicleRoute;
