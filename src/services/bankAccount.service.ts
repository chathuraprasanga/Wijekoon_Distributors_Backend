import {
    countBankAccountRepo,
    createBankAccountRepo,
    findAllBankAccountRepo, findBankAccountRepo,
    getPagedBankAccountRepo,
    updateBankAccountRepo,
} from "../repositories/bankAccount.repository";

export const createBankAccountService = async (data: any) => {
    try {
        return await createBankAccountRepo(data);
    } catch (e: any) {
        console.error(e.message);
        throw e;
    }
};

export const findAllBankAccountService = async (data: any) => {
    try {
        console.log("data", data);
        return await findAllBankAccountRepo({});
    } catch (e: any) {
        console.error(e.message);
        throw e;
    }
};

export const findBankAccountService = async (id: any) => {
    try {
        return await findBankAccountRepo({ _id: id });
    } catch (e: any) {
        console.error(e.message);
        throw e;
    }
};

export const updateBankAccountService = async (id: string, data: any) => {
    try {
        delete data._id;

        return await updateBankAccountRepo({ _id: id }, data);
    } catch (e: any) {
        console.error(e.message);
        throw e;
    }
};

export const getPagedBankAccountService = async (data: any) => {
    try {
        const filters = data.filters;
        const { bank, pageSize, pageIndex, sort, status } = filters;
        const matchFilter: any = { $and: [] };

        if (bank) {
            matchFilter.$and.push({ bank: bank });
        }

        if (status) {
            matchFilter.$and.push({ chequeStatus: status });
        }

        const response = await getPagedBankAccountRepo(
            matchFilter,
            pageSize,
            pageIndex,
            sort
        );
        const documentCount = await countBankAccountRepo(matchFilter);
        return {
            response,
            metadata: { total: documentCount, pageIndex },
        };
    } catch (e: any) {
        console.error(e.message);
        throw e;
    }
};
