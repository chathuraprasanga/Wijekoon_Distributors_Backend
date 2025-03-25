import {
    countCustomers,
    createCustomerRepo,
    findCustomerRepo,
    findCustomersRepo,
    getPagedCustomersRepo,
    updateCustomerRepo,
} from "../repositories/customer.repository";
import mongoose from "mongoose";
import errors from "../constants/errors";
import { CALCULATION_TYPES } from "../constants/settings";
import { aggregateOrderRepo } from "../repositories/order.repository";
import { aggregateSalesRecordRepo } from "../repositories/salesRecord.repository";
import { aggregateChequeRepo } from "../repositories/cheque.repository";

const ObjectId = mongoose.Types.ObjectId;

export const createCustomerService = async (data: any) => {
    try {
        const { phone, email } = data;

        if (phone && phone.trim() !== "") {
            const customerByPhone = await findCustomerByPhoneService(phone);
            if (customerByPhone) {
                throw new Error(errors.CUSTOMER_ALREADY_EXIST);
            }
        }

        data.phone = data.phone ?? null;

        const customersByEmail: any[] = await findCustomerByEmailService(email);
        const duplicateCustomers = customersByEmail.filter(
            (c) => c.email !== ""
        );
        if (duplicateCustomers.length > 0) {
            throw new Error(errors.EMAIL_IS_ALREADY_AVAILABLE);
        }
        return await createCustomerRepo(data);
    } catch (e: any) {
        console.error(e.message);
        throw e;
    }
};

const findCustomerByEmailService = async (email: string) => {
    return await findCustomersRepo({ email: email });
};

const findCustomerByPhoneService = async (phone: string) => {
    return await findCustomerRepo({ phone: phone });
};

export const findAllCustomersService = async (data: any) => {
    try {
        const filters = data.filters;
        return await findCustomersRepo(filters);
    } catch (e: any) {
        console.error(e.message);
        throw e;
    }
};

export const findCustomerByIdService = async (id: string) => {
    try {
        return await findCustomerRepo({ _id: new ObjectId(id) });
    } catch (e: any) {
        console.error(e.message);
        throw e;
    }
};

export const updateCustomerService = async (id: any, data: any) => {
    try {
        const existCustomers = await findCustomersRepo({ phone: data.phone });
        const duplicateCustomers = existCustomers.filter(
            (c: any) => !c._id.equals(new ObjectId(id)) // Use .equals() for ObjectId comparison
        );

        if (duplicateCustomers.length > 0) {
            throw new Error(errors.CUSTOMER_ALREADY_EXIST);
        }

        delete data._id;
        return await updateCustomerRepo({ _id: new ObjectId(id) }, data);
    } catch (e: any) {
        console.error(e.message);
        throw e;
    }
};

export const changeStatusCustomerService = async (id: string, data: any) => {
    try {
        if (!data.status) {
            const customer:any  = await findCustomerByIdService(id);
            if (customer.creditAmount > 0) {
                throw new Error(errors.CUSTOMER_CANNOT_BE_DELETED_BCZ_CREDIT)
            }
            const poSearchPipeline = [
                {
                    $match: {
                        customer: new ObjectId(id),
                        orderStatus: {
                            $ne: "COMPLETE",
                        },
                    },
                },
            ];
            const srSearchPipeline = [
                {
                    $match: {
                        customer: new ObjectId(id),
                        paymentStatus: {
                            $ne: "PAID",
                        },
                    },
                },
            ];
            const chqSearchPipeline = [
                {
                    $match: {
                        customer: new ObjectId(id),
                        chequeStatus: {
                            $ne: "COMPLETED",
                        },
                    },
                },
            ];
            const existingPO = await aggregateOrderRepo(poSearchPipeline);
            const existingSR = await aggregateSalesRecordRepo(srSearchPipeline);
            const existingCHQ = await aggregateChequeRepo(chqSearchPipeline);
            if (existingPO.length !== 0) {
                throw new Error(errors.CUSTOMER_CANNOT_BE_DELETED_BCZ_PO);
            }
            if (existingSR.length !== 0) {
                throw new Error(errors.CUSTOMER_CANNOT_BE_DELETED_BCZ_SR);
            }
            if (existingCHQ.length !== 0) {
                throw new Error(errors.CUSTOMER_CANNOT_BE_DELETED_BCZ_CHQ);
            }
        }
        return await updateCustomerRepo({ _id: id }, { status: data.status });
    } catch (e: any) {
        console.error(e.message);
        throw e;
    }
};

export const getPagedCustomersService = async (data: any) => {
    try {
        const filters = data.filters;
        const { searchQuery, pageSize, pageIndex, sort, status } = filters;
        const matchFilter: any = { $and: [] };

        if (searchQuery) {
            matchFilter.$or = [
                { name: { $regex: searchQuery, $options: "i" } },
                { email: { $regex: searchQuery, $options: "i" } },
                { phone: { $regex: searchQuery, $options: "i" } },
            ];
        }

        if (status) {
            matchFilter.$and.push({ status: status !== "INACTIVE" });
        }

        const response = await getPagedCustomersRepo(
            matchFilter,
            pageSize,
            pageIndex,
            sort
        );
        const documentCount = await countCustomers(matchFilter);
        return {
            response,
            metadata: { total: documentCount, pageIndex },
        };
    } catch (e: any) {
        console.error(e.message);
        throw e;
    }
};

export const updateCustomerCredit = async (data: any, type: string) => {
    try {
        const { amount, customer } = data;

        const selectedCustomer = await findCustomerByIdService(customer._id);

        if (!selectedCustomer) {
            throw new Error(errors.INVALID_CUSTOMER);
        }

        let credit: number;
        if (type === CALCULATION_TYPES.INCREMENT) {
            credit = selectedCustomer.creditAmount + amount;
        } else if (type === CALCULATION_TYPES.DECREMENT) {
            credit = selectedCustomer.creditAmount - amount;
        } else {
            throw new Error(`Invalid calculation type: ${type}`);
        }

        return updateCustomerRepo(new ObjectId(customer._id), {
            creditAmount: credit,
        });
    } catch (error: any) {
        console.error(error.message);
        throw error;
    }
};
