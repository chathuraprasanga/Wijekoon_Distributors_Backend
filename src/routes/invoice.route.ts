import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware";
import {
    createBulkInvoicePaymentController,
    createInvoiceController,
    getAllInvoiceController,
    getBulkInvoicePaymentController,
    getInvoiceController,
    getPagedBulkInvoicePaymentsController,
    getPagedInvoicesController,
    invoiceStatusChangeController,
    updateInvoiceController,
} from "../controllers/invoice.controller";

const invoiceRoute = Router();

invoiceRoute.post("/invoice", authMiddleware, createInvoiceController);
invoiceRoute.post("/invoices", authMiddleware, getAllInvoiceController);
invoiceRoute.post(
    "/paged-invoices",
    authMiddleware,
    getPagedInvoicesController
);
invoiceRoute.get("/invoice/:id", authMiddleware, getInvoiceController);
invoiceRoute.put("/invoice/:id", authMiddleware, updateInvoiceController);
invoiceRoute.put(
    "/change-status/:id",
    authMiddleware,
    invoiceStatusChangeController
);
invoiceRoute.post(
    "/bulk-invoice-payment",
    authMiddleware,
    createBulkInvoicePaymentController
);
invoiceRoute.post(
    "/paged-bulk-invoice-payments",
    authMiddleware,
    getPagedBulkInvoicePaymentsController
);
invoiceRoute.get(
    "/bulk-invoice-payment/:id",
    authMiddleware,
    getBulkInvoicePaymentController
);

export default invoiceRoute;
