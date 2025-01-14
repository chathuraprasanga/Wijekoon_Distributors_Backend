import { Customer } from "../models/customer.model";

export const createCustomerRepo = (data: any) => {
    return new Customer(data).save();
};

export const findCustomersRepo = (filters: any) => {
    return Customer.find(filters).exec();
};

export const findCustomerRepo = (filters: any) => {
    return Customer.findOne(filters).exec();
};

export const updateCustomerRepo = (filters: any, data: any) => {
    return Customer.findOneAndUpdate(filters, data, { new: true }).exec();
};

export const aggregateCustomerRepo = (pipeline: any) => {
    return Customer.aggregate(pipeline).exec();
};

export const countCustomers = (filters: any) => {
    return Customer.countDocuments(filters).exec();
};

export const getPagedCustomersRepo = (
    matchFilter: any,
    pageSize: any,
    pageIndex: any,
    sort:any
) => {
    return Customer.find(matchFilter)
        .sort({createdAt: sort})
        .limit(pageSize)
        .skip(pageSize * (pageIndex - 1))
        .exec();
};
