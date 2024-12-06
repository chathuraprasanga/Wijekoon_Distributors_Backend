import {
    createCustomerRepo,
    findCustomerRepo,
    findCustomersRepo,
    updateCustomerRepo,
} from "../repositories/customer.repository";
import mongoose from "mongoose";
import errors from "../constants/errors";

const ObjectId = mongoose.Types.ObjectId;

export const createCustomerService = async (data: any) => {
    try {
        const { phone } = data;
        const customerByPhone = await findCustomerByPhoneService(phone);
        if (customerByPhone) {
            throw new Error(errors.CUSTOMER_ALREADY_EXIST);
        }
        return await createCustomerRepo(data);
    } catch (e: any) {
        console.error(e.message);
        throw e;
    }
};

const findCustomerByPhoneService = async (phone: string) => {
    return await findCustomerRepo({ phone: phone });
};

export const findAllCustomersService = async () => {
    try {
        return await findCustomersRepo({});
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
            (c:any) => !c._id.equals(new ObjectId(id)) // Use .equals() for ObjectId comparison
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
        return await updateCustomerRepo({ _id: id }, { status: data.status });
    } catch (e: any) {
        console.error(e.message);
        throw e;
    }
};
