import { IRequest, IResponse } from "../interfaces/dto";
import { NextFunction } from "express";
import { sendResponse } from "../helpers/sendResponse";
import jwt from "jsonwebtoken";
import { findUserByUuidService } from "../services/user.service";

const ACCESS_TOKEN_SECRET: any = process.env.accessSecret;

const authMiddleware = async (req: IRequest, res: IResponse, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return sendResponse(res, 401, "Unauthorized: No token Provided", null, "Unauthorized", null);
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
                null,
            );
        } else if (error.name === "JsonWebTokenError") {
            sendResponse(
                res,
                401,
                "Unauthorized: Invalid token",
                null,
                "Unauthorized",
                null,
            );
        } else {
            console.error("Unexpected error during token verification:", error);
            sendResponse(
                res,
                500,
                "Internal Server Error",
                null,
                "Internal Server Error",
                null,
            );
        }
    }
};