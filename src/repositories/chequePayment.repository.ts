import { ChequePayment } from "../models/chequePayment.model";

export const createChequePaymentRepo = (data: any) => {
    return new ChequePayment(data).save();
};

export const findAllChequePaymentsRepo = (filters: any) => {
    return ChequePayment.find(filters).exec();
};

export const findChequePaymentRepo = (filters: any) => {
    return ChequePayment.findOne(filters).populate("bankAccount").exec();
};

export const updateChequePaymentRepo = (filters: any, data: any) => {
    return ChequePayment.findOneAndUpdate(filters, data).exec();
};

export const aggregateChequePaymentRepo = (pipeline: any) => {
    return ChequePayment.aggregate(pipeline).exec();
};

export const countChequePayments = (filters: any) => {
    return ChequePayment.countDocuments(filters).exec();
};

export const getPagedChequePaymentsRepo = (
    matchFilter: any,
    pageSize: any,
    pageIndex: any,
    sort:any
) => {
    return ChequePayment.find(matchFilter)
        .populate("bankAccount")
        .sort({createdAt: sort})
        .limit(pageSize)
        .skip(pageSize * (pageIndex - 1))
        .exec();
};
