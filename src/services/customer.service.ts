import {
    createCustomerRepo,
    findCustomerRepo,
    findCustomersRepo,
    updateCustomerRepo,
} from "../repositories/customer.repository";
import mongoose from "mongoose";

const ObjectId = mongoose.Types.ObjectId;

export const createCustomerService = async (data: any) => {
    try {
        const { phone } = data;
        const customerByPhone = await findCustomerByPhoneService(phone);
        if (customerByPhone) {
            throw new Error("Customer already exists");
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
        // const customerByPhone = await findCustomerRepo({ phone: data.phone, _id: { $ne: id}, });
        // if (customerByPhone) {
        //     throw new Error("Phone number should be unique");
        // }
        delete data._id;
        return await updateCustomerRepo({ _id: new ObjectId(id) }, data);
    } catch (e: any) {
        console.error(e.message);
        throw e;
    }
};
