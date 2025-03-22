import { IRequest, IResponse } from "../interfaces/dto";
import {
    changePasswordService, changeUserStatusService,
    confirmLoginService,
    createUserService,
    findAllUsersService,
    tokenRefreshService,
    userLoginService,
} from "../services/user.service";
import { sendResponse } from "../helpers/sendResponse";
import { createNotificationsForNewUserAdding } from "../services/email.service";

export const signupController = async (
    req: IRequest,
    res: IResponse
): Promise<any> => {
    try {
        const body = req.body;
        const response = await createUserService(body);
        await createNotificationsForNewUserAdding(response);
        return sendResponse(res, 201, "User signup successfully");
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

export const loginService = async (
    req: IRequest,
    res: IResponse
): Promise<any> => {
    try {
        const body = req.body;
        const response = await userLoginService(body);
        return sendResponse(res, 200, "User login successful", response);
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

export const confirmLoginController = async (
    req: IRequest,
    res: IResponse
): Promise<any> => {
    try {
        const { user } = req;
        const response = await confirmLoginService(user);
        return sendResponse(res, 200, "Confirm login successful", response);
    } catch (error: any) {
        console.error(error.message);
        return sendResponse(
            res,
            401,
            "Internal server error",
            null,
            error.message
        );
    }
};

export const tokenRefreshController = async (
    req: IRequest,
    res: IResponse
): Promise<any> => {
    try {
        const body = req.body;
        const payload = await tokenRefreshService(body);
        return sendResponse(res, 200, "Token refreshed successfully", payload);
    } catch (error: any) {
        console.error(error);
        return sendResponse(
            res,
            500,
            "Token refreshed failed",
            null,
            error.message
        );
    }
};

export const changePasswordController = async (
    req: IRequest,
    res: IResponse
): Promise<any> => {
    try {
        const { body, user } = req;
        const payload = await changePasswordService(body, user);
        return sendResponse(res, 200, "Password changed successfully", payload);
    } catch (error: any) {
        return sendResponse(
            res,
            500,
            "Password changed failed",
            null,
            error.message
        );
    }
};

export const getAllUsersController = async (
    req: IRequest,
    res: IResponse
): Promise<any> => {
    try {
        const payload = await findAllUsersService({});
        return sendResponse(res, 200, "Password changed successfully", payload);
    } catch (error: any) {
        return sendResponse(
            res,
            500,
            "Get all users failed",
            null,
            error.message
        );
    }
};

export const userStatusChangeController = async(req:IRequest, res: IResponse):Promise<any> => {
    try{
        const {id} = req.params;
        const body = req.body;
        const response = await changeUserStatusService(id, body);
        return sendResponse(res, 200, "User status changed successfully", response);
    } catch (error:any){
        return sendResponse(
            res,
            500,
            "Change user status failed",
            null,
            error.message
        );
    }
}