import {
    createWarehouseRepo,
    findWarehouseRepo, findWarehousesRepo,
    updateWarehouseRepo,
} from "../repositories/warehouse.repository";
import mongoose from "mongoose";

const ObjectId = mongoose.Types.ObjectId;

export const createWarehouseService = async (data: any) => {
    try {
        data.id = await generateWarehouseId();
        return await createWarehouseRepo(data);
    } catch (e: any) {
        console.error(e.message);
        throw e;
    }
};

const generateWarehouseId = async (): Promise<string> => {
    try {
        const lastWarehouse = await findWarehouseRepo({
            sort: { createdAt: -1 },
            limit: 1,
        });

        if (lastWarehouse?.id) {
            // Extract and increment the numerical part of the ID
            const idParts = lastWarehouse.id.split("-");
            if (idParts.length === 2 && !isNaN(Number(idParts[1]))) {
                const paymentIdNumber = parseInt(idParts[1], 10);
                const newPaymentIdNumber = paymentIdNumber + 1;
                return `W-${String(newPaymentIdNumber).padStart(4, "0")}`;
            } else {
                console.warn("Invalid warehouse ID format:", lastWarehouse.id);
            }
        }

        return "W-0001";
    } catch (e: any) {
        console.error("Error in generateWarehouseId:", e.message);
        throw e;
    }
};

export const updateWarehouseService = async (id: any, data: any) => {
    try {
        return await updateWarehouseRepo({ _id: new ObjectId(id) }, data);
    } catch (e: any) {
        console.error(e.message);
        throw e;
    }
};

export const findAllWarehouseService = async (data: any) => {
    try {
        const filters = data.filters;
        return await findWarehousesRepo(filters);
    } catch (e: any) {
        console.error(e.message);
        throw e;
    }
};

