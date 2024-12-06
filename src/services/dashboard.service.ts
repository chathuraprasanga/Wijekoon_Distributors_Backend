import { countUsers, findUserRepo } from "../repositories/user.repository";
import { countCustomers } from "../repositories/customer.repository";
import { countProducts } from "../repositories/product.repository";
import { countSuppliers } from "../repositories/supplier.repository";
import { countCheques } from "../repositories/cheque.repository";
import { countInvoices } from "../repositories/invoice.repository";

export const findDashboardDetailsService = async (data: any) => {
    try {
        return {
            user: await findUserRepo({ _id: data.userId }),
            usersCount: await countUsers({}),
            customersCount: await countCustomers({}),
            productsCount: await countProducts({}),
            suppliersCount: await countSuppliers({}),
            chequesCount: await countCheques({}),
            invoicesCount: await countInvoices({}),
        };
    } catch (e: any) {
        console.error(e.message);
        throw e;
    }
};
