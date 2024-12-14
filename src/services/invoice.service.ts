import {
    aggregateInvoiceRepo, countInvoices,
    createInvoiceRepo,
    findInvoiceRepo,
    findInvoicesRepo, getPagedInvoicesRepo,
    updateInvoiceRepo,
} from "../repositories/invoice.repository";
import errors from "../constants/errors";
import mongoose from "mongoose";

const ObjectId = mongoose.Types.ObjectId;

export const createInvoiceService = async (data: any) => {
    try {
        const duplicateInvoice = await findInvoiceRepo({ invoiceNumber: data.invoiceNumber });
        if (duplicateInvoice) {
            throw new Error(errors.INVOICE_ALREADY_EXIST);
        }
        return await createInvoiceRepo(data);
    } catch (e: any) {
        console.error(e.message);
        throw e;
    }
};

export const findAllInvoiceService = async () => {
    try {
        const pipeline = [
            {
                $lookup: {
                    as: "supplier",
                    from: "supplier",
                    foreignField: "_id",
                    localField: "supplier"
                }
            },
            {
                $unwind: {
                    path: "$supplier",
                    preserveNullAndEmptyArrays: true
                }
            }
        ]
        return await aggregateInvoiceRepo(pipeline);
    } catch (e: any) {
        console.error(e.message);
        throw e;
    }
};

export const updateInvoiceService = async (id: string, data: any) => {
    try {
        const existInvoice = await findInvoicesRepo({ invoiceNumber: data.invoiceNumber });
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

export const getPagedInvoicesService = async (data: any) => {
    try {
        const filters = data.filters;
        const { supplier, pageSize, pageIndex, sort, status, invoicedDate } = filters;
        const matchFilter: any = { $and: [] };

        if (supplier) {
            matchFilter.$and.push({ supplier: new ObjectId(supplier) });
        }

        if (status) {
            matchFilter.$and.push({ invoiceStatus: status });
        }

        if (invoicedDate) {
            matchFilter.$and.push({ invoiceDate: invoicedDate });
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
