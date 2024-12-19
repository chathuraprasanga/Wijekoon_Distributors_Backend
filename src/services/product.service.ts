import {
    countProducts,
    createProductRepo,
    findProductRepo,
    findProductsRepo,
    getPagedProductsRepo,
    updateProductRepo,
} from "../repositories/product.repository";
import errors from "../constants/errors";
import mongoose from "mongoose";

const ObjectId = mongoose.Types.ObjectId;

export const findAllProductsService = async (data: any) => {
    try {
        return await findProductsRepo(data);
    } catch (e: any) {
        console.error(e.message);
        throw e;
    }
};

export const createProductService = async (data: any) => {
    try {
        const { productCode } = data;
        const existProduct = await findProductByProductCode(productCode);
        if (existProduct) {
            throw new Error(errors.PRODUCT_ALREADY_EXIST);
        }
        return await createProductRepo(data);
    } catch (e: any) {
        console.error(e.mesage);
        throw e;
    }
};

const findProductByProductCode = async (productCode: string) => {
    return await findProductRepo({ productCode: productCode });
};

export const findProductByIdService = async (id: string) => {
    try {
        return await findProductRepo({ _id: id });
    } catch (e: any) {
        console.error(e.message);
        throw e;
    }
};

export const updateProductService = async (id: string, data: any) => {
    try {
        const existProducts = await findProductsRepo({
            productCode: data.productCode,
        });
        const duplicateProducts = existProducts.filter(
            (c: any) => !c._id.equals(new ObjectId(id)) // Use .equals() for ObjectId comparison
        );

        if (duplicateProducts.length > 0) {
            throw new Error(errors.PRODUCT_ALREADY_EXIST);
        }

        return await updateProductRepo({ _id: id }, data);
    } catch (e: any) {
        console.error(e.message);
        throw e;
    }
};

export const changeStatusProductService = async (id: string, data: any) => {
    try {
        return await updateProductRepo({ _id: id }, { status: data.status });
    } catch (e: any) {
        console.error(e.message);
        throw e;
    }
};

export const getPagedProductsService = async (data: any) => {
    try {
        const filters = data.filters;
        const { searchQuery, pageSize, pageIndex, sort, status } = filters;
        const matchFilter: any = { $and: [] };
        if (searchQuery) {
            matchFilter.$or = [
                { name: { $regex: searchQuery, $options: "i" } },
                { productCode: { $regex: searchQuery, $options: "i" } },
            ];
        }

        if (status) {
            matchFilter.$and.push({ status: status === "ACTIVE" });
        }

        const response = await getPagedProductsRepo(
            matchFilter,
            pageSize,
            pageIndex,
            sort
        );
        const documentCount = await countProducts(matchFilter);
        return {
            response,
            metadata: { total: documentCount, pageIndex },
        };
    } catch (e: any) {
        console.error(e.message);
        throw e;
    }
};
