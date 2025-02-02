import {
    countSalesRecords,
    createSalesRecordRepo,
    findLastSalesRecord,
    findSalesRecordRepo,
    findSalesRecordsRepo,
    getPagedSalesRecordsRepo,
    updateSalesRecordRepo,
} from "../repositories/salesRecord.repository";
import { findProductRepo } from "../repositories/product.repository";
import mongoose from "mongoose";
import errors from "../constants/errors";

const ObjectId = mongoose.Types.ObjectId;

export const createSalesRecordService = async (data: any) => {
    try {
        data.orderId = await generateOrderId();
        data.amountDetails = await generateAmountDetails(data);
        data.paymentDetails = await generatePaymentDetails(data);
        data.paymentStatus = await getPaymentStatus(data.paymentDetails);
        return await createSalesRecordRepo(data);
    } catch (e: any) {
        console.error(e.message);
        throw e;
    }
};

const generateOrderId = async () => {
    try {
        const lastOrder = await findLastSalesRecord();

        const orderId = lastOrder?.orderId;
        if (orderId) {
            if (!/^W-ORD-\d{4}$/.test(orderId)) {
                throw new Error(`Invalid paymentId format: ${orderId}`);
            }

            const paymentIdNumber = parseInt(orderId.split("-")[2]);

            const newPaymentIdNumber = paymentIdNumber + 1;
            return `W-ORD-${String(newPaymentIdNumber).padStart(4, "0")}`;
        } else {
            return "W-ORD-0001";
        }
    } catch (e: any) {
        console.error(e.message);
        throw e;
    }
};

const generateAmountDetails = async (data: any) => {
    try {
        const orderDetails = data.orderDetails;

        if (!Array.isArray(orderDetails)) {
            throw new Error("orderDetails must be an array.");
        }

        let newData: any[] = [];

        // Fetch product data in parallel using Promise.all
        const paymentDetailsPromise = orderDetails.map(async (o) => {
            const productData = await findProductRepo({ _id: o.product });

            if (!productData) {
                throw new Error(`Product not found for ID: ${o.product}`);
            }

            const totalAmount = productData.unitPrice * o.amount;
            const totalDiscount =
                ((productData.unitPrice * o.discountPercentage) / 100) *
                o.amount;
            const totalTax =
                ((productData.unitPrice * o.taxPercentage) / 100) * o.amount;
            const netTotal = totalAmount - totalDiscount + totalTax;
            const subTotal = netTotal + (data.otherCost || 0); // Ensure otherCost exists

            return {
                totalAmount,
                totalDiscount,
                totalTax,
                netTotal,
                subTotal,
            };
        });

        newData = await Promise.all(paymentDetailsPromise);

        // Aggregate the total amounts
        return newData.reduce(
            (acc, curr) => {
                acc.totalAmount += curr.totalAmount;
                acc.totalDiscount += curr.totalDiscount;
                acc.totalTax += curr.totalTax;
                acc.netTotal += curr.netTotal;
                acc.subTotal += curr.subTotal;
                return acc;
            },
            {
                totalAmount: 0,
                totalDiscount: 0,
                totalTax: 0,
                netTotal: 0,
                subTotal: 0,
            }
        );
    } catch (e: any) {
        console.error(e.message);
        throw e;
    }
};

const generatePaymentDetails = async (data: any) => {
    try {
        const paymentDetails = data.paymentDetails;

        if (!paymentDetails) {
            throw new Error("Missing paymentDetails in input data.");
        }

        // Extract values with defaulting to 0
        const cashPayment = paymentDetails.cash || 0;
        const chequePayment = paymentDetails.cheque || 0;
        const creditAmount = paymentDetails.credit || 0;
        const totalAmount = cashPayment + chequePayment + creditAmount;

        return {
            totalAmount,
            cashPayment,
            chequePayment,
            creditAmount,
            isPaymentDone: creditAmount === 0, // Fixed incorrect syntax
        };
    } catch (e: any) {
        console.error(e.message);
        throw e;
    }
};

const getPaymentStatus = async (data: any) => {
    try {
        const totalAmount = data.totalAmount || 0;
        const cashAmount = data.cashPayment || 0;
        const chequeAmount = data.chequePayment || 0;
        const creditAmount = data.creditAmount || 0;

        const paidAmount = cashAmount + chequeAmount;
        const outstandingAmount = totalAmount - paidAmount;

        if (outstandingAmount === 0) {
            return "PAID"; // Fully paid with cash/cheque
        }
        if (outstandingAmount === creditAmount) {
            return "NOT PAID"; // Entire amount on credit
        }
        if (outstandingAmount > 0 && creditAmount > 0) {
            return "PARTIALLY PAID"; // Some amount is pending in credit
        }
        if (totalAmount === cashAmount) {
            return "COMPLETE";
        }
        return "INCOMPLETE"; // Fallback in case an unknown scenario arises
    } catch (e: any) {
        console.error(e.message);
        throw e;
    }
};

export const findAllSalesRecordsService = async (data: any) => {
    try {
        const filters = data.filters;
        return await findSalesRecordsRepo(filters);
    } catch (e: any) {
        console.error(e.message);
        throw e;
    }
};

export const getPagedSalesRecordsService = async (data: any) => {
    try {
        const filters = data.filters;
        const { searchQuery, pageSize, pageIndex, sort, status } = filters;
        const matchFilter: any = { $and: [] };

        if (searchQuery) {
            matchFilter.$or = [
                { customer: { $regex: searchQuery, $options: "i" } },
            ];
        }

        if (status) {
            matchFilter.$and.push({ status: status !== "INACTIVE" });
        }

        const response = await getPagedSalesRecordsRepo(
            matchFilter,
            pageSize,
            pageIndex,
            sort
        );
        const documentCount = await countSalesRecords(matchFilter);
        return {
            response,
            metadata: { total: documentCount, pageIndex },
        };
    } catch (e: any) {
        console.error(e.message);
        throw e;
    }
};

export const findSalesRecordByIdService = async (id: string) => {
    try {
        return await findSalesRecordRepo({ _id: new ObjectId(id) });
    } catch (e: any) {
        console.error(e.message);
        throw e;
    }
};

export const updateSalesRecordService = async (id: string, data: any) => {
    try {
        const existSalesRecords = await findSalesRecordsRepo({ phone: data.phone });
        const duplicateSalesRecords = existSalesRecords.filter(
            (c: any) => !c._id.equals(new ObjectId(id)) // Use .equals() for ObjectId comparison
        );

        if (duplicateSalesRecords.length > 0) {
            throw new Error(errors.SALES_RECORD_ALREADY_EXIST);
        }

        delete data._id;
        return await updateSalesRecordRepo({ _id: id }, data);
    } catch (e: any) {
        console.error(e.message);
        throw e;
    }
};

export const changeStatusSalesRecordService = async (id: string, data: any) => {
    try {
        return await updateSalesRecordRepo({ _id: id }, { status: data.status });
    } catch (e: any) {
        console.error(e.message);
        throw e;
    }
};

export const findSalesRecordsService = async (data: any) => {
    try {
        const filters = data.filters;
        return await findSalesRecordsRepo(filters);
    } catch (e: any) {
        console.error(e.message);
        throw e;
    }
};
