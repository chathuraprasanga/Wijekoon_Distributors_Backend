import { WarehouseProductMapping } from "../models/warehouseProductMapping.model";

export const createWarehouseProductMappingRepo = (data: any) => {
    return new WarehouseProductMapping(data).save();
};

export const findWarehouseProductMappings = (filters: any) => {
    return WarehouseProductMapping.find(filters).populate("product").exec();
};
