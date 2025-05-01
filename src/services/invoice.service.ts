import {
    aggregateInvoiceRepo,
    countInvoices,
    createInvoiceRepo,
    findInvoiceRepo,
    findInvoicesRepo,
    getPagedInvoicesRepo,
    updateInvoiceRepo,
} from "../repositories/invoice.repository";
import errors from "../constants/errors";
import mongoose from "mongoose";
import { updateChequeRepo } from "../repositories/cheque.repository";
import { createChequePaymentRepo } from "../repositories/chequePayment.repository";
import { findSupplierRepo } from "../repositories/supplier.repository";
import {
    countBulkInvoicePayments,
    createBulkInvoicePaymentRepo,
    findBulkInvoicePaymentRepo,
    findLastBulkInvoicePaymentRepo,
    getPagedBulkInvoicePaymentsRepo,
} from "../repositories/bulkInvoicePayment.repository";

const ObjectId = mongoose.Types.ObjectId;

export const createInvoiceService = async (data: any) => {
    try {
        if (data.isCompanyCreated) {
            data.invoiceNumber = await generateCompanyInvoiceNumber();
        }
        const duplicateInvoice = await findInvoiceRepo({
            invoiceNumber: data.invoiceNumber,
        });
        if (duplicateInvoice) {
            throw new Error(errors.INVOICE_ALREADY_EXIST);
        }
        return await createInvoiceRepo(data);
    } catch (e: any) {
        console.error(e.message);
        throw e;
    }
};

const generateCompanyInvoiceNumber = async () => {
    try {
        const allInvoices: any = await findInvoicesRepo({});
        const wdInvoices = allInvoices
            .map((invoice: any) => invoice.invoiceNumber)
            .filter((num: string) => num.startsWith("WD-INV-"));

        if (wdInvoices.length === 0) {
            return "WD-INV-0001";
        }
        const lastNumber = Math.max(
            ...wdInvoices.map((num: any) =>
                parseInt(num.replace("WD-INV-", ""), 10)
            )
        );
        const nextNumber = lastNumber + 1;
        return `WD-INV-${nextNumber.toString().padStart(3, "0")}`;
    } catch (e) {
        console.error(e);
        throw e;
    }
};

export const findAllInvoiceService = async (data: any) => {
    try {
        const { filters } = data; // Destructure 'filter' from 'data'
        const { status, supplier, invoiceStatus } = filters || {}; // Destructure 'status' and 'supplier', default to an empty object if 'filter' is undefined
        console.log(supplier);

        const pipeline: any[] = [
            {
                $lookup: {
                    as: "supplier",
                    from: "supplier",
                    foreignField: "_id",
                    localField: "supplier",
                },
            },
            {
                $unwind: {
                    path: "$supplier",
                    preserveNullAndEmptyArrays: true,
                },
            },
        ];

        const match: any = {};

        if (status) {
            match.status = status;
        }

        if (supplier) {
            match["supplier._id"] = new ObjectId(supplier);
        }

        if (invoiceStatus) {
            match["invoiceStatus"] = invoiceStatus;
        }

        if (Object.keys(match).length > 0) {
            pipeline.push({
                $match: match,
            });
        }
        return await aggregateInvoiceRepo(pipeline);
    } catch (e: any) {
        console.error(e.message);
        throw e;
    }
};

export const updateInvoiceService = async (id: string, data: any) => {
    try {
        const existInvoice = await findInvoicesRepo({
            invoiceNumber: data.invoiceNumber,
        });
        const duplicateInvoices = existInvoice.filter(
            (c: any) => !c._id.equals(new ObjectId(id)) // Use .equals() for ObjectId comparison
        );

        if (duplicateInvoices.length > 0) {
            throw new Error(errors.INVOICE_ALREADY_EXIST);
        }

        delete data._id;
        return await updateInvoiceRepo({ _id: id }, data);
    } catch (e: any) {
        console.error(e.message);
        throw e;
    }
};

export const getInvoiceByIdService = async (id: string) => {
    try {
        return await findInvoiceRepo({ _id: id });
    } catch (e: any) {
        console.error(e.message);
        throw e;
    }
};

export const getBulkInvoicePaymentByIdService = async (id: string) => {
    try {
        return await findBulkInvoicePaymentRepo({ _id: id });
    } catch (e: any) {
        console.error(e.message);
        throw e;
    }
};

export const getPagedInvoicesService = async (data: any) => {
    try {
        const filters = data.filters;
        const {
            supplier,
            pageSize,
            pageIndex,
            sort,
            status,
            invoicedDate,
            fromDate,
            toDate,
            searchQuery,
        } = filters;
        const matchFilter: any = { $and: [] };

        if (searchQuery) {
            matchFilter.$or = [
                { invoiceNumber: { $regex: searchQuery, $options: "i" } },
            ];
        }

        if (supplier) {
            matchFilter.$and.push({ supplier: new ObjectId(supplier) });
        }

        if (status) {
            matchFilter.$and.push({ invoiceStatus: status });
        }

        if (invoicedDate) {
            matchFilter.$and.push({ invoiceDate: invoicedDate });
        }
        if (fromDate) {
            matchFilter.$and.push({ invoiceDate: { $gte: fromDate } });
        }

        if (toDate) {
            matchFilter.$and.push({ invoiceDate: { $lte: toDate } });
        }

        const response = await getPagedInvoicesRepo(
            matchFilter,
            pageSize,
            pageIndex,
            sort
        );
        const documentCount = await countInvoices(matchFilter);
        return {
            response,
            metadata: { total: documentCount, pageIndex },
        };
    } catch (e: any) {
        console.error(e.message);
        throw e;
    }
};

