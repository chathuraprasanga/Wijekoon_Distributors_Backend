import { Router } from "express";
import {
    bankDetailStatusChangeController,
    createBankAccountController,
    getAllBankAccountsController,
} from "../controllers/bankAccount.controller";
import authMiddleware from "../middlewares/auth.middleware";

const bankDetailRoute = Router();

bankDetailRoute.post(
    "/bank-details",
    authMiddleware([]),
    getAllBankAccountsController
);
bankDetailRoute.post(
    "/bank-detail",
    authMiddleware([]),
    createBankAccountController
);
bankDetailRoute.put(
    "/change-status/:id",
    authMiddleware([]),
    bankDetailStatusChangeController
);

export default bankDetailRoute;
