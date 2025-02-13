import { IRequest, IResponse } from "../interfaces/dto";
import { NextFunction } from "express";
import { sendResponse } from "../helpers/sendResponse";
import jwt from "jsonwebtoken";
import { findUserByUuidService } from "../services/user.service";

const authMiddleware = async (req: IRequest, res: IResponse, next: NextFunction): Promise<void> => {
    const ACCESS_TOKEN_SECRET: any = process.env.access_secret;

    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            sendResponse(res, 401, "Unauthorized: No token Provided", null, "Unauthorized");
            return;
        }
        const accessToken = authHeader.split(" ")[1];

        const decodedToken: any = jwt.verify(accessToken, ACCESS_TOKEN_SECRET);
        const user: any = await findUserByUuidService(decodedToken.uuid);
        
        req.user = user;
        
        next();
    } catch (error:any) {
        if (error.name === "TokenExpiredError") {
            sendResponse(
                res,
                401,
                "Unauthorized: Token has expired",
                null,
                "Unauthorized",
            );
        } else if (error.name === "JsonWebTokenError") {
            sendResponse(
                res,
                401,
                "Unauthorized: Invalid token",
                null,
                "Unauthorized",
            );
        } else {
            console.error("Unexpected error during token verification:", error);
            sendResponse(
                res,
                500,
                "Internal Server Error",
                null,
                "Internal Server Error",
            );
        }
    }
};

export default authMiddleware;
