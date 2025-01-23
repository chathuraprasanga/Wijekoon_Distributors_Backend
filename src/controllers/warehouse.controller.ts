import { IRequest, IResponse } from "../interfaces/dto";
import { sendResponse } from "../helpers/sendResponse";
import {
    createWarehouseService,
    updateWarehouseService,
} from "../services/warehouse.service";

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
