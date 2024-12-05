import {
    createSupplierRepo,
    findSupplierRepo,
    findSuppliersRepo,
    updateSupplierRepo,
} from "../repositories/supplier.repository";

export const createSupplierService = async (data: any) => {
    try {
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
