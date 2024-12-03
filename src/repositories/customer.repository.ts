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
    return Customer.findOneAndUpdate(filters, data).exec();
};

export const aggregateCustomerRepo = (pipeline: any) => {
    return Customer.aggregate(pipeline).exec();
};
