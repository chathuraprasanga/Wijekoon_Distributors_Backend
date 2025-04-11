import {
    aggregateOrderRepo,
    createOrderRepo,
    findLastOrderRepo,
    findOrderRepo,
    findOrdersRepo,
    updateOrderRepo,
} from "../repositories/order.repository";
import mongoose from "mongoose";
import errors from "../constants/errors";

const ObjectId = mongoose.Types.ObjectId;

export const createOrderService = async (data: any) => {
    try {
        const sanitizedData = JSON.parse(JSON.stringify(data));
        sanitizedData.metadata = { ...sanitizedData };

        sanitizedData.orderId = await generateOrderId();
        sanitizedData.orderDetails = await generateOrderDetails(
            sanitizedData.products
        );
        sanitizedData.amountDetails =
            await generateAmountDetails(sanitizedData);

        return await createOrderRepo(sanitizedData);
    } catch (e: any) {
        console.error("ERROR:", e.message);
        throw e;
    }
};

const generateOrderDetails = (data: any) => {
    try {
        return data.map((d: any) => ({
            product: d.product._id,
            amount: d.amount,
            lineTotal: d.lineTotal,
        }));
    } catch (e: any) {
        console.error(e.message);
        throw e;
    }
};

const generateOrderId = async () => {
    try {
        const lastOrder = await findLastOrderRepo();

        const orderId = lastOrder?.orderId;
        if (orderId) {
            if (!/^W-O-\d{4}$/.test(orderId)) {
                throw new Error(`Invalid orderId format: ${orderId}`);
            }

            const orderIdNumber = parseInt(orderId.split("-")[2]);

            const newOrderIdNumber = orderIdNumber + 1;
            return `W-PO-${String(newOrderIdNumber).padStart(4, "0")}`;
        } else {
            return "W-PO-0001";
        }
    } catch (e: any) {
        console.error(e.message);
        throw e;
    }
};

const generateAmountDetails = async (data: any) => {
    try {
        const subTotal = data.subTotal || 0;
        return { subTotal };
    } catch (e: any) {
        console.error(e.message);
        throw e;
    }
};

export const findAllOrdersService = async (data: any) => {
    try {
        const filters = data.filters;
        return await findOrdersRepo(filters);
    } catch (e: any) {
        console.error(e.message);
        throw e;
    }
};

export const findOrderByIdService = async (id: string) => {
    try {
        return await findOrderRepo({ _id: new ObjectId(id) });
    } catch (e: any) {
        console.error(e.message);
        throw e;
    }
};

export const updateOrderService = async (id: string, data: any) => {
    try {
        const order: any = await findOrderByIdService(id);

        if (!order) {
            throw new Error(errors.ORDER_NOT_FOUND);
        }

        const payload = {
            customer: data.customer,
            expectedDate: data.expectedDate,
            notes: data.notes,
            orderDetails: data.products,
            metadata: {
                ...data,
            },
        };

        return await updateOrderRepo({ _id: id }, payload);
    } catch (e: any) {
        console.error(e.message);
        throw e;
    }
};

export const changeStatusOrderService = async (id: string, data: any) => {
    try {
        return await updateOrderRepo(
            { _id: id },
            { orderStatus: data.orderStatus }
        );
    } catch (e: any) {
        console.error(e.message);
        throw e;
    }
};

export const getPagedOrdersService = async (data: any) => {
    try {
        const { searchQuery, pageSize, pageIndex, sort, status } = data.filters;

        const pipeline: any[] = [];

        pipeline.push({
            $lookup: {
                from: "customer",
                localField: "customer",
                foreignField: "_id",
                as: "customer",
            },
        });
        pipeline.push({
            $unwind: "$customer",
        });

        const matchConditions: any[] = [];
        if (searchQuery) {
            matchConditions.push({
                "customer.name": { $regex: searchQuery, $options: "i" },
            });
        }
        if (status) {
            matchConditions.push({ orderStatus: status });
        }
        if (matchConditions.length) {
            pipeline.push({
                $match: { $and: matchConditions },
            });
        }
        if (sort) {
            pipeline.push({
                $sort: { createdAt: sort },
            });
        }

        pipeline.push({ $skip: pageSize * (pageIndex - 1) });
        pipeline.push({ $limit: pageSize });

        const response = await aggregateOrderRepo(pipeline);

        const countPipeline = pipeline.filter(
            (stage) => !("$skip" in stage || "$limit" in stage)
        );
        countPipeline.push({ $count: "total" });
        const countResult = await aggregateOrderRepo(countPipeline);
        const documentCount = countResult.length > 0 ? countResult[0].total : 0;

        return {
            response,
            metadata: { total: documentCount, pageIndex },
        };
    } catch (e: any) {
        console.error(e.message);
        throw e;
    }
};
