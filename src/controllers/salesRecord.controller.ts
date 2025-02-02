import { sendResponse } from "../helpers/sendResponse";
import {
    changeStatusSalesRecordService,
    createSalesRecordService,
    findSalesRecordByIdService, findSalesRecordsService,
    getPagedSalesRecordsService,
    updateSalesRecordService,
} from "../services/salesRecord.service";
import { IRequest, IResponse } from "../interfaces/dto";
import errors from "../constants/errors";

export const createSalesRecordController = async (
    req: IRequest,
    res: IResponse
): Promise<any> => {
    try {
        const body = req.body;
        const response = await createSalesRecordService(body);
        return sendResponse(res, 201, "Sales record added successfully", response);
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

export const getSalesRecordsController = async (
    req: IRequest,
    res: IResponse
): Promise<any> => {
    try {
        const body = req.body;
        const response = await findSalesRecordsService(body);
        return sendResponse(
            res,
            200,
            "Sales records fetched successfully",
            response
        );
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

export const getSalesRecordController = async (
    req: IRequest,
    res: IResponse
): Promise<any> => {
    try {
        const { id } = req.params;
        const response = await findSalesRecordByIdService(id);
        return sendResponse(
            res,
            200,
            "Sales record fetched successfully",
            response
        );
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

export const updateSalesRecordController = async (
    req: IRequest,
    res: IResponse
): Promise<any> => {
    try {
        const { id } = req.params;
        const body = req.body;
        const response = await updateSalesRecordService(id, body);
        return sendResponse(
            res,
            200,
            "Sales record updated successfully",
            response
        );
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

export const changeStatusSalesRecordController = async (
    req: IRequest,
    res: IResponse
): Promise<any> => {
    try {
        const { id } = req.params;
        const body = req.body;
        const response = await changeStatusSalesRecordService(id, body);
        return sendResponse(
            res,
            200,
            "Sales record status changed successfully",
            response
        );
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

export const getPagedSalesRecordsController = async (
    req: IRequest,
    res: IResponse
): Promise<any> => {
    try {
        const body = req.body;
        const response = await getPagedSalesRecordsService(body);
        return sendResponse(
            res,
            200,
            "Sales records fetched successfully",
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
