import {
    aggregateSalesRecordRepo,
    createSalesRecordRepo,
    findLastSalesRecord,
    findSalesRecordRepo,
    findSalesRecordsRepo,
    updateSalesRecordRepo,
} from "../repositories/salesRecord.repository";
import mongoose from "mongoose";
import errors from "../constants/errors";
import { createChequeService } from "./cheque.service";
import { changeWarehouseStockBySales } from "./warehouseProductMapping.service";
import {
    findCustomerByIdService,
    updateCustomerCredit,
} from "./customer.service";
import { CALCULATION_TYPES } from "../constants/settings";
import { changeStatusOrderService } from "./order.service";

const ObjectId = mongoose.Types.ObjectId;

export const createSalesRecordService = async (data: any) => {
    try {
        if (data.isWarehouseSale) {
            await changeWarehouseStockBySales(data);
        }
        if (data.isOrdered) {
            await changeStatusOrderService(data.orderId, {
                orderStatus: "COMPLETE",
            });
        }
        data.customer = await findCustomerByIdService(data.customer);
        data.orderId = await generateOrderId();
        data.orderDetails = await generateOrderDetails(data.products);
        data.amountDetails = await generateAmountDetails(data);
        data.paymentDetails = await generatePaymentDetails(data);
        data.paymentStatus = await getPaymentStatus(data.paymentDetails);
        data.warehouse = data.warehouseId;
        data.metadata = { ...data };

        await updateCustomerCredit(
            {
                customer: data.customer,
                amount: data.paymentDetails.creditAmount,
            },
            CALCULATION_TYPES.INCREMENT
        );

        return await createSalesRecordRepo(data);
    } catch (e: any) {
        console.error(e.message);
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
        const lastOrder = await findLastSalesRecord();

        const orderId = lastOrder?.orderId;
        if (orderId) {
            if (!/^W-SR-\d{4}$/.test(orderId)) {
                throw new Error(`Invalid paymentId format: ${orderId}`);
            }

            const paymentIdNumber = parseInt(orderId.split("-")[2]);

            const newPaymentIdNumber = paymentIdNumber + 1;
            return `W-SR-${String(newPaymentIdNumber).padStart(4, "0")}`;
        } else {
            return "W-SR-0001";
        }
    } catch (e: any) {
        console.error(e.message);
        throw e;
    }
};

const generateAmountDetails = async (data: any) => {
    try {
        const subTotal = data.subTotal || 0;
        const discount = data.discount || 0;
        const tax = data.tax || 0;
        const otherCost = data.otherCost || 0;
        const netTotal = data.netTotal || 0;
        return { subTotal, discount, tax, otherCost, netTotal };
    } catch (e: any) {
        console.error(e.message);
        throw e;
    }
};

