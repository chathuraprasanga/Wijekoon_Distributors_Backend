import { findProductsRepo } from "../repositories/product.repository";
import {
    createWarehouseProductMappingRepo,
    findWarehouseProductMapping,
    findWarehouseProductMappings,
    updateWarehouseProductMapping,
} from "../repositories/warehouseProductMapping.repository";
import { findWarehousesRepo } from "../repositories/warehouse.repository";
import mongoose from "mongoose";

const ObjectId = mongoose.Types.ObjectId;

export const warehouseProductMappingCreateService = async (warehouse: any) => {
    try {
        const products = await findProductsRepo({ status: true });

        const mappingPromises = products.map((product: any) => {
            const data = { warehouse: warehouse._id, product: product._id };
            return createWarehouseProductMappingRepo(data);
        });

        return await Promise.all(mappingPromises);
    } catch (e: any) {
        console.error(e.message);
        throw e;
    }
};

export const warehouseNewProductMappingCreateService = async (product: any) => {
    try {
        const warehouses = await findWarehousesRepo({ status: true });

        const mappingPromises = warehouses.map((w: any) => {
            const data = { warehouse: w._id, product: product._id };
            return createWarehouseProductMappingRepo(data);
        });

        return await Promise.all(mappingPromises);
    } catch (e: any) {
        console.error(e.message);
        throw e;
    }
};

export const updateStockService = async (id: any, data: any) => {
    try {
        let masterResponse: any[] = [];

        const productMappingPromise = data?.data?.map(async (prod: any) => {
            const productMapping = await findWarehouseProductMapping({
                _id: prod.id,
            });

            if (!productMapping) {
                throw new Error(`Product mapping not found for ID: ${prod.id}`);
            }

            if (data.type === "increment") {
                productMapping.count += prod.amount;
            } else {
                productMapping.count -= prod.amount;
            }

            return await updateWarehouseProductMapping(
                { _id: prod.id },
                { count: productMapping.count }
            );
        });
        masterResponse = await Promise.all(productMappingPromise);

        return masterResponse;
    } catch (e: any) {
        console.error("Stock Update Error:", e.message);
        throw e;
    }
};

export const changeWarehouseStockBySales = async (data: any) => {
    try {
        const { products, warehouseId } = data;

        const mappedProducts = await findWarehouseProductMappings({
            warehouse: new ObjectId(warehouseId),
        });

        if (!mappedProducts || mappedProducts.length === 0) {
            console.warn("No products found in warehouse.");
            return [];
        }

        if (!products || products.length === 0) {
            console.warn("No products provided for stock update.");
            return [];
        }

        const updatedProducts = mappedProducts.map((p: any) => {
            const productObj = p.toObject ? p.toObject() : { ...p };

            const soldProduct = products.find((prod: any) => {
                return productObj._id.toString() === prod.product.mappingId; // Fix: Remove extra `.product`
            });

            if (soldProduct) {
                const newCount = (productObj.count || 0) - soldProduct.amount;

                if (newCount < 0) {
                    console.warn(
                        `⚠️ Negative stock detected for ${productObj._id.toString()} - Setting count to 0.`
                    );
                    return { ...productObj, count: 0 };
                }

                return { ...productObj, count: newCount };
            }

            return productObj;
        });

        for (const updatedProduct of updatedProducts) {
            await updateWarehouseProductMapping(updatedProduct._id, {
                count: updatedProduct.count,
            });
        }

        return updatedProducts;
    } catch (e: any) {
        console.error("Error in changeWarehouseStockBySales:", e.message);
        throw e;
    }
};
