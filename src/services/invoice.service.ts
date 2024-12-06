import {
    createInvoiceRepo,
    findInvoiceRepo,
    findInvoicesRepo,
    updateInvoiceRepo,
} from "../repositories/invoice.repository";

export const createInvoiceService = async (data: any) => {
    try {
        return await createInvoiceRepo(data);
    } catch (e: any) {
        console.error(e.message);
        throw e;
    }
};

export const findAllInvoiceService = async () => {
    try {
        return await findInvoicesRepo({});
    } catch (e: any) {
        console.error(e.message);
        throw e;
    }
};

export const updateInvoiceService = async (id: string, data: any) => {
    try {
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
