import {
    createProductRepo,
    findProductRepo,
    findProductsRepo,
    updateProductRepo,
} from "../repositories/product.repository";

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
        console.log(existProduct);
        if (existProduct) {
            throw new Error("Product code should be unique");
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
        return await updateProductRepo({ _id: id }, data);
    } catch (e: any) {
        console.error(e.message);
        throw e;
    }
};