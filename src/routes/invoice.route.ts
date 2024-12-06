import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware";
import {
    createInvoiceController,
    getAllInvoiceController,
    getInvoiceController,
    invoiceStatusChangeController,
    updateInvoiceController,
} from "../controllers/invoice.controller";


const invoiceRoute = Router();

invoiceRoute.post("/invoice", authMiddleware, createInvoiceController);
invoiceRoute.post("/invoices", authMiddleware, getAllInvoiceController);
invoiceRoute.get("/invoice/:id", authMiddleware, getInvoiceController);
invoiceRoute.put("/invoice/:id", authMiddleware, updateInvoiceController);
invoiceRoute.put("/change-status/:id", authMiddleware, invoiceStatusChangeController);

export default invoiceRoute;
