import { Cheque } from "../models/cheque.model";

export const createChequeRepo = (data: any) => {
    return new Cheque(data).save();
};

export const findChequesRepo = (filters: any) => {
    return Cheque.find(filters).exec();
};

export const findChequeRepo = (filters: any) => {
    return Cheque.findOne(filters).populate("customer").exec();
};

export const updateChequeRepo = (filters: any, data: any) => {
    return Cheque.findOneAndUpdate(filters, data, { new: true }).exec();
};

export const aggregateChequeRepo = (pipeline: any) => {
    return Cheque.aggregate(pipeline).exec();
};

export const countCheques = (filters: any) => {
    return Cheque.countDocuments(filters).exec();
};


export const getPagedChequesRepo = (
    matchFilter: any,
    pageSize: any,
    pageIndex: any,
    sort:any
) => {
    return Cheque.find(matchFilter)
        .populate("customer")
        .sort({createdAt: sort})
        .limit(pageSize)
        .skip(pageSize * (pageIndex - 1))
        .exec();
};

