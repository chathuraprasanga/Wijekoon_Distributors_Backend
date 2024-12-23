import { IRequest, IResponse } from "../interfaces/dto";
import {
    confirmLoginService,
    createUserService,
    tokenRefreshService,
    userLoginService,
} from "../services/user.service";
import { sendResponse } from "../helpers/sendResponse";

export const signupController = async (
    req: IRequest,
    res: IResponse
): Promise<any> => {
    try {
        const body = req.body;
        const response = await createUserService(body);
        console.log("crated user:", response);
        return sendResponse(res, 201, "User signup successfully");
    } catch (error: any) {
        console.error(error.message);
        return sendResponse(
            res,
            500,
            "Internal server error",
            null,
            "User signup failed"
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

export const confirmLoginController = async (req: IRequest, res: IResponse): Promise<any> => {
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
    res: IResponse,
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
            error.message,
        );
    }
};