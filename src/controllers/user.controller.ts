import { IRequest, IResponse } from "../interfaces/dto";
import { createUserService, userLoginService } from "../services/user.service";
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
            "User login error"
        );
    }
};
