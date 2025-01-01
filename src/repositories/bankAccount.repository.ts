import { BankAccount } from "../models/bankAcoount.model";

export const createBankAccountRepo = (data: any) => {
    return new BankAccount(data).save();
};

export const findAllBankAccountRepo = (filters: any) => {
    return BankAccount.find(filters).exec();
};

export const findBankAccountRepo = (filters: any) => {
    return BankAccount.findOne(filters).exec();
};

export const aggregateBankAccountRepo = (pipeline: any) => {
    return BankAccount.aggregate(pipeline).exec();
};

export const updateBankAccountRepo = (filters: any, data: any) => {
    return BankAccount.findOneAndUpdate(filters, data).exec();
};

export const getPagedBankAccountRepo = (
    matchFilter: any,
    pageSize: any,
    pageIndex: any,
    sort:any
) => {
    return BankAccount.find(matchFilter)
        .sort({createdAt: sort})
        .limit(pageSize)
        .skip(pageSize * (pageIndex - 1))
        .exec();
};

export const countBankAccountRepo = (filters: any) => {
    return BankAccount.countDocuments(filters).exec();
};



