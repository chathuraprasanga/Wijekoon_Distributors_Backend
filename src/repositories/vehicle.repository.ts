import { Vehicle } from "../models/vehicle.model";

export const createVehicleRepo = (data: any) => {
    return new Vehicle(data).save();
};

export const updateVehicleRepo = (filters: any, data: any) => {
    return Vehicle.findOneAndUpdate(filters, data, { new: true }).exec();
};

export const findVehicleRepo = (filters: any) => {
    return Vehicle.findOne(filters).exec();
};

export const findAllVehicleRepo = (filters: any) => {
    return Vehicle.find(filters).exec();
};

export const aggregateVehicleRepo = (pipeline: any) => {
    return Vehicle.aggregate(pipeline).exec();
};

export const getPagedVehiclesRepo = (
    matchFilter: any,
    pageSize: any,
    pageIndex: any,
    sort: any
) => {
    return Vehicle.find(matchFilter)
        .sort({ createdAt: sort })
        .limit(pageSize)
        .skip(pageSize * (pageIndex - 1))
        .exec();
};

export const countVehicleRepo = (filters: any) => {
    return Vehicle.countDocuments(filters).exec();
};
