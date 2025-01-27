import { Warehouse } from "../models/warehouse.model";

export const createWarehouseRepo = (data: any) => {
    return new Warehouse(data).save();
};

export const updateWarehouseRepo = (filters: any, data: any) => {
    return Warehouse.findOneAndUpdate(filters, data, { new: true }).exec();
};

export const findWarehouseRepo = (filters: any) => {
    return Warehouse.findOne(filters).lean().exec();
};

export const findWarehousesRepo = (filters: any) => {
    return Warehouse.find(filters).exec();
};

export const aggregateWarehouseRepo = (pipeline: any) => {
    return Warehouse.aggregate(pipeline).exec();
};

export const getPagedWarehousesRepo = (
    matchFilter: any,
    pageSize: any,
    pageIndex: any,
    sort: any
) => {
    return Warehouse.find(matchFilter)
        .sort({ createdAt: sort })
        .limit(pageSize)
        .skip(pageSize * (pageIndex - 1))
        .exec();
};

export const countWarehouses = (filters: any) => {
    return Warehouse.countDocuments(filters).exec();
};
