import { IRequest, IResponse } from "../interfaces/dto";
import { sendResponse } from "../helpers/sendResponse";
import errors from "../constants/errors";
import {
    createChequeService,
    findAllChequeService, getChequeByIdService, updateChequeService,
} from "../services/cheque.service";

export const createChequeController = async (
    req: IRequest,
    res: IResponse
): Promise<any> => {
    try {
        const body = req.body;
        const response = await createChequeService(body);
        return sendResponse(res, 201, "Cheque added successfully", response);
    } catch (error: any) {
        console.error(error.message);
        return sendResponse(
            res,
            500,
            errors.INTERNAL_SERVER_ERROR,
            null,
            error.message
        );
    }
};

export const getAllChequeController = async (
    req: IRequest,
    res: IResponse
): Promise<any> => {
    try {
        const response = await findAllChequeService();
        return sendResponse(res, 200, "Cheques fetched successfully", response);
    } catch (error: any) {
        console.log(error.message);
        return sendResponse(
            res,
            500,
            errors.INTERNAL_SERVER_ERROR,
            null,
            error.message
        );
    }
};

export const getChequeController = async (
    req: IRequest,
    res: IResponse
): Promise<any> => {
    try {
        const { id } = req.params;
        const response = await getChequeByIdService(id);
        return sendResponse(res, 200, "Cheque fetched successfully", response);
    } catch (error: any) {
        console.error(error.message);
        return sendResponse(
            res,
            500,
            errors.INTERNAL_SERVER_ERROR,
            null,
            error.message
        );
    }
};

export const updateChequeController = async (
    req: IRequest,
    res: IResponse
): Promise<any> => {
    try {
        const { id } = req.params;
        const body = req.body;
        const response = await updateChequeService(id, body);
        return sendResponse(res, 200, "Cheque updated successfully", response);
    } catch (error: any) {
        console.error(error.message);
        return sendResponse(
            res,
            500,
            errors.INTERNAL_SERVER_ERROR,
            null,
            error.message
        );
    }
};

export const chequeStatusChangeController = async(req: IRequest, res: IResponse): Promise<any> => {
    try {
        const { id } = req.params;
        const body = req.body;
        const response = await updateChequeService(id, body);
        return sendResponse(res, 200, "Cheque status changed successfully", response);
    }catch (error: any) {
        console.error(error.message);
        return sendResponse(
            res,
            500,
            errors.INTERNAL_SERVER_ERROR,
            null,
            error.message
        );
    }
}