export const calculateUnpaidInvoiceAmount = async () => {
    try {
        const pipeline = [
            { $match: { invoiceStatus: "NOT PAID" } },
            {
                $group: {
                    _id: null,
                    totalAmount: { $sum: "$amount" },
                    invoiceCount: { $sum: 1 },
                    invoices: {
                        $push: {
                            invoiceDate: "$invoiceDate",
                            invoiceNumber: "$invoiceNumber",
                            amount: "$amount",
                        },
                    },
                },
            },
        ];

        const response = await aggregateInvoiceRepo(pipeline);
        return response[0];
    } catch (e: any) {
        console.error(e.message);
        throw e;
    }
};

export const getUnpaidInvoicesBySupplier = async () => {
    try {
        const pipeline = [
            { $match: { invoiceStatus: "NOT PAID" } },
            {
                $group: {
                    _id: "$supplier",
                    totalAmount: { $sum: "$amount" },
                    invoiceCount: { $sum: 1 },
                    invoices: {
                        $push: {
                            invoiceDate: "$invoiceDate",
                            invoiceNumber: "$invoiceNumber",
                            amount: "$amount",
                        },
                    },
                },
            },
            {
                $lookup: {
                    from: "supplier",
                    localField: "_id",
                    foreignField: "_id",
                    as: "supplierDetails",
                },
            },
            {
                $project: {
                    _id: "$_id",
                    supplierName: {
                        $arrayElemAt: ["$supplierDetails.name", 0],
                    },
                    totalAmount: 1,
                    invoiceCount: 1,
                    invoices: 1,
                },
            },
        ];
        return await aggregateInvoiceRepo(pipeline);
    } catch (e: any) {
        console.error(e.message);
        throw e;
    }
};

export const createBulkInvoicePaymentService = async (data: any) => {
    try {
        const paymentId = await generatePaymentId();

        const supplier: any | null = await findSupplierRepo({
            _id: data.supplier,
        });

        const invoices = await Promise.all(
            data.invoices.map(async (i: any) => {
                const invoice = await updateInvoiceRepo(
                    { _id: i },
                    { invoiceStatus: "PAID" }
                );
                if (!invoice) {
                    throw new Error(
                        `Invoice with ID ${i} not found or update failed`
                    );
                }
                return invoice;
            })
        );

        const cheques = await Promise.all(
            data.customerCheques.map(async (c: any) => {
                const cheque = await updateChequeRepo(
                    { _id: c },
                    { chequeStatus: "SEND TO SUPPLIER" }
                );
                if (!cheque) {
                    throw new Error(
                        `Cheque with ID ${c} not found or update failed`
                    );
                }
                return cheque;
            })
        );

        const chequePayments = await Promise.all(
            data.createdCheques.map(async (cc: any) => {
                const chequePayment = await createChequePaymentRepo({
                    payFor: supplier.name,
                    number: cc.chequeNumber,
                    amount: cc.amount,
                    date: cc.date,
                    bankAccount: cc.bankAccount,
                    paymentStatus: "PENDING",
                    status: true,
                });
                if (!chequePayment) {
                    throw new Error("Failed to create cheque payment");
                }
                return chequePayment;
            })
        );

        const createdChequesIds = chequePayments.map((i) => i._id);

        const payload: any = {
            paymentId: paymentId,
            supplier: data.supplier,
            invoices: data.invoices,
            customerCheques: data.customerCheques,
            createdCheques: createdChequesIds,
            addedCash: data.addedCash,
            notes: data.notes,
            additionalEmails: data.additionalEmails,
        };

        const response = await createBulkInvoicePaymentRepo(payload);

        return {
            ...response,
            updatedInvoices: invoices,
            updatedCustomerCheques: cheques,
            createdCheques: chequePayments,
            supplierData: supplier,
        };
    } catch (e: any) {
        console.error(e.message);
        throw new Error(e);
    }
};

const generatePaymentId = async () => {
    try {
        const lastBulkInvoicePayment = await findLastBulkInvoicePaymentRepo();

        const paymentId = lastBulkInvoicePayment?.paymentId;
        if (paymentId) {
            if (!/^W-PAY-\d{4}$/.test(paymentId)) {
                throw new Error(`Invalid paymentId format: ${paymentId}`);
            }

            const paymentIdNumber = parseInt(paymentId.split("-")[2]);

            const newPaymentIdNumber = paymentIdNumber + 1;
            return `W-PAY-${String(newPaymentIdNumber).padStart(4, "0")}`;
        } else {
            return "W-PAY-0001";
        }
    } catch (e: any) {
        console.error(e.message);
        throw e;
    }
};

export const getPagedBulkInvoicePaymentsService = async (data: any) => {
    try {
        const filters = data.filters;
        const { supplier, pageSize, pageIndex, sort } = filters;
        const matchFilter: any = { $and: [] };

        if (supplier) {
            matchFilter.$and.push({ supplier: new ObjectId(supplier) });
        }

        const response = await getPagedBulkInvoicePaymentsRepo(
            matchFilter,
            pageSize,
            pageIndex,
            sort
        );
        const documentCount = await countBulkInvoicePayments(matchFilter);
        return {
            response,
            metadata: { total: documentCount, pageIndex },
        };
    } catch (e: any) {
        console.error(e.message);
        throw e;
    }
};
