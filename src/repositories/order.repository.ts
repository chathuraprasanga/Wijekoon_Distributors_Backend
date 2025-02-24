import { Order } from "../models/order.model";

export const createOrderRepo = (data: any) => {
    return new Order(data).save();
};

export const findLastOrderRepo = () => {
    return Order.findOne().sort({ createdAt: -1 }).exec();
};

export const updateOrderRepo = (filters: any, data: any) => {
    return Order.findOneAndUpdate(filters, data, { new: true }).exec();
};

export const findOrderRepo = (filters: any) => {
    return Order.findOne(filters)
        .populate("customer") // Populates customer details
        .populate("orderDetails.product") // Populates product details inside orderDetails
        .lean()
        .exec();
};

export const findOrdersRepo = (filters: any) => {
    return Order.find(filters).exec();
};

export const aggregateOrderRepo = (pipeline: any) => {
    return Order.aggregate(pipeline).exec();
};

export const getPagedOrdersRepo = (
    matchFilter: any,
    pageSize: any,
    pageIndex: any,
    sort: any
) => {
    return Order.find(matchFilter)
        .populate("customer")
        .sort({ createdAt: sort })
        .limit(pageSize)
        .skip(pageSize * (pageIndex - 1))
        .exec();
};

export const countOrdersRepo = (filters: any) => {
    return Order.countDocuments(filters).exec();
};
