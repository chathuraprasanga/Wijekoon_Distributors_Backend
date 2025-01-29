import { IRequest, IResponse } from "../interfaces/dto";
import { sendResponse } from "../helpers/sendResponse";
import errors from "../constants/errors";
import { findDashboardDetailsService } from "../services/dashboard.service";
import { changeChequeStatusStatusSendToSupplierService } from "../services/cheque.service";
import { changeChequePaymentStatusService } from "../services/chequePayment.service";

export const getDashboardDetails = async (
    req: IRequest,
    res: IResponse
): Promise<any> => {
    try {
        const body = req.body;
        // send to supplier 7 days older cheques and chequePayments completed
        await changeChequeStatusStatusSendToSupplierService();
        await changeChequePaymentStatusService();
        const response = await findDashboardDetailsService(body);
        return sendResponse(
            res,
            200,
            "Dashboard details fetched successfully",
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
