import { Response } from "express";

export const sendResponse = (
    res: Response,
    statusCode: number,
    message: string,
    result: any = null,
    error: any = null,
): Response => {
    return res.status(statusCode).json({
        code: statusCode,
        message,
        result,
        error,
    });
};
