import {
    createChequeRepo,
    findChequeRepo,
    findChequesRepo,
    updateChequeRepo,
} from "../repositories/cheque.repository";

export const createChequeService = async (data: any) => {
    try {
        return await createChequeRepo(data);
    } catch (e: any) {
        console.error(e.message);
        throw e;
    }
};

export const findAllChequeService = async () => {
    try {
        return await findChequesRepo({});
    } catch (e: any) {
        console.error(e.message);
        throw e;
    }
};

export const updateChequeService = async (id: string, data: any) => {
    try {
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
