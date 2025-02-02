import {
    countWarehouses,
    createWarehouseRepo, findLastWarehouseRepo,
    findWarehouseRepo,
    findWarehousesRepo,
    getPagedWarehousesRepo,
    updateWarehouseRepo,
} from "../repositories/warehouse.repository";
import mongoose from "mongoose";
import { warehouseProductMappingCreateService } from "./warehouseProductMapping.service";
import { findWarehouseProductMappings } from "../repositories/warehouseProductMapping.repository";

const ObjectId = mongoose.Types.ObjectId;

export const createWarehouseService = async (data: any) => {
    try {
        const existWarehouse = await findWarehouseRepo({ city: data.city });
        if (existWarehouse) {
            throw new Error("Warehouse already exists");
        }
        data.id = await generateWarehouseId();
        const warehouse = await createWarehouseRepo(data);
        const warehouseProductMapping =
            await warehouseProductMappingCreateService(warehouse);
        const plainWarehouse = warehouse.toObject();
        return { ...plainWarehouse, products: warehouseProductMapping };
    } catch (e: any) {
        console.error(e.message);
        throw e;
    }
};

const generateWarehouseId = async (): Promise<string> => {
    try {
        const lastWarehouse:any = await findLastWarehouseRepo();

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

export const getPagedWarehousesService = async (data: any) => {
    try {
        const filters = data.filters;
        const { searchQuery, pageSize, pageIndex, sort, status } = filters;
        const matchFilter: any = { $and: [] };

        if (searchQuery) {
            matchFilter.$or = [
                { city: { $regex: searchQuery, $options: "i" } },
                { id: { $regex: searchQuery, $options: "i" } },
            ];
        }

        if (status) {
            matchFilter.$and.push({ status: status !== "INACTIVE" });
        }

        const response = await getPagedWarehousesRepo(
            matchFilter,
            pageSize,
            pageIndex,
            sort
        );
        const documentCount = await countWarehouses(matchFilter);
        return {
            response,
            metadata: { total: documentCount, pageIndex },
        };
    } catch (e: any) {
        console.error(e.message);
        throw e;
    }
};

export const findWarehouseByIdService = async (id: string) => {
    try {
        const warehouse = await findWarehouseRepo({ _id: new ObjectId(id) });
        const warehouseProductMappings = await findWarehouseProductMappings({
            warehouse: new ObjectId(id),
        });
        return { ...warehouse, products: warehouseProductMappings };
    } catch (e: any) {
        console.error(e.message);
        throw e;
    }
};
