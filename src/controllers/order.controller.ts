import { sendResponse } from "../helpers/sendResponse";
import {
    changeStatusOrderService,
    createOrderService, findAllOrdersService,
    findOrderByIdService, getPagedOrdersService,
    updateOrderService,
} from "../services/order.service";
import { IRequest, IResponse } from "../interfaces/dto";
import errors from "../constants/errors";

export const createOrderController = async (
    req: IRequest,
    res: IResponse
): Promise<any> => {
    try {
        const body = req.body;
        const response = await createOrderService(body);
        return sendResponse(res, 201, "Order added successfully", response);
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

export const getOrdersController = async (
    req: IRequest,
    res: IResponse
): Promise<any> => {
    try {
        const body = req.body;
        const response = await findAllOrdersService(body);
        return sendResponse(
            res,
            200,
            "Orders fetched successfully",
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

export const getOrderController = async (
    req: IRequest,
    res: IResponse
): Promise<any> => {
    try {
        const { id } = req.params;
        const response = await findOrderByIdService(id);
        return sendResponse(
            res,
            200,
            "Order fetched successfully",
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

export const updateOrderController = async (
    req: IRequest,
    res: IResponse
): Promise<any> => {
    try {
        const { id } = req.params;
        const body = req.body;
        const response = await updateOrderService(id, body);
        return sendResponse(
            res,
            200,
            "Order updated successfully",
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

export const changeStatusOrderController = async (
    req: IRequest,
    res: IResponse
): Promise<any> => {
    try {
        const { id } = req.params;
        const body = req.body;
        const response = await changeStatusOrderService(id, body);
        return sendResponse(
            res,
            200,
            "Order status changed successfully",
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

export const getPagedOrdersController = async (
    req: IRequest,
    res: IResponse
): Promise<any> => {
    try {
        const body = req.body;
        const response = await getPagedOrdersService(body);
        return sendResponse(
            res,
            200,
            "Orders fetched successfully",
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
