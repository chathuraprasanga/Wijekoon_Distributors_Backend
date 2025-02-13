import { IRequest, IResponse } from "../interfaces/dto";
import { sendResponse } from "../helpers/sendResponse";
import {
    createWarehouseService,
    findAllWarehouseService, findWarehouseByIdService, getPagedWarehousesService,
    updateWarehouseService,
} from "../services/warehouse.service";
import { updateStockService } from "../services/warehouseProductMapping.service";

export const createWarehouseController = async (
    req: IRequest,
    res: IResponse
): Promise<any> => {
    try {
        const body = req.body;
        const response = await createWarehouseService(body);
        return sendResponse(
            res,
            201,
            "Warehouse created successfully",
            response
        );
    } catch (error: any) {
        return sendResponse(
            res,
            500,
            "Internal server error",
            null,
            error.message
        );
    }
};

export const warehouseStatusChangeController = async (
    req: IRequest,
    res: IResponse
): Promise<any> => {
    try {
        const id = req.params;
        const body = req.body;
        const response = await updateWarehouseService(id, body);
        return sendResponse(
            res,
            200,
            "Warehouse status changes successfully",
            response
        );
    } catch (error: any) {
        return sendResponse(
            res,
            500,
            "Internal server error",
            null,
            error.message
        );
    }
};

export const getAllWarehousesController = async (
    req: IRequest,
    res: IResponse
): Promise<any> => {
    try {
        const body = req.body;
        const response = await findAllWarehouseService(body);
        return sendResponse(
            res,
            200,
            "Fetch warehouses successfully",
            response
        );
    } catch (error: any) {
        return sendResponse(
            res,
            500,
            "Fetch warehouses failed",
            null,
            error.message
        );
    }
};

export const getPagedWarehousesController = async (
    req: IRequest,
    res: IResponse
): Promise<any> => {
    try {
        const body = req.body;
        const response = await getPagedWarehousesService(body);
        return sendResponse(
            res,
            200,
            "Warehouses fetched successfully",
            response,
            null
        );
    } catch (error: any) {
        console.error(error.message);
        return sendResponse(
            res,
            500,
            "Internal server error",
            null,
            error.message
        );
    }
};

export const getWarehouseController = async (
    req: IRequest,
    res: IResponse
): Promise<any> => {
    try {
        const { id } = req.params;
        const response = await findWarehouseByIdService(id);
        return sendResponse(
            res,
            200,
            "Warehouse fetched successfully",
            response,
            null
        );
    } catch (error: any) {
        console.error(error.message);
        return sendResponse(
            res,
            500,
            "Internal server error",
            null,
            error.message
        );
    }
};

export const updateStockController = async (
    req: IRequest,
    res: IResponse
): Promise<any> => {
    try {
        const { id } = req.params;
        const body = req.body;
        const response = await updateStockService(id, body);
        return sendResponse(
            res,
            200,
            "Warehouse stock updated successfully",
            response,
            null
        );
    } catch (error: any) {
        console.error(error.message);
        return sendResponse(
            res,
            500,
            "Internal server error",
            null,
            error.message
        );
    }
};


