import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware";
import {
    chequeStatusChangeController,
    createChequeController,
    getAllChequeController, getChequeController, getPagedChequesController, updateChequeController,
} from "../controllers/cheque.controller";

const chequeRoute = Router();

chequeRoute.post("/cheque", authMiddleware, createChequeController);
chequeRoute.post("/cheques", authMiddleware, getAllChequeController);
chequeRoute.post("/paged-cheques", authMiddleware, getPagedChequesController);
chequeRoute.get("/cheque/:id", authMiddleware, getChequeController);
chequeRoute.put("/cheque/:id", authMiddleware, updateChequeController);
chequeRoute.put("/change-status/:id", authMiddleware, chequeStatusChangeController);

export default chequeRoute;
