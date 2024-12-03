import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware";
import {
    createProductController,
    getAllProductsController, getProductController, updateProductController,
} from "../controllers/product.controller";

const productRoute = Router();

productRoute.post("/products", authMiddleware, getAllProductsController);
productRoute.post("/product", authMiddleware, createProductController);
productRoute.get("/product/:id", authMiddleware, getProductController);
productRoute.put("/product/:id", authMiddleware, updateProductController);

export default productRoute;
