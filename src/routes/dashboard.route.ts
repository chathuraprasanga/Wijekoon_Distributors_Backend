import { Router } from "express";
import { getDashboardDetails } from "../controllers/dashboard.controller";
import authMiddleware from "../middlewares/auth.middleware";


const dashboardRoute = Router();

dashboardRoute.post("/details", authMiddleware([]), getDashboardDetails);

export default dashboardRoute;