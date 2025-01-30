import { findProductsRepo } from "../repositories/product.repository";
import {
    createWarehouseProductMappingRepo,
    findWarehouseProductMapping, updateWarehouseProductMapping,
} from "../repositories/warehouseProductMapping.repository";
import { findWarehousesRepo } from "../repositories/warehouse.repository";

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

        const productMappingPromise = data.map(async (prod:any) => {
            const productMapping = await findWarehouseProductMapping({ _id: prod.id });

            if (!productMapping) {
                throw new Error(`Product mapping not found for ID: ${prod.id}`);
            }

            productMapping.count += prod.amount;

            const response = await updateWarehouseProductMapping(
                { _id: prod.id },
                { count: productMapping.count }
            );

            return response;
        });
        masterResponse = await Promise.all(productMappingPromise);

        return masterResponse;
    } catch (e: any) {
        console.error("Stock Update Error:", e.message);
        throw e;
    }
};

