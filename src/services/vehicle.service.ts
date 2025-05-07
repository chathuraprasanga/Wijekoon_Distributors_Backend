import {
    countVehicleRepo,
    createVehicleRepo,
    findAllVehicleRepo,
    findVehicleRepo,
    getPagedVehiclesRepo,
    updateVehicleRepo,
} from "../repositories/vehicle.repository";
import errors from "../constants/errors";
import mongoose from "mongoose";

const ObjectId = mongoose.Types.ObjectId;

export const createVehicleService = async (data: any) => {
    try {
        const existingVehicle = await findVehicleRepo({ number: data.number });
        if (existingVehicle) {
            throw new Error(errors.VEHICLE_ALREADY_EXISTS);
        }
        return createVehicleRepo(data);
    } catch (e) {
        console.error(e);
        throw e;
    }
};

export const updateVehicleService = async (id: string, data: any) => {
    try {
        const existingVehicle = await findVehicleRepo({ number: data.number });
        if (existingVehicle && JSON.stringify(existingVehicle._id) !== id) {
            throw new Error(errors.VEHICLE_ALREADY_EXISTS);
        }
        return updateVehicleRepo({ _id: new ObjectId(id) }, data);
    } catch (e) {
        console.error(e);
        throw e;
    }
};

export const getPagedVehicleService = async (data: any) => {
    try {
        const filters = data.filters;
        const { searchQuery, pageSize, pageIndex, sort, status, type } =
            filters;
        const matchFilter: any = { $and: [] };

        if (searchQuery) {
            matchFilter.$or = [
                { number: { $regex: searchQuery, $options: "i" } },
                { brand: { $regex: searchQuery, $options: "i" } },
            ];
        }

        if (type) {
            matchFilter.$and.push({ type: type });
        }

        if (status) {
            matchFilter.$and.push({ status: status === "ACTIVE" });
        }

        const response = await getPagedVehiclesRepo(
            matchFilter,
            pageSize,
            pageIndex,
            sort
        );
        const documentCount = await countVehicleRepo(matchFilter);
        return {
            response,
            metadata: { total: documentCount, pageIndex },
        };
    } catch (e: any) {
        console.error(e.message);
        throw e;
    }
};

export const findAllVehicleService = async (data: any) => {
    try {
        const filters = data.filters;
        return await findAllVehicleRepo(filters);
    } catch (e: any) {
        console.error(e.message);
        throw e;
    }
};

export const findVehicleService = async (id: string) => {
    try {
        return await findVehicleRepo({ _id: new ObjectId(id) });
    } catch (e: any) {
        console.error(e.message);
        throw e;
    }
};
