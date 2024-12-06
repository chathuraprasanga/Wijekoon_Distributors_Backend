import { Supplier } from "../models/supplier.model";

export const createSupplierRepo = (data: any) => {
    return new Supplier(data).save();
};

export const findSuppliersRepo = (filters: any) => {
    return Supplier.find(filters).exec();
};

export const findSupplierRepo = (filters: any) => {
    return Supplier.findOne(filters).exec();
};

export const updateSupplierRepo = (filters: any, data: any) => {
    return Supplier.findOneAndUpdate(filters, data).exec();
};

export const aggregateSupplierRepo = (pipeline: any) => {
    return Supplier.aggregate(pipeline).exec();
};

export const countSuppliers = (filters:any) => {
    return Supplier.countDocuments(filters).exec();
}
