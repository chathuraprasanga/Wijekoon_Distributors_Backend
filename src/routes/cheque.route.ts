import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware";
import {
    chequeStatusChangeController,
    createChequeController,
    getAllChequeController, getChequeController, updateChequeController,
} from "../controllers/cheque.controller";

const chequeRoute = Router();

chequeRoute.post("/cheque", authMiddleware, createChequeController);
chequeRoute.post("/cheques", authMiddleware, getAllChequeController);
chequeRoute.get("/cheque/:id", authMiddleware, getChequeController);
chequeRoute.put("/cheque/:id", authMiddleware, updateChequeController);
chequeRoute.put("/change-status/:id", authMiddleware, chequeStatusChangeController);

export default chequeRoute;
