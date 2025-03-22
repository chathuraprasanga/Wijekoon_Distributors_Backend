import { Router } from "express";
import {
    bankDetailStatusChangeController,
    createBankAccountController,
    getAllBankAccountsController,
} from "../controllers/bankAccount.controller";
import authMiddleware from "../middlewares/auth.middleware";
import { USER_ROLES } from "../constants/settings";

const bankDetailRoute = Router();

bankDetailRoute.post(
    "/bank-details",
    authMiddleware([USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN, USER_ROLES.OWNER]),
    getAllBankAccountsController
);
bankDetailRoute.post(
    "/bank-detail",
    authMiddleware([USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN, USER_ROLES.OWNER]),
    createBankAccountController
);
bankDetailRoute.put(
    "/change-status/:id",
    authMiddleware([USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN, USER_ROLES.OWNER]),
    bankDetailStatusChangeController
);

export default bankDetailRoute;
