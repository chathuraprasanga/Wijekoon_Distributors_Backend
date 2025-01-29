import { findProductsRepo } from "../repositories/product.repository";
import { createWarehouseProductMappingRepo } from "../repositories/warehouseProductMapping.repository";
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
