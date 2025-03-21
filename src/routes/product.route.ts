import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware";
import {
    changeStatusProductController,
    createProductController,
    getAllProductsController, getPagedProductsController, getProductController, updateProductController,
} from "../controllers/product.controller";

const productRoute = Router();

productRoute.post("/products", authMiddleware([]), getAllProductsController);
productRoute.post("/paged-products", authMiddleware([]), getPagedProductsController);
productRoute.post("/product", authMiddleware([]), createProductController);
productRoute.get("/product/:id", authMiddleware([]), getProductController);
productRoute.put("/product/:id", authMiddleware([]), updateProductController);
productRoute.put("/change-status/:id", authMiddleware([]), changeStatusProductController);



export default productRoute;
