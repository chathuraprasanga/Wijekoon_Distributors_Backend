import {
    countChequePayments,
    createChequePaymentRepo,
    findAllChequePaymentsRepo,
    findChequePaymentRepo,
    getPagedChequePaymentsRepo,
    updateChequePaymentRepo,
} from "../repositories/chequePayment.repository";
import { findCustomersRepo } from "../repositories/customer.repository";
import { findSuppliersRepo } from "../repositories/supplier.repository";

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
        const {
            searchQuery,
            pageSize,
            pageIndex,
            sort,
            status,
            date,
            fromDate,
            toDate,
        } = filters;
        const matchFilter: any = { $and: [] };

        if (searchQuery) {
            matchFilter.$or = [
                { payFor: { $regex: searchQuery, $options: "i" } },
                { number: { $regex: searchQuery, $options: "i" } },
            ];
        }

        if (status) {
            matchFilter.$and.push({ paymentStatus: status });
        }

        if (date) {
            matchFilter.$and.push({ date: date });
        }

        if (fromDate) {
            matchFilter.$and.push({ date: { $gte: fromDate } });
        }

        if (toDate) {
            matchFilter.$and.push({ date: { $lte: toDate } });
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

export const changeStatusChequePaymentService = async (
    id: string,
    data: any
) => {
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

export const findAllSystemPayeesService = async () => {
    try {
        const customers = await findCustomersRepo({});
        const supplier = await findSuppliersRepo({});
        const chequePayments = await findAllChequePaymentsRepo({});
        const customersNames = customers.map((c) => c.name);
        const suppliersNames = supplier.map((s) => s.name);
        const payeesNames = chequePayments.map((p) => p.payFor);
        return [customersNames, suppliersNames, payeesNames].flat();
    } catch (e: any) {
        console.log(e.message);
        throw e;
    }
};

export const changeChequePaymentStatusService = async () => {
    try {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setUTCDate(sevenDaysAgo.getUTCDate() - 7);
        sevenDaysAgo.setUTCHours(0, 0, 0, 0); // Ensure proper comparison

        const outdatedChequePayments = await findAllChequePaymentsRepo({
            paymentStatus: "PENDING",
            date: { $lt: sevenDaysAgo.toISOString() }, // Ensure UTC comparison
        });

        console.log("Outdated Payments Before Update:", outdatedChequePayments.length);
        console.log("Outdated Payments Before Update:", outdatedChequePayments);



        if (outdatedChequePayments.length > 0) {
            console.log(
                "Updating outdated cheque payments:",
                outdatedChequePayments
            );

            await Promise.all(
                outdatedChequePayments.map((chequePayment) =>
                    updateChequePaymentRepo(chequePayment._id, {
                        paymentStatus: "COMPLETED",
                    })
                )
            );

            console.log(
                `${outdatedChequePayments.length} cheque payment(s) updated to COMPLETED.`
            );
        } else {
            console.log("No outdated cheque payments found.");
        }

        return outdatedChequePayments.length;
    } catch (e: any) {
        console.error("Error updating cheque payment statuses:", e.message);
        throw e;
    }
};
