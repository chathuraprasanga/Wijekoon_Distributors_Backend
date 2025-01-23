import { Warehouse } from "../models/warehouse.model";

export const createWarehouseRepo = (data: any) => {
    return new Warehouse(data).save();
};

export const updateWarehouseRepo = (filters: any, data: any) => {
    return Warehouse.findOneAndUpdate(filters, data, { new: true }).exec();
};

export const findWarehouseRepo = (filters: any) => {
    return Warehouse.findOne(filters).exec();
};

export const findWarehousesRepo = (filters: any) => {
    return Warehouse.find(filters).exec();
};

export const aggregateWarehouseRepo = (pipeline: any) => {
    return Warehouse.aggregate(pipeline).exec();
};
