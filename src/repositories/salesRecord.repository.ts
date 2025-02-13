import { SalesRecord } from "../models/salesRecord.model";

export const createSalesRecordRepo = (data: any) => {
    return new SalesRecord(data).save();
};

export const findLastSalesRecord = () => {
    return SalesRecord.findOne().sort({ createdAt: -1 }).exec();
};

export const updateSalesRecordRepo = (filters: any, data: any) => {
    return SalesRecord.findOneAndUpdate(filters, data, { new: true }).exec();
};

export const findSalesRecordRepo = (filters: any) => {
    return SalesRecord.findOne(filters)
        .populate("customer") // Populates customer details
        .populate("orderDetails.product") // Populates product details inside orderDetails
        .lean()
        .exec();
};

export const findSalesRecordsRepo = (filters: any) => {
    return SalesRecord.find(filters).exec();
};

export const aggregateSalesRecordRepo = (pipeline: any) => {
    return SalesRecord.aggregate(pipeline).exec();
};

export const getPagedSalesRecordsRepo = (
    matchFilter: any,
    pageSize: any,
    pageIndex: any,
    sort: any
) => {
    return SalesRecord.find(matchFilter)
        .populate("customer")
        .sort({ createdAt: sort })
        .limit(pageSize)
        .skip(pageSize * (pageIndex - 1))
        .exec();
};

export const countSalesRecords = (filters: any) => {
    return SalesRecord.countDocuments(filters).exec();
};
