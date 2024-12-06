import {
    createSupplierRepo,
    findSupplierRepo,
    findSuppliersRepo,
    updateSupplierRepo,
} from "../repositories/supplier.repository";
import errors from "../constants/errors";
import mongoose from "mongoose";

const ObjectId = mongoose.Types.ObjectId;

export const createSupplierService = async (data: any) => {
    try {
        const duplicateSupplier = await findSupplierRepo({ phone: data.phone });
        if (duplicateSupplier) {
            throw new Error(errors.SUPPLIER_ALREADY_EXIST);
        }
        return await createSupplierRepo(data);
    } catch (e: any) {
        console.error(e.message);
        throw e;
    }
};

export const findSuppliersService = async (filters: any) => {
    try {
        return await findSuppliersRepo(filters);
    } catch (e: any) {
        console.error(e.message);
        throw e;
    }
};

export const findSupplierByIdService = async (id: string) => {
    try {
        return await findSupplierRepo({ _id: id });
    } catch (e: any) {
        console.error(e.message);
        throw e;
    }
};

export const updateSupplierService = async (id: string, data: any) => {
    try {
        const existSuppliers = await findSuppliersRepo({ phone: data.phone });
        const duplicateSuppliers = existSuppliers.filter(
            (c: any) => !c._id.equals(new ObjectId(id)) // Use .equals() for ObjectId comparison
        );

        if (duplicateSuppliers.length > 0) {
            throw new Error(errors.SUPPLIER_ALREADY_EXIST);
        }

        delete data._id;
        return await updateSupplierRepo({ _id: id }, data);
    } catch (e: any) {
        console.error(e.message);
        throw e;
    }
};

export const changeStatusSupplierService = async (id: string, data: any) => {
    try {
        return await updateSupplierRepo({ _id: id }, { status: data.status });
    } catch (e: any) {
        console.error(e.message);
        throw e;
    }
};
