import { IRequest, IResponse } from "../interfaces/dto";
import { sendResponse } from "../helpers/sendResponse";
import errors from "../constants/errors";
import {
    createInvoiceService, findAllInvoiceService, getInvoiceByIdService, getPagedInvoicesService,
    updateInvoiceService,
} from "../services/invoice.service";
import { getPagedChequesService } from "../services/cheque.service";

export const createInvoiceController = async (
    req: IRequest,
    res: IResponse
): Promise<any> => {
    try {
        const body = req.body;
        const response = await createInvoiceService(body);
        return sendResponse(res, 201, "Invoice added successfully", response);
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

export const getAllInvoiceController = async (
    req: IRequest,
    res: IResponse
): Promise<any> => {
    try {
        const response = await findAllInvoiceService();
        return sendResponse(res, 200, "Invoices fetched successfully", response);
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

export const getInvoiceController = async (
    req: IRequest,
    res: IResponse
): Promise<any> => {
    try {
        const { id } = req.params;
        const response = await getInvoiceByIdService(id);
        return sendResponse(res, 200, "Invoice fetched successfully", response);
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

export const updateInvoiceController = async (
    req: IRequest,
    res: IResponse
): Promise<any> => {
    try {
        const { id } = req.params;
        const body = req.body;
        const response = await updateInvoiceService(id, body);
        return sendResponse(res, 200, "Invoice updated successfully", response);
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

export const invoiceStatusChangeController = async(req: IRequest, res: IResponse): Promise<any> => {
    try {
        const { id } = req.params;
        const body = req.body;
        const response = await updateInvoiceService(id, body);
        return sendResponse(res, 200, "Invoice status changed successfully", response);
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

export const getPagedInvoicesController = async (
    req: IRequest,
    res: IResponse
): Promise<any> => {
    try {
        const body = req.body;
        const response = await getPagedInvoicesService(body);
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