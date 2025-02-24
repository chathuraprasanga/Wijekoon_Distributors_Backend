import mongoose, { ObjectId, Schema } from "mongoose";
import { Customer } from "./customer.model";
import errors from "../constants/errors";

export interface IOrder extends Document {
    orderId: string;
    expectedDate: string;
    customer: ObjectId;
    orderDetails: any;
    orderStatus: string;
    status: boolean;
    notes: string;
    createdAt: Date;
    updatedAt: Date;
}

const OrderSchema: Schema<IOrder> = new Schema<IOrder>(
    {
        orderId: {
            type: Schema.Types.String,
            required: [true, "Order id is required"],
        },
        expectedDate: {
            type: Schema.Types.String,
            required: [true, "Date is required"],
        },
        customer: {
            type: Schema.Types.ObjectId,
            ref: "Customer",
            required: [true, "Customer is required"],
            validate: {
                validator: async function (value: mongoose.Types.ObjectId) {
                    return Customer.exists({ _id: value });
                },
                message: errors.INVALID_CUSTOMER,
            },
        },
        orderDetails: [
            {
                product: {
                    type: Schema.Types.ObjectId,
                    ref: "Product", // Ensure it references the Product model
                    required: true,
                },
                amount: { type: Number, required: true },
                lineTotal: { type: Number, required: true },
            },
        ],
        orderStatus: {
            type: Schema.Types.String,
            required: [true, "Order status is required"],
            enum: ["PENDING", "COMPLETE", "INCOMPLETE"],
            default: "PENDING",
        },
        status: {
            type: Schema.Types.Boolean,
            default: true,
        },
        notes: {
            type: Schema.Types.String,
        },
    },
    {
        timestamps: true,
        collection: "order",
    }
);

export const Order = mongoose.model<IOrder>("Order", OrderSchema);
