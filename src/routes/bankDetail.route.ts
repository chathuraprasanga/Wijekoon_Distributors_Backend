import { Router } from "express";
import {
    createBankAccountController,
    getAllBankAccountsController,
} from "../controllers/bankAccount.controller";
import authMiddleware from "../middlewares/auth.middleware";

const bankDetailRoute = Router();

bankDetailRoute.post(
    "/bank-details",
    authMiddleware,
    getAllBankAccountsController
);bankDetailRoute.post(
    "/bank-detail",
    authMiddleware,
    createBankAccountController
);

export default bankDetailRoute;
