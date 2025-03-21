import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware";
import {
    chequePaymentStatusChangeController,
    createChequePaymentController,
    getAllChequePaymentsController,
    getAllSystemPayeesController,
    getChequePaymentController,
    getPagedChequePaymentsController,
    updateChequePaymentController,
} from "../controllers/chequePayment.controller";

const chequePaymentRoute = Router();
chequePaymentRoute.post(
    "/cheque-payment",
    authMiddleware([]),
    createChequePaymentController
);
chequePaymentRoute.post(
    "/cheque-payments",
    authMiddleware([]),
    getAllChequePaymentsController
);
chequePaymentRoute.post(
    "/paged-cheque-payments",
    authMiddleware([]),
    getPagedChequePaymentsController
);
chequePaymentRoute.get(
    "/cheque-payment/:id",
    authMiddleware([]),
    getChequePaymentController
);
chequePaymentRoute.put(
    "/cheque-payment/:id",
    authMiddleware([]),
    updateChequePaymentController
);
chequePaymentRoute.put(
    "/change-status/:id",
    authMiddleware([]),
    chequePaymentStatusChangeController
);
chequePaymentRoute.get(
    "/system-payees",
    authMiddleware([]),
    getAllSystemPayeesController
);

export default chequePaymentRoute;
