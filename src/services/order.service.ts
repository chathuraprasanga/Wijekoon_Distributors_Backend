import {
    countOrdersRepo,
    createOrderRepo, findLastOrderRepo,
    findOrderRepo,
    findOrdersRepo, getPagedOrdersRepo,
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
            return `W-O-${String(newOrderIdNumber).padStart(4, "0")}`;
        } else {
            return "W-O-0001";
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
            amountDetails: {
                subTotal: data.subTotal,
                discount: data.discount,
                tax: data.tax,
                netTotal: data.netTotal,
            },
            customer: data.customer,
            date: data.date,
            notes: data.notes,
            metadata: {
                customer: data.customer,
                date: data.date,
                notes: data.notes,
                subTotal: data.subTotal,
                discount: data.discount,
                tax: data.tax,
                netTotal: data.netTotal,
                products: data.products,
            }
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
            { status: data.status }
        );
    } catch (e: any) {
        console.error(e.message);
        throw e;
    }
};

export const getPagedOrdersService = async (data: any) => {
    try {
        const filters = data.filters;
        const { searchQuery, pageSize, pageIndex, sort, status } = filters;
        const matchFilter: any = { $and: [] };

        if (searchQuery) {
            matchFilter.$or = [
                { "customer.name": { $regex: searchQuery, $options: "i" } },
            ];
        }

        if (status) {
            matchFilter.$and.push({ paymentStatus: status });
        }

        const response = await getPagedOrdersRepo(
            matchFilter,
            pageSize,
            pageIndex,
            sort
        );
        const documentCount = await countOrdersRepo(matchFilter);

        return {
            response,
            metadata: { total: documentCount, pageIndex },
        };
    } catch (e: any) {
        console.error(e.message);
        throw e;
    }
};

