import { Router } from "express";
import { getDashboardDetails } from "../controllers/dashboard.controller";


const dashboardRoute = Router();

dashboardRoute.post("/details", getDashboardDetails);

export default dashboardRoute;