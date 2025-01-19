import {
    aggregateChequeRepo,
    countCheques,
    createChequeRepo,
    findChequeRepo,
    getPagedChequesRepo,
    updateChequeRepo,
} from "../repositories/cheque.repository";
import errors from "../constants/errors";
import mongoose from "mongoose";

const ObjectId = mongoose.Types.ObjectId;

export const createChequeService = async (data: any) => {
    try {
        const duplicateCheque = await findChequeRepo({
            customer: data.customer,
            number: data.number,
        });
        if (duplicateCheque) {
            throw new Error(errors.CHEQUE_ALREADY_EXIST);
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
        } = filters;
        const matchFilter: any = { $and: [] };

        if (customer) {
            matchFilter.$and.push({ customer: new ObjectId(customer) });
        }

        if (status) {
            matchFilter.$and.push({ chequeStatus: status });
        }

        if (depositDate) {
            matchFilter.$and.push({ depositDate: depositDate });
        }

        if(fromDate) {
            matchFilter.$and.push({ depositDate: {$gte: fromDate }})
        }

        if(toDate) {
            matchFilter.$and.push({ depositDate: {$lte: toDate }})
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
