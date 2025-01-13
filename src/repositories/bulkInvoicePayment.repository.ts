import { BulkInvoicePayment } from "../models/bulkInvoicePayment.model";

export const createBulkInvoicePaymentRepo = async (data: any) => {
    const newBulkInvoicePayment = new BulkInvoicePayment(data);
    const savedData = await newBulkInvoicePayment.save();
    return savedData.toObject();
};

export const findBulkInvoicePaymentRepo = (filters: any) => {
    return BulkInvoicePayment.findOne(filters).exec();
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
