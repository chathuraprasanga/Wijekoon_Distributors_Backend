import { Invoice } from "../models/invoice.model";

export const createInvoiceRepo = (data: any) => {
    return new Invoice(data).save();
};

export const findInvoicesRepo = (filters: any) => {
    return Invoice.find(filters).exec();
};

export const findInvoiceRepo = (filters: any) => {
    return Invoice.findOne(filters).populate("supplier").exec();
};

export const updateInvoiceRepo = (filters: any, data: any) => {
    return Invoice.findOneAndUpdate(filters, data, { new: true }).exec();
};

export const aggregateInvoiceRepo = (pipeline: any) => {
    return Invoice.aggregate(pipeline).exec();
};

export const countInvoices = (filters: any) => {
    return Invoice.countDocuments(filters).exec();
};

export const getPagedInvoicesRepo = (
    matchFilter: any,
    pageSize: any,
    pageIndex: any,
    sort:any
) => {
    return Invoice.find(matchFilter)
        .populate("supplier")
        .sort({createdAt: sort})
        .limit(pageSize)
        .skip(pageSize * (pageIndex - 1))
        .exec();
};

