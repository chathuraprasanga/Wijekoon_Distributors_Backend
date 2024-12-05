import { Cheque } from "../models/cheque.model";

export const createChequeRepo = (data: any) => {
    return new Cheque(data).save();
};

export const findChequesRepo = (filters: any) => {
    return Cheque.find(filters).exec();
};

export const findChequeRepo = (filters: any) => {
    return Cheque.findOne(filters).exec();
};

export const updateChequeRepo = (filters: any, data: any) => {
    return Cheque.findOneAndUpdate(filters, data).exec();
};

export const aggregateChequeRepo = (pipeline: any) => {
    return Cheque.aggregate(pipeline).exec();
};
