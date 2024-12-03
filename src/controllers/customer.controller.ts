import { IRequest, IResponse } from "../interfaces/dto";
import { sendResponse } from "../helpers/sendResponse";
import {
    changeStatusCustomerService,
    createCustomerService,
    findAllCustomersService,
    findCustomerByIdService,
    updateCustomerService,
} from "../services/customer.service";
import errors from "../constants/errors";

export const createCustomerController = async (
    req: IRequest,
    res: IResponse
): Promise<any> => {
    try {
        const body = req.body;
        const response = await createCustomerService(body);
        return sendResponse(
            res,
            201,
            "Customer created successfully",
            response
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

export const getAllCustomersController = async (
    req: IRequest,
    res: IResponse
): Promise<any> => {
    try {
        const response = await findAllCustomersService();
        return sendResponse(
            res,
            200,
            "Customers fetched successfully",
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

export const getCustomerController = async (
    req: IRequest,
    res: IResponse
): Promise<any> => {
    try {
        const { id } = req.params;
        const response = await findCustomerByIdService(id);
        return sendResponse(
            res,
            200,
            "Customer fetched successfully",
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

export const updateCustomerController = async (
    req: IRequest,
    res: IResponse
): Promise<any> => {
    try {
        const body = req.body;
        const { id } = req.params;
        const response = await updateCustomerService(id, body);
        return sendResponse(
            res,
            200,
            "Customer updated successfully",
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

export const changeStatusCustomerController = async (
    req: IRequest,
    res: IResponse
): Promise<any> => {
    try {
        const { id } = req.params;
        const body = req.body;
        const response = await changeStatusCustomerService(id, body);
        return sendResponse(
            res,
            200,
            "Customer status changed successfully",
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
