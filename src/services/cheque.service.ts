import {
    aggregateChequeRepo,
    countCheques,
    createChequeRepo,
    findChequeRepo,
    findChequesRepo,
    getPagedChequesRepo,
    updateChequeRepo,
} from "../repositories/cheque.repository";
import errors from "../constants/errors";
import mongoose from "mongoose";
import { findCustomerByIdService, updateCustomerCredit } from "./customer.service";
import { CALCULATION_TYPES } from "../constants/settings";

const ObjectId = mongoose.Types.ObjectId;

export const createChequeService = async (data: any) => {
    try {
        const duplicateCheque = await findChequeRepo({
            customer: data.customer,
            number: data.number,
        });
        if (duplicateCheque) {
            throw new Error(`${data.number} ${errors.CHEQUE_ALREADY_EXIST}`);
        }
        const customer:any = await findCustomerByIdService(data.customer);

        if(customer.creditAmount > 0) {
            await updateCustomerCredit({...data,customer: customer}, CALCULATION_TYPES.DECREMENT);
        }
        return await createChequeRepo(data);
    } catch (e: any) {
        console.error(e.message);
        throw e;
    }
};

export const findAllChequeService = async (data: any) => {
    try {
        const { filters } = data;
        const { status, chequeStatus } = filters;

        const pipeline: any = [
            {
                $lookup: {
                    as: "customer",
                    from: "customer",
                    foreignField: "_id",
                    localField: "customer",
                },
            },
            {
                $unwind: {
                    path: "$customer",
                    preserveNullAndEmptyArrays: true,
                },
            },
        ];

        const match: any = {};

        if (status) {
            match.status = status;
        }

        if (chequeStatus) {
            if (chequeStatus.length > 1) {
                match["$or"] = chequeStatus.map((status: string) => ({
                    chequeStatus: status,
                }));
            } else {
                match["chequeStatus"] = chequeStatus[0];
            }
        }

        if (Object.keys(match).length > 0) {
            pipeline.push({
                $match: match,
            });
        }

        return await aggregateChequeRepo(pipeline);
    } catch (e: any) {
        console.error(e.message);
        throw e;
    }
};

export const updateChequeService = async (id: string, data: any) => {
    try {
        // const existCheques = await findChequesRepo({
        //     customer: data.customer,
        //     number: data.number,
        // });
        // const duplicateCheques = existCheques.filter(
        //     (c: any) => !c._id.equals(new ObjectId(id)) // Use .equals() for ObjectId comparison
        // );
        //
        // if (duplicateCheques.length > 0) {
        //     throw new Error(errors.CHEQUE_ALREADY_EXIST);
        // }

        return await updateChequeRepo({ _id: id }, data);
    } catch (e: any) {
        console.error(e.message);
        throw e;
    }
};

export const getChequeByIdService = async (id: string) => {
    try {
        return await findChequeRepo({ _id: id });
    } catch (e: any) {
        console.error(e.message);
        throw e;
    }
};

export const getPagedChequesService = async (data: any) => {
    try {
        const filters = data.filters;
        const {
            customer,
            pageSize,
            pageIndex,
            sort,
            status,
            depositDate,
            fromDate,
            toDate,
            searchQuery
        } = filters;
        const matchFilter: any = { $and: [] };

        if (searchQuery) {
            matchFilter.$or = [
                { number: { $regex: searchQuery, $options: "i" } },
            ];
        }

        if (customer) {
            matchFilter.$and.push({ customer: new ObjectId(customer) });
        }

        if (status) {
            matchFilter.$and.push({ chequeStatus: status });
        }

        if (depositDate) {
            matchFilter.$and.push({ depositDate: depositDate });
        }

        if (fromDate) {
            matchFilter.$and.push({ depositDate: { $gte: fromDate } });
        }

        if (toDate) {
            matchFilter.$and.push({ depositDate: { $lte: toDate } });
        }

        const response = await getPagedChequesRepo(
            matchFilter,
            pageSize,
            pageIndex,
            sort
        );
        const documentCount = await countCheques(matchFilter);
        return {
            response,
            metadata: { total: documentCount, pageIndex },
        };
    } catch (e: any) {
        console.error(e.message);
        throw e;
    }
};

export const changeChequeStatusStatusSendToSupplierService = async () => {
    try {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setUTCDate(sevenDaysAgo.getUTCDate() - 7);
        sevenDaysAgo.setUTCHours(0, 0, 0, 0); // Ensure proper comparison

        const outdatedCheques = await findChequesRepo({
            chequeStatus: "SEND TO SUPPLIER",
            depositDate: { $lt: sevenDaysAgo.toISOString() },
        });

        if (outdatedCheques.length > 0) {
            console.log("Updating outdated cheques:", outdatedCheques);

            await Promise.all(
                outdatedCheques.map((cheque) =>
                    updateChequeRepo(cheque._id, { chequeStatus: "COMPLETED" })
                )
            );

            console.log(`${outdatedCheques.length} cheque(s) updated to COMPLETED.`);
        } else {
            console.log("No outdated cheques found.");
        }

        return outdatedCheques.length;
    } catch (e: any) {
        console.error("Error updating cheque statuses:", e.message);
        throw e;
    }
};

