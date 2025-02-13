import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware";
import {
    changeStatusSalesRecordController,
    createSalesRecordController,
    getPagedSalesRecordsController,
    getSalesRecordController,
    getSalesRecordsController,
    updateSalesRecordController,
} from "../controllers/salesRecord.controller";

const salesRecordRoute = Router();

salesRecordRoute.post("/sales-record", authMiddleware, createSalesRecordController);
salesRecordRoute.post("/sales-records", authMiddleware, getSalesRecordsController);
salesRecordRoute.post("/paged-sales-records", authMiddleware, getPagedSalesRecordsController);
salesRecordRoute.get("/sales-record/:id", authMiddleware, getSalesRecordController);
salesRecordRoute.put("/sales-record/:id", authMiddleware, updateSalesRecordController);
salesRecordRoute.put("/change-status/:id", authMiddleware, changeStatusSalesRecordController);

export default salesRecordRoute;
