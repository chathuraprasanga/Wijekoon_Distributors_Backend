import mongoose, { ObjectId, Schema } from "mongoose";
import errors from "../constants/errors";
import { Supplier } from "./supplier.model";

export interface IInvoice extends Document {
    supplier: ObjectId;
    invoiceDate: string;
    invoiceNumber: string;
    isCompanyCreated: boolean;
    amount: number;
    invoiceStatus: string;
    status: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const InvoiceSchema: Schema = new Schema<IInvoice>(
    {
        supplier: {
            type: Schema.Types.ObjectId,
            ref: "Supplier",
            required: [true, "Supplier is required"],
            validate: {
                validator: async function (value) {
                    return Supplier.exists({ _id: value });
                },
                message: errors.INVALID_SUPPLIER,
            },
        },
        invoiceDate: {
            type: Schema.Types.String,
            required: [true, "Invoice date is required"],
        },
        invoiceNumber: {
            type: Schema.Types.String,
            required: [true, "Invoice number is required"],
            unique: true,
        },
        isCompanyCreated: {
            type: Schema.Types.Boolean,
            default: false,
        },
        amount: {
            type: Schema.Types.Number,
            required: [true, "Invoice status is required"],
        },
        invoiceStatus: {
            type: Schema.Types.String,
            enum: ["PAID", "NOT PAID"],
            required: [true, "Invoice status is required"],
            default: "NOT PAID",
        },
        status: {
            type: Schema.Types.Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
        collection: "invoice",
    }
);

export const Invoice = mongoose.model<IInvoice>("Invoice", InvoiceSchema);
