import { Product } from "../models/product.model";

export const findProductsRepo = (filters: any) => {
    return Product.find(filters).exec();
};

export const findProductRepo = (filters: any) => {
    return Product.findOne(filters).exec();
};

export const createProductRepo = (data: any) => {
    return new Product(data).save();
};

export const updateProductRepo = (filters: any, data: any) => {
    return Product.findOneAndUpdate(filters, data, { new: true }).exec();
};

export const countProducts = (filters: any) => {
    return Product.countDocuments(filters).exec();
};

export const getPagedProductsRepo = (
    matchFilter: any,
    pageSize: any,
    pageIndex: any,
    sort:any
) => {
    return Product.find(matchFilter)
        .sort({createdAt: sort})
        .limit(pageSize)
        .skip(pageSize * (pageIndex - 1))
        .exec();
};
