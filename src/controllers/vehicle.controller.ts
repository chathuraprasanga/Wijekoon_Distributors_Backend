import { IRequest, IResponse } from "../interfaces/dto";
import { sendResponse } from "../helpers/sendResponse";
import {
    createVehicleService,
    findAllVehicleService,
    findVehicleService,
    getPagedVehicleService,
    updateVehicleService,
} from "../services/vehicle.service";

export const createVehicleController = async (
    req: IRequest,
    res: IResponse
): Promise<any> => {
    try {
        const body = req.body;
        const response = await createVehicleService(body);
        return sendResponse(
            res,
            201,
            "Vehicle created success",
            response,
            null
        );
    } catch (error: any) {
        return sendResponse(
            res,
            500,
            "Vehicle created failed",
            null,
            error.message
        );
    }
};

export const updateVehicleController = async (
    req: IRequest,
    res: IResponse
): Promise<any> => {
    try {
        const body = req.body;
        const { id } = req.params;
        const response = await updateVehicleService(id, body);
        return sendResponse(
            res,
            200,
            "Vehicle updated success",
            response,
            null
        );
    } catch (error: any) {
        return sendResponse(
            res,
            500,
            "Vehicle update failed",
            null,
            error.message
        );
    }
};

export const getPagedVehicleController = async (
    req: IRequest,
    res: IResponse
): Promise<any> => {
    try {
        const body = req.body;
        const response = await getPagedVehicleService(body);
        return sendResponse(
            res,
            200,
            "Vehicles fetched success",
            response,
            null
        );
    } catch (error: any) {
        return sendResponse(
            res,
            500,
            "Vehicles fetched failed",
            null,
            error.message
        );
    }
};

export const getAllVehicleController = async (
    req: IRequest,
    res: IResponse
): Promise<any> => {
    try {
        const body = req.body;
        const response = await findAllVehicleService(body);
        return sendResponse(
            res,
            200,
            "Vehicles fetched success",
            response,
            null
        );
    } catch (error: any) {
        return sendResponse(
            res,
            500,
            "Vehicles fetched failed",
            null,
            error.message
        );
    }
};

export const getVehicleController = async (
    req: IRequest,
    res: IResponse
): Promise<any> => {
    try {
        const { id } = req.params;
        const response = await findVehicleService(id);
        return sendResponse(
            res,
            200,
            "Vehicle fetched success",
            response,
            null
        );
    } catch (error: any) {
        return sendResponse(
            res,
            500,
            "Vehicle fetched failed",
            null,
            error.message
        );
    }
};
