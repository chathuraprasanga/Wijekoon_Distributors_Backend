import { IRequest, IResponse } from "../interfaces/dto";
import { sendResponse } from "../helpers/sendResponse";
import errors from "../constants/errors";
import {
    changeStatusChequePaymentService,
    createChequePaymentService,
    findAllChequePaymentsService, findAllSystemPayeesService,
    getChequePaymentByIdService,
    getPagedChequePaymentsService,
    updateChequePaymentService,
} from "../services/chequePayment.service";

export const createChequePaymentController = async (
    req: IRequest,
    res: IResponse
): Promise<any> => {
    try {
        const body = req.body;
        const response = await createChequePaymentService(body);
        return sendResponse(
            res,
            201,
            "Cheque payment added successfully",
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

export const getAllChequePaymentsController = async (
    req: IRequest,
    res: IResponse
): Promise<any> => {
    try {
        const response = await findAllChequePaymentsService({});
        return sendResponse(
            res,
            200,
            "Cheque payments fetched successfully",
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

export const getChequePaymentController = async (
    req: IRequest,
    res: IResponse
): Promise<any> => {
    try {
        const { id } = req.params;
        const response = await getChequePaymentByIdService(id);
        return sendResponse(
            res,
            200,
            "Cheque payment fetched successfully",
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

export const updateChequePaymentController = async (
    req: IRequest,
    res: IResponse
): Promise<any> => {
    try {
        const { id } = req.params;
        const body = req.body;
        const response = await updateChequePaymentService(id, body);
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

export const chequePaymentStatusChangeController = async (
    req: IRequest,
    res: IResponse
): Promise<any> => {
    try {
        const { id } = req.params;
        const body = req.body;
        const response = await changeStatusChequePaymentService(id, body);
        return sendResponse(
            res,
            200,
            "Cheque payment status changed successfully",
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

export const getPagedChequePaymentsController = async (
    req: IRequest,
    res: IResponse
): Promise<any> => {
    try {
        const body = req.body;
        const response = await getPagedChequePaymentsService(body);
        return sendResponse(
            res,
            200,
            "Paged Cheque payments fetched successfully",
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

export const getAllSystemPayeesController = async (req:IRequest, res:IResponse):Promise<any> => {
    try {
        const response = await findAllSystemPayeesService();
        return sendResponse(
            res,
            200,
            "System payees fetched successfully",
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
}