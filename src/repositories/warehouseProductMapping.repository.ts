import { WarehouseProductMapping } from "../models/warehouseProductMapping.model";

export const createWarehouseProductMappingRepo = (data: any) => {
    return new WarehouseProductMapping(data).save();
};

export const findWarehouseProductMappings = (filters: any) => {
    return WarehouseProductMapping.find(filters).populate("product").exec();
};

export const findWarehouseProductMapping = (filters: any) => {
    return WarehouseProductMapping.findOne(filters).populate("product").exec();
};

export const updateWarehouseProductMapping = (
    filters: any,
    updateData: any
) => {
    return WarehouseProductMapping.findOneAndUpdate(filters, updateData, {
        new: true,
    })
        .populate("product")
        .exec();
};
