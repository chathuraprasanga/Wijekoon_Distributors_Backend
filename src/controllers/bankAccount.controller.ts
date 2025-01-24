import { IRequest, IResponse } from "../interfaces/dto";
import { sendResponse } from "../helpers/sendResponse";
import {
    changeBankDetailStatusService,
    createBankAccountService,
    findAllBankAccountService,
    findBankAccountService,
    updateBankAccountService,
} from "../services/bankAccount.service";

export const createBankAccountController = async (
    req: IRequest,
    res: IResponse
): Promise<any> => {
    try {
        const body = req.body;
        const response = await createBankAccountService(body);
        return sendResponse(
            res,
            201,
            "Bank account created successfully",
            response
        );
    } catch (error: any) {
        return sendResponse(
            res,
            500,
            "Bank account created failed",
            null,
            error.message
        );
    }
};

export const getAllBankAccountsController = async (
    req: IRequest,
    res: IResponse
): Promise<any> => {
    try {
        const body = req.body;
        const response = await findAllBankAccountService(body);
        return sendResponse(
            res,
            200,
            "Fetch bank accounts successfully",
            response
        );
    } catch (error: any) {
        return sendResponse(
            res,
            500,
            "Fetch bank accounts failed",
            null,
            error.message
        );
    }
};

export const getBankAccountController = async (
    req: IRequest,
    res: IResponse
): Promise<any> => {
    try {
        const { id } = req.params;
        const response = await findBankAccountService(id);
        return sendResponse(
            res,
            201,
            "Fetch bank account successfully",
            response
        );
    } catch (error: any) {
        return sendResponse(
            res,
            500,
            "Fetch bank account failed",
            null,
            error.message
        );
    }
};

export const updateBankAccountController = async (
    req: IRequest,
    res: IResponse
): Promise<any> => {
    try {
        const { id } = req.params;
        const body = req.body;
        const response = await updateBankAccountService(id, body);
        return sendResponse(
            res,
            201,
            "Update bank account successfully",
            response
        );
    } catch (error: any) {
        return sendResponse(
            res,
            500,
            "Update bank account failed",
            null,
            error.message
        );
    }
};

export const bankDetailStatusChangeController = async (
    req: IRequest,
    res: IResponse
): Promise<any> => {
    try {
        const { id } = req.params;
        const body = req.body;
        const response = await changeBankDetailStatusService(id, body);
        return sendResponse(
            res,
            200,
            "Change bank account status successfully",
            response
        );
    } catch (error: any) {
        return sendResponse(
            res,
            500,
            "Update bank account failed",
            null,
            error.message
        );
    }
};
