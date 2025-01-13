import { BulkInvoicePayment } from "../models/bulkInvoicePayment.model";

export const createBulkInvoicePaymentRepo = async (data: any) => {
    const newBulkInvoicePayment = new BulkInvoicePayment(data);
    const savedData = await newBulkInvoicePayment.save();
    return savedData.toObject();
};

export const findBulkInvoicePaymentRepo = (filters: any) => {
    return BulkInvoicePayment.findOne(filters)
        .populate("supplier")
        .populate("invoices")
        .populate("customerCheques")
        .populate("createdCheques")
        .exec();
};

export const findBulkInvoicesPaymentRepo = (filters: any) => {
    return BulkInvoicePayment.find(filters).exec();
};

export const updateBulkInvoicePaymentRepo = (filters: any, data: any) => {
    return BulkInvoicePayment.findOneAndUpdate(filters, data).exec();
};

export const aggregateBulkInvoicePaymentRepo = (pipeline: any) => {
    return BulkInvoicePayment.aggregate(pipeline).exec();
};

export const getPagedBulkInvoicePaymentsRepo = (
    matchFilter: any,
    pageSize: any,
    pageIndex: any,
    sort: any
) => {
    return BulkInvoicePayment.find(matchFilter)
        .populate("supplier")
        .populate("customerCheques")
        .populate("createdCheques")
        .populate("invoices")
        .sort({ createdAt: sort })
        .limit(pageSize)
        .skip(pageSize * (pageIndex - 1))
        .exec();
};
