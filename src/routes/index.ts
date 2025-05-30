import { Router } from "express";
import userRoute from "./user.route";
import customerRoute from "./customer.route";
import productRoute from "./product.route";
import supplierRoute from "./supplier.route";
import chequeRoute from "./cheque.route";
import invoiceRoute from "./invoice.route";
import dashboardRoute from "./dashboard.route";
import bankDetailRoute from "./bankDetail.route";
import chequePaymentRoute from "./chequePayment.route";
import warehouseRoute from "./warehouse.route";
import salesRecordRoute from "./salesRecord.route";
import orderRoute from "./order.route";
import vehicleRoute from "./vehicle.route";

import publicRoute from "./public.route";

const routes = Router();

routes.get("/", (req: any, res: any) => {
    res.send("Hello from Wijekoon Distributors API Endpoints");
});
routes.use("/users", userRoute);
routes.use("/customers", customerRoute);
routes.use("/products", productRoute);
routes.use("/suppliers", supplierRoute);
routes.use("/cheques", chequeRoute);
routes.use("/invoices", invoiceRoute);
routes.use("/dashboard", dashboardRoute);
routes.use("/bank-details", bankDetailRoute);
routes.use("/cheque-payment", chequePaymentRoute);
routes.use("/warehouses", warehouseRoute);
routes.use("/sales-records", salesRecordRoute);
routes.use("/orders", orderRoute);
routes.use("/vehicles", vehicleRoute);

routes.use("/public", publicRoute);

export default routes;
