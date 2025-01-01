import {
    countChequePayments,
    createChequePaymentRepo,
    findAllChequePaymentsRepo,
    findChequePaymentRepo, getPagedChequePaymentsRepo,
    updateChequePaymentRepo,
} from "../repositories/chequePayment.repository";

export const createChequePaymentService = async (data: any) => {
    try {
        return await createChequePaymentRepo(data);
    } catch (e: any) {
        console.error(e.message);
        throw e;
    }
};

export const updateChequePaymentService = async (id: any, data: any) => {
    try {
        delete data._id;
        return await updateChequePaymentRepo({ _id: id }, data);
    } catch (e: any) {
        console.error(e.message);
        throw e;
    }
};

export const findAllChequePaymentsService = async (data: any) => {
    try {
        console.log(data);
        return await findAllChequePaymentsRepo({});
    } catch (e: any) {
        console.error(e.message);
        throw e;
    }
};

export const getPagedChequePaymentsService = async (data: any) => {
    try {
        const filters = data.filters;
        const { searchQuery, pageSize, pageIndex, sort, status, date } = filters;
        const matchFilter: any = { $and: [] };

        if (searchQuery) {
            matchFilter.$or = [{ payFor: { $regex: searchQuery, $options: "i" } }];
        }

        if (status) {
            matchFilter.$and.push({ paymentStatus: status });
        }

        if (date) {
            matchFilter.$and.push({ date: date });
        }

        const response = await getPagedChequePaymentsRepo(
            matchFilter,
            pageSize,
            pageIndex,
            sort
        );
        const documentCount = await countChequePayments(matchFilter);
        return {
            response,
            metadata: { total: documentCount, pageIndex },
        };
    } catch (e: any) {
        console.error(e.message);
        throw e;
    }
};

export const changeStatusChequePaymentService = async (id: string, data: any) => {
    try {
        return await updateChequePaymentRepo(
            { _id: id },
            { status: data.status }
        );
    } catch (e: any) {
        console.error(e.message);
        throw e;
    }
};

export const getChequePaymentByIdService = async (id: any) => {
    try {
        return await findChequePaymentRepo({ _id: id });
    } catch (e: any) {
        console.error(e.message);
        throw e;
    }
};
