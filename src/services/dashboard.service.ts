import { countUsers, findUserRepo } from "../repositories/user.repository";
import { countCustomers } from "../repositories/customer.repository";
import { countProducts } from "../repositories/product.repository";
import { countSuppliers } from "../repositories/supplier.repository";
import {
    countCheques,
    findChequesRepo,
} from "../repositories/cheque.repository";
import { countInvoices } from "../repositories/invoice.repository";
import {
    calculateUnpaidInvoiceAmount,
    getUnpaidInvoicesBySupplier,
} from "./invoice.service";
import { findAllChequePaymentsRepo } from "../repositories/chequePayment.repository";

export const findDashboardDetailsService = async (data: any) => {
    try {
        const { chequesCount, totalAmount, todayChequesCount, todayChequesTotalAmount } = await getChequesToDeposit();
        const { chequePaymentsCount, totalPaymentAmount, todayChequePaymentsCount, todayTotalPaymentAmount } =
            await getChequesComesToTransfer();
        return {
            user: await findUserRepo({ _id: data.userId }),
            usersCount: await countUsers({}),
            customersCount: await countCustomers({}),
            productsCount: await countProducts({}),
            suppliersCount: await countSuppliers({}),
            chequesCount: await countCheques({}),
            invoicesCount: await countInvoices({}),
            chequesToDeposit: {
                count: chequesCount,
                amount: totalAmount,
                todayCount: todayChequesCount,
                todayAmount: todayChequesTotalAmount
            },
            chequesComesToTransfer: {
                count: chequePaymentsCount,
                amount: totalPaymentAmount,
                todayCount: todayChequePaymentsCount,
                todayAmount: todayTotalPaymentAmount
            },
            invoicesToBePaid: {
                toBePaid: await calculateUnpaidInvoiceAmount(),
                supplierWise: await getUnpaidInvoicesBySupplier(),
            },
        };
    } catch (e: any) {
        console.error(e.message);
        throw e;
    }
};

const getChequesToDeposit = async () => {
    try {
        const date = new Date();
        const todayUtc = new Date(
            Date.UTC(
                date.getUTCFullYear(),
                date.getUTCMonth(),
                date.getUTCDate()
            )
        );
        const today = todayUtc.toISOString();

        const cheques = await findChequesRepo({
            depositDate: { $lte: today },
            chequeStatus: "PENDING",
        });
        const todayCheques = await findChequesRepo({
            depositDate: today ,
            chequeStatus: "PENDING",
        });

        const chequesCount = cheques.length;
        const totalAmount = cheques.reduce(
            (sum, cheque) => sum + cheque.amount,
            0
        );

        const todayChequesCount = todayCheques.length;
        const todayChequesTotalAmount = todayCheques.reduce(
            (sum, cheque) => sum + cheque.amount,
            0
        );

        return { chequesCount, totalAmount, todayChequesCount, todayChequesTotalAmount };
    } catch (e: any) {
        console.error(e.message);
        throw e;
    }
};

const getChequesComesToTransfer = async () => {
    try {
        const date = new Date();
        const todayUtc = new Date(
            Date.UTC(
                date.getUTCFullYear(),
                date.getUTCMonth(),
                date.getUTCDate()
            )
        );
        const today = todayUtc.toISOString();
        const chequePayments = await findAllChequePaymentsRepo({
            date: { $gte: today },
            paymentStatus: "PENDING",
        });
        const todayChequePayments = await findAllChequePaymentsRepo({
            date: today,
            paymentStatus: "PENDING",
        });

        const chequePaymentsCount = chequePayments.length;
        const totalPaymentAmount = chequePayments.reduce(
            (sum, cheque) => sum + cheque.amount,
            0
        );
        const todayChequePaymentsCount = todayChequePayments.length;
        const todayTotalPaymentAmount = todayChequePayments.reduce(
            (sum, cheque) => sum + cheque.amount,
            0
        );

        return { chequePaymentsCount, totalPaymentAmount, todayChequePaymentsCount, todayTotalPaymentAmount };
    } catch (e: any) {
        console.error(e.message);
        throw e;
    }
};