const generatePaymentDetails = async (data: any) => {
    try {
        const { payments = {}, customer } = data; // Ensure payments is never undefined
        const cheques = payments.cheques ?? [];

        if (cheques.length > 0) {
            await Promise.all(
                cheques.map(
                    async (cheque: any) =>
                        await createChequeService({ ...cheque, customer })
                )
            );
        }

        const cashPayment = payments.cash || 0;
        const chequePayment = cheques.reduce(
            (acc: number, c: any) => acc + (c.amount || 0),
            0
        );
        const creditAmount = payments.credit || 0;
        const totalAmount = cashPayment + chequePayment + creditAmount;

        return {
            totalAmount,
            cashPayment,
            chequePayment,
            creditAmount,
            isPaymentDone: creditAmount === 0,
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

        const paidAmount = cashAmount + chequeAmount;
        const outstandingAmount = totalAmount - paidAmount;

        if (outstandingAmount === 0) {
            return "PAID"; // Fully paid with cash/cheque
        }
        if (outstandingAmount === totalAmount) {
            return "NOT PAID"; // Entire amount on credit
        }
        if (outstandingAmount > 0) {
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
        const { searchQuery, pageSize, pageIndex, sort, status } = data.filters;

        const pipeline: any[] = [];

        pipeline.push({
            $lookup: {
                from: "customer", // ensure this matches your Customer collection name
                localField: "customer",
                foreignField: "_id",
                as: "customer",
            },
        });
        pipeline.push({ $unwind: "$customer" });

        const matchConditions: any[] = [];
        if (searchQuery) {
            matchConditions.push({
                "customer.name": { $regex: searchQuery, $options: "i" },
            });
        }
        if (status) {
            matchConditions.push({ paymentStatus: status });
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

        const response = await aggregateSalesRecordRepo(pipeline);

        const countPipeline = pipeline.filter(
            (stage) => !("$skip" in stage || "$limit" in stage)
        );
        countPipeline.push({ $count: "total" });

        const countResult = await aggregateSalesRecordRepo(countPipeline);
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
        const salesRecord: any = await findSalesRecordByIdService(id);

        if (!salesRecord) {
            throw new Error(errors.SALES_RECORD_NOT_FOUND);
        }

        if (data?.isUpdatePayments) {
            const paymentDetails = data.paymentDetails;

            if (paymentDetails?.cheques?.length > 0) {
                await Promise.all(
                    paymentDetails.cheques.map((c: any) =>
                        createChequeService({
                            ...c,
                            customer: data.customer,
                            salesRecordUpdate: true,
                        })
                    )
                );
            }

            const payload: any = {
                paymentDetails: {
                    ...salesRecord.paymentDetails,
                    cashPayment:
                        (salesRecord.paymentDetails?.cashPayment || 0) +
                        (paymentDetails.cash || 0),
                    chequePayment:
                        (salesRecord.paymentDetails?.chequePayment || 0) +
                        (paymentDetails?.cheques?.reduce(
                            (acc: any, c: any) => acc + c.amount,
                            0
                        ) || 0),
                    creditAmount: paymentDetails.credit || 0,
                    isPaymentDone: (paymentDetails.credit || 0) <= 0,
                },
                paymentStatus:
                    (paymentDetails.credit || 0) <= 0
                        ? "PAID"
                        : "PARTIALLY PAID",
                metadata: {
                    ...salesRecord.metadata,
                    payments: {
                        cash:
                            (salesRecord.metadata?.payments?.cash || 0) +
                            (paymentDetails.cash || 0),
                        cheques: [
                            ...(salesRecord.metadata?.payments?.cheques || []),
                            ...paymentDetails.cheques,
                        ],
                        credit: paymentDetails.credit || 0,
                    },
                },
            };

            await updateCustomerCredit(
                {
                    amount:
                        data.paymentDetails.cheques.reduce(
                            (acc: number, c: any) => acc + c.amount,
                            0
                        ) + data.paymentDetails.cash,
                    customer: salesRecord.customer,
                },
                CALCULATION_TYPES.DECREMENT
            );

            return await updateSalesRecordRepo(
                { _id: new ObjectId(id) },
                payload
            );
        } else {
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
                },
            };
            return await updateSalesRecordRepo(
                { _id: new ObjectId(id) },
                payload
            );
        }
    } catch (e: any) {
        console.error(e.message);
        throw e;
    }
};

export const changeStatusSalesRecordService = async (id: string, data: any) => {
    try {
        return await updateSalesRecordRepo(
            { _id: id },
            { status: data.status }
        );
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

export const reduceBySalesRecords = async (data: any) => {
    try {
        const salesRecords = await findSalesRecordsRepo({
            customer: new ObjectId(data.customer_id || data.customer),
            paymentStatus: { $in: ["NOT PAID", "PARTIALLY PAID"] },
        });

        let remainingAmount = data.amount;

        const updatedSalesRecords = salesRecords.map((sr: any) => {
            if (remainingAmount <= 0) return sr;

            const paymentDetails = sr.paymentDetails;
            const metadata = sr.metadata;

            metadata.payments = metadata.payments || {};
            metadata.paymentDetails = metadata.paymentDetails || {};

            if (paymentDetails.creditAmount <= remainingAmount) {
                const paidAmount = paymentDetails.creditAmount;
                remainingAmount -= paidAmount;

                paymentDetails.creditAmount = 0;
                paymentDetails.chequePayment =
                    (paymentDetails.chequePayment || 0) + paidAmount;
                paymentDetails.isPaymentDone = true;
                sr.paymentStatus = "PAID";
                metadata.paymentStatus = "PAID";

                const currentCheques = metadata.payments.cheques || [];
                metadata.payments = {
                    ...metadata.payments,
                    cheques: [...currentCheques, data],
                    credit: 0,
                };

                metadata.paymentDetails = {
                    ...metadata.paymentDetails,
                    chequePayment:
                        (metadata.paymentDetails.chequePayment || 0) +
                        paidAmount,
                    creditAmount: 0,
                    isPaymentDone: true,
                };
            } else {
                paymentDetails.creditAmount -= remainingAmount;
                paymentDetails.chequePayment =
                    (paymentDetails.chequePayment || 0) + remainingAmount;
                paymentDetails.isPaymentDone = false;
                sr.paymentStatus = "PARTIALLY PAID";
                metadata.paymentStatus = "PARTIALLY PAID";

                const currentCheques = metadata.payments.cheques || [];
                metadata.payments = {
                    ...metadata.payments,
                    cheques: [...currentCheques, data],
                    credit: paymentDetails.creditAmount,
                };

                metadata.paymentDetails = {
                    ...metadata.paymentDetails,
                    chequePayment:
                        (metadata.paymentDetails.chequePayment || 0) +
                        remainingAmount,
                    creditAmount: paymentDetails.creditAmount,
                    isPaymentDone: false,
                };

                remainingAmount = 0;
            }
            return sr;
        });

        return await Promise.all(
            updatedSalesRecords.map((u) =>
                updateSalesRecordRepo({ _id: u._id }, u)
            )
        );
    } catch (e) {
        console.error(e);
        throw e;
    }
};
