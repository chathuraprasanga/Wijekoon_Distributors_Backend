import mongoose, { ObjectId, Schema } from "mongoose";
import { Customer } from "./customer.model";
import errors from "../constants/errors";

export interface ISalesRecord extends Document {
    orderId: string;
    date: string;
    customer: ObjectId;
    orderDetails: any;
    amountDetails: any;
    paymentDetails: any;
    paymentStatus: string;
    status: boolean;
    metadata: any;
    notes: string;
    createdAt: Date;
    updatedAt: Date;
}

const SalesRecordSchema: Schema<ISalesRecord> = new Schema<ISalesRecord>(
    {
        orderId: {
            type: Schema.Types.String,
            required: [true, "Order id is required"],
        },
        date: {
            type: Schema.Types.String,
            required: [true, "Date is required"],
        },
        customer: {
            type: Schema.Types.ObjectId,
            ref: "customer",
            required: [true, "Customer is required"],
            validate: {
                validator: async function (value: mongoose.Types.ObjectId) {
                    return Customer.exists({ _id: value });
                },
                message: errors.INVALID_CUSTOMER,
            },
        },
        orderDetails: {
            type: Schema.Types.Array,
            required: [true, "Order details are required"],
        },
        amountDetails: {
            type: Schema.Types.Mixed,
            required: [true, "Amount details is required"],
        },
        paymentDetails: {
            type: Schema.Types.Mixed,
            required: [true, "Payment details are required"],
        },
        paymentStatus: {
            type: Schema.Types.String,
            required: [true, "Payment status is required"],
            enum: [
                "PAID",
                "NOT PAID",
                "PARTIALLY PAID",
                "COMPLETE",
                "INCOMPLETE",
            ],
            default: "NOT PAID",
        },
        status: {
            type: Schema.Types.Boolean,
            default: true,
        },
        metadata: {
            type: Schema.Types.Mixed,
        },
        notes: {
            type: Schema.Types.String,
        }
    },
    {
        timestamps: true,
        collection: "sales_record",
    }
);

export const SalesRecord = mongoose.model<ISalesRecord>(
    "SalesRecord",
    SalesRecordSchema
);
